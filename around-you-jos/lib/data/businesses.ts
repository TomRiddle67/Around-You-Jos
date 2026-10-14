import { prisma } from "@/lib/prisma";
import type { BusinessSummary } from "@/types";

export type BusinessFilterParams = {
  neighborhood?: string;
  category?: string;
  featured?: boolean;
};

/**
 * Builds the Prisma `where` clause for business directory queries.
 * Always guarantees `isActive: true` so inactive or unpublished businesses
 * are never exposed, regardless of user input.
 */
export function buildBusinessWhereClause(filters?: BusinessFilterParams) {
  const neighborhood =
    typeof filters?.neighborhood === "string" && filters.neighborhood.trim().length > 0
      ? filters.neighborhood.trim()
      : undefined;
  const category =
    typeof filters?.category === "string" && filters.category.trim().length > 0
      ? filters.category.trim()
      : undefined;

  return {
    isActive: true,
    ...(filters?.featured     && { isFeatured: true }),
    ...(neighborhood          && { neighborhood: { slug: neighborhood } }),
    ...(category              && { category:     { slug: category } }),
  };
}

/**
 * Parses and normalizes directory search parameters from URL query strings.
 * Discards malformed (non-string), empty, or whitespace-only values,
 * and ignores unsupported query keys.
 */
export function parseDirectorySearchParams(params?: Record<string, unknown>): {
  category?: string;
  neighborhood?: string;
} {
  const category =
    typeof params?.category === "string" && params.category.trim().length > 0
      ? params.category.trim()
      : undefined;
  const neighborhood =
    typeof params?.neighborhood === "string" && params.neighborhood.trim().length > 0
      ? params.neighborhood.trim()
      : undefined;

  return { category, neighborhood };
}

/**
 * Builds consistent directory URLs while preserving existing active filters.
 */
export function buildDirectoryFilterUrl(params: {
  category?: string;
  neighborhood?: string;
}): string {
  const query = new URLSearchParams();
  if (params.category && params.category.trim().length > 0) {
    query.set("category", params.category.trim());
  }
  if (params.neighborhood && params.neighborhood.trim().length > 0) {
    query.set("neighborhood", params.neighborhood.trim());
  }
  const qs = query.toString();
  return qs ? `/businesses?${qs}` : "/businesses";
}

/**
 * Get all active businesses.
 * Optional filters: neighborhood slug, category slug, featured only.
 */
export async function getBusinesses(filters?: BusinessFilterParams): Promise<BusinessSummary[]> {
  const businesses = await prisma.business.findMany({
    where: buildBusinessWhereClause(filters),
    include: {
      neighborhood: { select: { name: true, slug: true } },
      category:     { select: { name: true, slug: true, icon: true } },
      images:       { where: { isPrimary: true }, take: 1 },
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt:  "desc" },
    ],
  });

  return businesses as BusinessSummary[];
}

/**
 * Get a single business by slug.
 * Returns null if not found — the page handles the 404.
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessSummary | null> {
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      neighborhood: { select: { name: true, slug: true } },
      category:     { select: { name: true, slug: true, icon: true } },
      images:       { where: { isPrimary: true }, take: 1 },
    },
  });

  return business as BusinessSummary | null;
}

/**
 * Get all categories for filter UI.
 */
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Get all neighborhoods for filter UI.
 */
export async function getNeighborhoods() {
  return prisma.neighborhood.findMany({
    orderBy: { name: "asc" },
  });
}
export async function getNeighborhoodBySlug(slug: string) {
  return prisma.neighborhood.findUnique({
    where: { slug },
  });
}

export const MIN_SEARCH_QUERY_LENGTH = 2;
export const MAX_SEARCH_QUERY_LENGTH = 100;

export type SearchQueryValidationResult =
  | { isValid: true; query: string; reason?: never }
  | { isValid: false; query: string; reason: "empty" | "too_short" | "too_long" };

/**
 * Validates and normalizes user-supplied search queries.
 *
 * Enforces:
 * - Safe handling of null, undefined, strings, and string arrays (extracts first param).
 * - Trimming of leading and trailing whitespace.
 * - Rejection of empty or whitespace-only queries.
 * - Minimum search query length of 2 characters.
 * - Maximum search query length of 100 characters (safely rejected, never silently truncated).
 */
export function validateSearchQuery(rawQuery: unknown): SearchQueryValidationResult {
  let queryStr: string;

  if (Array.isArray(rawQuery)) {
    queryStr = typeof rawQuery[0] === "string" ? rawQuery[0] : "";
  } else if (typeof rawQuery === "string") {
    queryStr = rawQuery;
  } else {
    return { isValid: false, query: "", reason: "empty" };
  }

  const trimmed = queryStr.trim();

  if (trimmed.length === 0) {
    return { isValid: false, query: "", reason: "empty" };
  }

  if (trimmed.length < MIN_SEARCH_QUERY_LENGTH) {
    return { isValid: false, query: trimmed, reason: "too_short" };
  }

  if (trimmed.length > MAX_SEARCH_QUERY_LENGTH) {
    return { isValid: false, query: trimmed, reason: "too_long" };
  }

  return { isValid: true, query: trimmed };
}

export async function searchBusinesses(query: string) {
  const validation = validateSearchQuery(query);
  if (!validation.isValid) return { businesses: [], neighborhoods: [] };

  const term = validation.query;

  const [businesses, neighborhoods] = await Promise.all([
    prisma.business.findMany({
      where: {
        isActive: true,
        OR: [
          { name:        { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { address:     { contains: term, mode: "insensitive" } },
          { category:    { name: { contains: term, mode: "insensitive" } } },
          { neighborhood:{ name: { contains: term, mode: "insensitive" } } },
        ],
      },
      include: {
        neighborhood: { select: { name: true, slug: true } },
        category:     { select: { name: true, slug: true, icon: true } },
        images:       { where: { isPrimary: true }, take: 1 },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 20,
    }),

    prisma.neighborhood.findMany({
      where: {
        OR: [
          { name:        { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
  ]);

  return { businesses, neighborhoods };
}

export async function getActiveBusinessesCount(): Promise<number> {
  return prisma.business.count({
    where: { isActive: true },
  });
}

export async function getTrustedPicksCount(): Promise<number> {
  return prisma.business.count({
    where: { isVerified: true, isActive: true },
  });
}

export async function getPeopleHelpedCount(): Promise<number> {
  return prisma.serviceRequest.count();
}

