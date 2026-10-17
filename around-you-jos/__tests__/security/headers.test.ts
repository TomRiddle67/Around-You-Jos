import { describe, it, expect } from "vitest";
import nextConfig, { securityHeaders, buildCspString } from "@/next.config";

/**
 * Parses a raw CSP header string into a Map of directive name to array of tokens.
 */
function parseCsp(csp: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const parts = csp.split(";").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    const tokens = part.split(/\s+/);
    const directive = tokens[0];
    const values = tokens.slice(1);
    if (directive) {
      map.set(directive, values);
    }
  }
  return map;
}

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

  describe("buildCspString helper", () => {
    it("formats directive dictionaries into valid semicolon-separated CSP strings", () => {
      const formatted = buildCspString({
        "default-src": ["'self'"],
        "object-src": ["'none'"],
        "upgrade-insecure-requests": [],
      });
      expect(formatted).toBe("default-src 'self'; object-src 'none'; upgrade-insecure-requests");
    });
  });

  describe("next.config headers() configuration", () => {
    it("configures headers() method with baseline and partitioned CSP routes", async () => {
      expect(nextConfig.headers).toBeDefined();
      expect(typeof nextConfig.headers).toBe("function");

      const headerConfigs = await nextConfig.headers!();
      expect(Array.isArray(headerConfigs)).toBe(true);

      // 1. Verify baseline catch-all route (/:path*)
      const catchAllRoute = headerConfigs.find((route) => route.source === "/:path*");
      expect(catchAllRoute).toBeDefined();

      const catchAllHeaderMap = new Map(catchAllRoute!.headers.map((h) => [h.key, h.value]));
      expect(catchAllHeaderMap.get("X-Content-Type-Options")).toBe("nosniff");
      expect(catchAllHeaderMap.get("X-Frame-Options")).toBe("DENY");
      expect(catchAllHeaderMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(catchAllHeaderMap.get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=()");
      expect(catchAllHeaderMap.has("Strict-Transport-Security")).toBe(false);

      // 2. Verify Studio route (/studio/:path*) has dedicated CSP Report-Only
      const studioRoute = headerConfigs.find((route) => route.source === "/studio/:path*");
      expect(studioRoute).toBeDefined();

      const studioHeaderMap = new Map(studioRoute!.headers.map((h) => [h.key, h.value]));
      const studioCsp = studioHeaderMap.get("Content-Security-Policy-Report-Only");
      expect(studioCsp).toBeDefined();

      // 3. Verify Public routes (/((?!studio(?:/|$)).*)) has dedicated CSP Report-Only
      const publicRoute = headerConfigs.find(
        (route) => route.source === "/((?!studio(?:/|$)).*)"
      );
      expect(publicRoute).toBeDefined();

      const publicHeaderMap = new Map(publicRoute!.headers.map((h) => [h.key, h.value]));
      const publicCsp = publicHeaderMap.get("Content-Security-Policy-Report-Only");
      expect(publicCsp).toBeDefined();
    });

    it("verifies public CSP Report-Only contains all required baseline directives", async () => {
      const headerConfigs = await nextConfig.headers!();
      const publicRoute = headerConfigs.find(
        (route) => route.source === "/((?!studio(?:/|$)).*)"
      );
      const publicCsp = publicRoute!.headers.find(
        (h) => h.key === "Content-Security-Policy-Report-Only"
      )!.value;

      const parsed = parseCsp(publicCsp);

      // Check baseline directives existence
      expect(parsed.has("default-src")).toBe(true);
      expect(parsed.get("default-src")).toEqual(["'self'"]);

      expect(parsed.has("script-src")).toBe(true);
      expect(parsed.get("script-src")).toContain("'self'");
      expect(parsed.get("script-src")).toContain("'unsafe-inline'");

      expect(parsed.has("style-src")).toBe(true);
      expect(parsed.get("style-src")).toEqual(["'self'", "'unsafe-inline'"]);

      expect(parsed.has("img-src")).toBe(true);
      expect(parsed.get("img-src")).toContain("'self'");
      expect(parsed.get("img-src")).toContain("data:");
      expect(parsed.get("img-src")).toContain("https://cdn.sanity.io");

      expect(parsed.has("font-src")).toBe(true);
      expect(parsed.get("font-src")).toEqual(["'self'", "data:"]);

      expect(parsed.has("connect-src")).toBe(true);
      expect(parsed.get("connect-src")).toContain("'self'");
      expect(parsed.get("connect-src")).toContain("https://*.api.sanity.io");
      expect(parsed.get("connect-src")).toContain("https://*.sanity.io");

      expect(parsed.has("object-src")).toBe(true);
      expect(parsed.get("object-src")).toEqual(["'none'"]);

      expect(parsed.has("base-uri")).toBe(true);
      expect(parsed.get("base-uri")).toEqual(["'self'"]);

      expect(parsed.has("form-action")).toBe(true);
      expect(parsed.get("form-action")).toEqual(["'self'"]);

      expect(parsed.has("frame-ancestors")).toBe(true);
      expect(parsed.get("frame-ancestors")).toEqual(["'none'"]);
    });

    it("ensures public CSP strictly excludes Studio-only exceptions", async () => {
      const headerConfigs = await nextConfig.headers!();
      const publicRoute = headerConfigs.find(
        (route) => route.source === "/((?!studio(?:/|$)).*)"
      );
      const publicCsp = publicRoute!.headers.find(
        (h) => h.key === "Content-Security-Policy-Report-Only"
      )!.value;

      const parsed = parseCsp(publicCsp);

      // Public site must NOT permit 'unsafe-eval'
      expect(parsed.get("script-src")).not.toContain("'unsafe-eval'");

      // Public site must NOT permit blob: or external user avatar origins
      expect(parsed.get("img-src")).not.toContain("blob:");
      expect(parsed.get("img-src")).not.toContain("https://*.gravatar.com");
      expect(parsed.get("img-src")).not.toContain("https://*.googleusercontent.com");
      expect(parsed.get("img-src")).not.toContain("https://avatars.githubusercontent.com");

      // Public site must NOT permit live listener WebSockets
      expect(parsed.get("connect-src")).not.toContain("wss://*.api.sanity.io");

      // Public site must strictly maintain frame-ancestors 'none'
      expect(parsed.get("frame-ancestors")).toEqual(["'none'"]);
    });

    it("verifies Studio CSP correctly configures required Sanity exceptions", async () => {
      const headerConfigs = await nextConfig.headers!();
      const studioRoute = headerConfigs.find((route) => route.source === "/studio/:path*");
      const studioCsp = studioRoute!.headers.find(
        (h) => h.key === "Content-Security-Policy-Report-Only"
      )!.value;

      const parsed = parseCsp(studioCsp);

      // Studio requires 'unsafe-eval' for runtime tool and schema compilation
      expect(parsed.get("script-src")).toContain("'unsafe-eval'");
      expect(parsed.get("script-src")).toContain("'unsafe-inline'");

      // Studio requires blob: for local asset uploads and avatar domains for user profiles
      expect(parsed.get("img-src")).toContain("blob:");
      expect(parsed.get("img-src")).toContain("https://cdn.sanity.io");
      expect(parsed.get("img-src")).toContain("https://*.gravatar.com");
      expect(parsed.get("img-src")).toContain("https://*.googleusercontent.com");
      expect(parsed.get("img-src")).toContain("https://avatars.githubusercontent.com");

      // Studio requires live WebSocket listener support
      expect(parsed.get("connect-src")).toContain("wss://*.api.sanity.io");

      // Studio permits self-framing for internal workspace tools
      expect(parsed.get("frame-ancestors")).toEqual(["'self'"]);
    });
  });
});
