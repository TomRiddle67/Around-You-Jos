import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildBusinessWhereClause,
  parseDirectorySearchParams,
  buildDirectoryFilterUrl,
  getBusinesses,
} from "@/lib/data/businesses";
import { prisma } from "@/lib/prisma";

// Mock prisma to isolate tests completely from live PostgreSQL
vi.mock("@/lib/prisma", () => ({
  prisma: {
    business: {
      findMany: vi.fn(),
    },
  },
}));

describe("Business Directory Filtering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parseDirectorySearchParams", () => {
    it("returns undefined filters for undefined or null input", () => {
      expect(parseDirectorySearchParams(undefined)).toEqual({
        category: undefined,
        neighborhood: undefined,
      });
    });

    it("returns undefined filters for an empty object", () => {
      expect(parseDirectorySearchParams({})).toEqual({
        category: undefined,
        neighborhood: undefined,
      });
    });

    it("extracts a valid category parameter", () => {
      const result = parseDirectorySearchParams({ category: "restaurants" });
      expect(result).toEqual({
        category: "restaurants",
        neighborhood: undefined,
      });
    });

    it("extracts a valid neighborhood parameter", () => {
      const result = parseDirectorySearchParams({ neighborhood: "rayfield" });
      expect(result).toEqual({
        category: undefined,
        neighborhood: "rayfield",
      });
    });

    it("extracts both category and neighborhood parameters", () => {
      const result = parseDirectorySearchParams({
        category: "cafes",
        neighborhood: "tudun-wada",
      });
      expect(result).toEqual({
        category: "cafes",
        neighborhood: "tudun-wada",
      });
    });

    it("normalizes parameters by trimming whitespace", () => {
      const result = parseDirectorySearchParams({
        category: "  automotive  ",
        neighborhood: "  angwan-rogo  ",
      });
      expect(result).toEqual({
        category: "automotive",
        neighborhood: "angwan-rogo",
      });
    });

    it("discards whitespace-only parameters", () => {
      const result = parseDirectorySearchParams({
        category: "   ",
        neighborhood: "\t \n ",
      });
      expect(result).toEqual({
        category: undefined,
        neighborhood: undefined,
      });
    });

    it("discards non-string / malformed parameter types", () => {
      const result = parseDirectorySearchParams({
        category: 12345,
        neighborhood: ["rayfield", "millionaires-quarters"],
      });
      expect(result).toEqual({
        category: undefined,
        neighborhood: undefined,
      });
    });

    it("discards object and boolean types", () => {
      const result = parseDirectorySearchParams({
        category: { slug: "tech" },
        neighborhood: true,
      });
      expect(result).toEqual({
        category: undefined,
        neighborhood: undefined,
      });
    });

    it("ignores unsupported or unexpected query parameters", () => {
      const result = parseDirectorySearchParams({
        category: "health",
        unsupported: "foo",
        isAdmin: "true",
        isActive: "false",
      });
      expect(result).toEqual({
        category: "health",
        neighborhood: undefined,
      });
    });
  });

  describe("buildDirectoryFilterUrl", () => {
    it("returns base directory path when no filters are set", () => {
      expect(buildDirectoryFilterUrl({})).toBe("/businesses");
    });

    it("returns base directory path when all filters are undefined or empty", () => {
      expect(
        buildDirectoryFilterUrl({ category: undefined, neighborhood: undefined })
      ).toBe("/businesses");
      expect(
        buildDirectoryFilterUrl({ category: "   ", neighborhood: "" })
      ).toBe("/businesses");
    });

    it("builds category-only URL", () => {
      expect(buildDirectoryFilterUrl({ category: "food-dining" })).toBe(
        "/businesses?category=food-dining"
      );
    });

    it("builds neighborhood-only URL", () => {
      expect(buildDirectoryFilterUrl({ neighborhood: "rayfield" })).toBe(
        "/businesses?neighborhood=rayfield"
      );
    });

    it("builds combined category and neighborhood URL", () => {
      expect(
        buildDirectoryFilterUrl({
          category: "food-dining",
          neighborhood: "rayfield",
        })
      ).toBe("/businesses?category=food-dining&neighborhood=rayfield");
    });

    it("preserves active neighborhood when switching or setting category", () => {
      const activeNeighborhood = "rayfield";
      const newCategory = "nightlife";
      const url = buildDirectoryFilterUrl({
        category: newCategory,
        neighborhood: activeNeighborhood,
      });
      expect(url).toBe("/businesses?category=nightlife&neighborhood=rayfield");
    });

    it("preserves active category when switching or setting neighborhood", () => {
      const activeCategory = "health";
      const newNeighborhood = "tudun-wada";
      const url = buildDirectoryFilterUrl({
        category: activeCategory,
        neighborhood: newNeighborhood,
      });
      expect(url).toBe("/businesses?category=health&neighborhood=tudun-wada");
    });

    it("preserves active neighborhood when clearing category", () => {
      const activeNeighborhood = "rayfield";
      const url = buildDirectoryFilterUrl({
        category: undefined,
        neighborhood: activeNeighborhood,
      });
      expect(url).toBe("/businesses?neighborhood=rayfield");
    });

    it("preserves active category when clearing neighborhood", () => {
      const activeCategory = "health";
      const url = buildDirectoryFilterUrl({
        category: activeCategory,
        neighborhood: undefined,
      });
      expect(url).toBe("/businesses?category=health");
    });
  });

  describe("buildBusinessWhereClause", () => {
    it("always enforces isActive: true when called with no arguments", () => {
      const where = buildBusinessWhereClause();
      expect(where).toEqual({ isActive: true });
    });

    it("always enforces isActive: true when called with an empty object", () => {
      const where = buildBusinessWhereClause({});
      expect(where).toEqual({ isActive: true });
    });

    it("builds category-only where clause and enforces isActive: true", () => {
      const where = buildBusinessWhereClause({ category: "food-dining" });
      expect(where).toEqual({
        isActive: true,
        category: { slug: "food-dining" },
      });
    });

    it("builds neighborhood-only where clause and enforces isActive: true", () => {
      const where = buildBusinessWhereClause({ neighborhood: "rayfield" });
      expect(where).toEqual({
        isActive: true,
        neighborhood: { slug: "rayfield" },
      });
    });

    it("builds combined category and neighborhood where clause and enforces isActive: true", () => {
      const where = buildBusinessWhereClause({
        category: "health",
        neighborhood: "angwan-rogo",
      });
      expect(where).toEqual({
        isActive: true,
        category: { slug: "health" },
        neighborhood: { slug: "angwan-rogo" },
      });
    });

    it("handles featured flag correctly", () => {
      const featuredWhere = buildBusinessWhereClause({ featured: true });
      expect(featuredWhere).toEqual({
        isActive: true,
        isFeatured: true,
      });

      const unfeaturedWhere = buildBusinessWhereClause({ featured: false });
      expect(unfeaturedWhere).toEqual({
        isActive: true,
      });
    });

    it("normalizes and trims whitespace from filter values in where clause", () => {
      const where = buildBusinessWhereClause({
        category: "  fashion  ",
        neighborhood: "  millionaires-quarters  ",
      });
      expect(where).toEqual({
        isActive: true,
        category: { slug: "fashion" },
        neighborhood: { slug: "millionaires-quarters" },
      });
    });

    it("ignores whitespace-only and malformed filter values", () => {
      const where = buildBusinessWhereClause({
        category: "   ",
        neighborhood: "\t \n",
      });
      expect(where).toEqual({ isActive: true });
    });

    it("prevents broadening access: isActive cannot be circumvented", () => {
      // Even if an unexpected input object is cast, isActive is hardcoded to true
      const maliciousAttempt = {
        category: "tech",
        isActive: false,
      } as unknown as { category?: string };

      const where = buildBusinessWhereClause(maliciousAttempt);
      expect(where.isActive).toBe(true);
    });
  });

  describe("getBusinesses database query integration", () => {
    it("calls prisma.business.findMany with default isActive: true and standard ordering", async () => {
      const mockBusinesses = [
        {
          id: "biz-1",
          name: "Jos Roastery",
          slug: "jos-roastery",
          isActive: true,
          isFeatured: true,
        },
      ];
      vi.mocked(prisma.business.findMany).mockResolvedValueOnce(
        mockBusinesses as unknown as Awaited<ReturnType<typeof prisma.business.findMany>>
      );

      const result = await getBusinesses();

      expect(prisma.business.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.business.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: {
          neighborhood: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true, icon: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      });
      expect(result).toEqual(mockBusinesses);
    });

    it("passes combined category and neighborhood filters to prisma.business.findMany", async () => {
      vi.mocked(prisma.business.findMany).mockResolvedValueOnce([]);

      const result = await getBusinesses({
        category: "cafes",
        neighborhood: "rayfield",
      });

      expect(prisma.business.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isActive: true,
            category: { slug: "cafes" },
            neighborhood: { slug: "rayfield" },
          },
        })
      );
      expect(result).toEqual([]);
    });

    it("handles empty-result behavior gracefully", async () => {
      vi.mocked(prisma.business.findMany).mockResolvedValueOnce([]);

      const result = await getBusinesses({
        category: "non-existent-category",
        neighborhood: "non-existent-neighborhood",
      });

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
