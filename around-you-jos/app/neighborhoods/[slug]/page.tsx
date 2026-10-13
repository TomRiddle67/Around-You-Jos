import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { BusinessCard } from "@/components/business/BusinessCard";
import { getNeighborhoodBySlug, getBusinesses, getCategories } from "@/lib/data/businesses";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { BusinessSummary } from "@/types";

type PageParams = Promise<{ slug: string }>;
type SearchParams = Promise<{ category?: string }>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const neighborhood = await getNeighborhoodBySlug(slug);
  if (!neighborhood) return { title: "Neighborhood Not Found" };

  const title = resolvedSearch.category
    ? `${resolvedSearch.category} in Around ${neighborhood.name}`
    : `Around ${neighborhood.name}`;

  return {
    title,
    description: neighborhood.description ?? `Discover businesses and services around ${neighborhood.name}, Jos.`,
  };
}

export default async function NeighborhoodPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const activeCategory =
    typeof resolvedSearch.category === "string" ? resolvedSearch.category.trim() : undefined;

  const [neighborhood, businesses, categories] = await Promise.all([
    getNeighborhoodBySlug(slug),
    getBusinesses({
      neighborhood: slug,
      category: activeCategory || undefined,
    }),
    getCategories(),
  ]);

  if (!neighborhood) notFound();

  const selectedCategory = categories.find(
    (c: { id: string; name: string; slug: string }) => c.slug === activeCategory
  );

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center gap-2"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <Link href="/neighborhoods" style={{ color: "rgba(255,255,255,0.65)" }}>Neighborhoods</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.9)" }}>Around {neighborhood.name}</span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container>
            <Link
              href="/neighborhoods"
              className="inline-flex items-center gap-1.5 text-xs mb-2"
              style={{ color: "var(--fg-muted)" }}
            >
              <ArrowLeft className="h-3 w-3" /> All neighborhoods
            </Link>
            <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
              {selectedCategory
                ? `${selectedCategory.name}s around ${neighborhood.name}`
                : `Around ${neighborhood.name}`}
            </h1>
            {neighborhood.description && (
              <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                {neighborhood.description}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: "var(--fg-subtle)" }}>
              {businesses.length} {businesses.length === 1 ? "business" : "businesses"} listed
              {activeCategory && (
                <>
                  {" — "}
                  <Link
                    href={`/neighborhoods/${slug}`}
                    className="hover:underline font-medium"
                    style={{ color: "var(--green)" }}
                  >
                    Clear category filter
                  </Link>
                </>
              )}
            </p>
          </Container>
        </div>

        <div className="flex" style={{ borderBottom: "1px solid var(--border)" }}>
          <aside
            className="hidden md:block shrink-0 py-3"
            style={{ width: 200, borderRight: "1px solid var(--border)", background: "var(--bg-surface)" }}
          >
            <div
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
            >
              Filter by category
            </div>
            <Link
              href={`/neighborhoods/${slug}`}
              className="flex items-center justify-between px-3 py-1 text-sm font-medium transition-colors"
              style={{ color: !activeCategory ? "var(--green)" : "var(--fg)" }}
            >
              <span>All categories</span>
            </Link>
            {categories.map((c: { id: string; name: string; slug: string }) => {
              const isActive = activeCategory === c.slug;
              return (
                <Link
                  key={c.id}
                  href={
                    isActive
                      ? `/neighborhoods/${slug}`
                      : `/neighborhoods/${slug}?category=${encodeURIComponent(c.slug)}`
                  }
                  className="flex items-center justify-between px-3 py-1 text-sm transition-colors"
                  style={{
                    color: isActive ? "var(--green)" : "var(--fg)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span>{c.name}</span>
                  {isActive && <span className="text-xs" style={{ color: "var(--green)" }}>✓</span>}
                </Link>
              );
            })}

            <div style={{ height: "0.5px", background: "var(--border)", margin: "8px 0" }} />

            <div
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
            >
              Other areas
            </div>
            <Link href="/neighborhoods" className="block px-3 py-1 text-xs" style={{ color: "var(--green)" }}>
              View all neighborhoods →
            </Link>
          </aside>

          <div className="flex-1 p-4" style={{ background: "var(--bg)" }}>
            {businesses.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm mb-2" style={{ color: "var(--fg-muted)" }}>
                  {activeCategory
                    ? `No ${selectedCategory?.name ?? "matching"} businesses listed in ${neighborhood.name} yet.`
                    : `No businesses listed in ${neighborhood.name} yet.`}
                </p>
                {activeCategory ? (
                  <Link
                    href={`/neighborhoods/${slug}`}
                    className="text-xs inline-block"
                    style={{ color: "var(--green)" }}
                  >
                    Clear category filter →
                  </Link>
                ) : (
                  <Link href="/ask" className="text-xs" style={{ color: "var(--green)" }}>
                    Know a business here? Tell us →
                  </Link>
                )}
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
                style={{ background: "var(--border)" }}
              >
                {businesses.map((business: BusinessSummary) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
