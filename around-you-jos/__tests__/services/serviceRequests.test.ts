import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitServiceRequest } from "@/lib/services/serviceRequests";
import { createServiceRequest } from "@/lib/data/serviceRequests";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/data/serviceRequests", () => ({
  createServiceRequest: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    rateLimitBucket: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
    },
    serviceRequest: {
      create: vi.fn(),
    },
  },
}));

describe("submitServiceRequest with Rate Limiting", () => {
  const validPayload = {
    name: "Sani Mohammed",
    phone: "+234 803 111 2233",
    description: "Looking for an auto mechanic in Anglo Jos.",
    neighborhoodId: "neighborhood-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.rateLimitBucket.deleteMany).mockResolvedValue({ count: 0 });
  });

  it("successfully creates a request when under the rate limits", async () => {
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValue({
      key: "test-key",
      count: 1,
      expiresAt: new Date(Date.now() + 600000),
    });
    vi.mocked(createServiceRequest).mockResolvedValueOnce({
      id: "req-1",
      name: validPayload.name,
      phone: validPayload.phone,
      description: validPayload.description,
      status: "PENDING",
      createdAt: new Date(),
      neighborhoodId: validPayload.neighborhoodId,
    });

    const result = await submitServiceRequest(validPayload, {
      clientIp: "192.168.1.100",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.message).toContain("received");
    }
    expect(createServiceRequest).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid input schema before creating records", async () => {
    // Under rate limit
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValue({
      key: "test-key",
      count: 1,
      expiresAt: new Date(Date.now() + 600000),
    });

    const invalidPayload = {
      name: "S", // Too short (min 2)
      phone: "invalid-phone",
      description: "Short", // Too short (min 10)
    };

    const result = await submitServiceRequest(invalidPayload, {
      clientIp: "192.168.1.100",
    });

    expect(result.success).toBe(false);
    if (!result.success && "errors" in result) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.phone).toBeDefined();
      expect(result.errors.description).toBeDefined();
    }
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("rejects submission and avoids creating records when neighborhoodId is malformed or invalid", async () => {
    // Under IP rate limit
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValue({
      key: "test-key",
      count: 1,
      expiresAt: new Date(Date.now() + 600000),
    });

    const malformedPayload = {
      ...validPayload,
      neighborhoodId: "<script>alert('xss')</script>",
    };

    const result = await submitServiceRequest(malformedPayload, {
      clientIp: "192.168.1.100",
    });

    expect(result.success).toBe(false);
    if (!result.success && "errors" in result) {
      expect(result.errors.neighborhoodId).toBeDefined();
    }
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("blocks submission and avoids creating records when IP rate limit is exceeded", async () => {
    // First upsert call is for IP check -> return count 6 (limit is 5)
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
      key: "ip-key",
      count: 6,
      expiresAt: new Date(Date.now() + 600000),
    });

    const result = await submitServiceRequest(validPayload, {
      clientIp: "192.168.1.200",
    });

    expect(result.success).toBe(false);
    if (!result.success && "message" in result) {
      expect(result.message).toContain("Too many requests from your connection");
      // Must not leak internal details or raw IP
      expect(result.message).not.toContain("192.168.1.200");
    }
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("blocks submission and avoids creating records when Phone rate limit is exceeded", async () => {
    // 1st upsert: IP check passes (count 1)
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
      key: "ip-key",
      count: 1,
      expiresAt: new Date(Date.now() + 600000),
    });

    // 2nd upsert: Phone check fails (count 4, limit is 3)
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
      key: "phone-key",
      count: 4,
      expiresAt: new Date(Date.now() + 600000),
    });

    const result = await submitServiceRequest(validPayload, {
      clientIp: "192.168.1.50",
    });

    expect(result.success).toBe(false);
    if (!result.success && "message" in result) {
      expect(result.message).toContain("Too many requests for this phone number");
      // Must not leak raw phone number
      expect(result.message).not.toContain(validPayload.phone);
    }
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("fails closed safely when the rate limiting storage is unavailable", async () => {
    vi.mocked(prisma.rateLimitBucket.upsert).mockRejectedValueOnce(
      new Error("PostgreSQL connection refused")
    );

    const result = await submitServiceRequest(validPayload, {
      clientIp: "192.168.1.100",
    });

    // Fail-closed policy protects database from unthrottled writes during backend degradation
    expect(result.success).toBe(false);
    if (!result.success && "message" in result) {
      expect(result.message).toContain("Too many requests");
      expect(result.message).not.toContain("PostgreSQL");
    }
    expect(createServiceRequest).not.toHaveBeenCalled();
  });

  it("handles generic database write errors during createServiceRequest gracefully", async () => {
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValue({
      key: "test-key",
      count: 1,
      expiresAt: new Date(Date.now() + 600000),
    });
    vi.mocked(createServiceRequest).mockRejectedValueOnce(new Error("Database write error"));

    const result = await submitServiceRequest(validPayload, {
      clientIp: "192.168.1.100",
    });

    expect(result.success).toBe(false);
    if (!result.success && "message" in result) {
      expect(result.message).toBe("Something went wrong. Please try again.");
    }
  });

  it("safely skips IP rate limit and allows submission when clientIp is null or anonymous without locking out visitors", async () => {
    // Only phone rate limit should be checked (1 upsert call)
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValueOnce({
      key: "phone-key",
      count: 1,
      expiresAt: new Date(Date.now() + 600000),
    });
    vi.mocked(createServiceRequest).mockResolvedValueOnce({
      id: "req-anon",
      name: validPayload.name,
      phone: validPayload.phone,
      description: validPayload.description,
      status: "PENDING",
      createdAt: new Date(),
      neighborhoodId: validPayload.neighborhoodId,
    });

    const result = await submitServiceRequest(validPayload, {
      clientIp: null,
    });

    expect(result.success).toBe(true);
    // Verifies that only the phone rate limit bucket was touched, NOT an anonymous IP bucket
    expect(prisma.rateLimitBucket.upsert).toHaveBeenCalledTimes(1);
    expect(createServiceRequest).toHaveBeenCalledTimes(1);
  });
});

