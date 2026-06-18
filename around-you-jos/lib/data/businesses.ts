import { prisma } from "@/lib/prisma";
import type { BusinessSummary } from "@/types";

/**
 * Get all active businesses.
 * Optional filters: neighborhood slug, category slug, featured only.
 */
export async function getBusinesses(filters?: {
  neighborhood?: string;
  category?: string;
  featured?: boolean;
}): Promise<BusinessSummary[]> {
  const businesses = await prisma.business.findMany({
    where: {
      isActive: true,
      ...(filters?.featured     && { isFeatured: true }),
      ...(filters?.neighborhood && { neighborhood: { slug: filters.neighborhood } }),
      ...(filters?.category     && { category:     { slug: filters.category } }),
    },
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

export async function searchBusinesses(query: string) {
  if (!query || query.trim().length < 2) return { businesses: [], neighborhoods: [] };

  const term = query.trim();

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

export async function getTrustedPicksCount(): Promise<number> {
  return prisma.business.count({
    where: { isVerified: true, isActive: true },
  });
}

export async function getPeopleHelpedCount(): Promise<number> {
  return prisma.serviceRequest.count();
}
