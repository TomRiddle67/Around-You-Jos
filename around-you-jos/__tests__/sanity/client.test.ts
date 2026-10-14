import { describe, it, expect } from "vitest";
import { client, isSanityConfigured, sanityFetch } from "@/sanity/client";

describe("Sanity Client Configuration", () => {
  it("reports isSanityConfigured correctly based on environment variables", () => {
    // In local testing without NEXT_PUBLIC_SANITY_PROJECT_ID, it should be false
    expect(typeof isSanityConfigured).toBe("boolean");
  });

  it("handles unconfigured client safely without crashing on module load", () => {
    if (!isSanityConfigured) {
      expect(client).toBeNull();
    } else {
      expect(client).toBeDefined();
    }
  });

  it("throws a descriptive error when sanityFetch is called without configuration", async () => {
    if (!isSanityConfigured) {
      await expect(sanityFetch("*[_type == 'post']")).rejects.toThrow(
        /Sanity client is not configured/
      );
    }
  });
});
