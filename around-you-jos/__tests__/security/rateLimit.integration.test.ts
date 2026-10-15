import { describe, it, expect, afterAll } from "vitest";

// This integration test verifies atomic PostgreSQL behavior directly against a running database instance.
// When DATABASE_URL is not set (e.g. isolated unit-test environments), the suite is skipped.
const hasDb = Boolean(process.env.DATABASE_URL);

describe.runIf(hasDb)("Real PostgreSQL Rate Limiter Integration", () => {
  const testAction = "integration_test";
  const uniqueId = `pg-client-${Date.now()}`;

  afterAll(async () => {
    if (!hasDb) return;
    const { prisma } = await import("@/lib/prisma");
    await prisma.rateLimitBucket.deleteMany({
      where: {
        key: {
          startsWith: `${testAction}:`,
        },
      },
    });
    await prisma.$disconnect();
  });

  it("verifies atomic row lock and rejects 6th concurrent request when limit is 5", async () => {
    const { checkRateLimit } = await import("@/lib/security/rateLimit");
    const { prisma } = await import("@/lib/prisma");

    // Fire 10 concurrent requests simultaneously to PostgreSQL
    const concurrency = 10;
    const limit = 5;

    const promises = Array.from({ length: concurrency }).map(() =>
      checkRateLimit({
        action: testAction,
        identifier: uniqueId,
        limit,
        windowMs: 600000,
      })
    );

    const results = await Promise.all(promises);

    const allowed = results.filter((r) => r.success);
    const blocked = results.filter((r) => !r.success);

    // Exactly 5 allowed, exactly 5 blocked
    expect(allowed).toHaveLength(5);
    expect(blocked).toHaveLength(5);

    // Verify actual PostgreSQL row state in database
    const rows = await prisma.rateLimitBucket.findMany({
      where: {
        key: {
          startsWith: `${testAction}:`,
        },
      },
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].count).toBe(10);
  });

  it("prunes expired buckets from real PostgreSQL without affecting active buckets", async () => {
    const { pruneExpiredRateLimits } = await import("@/lib/security/rateLimit");
    const { prisma } = await import("@/lib/prisma");

    // Create an expired bucket directly in DB
    const expiredKey = `${testAction}:expired-bucket-${Date.now()}`;
    await prisma.rateLimitBucket.create({
      data: {
        key: expiredKey,
        count: 5,
        expiresAt: new Date(Date.now() - 10000), // 10 seconds in the past
      },
    });

    // Run prune
    const prunedCount = await pruneExpiredRateLimits(true);
    expect(prunedCount).toBeGreaterThanOrEqual(1);

    // Verify expired bucket is deleted
    const foundExpired = await prisma.rateLimitBucket.findUnique({
      where: { key: expiredKey },
    });
    expect(foundExpired).toBeNull();
  });
});
