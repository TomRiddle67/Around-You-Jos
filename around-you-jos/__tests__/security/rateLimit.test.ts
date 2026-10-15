import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkRateLimit,
  hashIdentifier,
  pruneExpiredRateLimits,
  resetPruneStateForTesting,
  RATE_LIMIT_CONFIG,
} from "@/lib/security/rateLimit";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    rateLimitBucket: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe("Distributed Rate Limiter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPruneStateForTesting();
    vi.mocked(prisma.rateLimitBucket.deleteMany).mockResolvedValue({ count: 0 });
  });

  describe("hashIdentifier", () => {
    it("hashes an identifier into a 64-character hex SHA-256 string", () => {
      const hash = hashIdentifier("192.168.1.1");
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("produces identical hashes for identical inputs with identical salt", () => {
      const hash1 = hashIdentifier("10.0.0.1", "test-salt");
      const hash2 = hashIdentifier("10.0.0.1", "test-salt");
      expect(hash1).toBe(hash2);
    });

    it("normalizes case and surrounding whitespace before hashing", () => {
      const hash1 = hashIdentifier("  +2348012345678  ", "salt");
      const hash2 = hashIdentifier("+2348012345678", "salt");
      expect(hash1).toBe(hash2);
    });

    it("produces different hashes for different salts (keyed hashing)", () => {
      const hash1 = hashIdentifier("10.0.0.1", "salt-a");
      const hash2 = hashIdentifier("10.0.0.1", "salt-b");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("checkRateLimit atomic enforcement", () => {
    it("allows a request when count is below the limit", async () => {
      vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
        key: "test-key",
        count: 1,
        expiresAt: new Date(Date.now() + 600000),
      });

      const result = await checkRateLimit({
        action: "test_action",
        identifier: "client-1",
        limit: 5,
        windowMs: 600000,
      });

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.limit).toBe(5);
      expect(prisma.rateLimitBucket.upsert).toHaveBeenCalledTimes(1);
    });

    it("allows a request when count exactly equals the limit", async () => {
      vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
        key: "test-key",
        count: 5,
        expiresAt: new Date(Date.now() + 600000),
      });

      const result = await checkRateLimit({
        action: "test_action",
        identifier: "client-1",
        limit: 5,
        windowMs: 600000,
      });

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it("rejects a request when count exceeds the limit", async () => {
      vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
        key: "test-key",
        count: 6,
        expiresAt: new Date(Date.now() + 600000),
      });

      const result = await checkRateLimit({
        action: "test_action",
        identifier: "client-1",
        limit: 5,
        windowMs: 600000,
      });

      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("prevents concurrent requests from bypassing the limit via atomic increment", async () => {
      // Simulate 10 concurrent requests to PostgreSQL upsert
      let currentCount = 0;
      vi.mocked(prisma.rateLimitBucket.upsert).mockImplementation(
        (() => {
          currentCount += 1;
          return Promise.resolve({
            key: "concurrent-key",
            count: currentCount,
            expiresAt: new Date(Date.now() + 600000),
          });
        }) as unknown as typeof prisma.rateLimitBucket.upsert
      );

      const promises = Array.from({ length: 10 }).map(() =>
        checkRateLimit({
          action: "concurrent_test",
          identifier: "concurrent-client",
          limit: 5,
          windowMs: 600000,
        })
      );

      const results = await Promise.all(promises);

      const allowed = results.filter((r) => r.success);
      const blocked = results.filter((r) => !r.success);

      expect(allowed).toHaveLength(5);
      expect(blocked).toHaveLength(5);
      expect(prisma.rateLimitBucket.upsert).toHaveBeenCalledTimes(10);
    });

    it("resets when moving to a new time window", async () => {
      const windowMs = 60000;
      const now = 1000000;
      vi.spyOn(Date, "now").mockReturnValue(now);

      vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
        key: "window-1",
        count: 5,
        expiresAt: new Date(now + windowMs),
      });

      const res1 = await checkRateLimit({
        action: "window_test",
        identifier: "client-w",
        limit: 5,
        windowMs,
      });
      expect(res1.success).toBe(true);

      // Advance time into next window
      vi.spyOn(Date, "now").mockReturnValue(now + windowMs + 1000);

      vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
        key: "window-2",
        count: 1,
        expiresAt: new Date(now + windowMs * 2),
      });

      const res2 = await checkRateLimit({
        action: "window_test",
        identifier: "client-w",
        limit: 5,
        windowMs,
      });

      expect(res2.success).toBe(true);
      expect(res2.remaining).toBe(4);
    });
  });

  describe("Failure policy and error handling", () => {
    it("implements fail-closed by default when rate-limit storage is unavailable", async () => {
      vi.mocked(prisma.rateLimitBucket.upsert).mockRejectedValueOnce(
        new Error("Connection to PostgreSQL failed: connection refused")
      );

      const result = await checkRateLimit({
        action: "test_action",
        identifier: "client-1",
        limit: 5,
        windowMs: 600000,
      });

      // Fail-closed policy ensures downstream service requests are protected during outages
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("supports deliberate fail-open policy when explicitly configured", async () => {
      vi.mocked(prisma.rateLimitBucket.upsert).mockRejectedValueOnce(
        new Error("Connection to PostgreSQL failed: connection timeout")
      );

      const result = await checkRateLimit({
        action: "test_action",
        identifier: "client-1",
        limit: 5,
        windowMs: 600000,
        failureMode: "fail-open",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("pruneExpiredRateLimits", () => {
    it("deletes expired buckets from the database", async () => {
      vi.mocked(prisma.rateLimitBucket.deleteMany).mockResolvedValueOnce({ count: 12 });

      const deletedCount = await pruneExpiredRateLimits();

      expect(deletedCount).toBe(12);
      expect(prisma.rateLimitBucket.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
    });

    it("handles prune errors gracefully without throwing", async () => {
      vi.mocked(prisma.rateLimitBucket.deleteMany).mockRejectedValueOnce(
        new Error("Database write locked")
      );

      const deletedCount = await pruneExpiredRateLimits(true);
      expect(deletedCount).toBe(0);
    });

    it("throttles successive prune invocations to prevent database stampedes", async () => {
      vi.mocked(prisma.rateLimitBucket.deleteMany).mockResolvedValue({ count: 5 });

      // First run succeeds and updates lastPrunedAt
      const first = await pruneExpiredRateLimits(true);
      expect(first).toBe(5);
      expect(prisma.rateLimitBucket.deleteMany).toHaveBeenCalledTimes(1);

      // Immediate second unforced run should be throttled and return 0 without hitting the DB
      const second = await pruneExpiredRateLimits(false);
      expect(second).toBe(0);
      expect(prisma.rateLimitBucket.deleteMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("Default configuration", () => {
    it("defines sensible default limits and window", () => {
      expect(RATE_LIMIT_CONFIG.WINDOW_MS).toBeGreaterThan(0);
      expect(RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_IP).toBeGreaterThan(0);
      expect(RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_PHONE).toBeGreaterThan(0);
      expect(RATE_LIMIT_CONFIG.SALT).toBeDefined();
    });

    it("falls back to default salt if whitespace-only salt is provided to hashIdentifier", () => {
      const defaultHash = hashIdentifier("test-id", RATE_LIMIT_CONFIG.SALT);
      const whitespaceSaltHash = hashIdentifier("test-id", "   ");
      expect(whitespaceSaltHash).toBe(defaultHash);
    });
  });
});

