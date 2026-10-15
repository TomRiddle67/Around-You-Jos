import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getClientIp, isValidIp } from "@/lib/security/clientIp";
import { headers } from "next/headers";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("Client IP Extraction & Validation", () => {
  const originalVercelEnv = process.env.VERCEL;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.VERCEL;
  });

  afterEach(() => {
    if (originalVercelEnv !== undefined) {
      process.env.VERCEL = originalVercelEnv;
    } else {
      delete process.env.VERCEL;
    }
  });

  describe("isValidIp", () => {
    it("accepts valid IPv4 addresses", () => {
      expect(isValidIp("127.0.0.1")).toBe(true);
      expect(isValidIp("192.168.1.100")).toBe(true);
      expect(isValidIp("102.89.43.12")).toBe(true);
      expect(isValidIp("8.8.8.8")).toBe(true);
    });

    it("accepts valid IPv6 addresses", () => {
      expect(isValidIp("2001:db8::1")).toBe(true);
      expect(isValidIp("fe80::1ff:fe23:4567:890a")).toBe(true);
      expect(isValidIp("::1")).toBe(true);
    });

    it("rejects invalid, malicious, or malformed strings", () => {
      expect(isValidIp("")).toBe(false);
      expect(isValidIp("not-an-ip")).toBe(false);
      expect(isValidIp("192.168.1.1; DROP TABLE users;")).toBe(false);
      expect(isValidIp("<script>alert(1)</script>")).toBe(false);
      expect(isValidIp("a".repeat(46))).toBe(false);
      expect(isValidIp("999.999.999.999.999")).toBe(false);
    });
  });

  describe("getClientIp in Vercel environment", () => {
    beforeEach(() => {
      process.env.VERCEL = "1";
    });

    it("trusts x-vercel-forwarded-for header when valid", async () => {
      vi.mocked(headers).mockResolvedValueOnce(
        new Headers({
          "x-vercel-forwarded-for": "102.89.43.12, 76.76.21.21",
          "x-forwarded-for": "1.2.3.4",
          "x-real-ip": "5.6.7.8",
        }) as unknown as Awaited<ReturnType<typeof headers>>
      );

      const ip = await getClientIp();
      expect(ip).toBe("102.89.43.12");
    });

    it("ignores client-supplied x-forwarded-for or x-real-ip when x-vercel-forwarded-for is missing", async () => {
      vi.mocked(headers).mockResolvedValueOnce(
        new Headers({
          "x-forwarded-for": "1.2.3.4",
          "x-real-ip": "5.6.7.8",
        }) as unknown as Awaited<ReturnType<typeof headers>>
      );

      const ip = await getClientIp();
      // Must NOT trust spoofable headers in Vercel environment
      expect(ip).toBeNull();
    });

    it("returns null if x-vercel-forwarded-for is malformed", async () => {
      vi.mocked(headers).mockResolvedValueOnce(
        new Headers({
          "x-vercel-forwarded-for": "malicious-header-payload",
        }) as unknown as Awaited<ReturnType<typeof headers>>
      );

      const ip = await getClientIp();
      expect(ip).toBeNull();
    });
  });

  describe("getClientIp in non-Vercel environment (self-hosted / proxy)", () => {
    it("extracts from x-real-ip when valid", async () => {
      vi.mocked(headers).mockResolvedValueOnce(
        new Headers({
          "x-real-ip": "192.168.1.50",
        }) as unknown as Awaited<ReturnType<typeof headers>>
      );

      const ip = await getClientIp();
      expect(ip).toBe("192.168.1.50");
    });

    it("extracts leftmost entry from x-forwarded-for when x-real-ip is missing", async () => {
      vi.mocked(headers).mockResolvedValueOnce(
        new Headers({
          "x-forwarded-for": "192.168.1.60, 10.0.0.1",
        }) as unknown as Awaited<ReturnType<typeof headers>>
      );

      const ip = await getClientIp();
      expect(ip).toBe("192.168.1.60");
    });

    it("returns null when no proxy headers are provided", async () => {
      vi.mocked(headers).mockResolvedValueOnce(
        new Headers() as unknown as Awaited<ReturnType<typeof headers>>
      );

      const ip = await getClientIp();
      expect(ip).toBeNull();
    });

    it("returns null and does not throw when headers() throws (e.g. outside request context)", async () => {
      vi.mocked(headers).mockRejectedValueOnce(new Error("Headers unavailable outside request"));

      const ip = await getClientIp();
      expect(ip).toBeNull();
    });
  });
});
