import { describe, it, expect } from "vitest";
import nextConfig, { securityHeaders } from "@/next.config";

describe("HTTP Security Headers Configuration", () => {
  it("exports securityHeaders with the baseline security protections", () => {
    expect(securityHeaders).toEqual([
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ]);
  });

  it("configures headers() method in next.config", async () => {
    expect(nextConfig.headers).toBeDefined();
    expect(typeof nextConfig.headers).toBe("function");

    const headerConfigs = await nextConfig.headers!();
    expect(Array.isArray(headerConfigs)).toBe(true);

    const catchAllRoute = headerConfigs.find((route) => route.source === "/:path*");
    expect(catchAllRoute).toBeDefined();

    const headers = catchAllRoute!.headers;

    // Verify individual header mappings
    const headerMap = new Map(headers.map((h) => [h.key, h.value]));

    expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headerMap.get("X-Frame-Options")).toBe("DENY");
    expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headerMap.get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=()");

    // Verify HSTS is not set in next.config to prevent breaking local HTTP development
    expect(headerMap.has("Strict-Transport-Security")).toBe(false);
  });
});
