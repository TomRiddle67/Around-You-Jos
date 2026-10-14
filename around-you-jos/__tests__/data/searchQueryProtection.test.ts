import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateSearchQuery,
  searchBusinesses,
  MIN_SEARCH_QUERY_LENGTH,
  MAX_SEARCH_QUERY_LENGTH,
} from "@/lib/data/businesses";
import { prisma } from "@/lib/prisma";

// Mock prisma to isolate tests completely from live database
vi.mock("@/lib/prisma", () => ({
  prisma: {
    business: {
      findMany: vi.fn(),
    },
    neighborhood: {
      findMany: vi.fn(),
    },
  },
}));

describe("Search Query Boundary Protection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Constants", () => {
    it("documents the expected minimum search length of 2", () => {
      expect(MIN_SEARCH_QUERY_LENGTH).toBe(2);
    });

    it("documents the expected maximum search length of 100", () => {
      expect(MAX_SEARCH_QUERY_LENGTH).toBe(100);
    });
  });

  describe("validateSearchQuery", () => {
    it("accepts a normal valid query", () => {
      const result = validateSearchQuery("tailor");
      expect(result).toEqual({
        isValid: true,
        query: "tailor",
      });
    });

    it("accepts queries with multiple words within limit", () => {
      const result = validateSearchQuery("dry cleaner in rayfield");
      expect(result).toEqual({
        isValid: true,
        query: "dry cleaner in rayfield",
      });
    });

    it("accepts exactly 2 characters (minimum boundary)", () => {
      const result = validateSearchQuery("jo");
      expect(result).toEqual({
        isValid: true,
        query: "jo",
      });
    });

    it("rejects 1 character as too short", () => {
      const result = validateSearchQuery("j");
      expect(result).toEqual({
        isValid: false,
        query: "j",
        reason: "too_short",
      });
    });

    it("accepts exactly 100 characters (maximum boundary)", () => {
      const query100 = "a".repeat(100);
      const result = validateSearchQuery(query100);
      expect(result).toEqual({
        isValid: true,
        query: query100,
      });
    });

    it("rejects 101 characters as too long", () => {
      const query101 = "a".repeat(101);
      const result = validateSearchQuery(query101);
      expect(result).toEqual({
        isValid: false,
        query: query101,
        reason: "too_long",
      });
    });

    it("rejects a substantially oversized query (500 characters)", () => {
      const query500 = "x".repeat(500);
      const result = validateSearchQuery(query500);
      expect(result).toEqual({
        isValid: false,
        query: query500,
        reason: "too_long",
      });
    });

    it("strips leading and trailing whitespace from a valid query", () => {
      const result = validateSearchQuery("   mechanic   ");
      expect(result).toEqual({
        isValid: true,
        query: "mechanic",
      });
    });

    it("accepts a query where padding whitespace brings total length > 100 but trimmed length is 100", () => {
      const query100 = "b".repeat(100);
      const padded = `   ${query100}   `;
      expect(padded.length).toBe(106);

      const result = validateSearchQuery(padded);
      expect(result).toEqual({
        isValid: true,
        query: query100,
      });
    });

    it("rejects a padded query whose trimmed length exceeds 100 characters", () => {
      const query101 = "c".repeat(101);
      const padded = `  ${query101}  `;
      const result = validateSearchQuery(padded);
      expect(result).toEqual({
        isValid: false,
        query: query101,
        reason: "too_long",
      });
    });

    it("rejects whitespace-only queries as empty", () => {
      const result = validateSearchQuery("     ");
      expect(result).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
    });

    it("rejects empty string as empty", () => {
      const result = validateSearchQuery("");
      expect(result).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
    });

    it("rejects undefined query as empty", () => {
      const result = validateSearchQuery(undefined);
      expect(result).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
    });

    it("rejects null query as empty", () => {
      const result = validateSearchQuery(null);
      expect(result).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
    });

    it("safely handles non-string and non-array inputs without throwing", () => {
      expect(validateSearchQuery(12345)).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
      expect(validateSearchQuery({})).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
      expect(validateSearchQuery(true)).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
    });

    it("handles repeated query parameters (array) by using the first parameter", () => {
      const result = validateSearchQuery(["tailor", "pharmacy"]);
      expect(result).toEqual({
        isValid: true,
        query: "tailor",
      });
    });

    it("rejects repeated query parameters if the first parameter is oversized", () => {
      const result = validateSearchQuery(["a".repeat(101), "valid"]);
      expect(result).toEqual({
        isValid: false,
        query: "a".repeat(101),
        reason: "too_long",
      });
    });

    it("rejects repeated query parameters if the first parameter is too short", () => {
      const result = validateSearchQuery(["x", "valid"]);
      expect(result).toEqual({
        isValid: false,
        query: "x",
        reason: "too_short",
      });
    });

    it("rejects an empty array of parameters as empty", () => {
      const result = validateSearchQuery([]);
      expect(result).toEqual({
        isValid: false,
        query: "",
        reason: "empty",
      });
    });
  });

  describe("searchBusinesses database boundary protection", () => {
    it("executes database queries for normal valid search query", async () => {
      vi.mocked(prisma.business.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.neighborhood.findMany).mockResolvedValueOnce([]);

      const result = await searchBusinesses("bakery");

      expect(prisma.business.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.neighborhood.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.business.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            OR: expect.arrayContaining([
              { name: { contains: "bakery", mode: "insensitive" } },
            ]),
          }),
        })
      );
      expect(result).toEqual({ businesses: [], neighborhoods: [] });
    });

    it("executes database queries for exactly 100 character query", async () => {
      vi.mocked(prisma.business.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.neighborhood.findMany).mockResolvedValueOnce([]);

      const query100 = "a".repeat(100);
      const result = await searchBusinesses(query100);

      expect(prisma.business.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.neighborhood.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ businesses: [], neighborhoods: [] });
    });

    it("bypasses database search entirely when query exceeds 100 characters (101 chars)", async () => {
      const query101 = "a".repeat(101);
      const result = await searchBusinesses(query101);

      expect(result).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();
    });

    it("bypasses database search entirely for a substantially oversized query (500 chars)", async () => {
      const query500 = "z".repeat(500);
      const result = await searchBusinesses(query500);

      expect(result).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();
    });

    it("bypasses database search entirely when query is below minimum length (1 char)", async () => {
      const result = await searchBusinesses("a");

      expect(result).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();
    });

    it("bypasses database search entirely when query is empty", async () => {
      const result = await searchBusinesses("");

      expect(result).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();
    });

    it("bypasses database search entirely when query is whitespace only", async () => {
      const result = await searchBusinesses("    ");

      expect(result).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();
    });

    it("bypasses database search entirely when query is null or undefined", async () => {
      // Cast to unknown/any to verify boundary protection against untyped callers
      const resultUndefined = await searchBusinesses(undefined as unknown as string);
      expect(resultUndefined).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();

      const resultNull = await searchBusinesses(null as unknown as string);
      expect(resultNull).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();
    });

    it("bypasses database search when passed an array containing an oversized first query", async () => {
      const result = await searchBusinesses(["a".repeat(105), "normal"] as unknown as string);

      expect(result).toEqual({ businesses: [], neighborhoods: [] });
      expect(prisma.business.findMany).not.toHaveBeenCalled();
      expect(prisma.neighborhood.findMany).not.toHaveBeenCalled();
    });
  });
});
