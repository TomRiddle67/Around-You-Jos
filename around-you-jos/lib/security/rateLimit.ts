import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export interface RateLimitConfig {
  WINDOW_MS: number;
  MAX_REQUESTS_PER_IP: number;
  MAX_REQUESTS_PER_PHONE: number;
  SALT: string;
}

const rawSalt = process.env.RATE_LIMIT_SALT?.trim();
if (process.env.NODE_ENV === "production" && !rawSalt) {
  console.warn(
    "[RateLimit] WARNING: RATE_LIMIT_SALT is not configured or empty in production. Using fallback salt."
  );
}

export const RATE_LIMIT_CONFIG: RateLimitConfig = {
  WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000, // 10 minutes
  MAX_REQUESTS_PER_IP: Number(process.env.RATE_LIMIT_IP_MAX) || 5, // 5 requests per window per IP
  MAX_REQUESTS_PER_PHONE: Number(process.env.RATE_LIMIT_PHONE_MAX) || 3, // 3 requests per window per phone
  SALT: rawSalt || "around-you-jos-rate-limit-v1",
};

export interface CheckRateLimitOptions {
  action: string;
  identifier: string;
  limit: number;
  windowMs: number;
  failureMode?: "fail-closed" | "fail-open";
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

/**
 * Creates a keyed SHA-256 hash of an identifier (e.g. IP address or phone number)
 * to ensure raw personal identifiers are never stored or logged in rate-limit buckets.
 */
export function hashIdentifier(identifier: string, salt: string = RATE_LIMIT_CONFIG.SALT): string {
  const activeSalt = salt?.trim() || RATE_LIMIT_CONFIG.SALT;
  return crypto
    .createHash("sha256")
    .update(`${activeSalt}:${identifier.trim().toLowerCase()}`)
    .digest("hex");
}

// In-memory throttling state to protect against pruning stampedes under high-cardinality attacks
let lastPrunedAt = 0;
let isPruning = false;
const PRUNE_INTERVAL_MS = 5 * 60 * 1000; // 5-minute cooldown between cleanup sweeps

/**
 * Atomically checks and increments a rate limit bucket in PostgreSQL.
 *
 * Design features:
 * - Distributed & Multi-instance: Backed by shared PostgreSQL table `RateLimitBucket`.
 * - Atomic & Concurrency-safe: Uses PostgreSQL row-level locks on conflict increment.
 * - Privacy-preserving: Raw identifiers are hashed via SHA-256 before storage.
 * - Bounded accumulation: Fixed time-window keys limit rows to at most 1 per identifier per window.
 * - Stampede-protected cleanup: Opportunistic pruning is throttled with in-memory lock.
 * - Deliberate failure policy: Fails closed by default to protect downstream systems during outages.
 */
export async function checkRateLimit(options: CheckRateLimitOptions): Promise<RateLimitResult> {
  const { action, identifier, limit, windowMs, failureMode = "fail-closed" } = options;
  const now = Date.now();
  const windowIndex = Math.floor(now / windowMs);
  const resetAt = new Date((windowIndex + 1) * windowMs);

  const identifierHash = hashIdentifier(identifier);
  const bucketKey = `${action}:${identifierHash}:${windowIndex}`;

  try {
    const bucket = await prisma.rateLimitBucket.upsert({
      where: { key: bucketKey },
      create: {
        key: bucketKey,
        count: 1,
        expiresAt: resetAt,
      },
      update: {
        count: { increment: 1 },
      },
      select: {
        count: true,
      },
    });

    const isAllowed = bucket.count <= limit;
    const remaining = Math.max(0, limit - bucket.count);

    // Opportunistically trigger cleanup when a new bucket is created,
    // throttled internally to avoid database stampedes under high-cardinality attacks.
    if (bucket.count === 1) {
      pruneExpiredRateLimits().catch(() => {});
    }

    return {
      success: isAllowed,
      limit,
      remaining,
      resetAt,
    };
  } catch (error) {
    console.error(
      "[RateLimit] Storage error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    // Documented failure policy:
    // If rate-limit storage is unavailable, fail-closed by default for sensitive public actions
    // to prevent uncontrolled submission spikes during database distress.
    const isAllowed = failureMode === "fail-open";

    return {
      success: isAllowed,
      limit,
      remaining: 0,
      resetAt,
    };
  }
}

/**
 * Resets the in-memory prune throttling state.
 * Strictly intended for testing isolation.
 */
export function resetPruneStateForTesting(): void {
  lastPrunedAt = 0;
  isPruning = false;
}

/**
 * Prunes expired rate-limit buckets from PostgreSQL.
 * Uses indexed `expiresAt` column to ensure non-blocking, fast cleanup.
 *
 * Includes concurrency locking and interval throttling so that high-cardinality
 * requests do not flood PostgreSQL with redundant delete queries.
 *
 * @param force If true, bypasses the interval check (useful for manual maintenance or tests).
 */
export async function pruneExpiredRateLimits(force = false): Promise<number> {
  const now = Date.now();
  if (!force && (isPruning || now - lastPrunedAt < PRUNE_INTERVAL_MS)) {
    return 0;
  }

  isPruning = true;
  try {
    const result = await prisma.rateLimitBucket.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    lastPrunedAt = Date.now();
    return result?.count ?? 0;
  } catch (error) {
    console.error(
      "[RateLimit] Prune error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return 0;
  } finally {
    isPruning = false;
  }
}
