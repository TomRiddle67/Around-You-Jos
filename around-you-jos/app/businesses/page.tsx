import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { BusinessCard } from "@/components/business/BusinessCard";
import { getBusinesses, getCategories, getNeighborhoods } from "@/lib/data/businesses";
import Link from "next/link";
import type { Metadata } from "next";
import type { BusinessSummary } from "@/types";

type Item = { id: string; name: string; slug: string };

type SearchParams = Promise<{
  category?: string;
  neighborhood?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const resolved = await searchParams;
  const parts: string[] = [];
  if (resolved.category) parts.push(`category: ${resolved.category}`);
  if (resolved.neighborhood) parts.push(`neighborhood: ${resolved.neighborhood}`);

  const title = parts.length > 0 ? `Businesses (${parts.join(", ")})` : "Businesses";
  return {
    title,
    description: "Discover trusted local businesses in Jos, Nigeria.",
  };
}

function buildFilterUrl(params: { category?: string; neighborhood?: string }) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.neighborhood) query.set("neighborhood", params.neighborhood);
  const qs = query.toString();
  return qs ? `/businesses?${qs}` : "/businesses";
}

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const activeCategory =
    typeof resolvedParams.category === "string" ? resolvedParams.category.trim() : undefined;
  const activeNeighborhood =
    typeof resolvedParams.neighborhood === "string"
      ? resolvedParams.neighborhood.trim()
      : undefined;

  const [businesses, categories, neighborhoods] = await Promise.all([
    getBusinesses({
      category: activeCategory || undefined,
      neighborhood: activeNeighborhood || undefined,
    }),
    getCategories(),
    getNeighborhoods(),
  ]);

  const selectedCategoryName = categories.find((c: Item) => c.slug === activeCategory)?.name;
  const selectedNeighborhoodName = neighborhoods.find(
    (n: Item) => n.slug === activeNeighborhood
  )?.name;

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center justify-between"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <span>Business Directory — Jos, Plateau State</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>
            {businesses.length} {businesses.length === 1 ? "business" : "businesses"} listed
          </span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container>
            <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
              {selectedCategoryName && selectedNeighborhoodName
                ? `${selectedCategoryName}s in ${selectedNeighborhoodName}`
                : selectedCategoryName
                ? `${selectedCategoryName}s in Jos`
                : selectedNeighborhoodName
                ? `Local Businesses in ${selectedNeighborhoodName}`
                : "Local Businesses in Jos"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
              {businesses.length} {businesses.length === 1 ? "business" : "businesses"} across{" "}
              {neighborhoods.length} neighborhoods
              {(activeCategory || activeNeighborhood) && (
                <>
                  {" — "}
                  <Link href="/businesses" className="hover:underline font-medium" style={{ color: "var(--green)" }}>
                    Clear all filters
                  </Link>
                </>
              )}
            </p>
          </Container>
        </div>

        <div className="sticky top-16 z-40 py-2" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          <Container>
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "var(--fg-muted)" }}>
                Filter:
              </span>
              <Link
                href={buildFilterUrl({ neighborhood: activeNeighborhood })}
                className="px-2.5 py-1 text-xs whitespace-nowrap rounded-sm transition-colors font-medium"
                style={
                  !activeCategory
                    ? {
                        background: "var(--green-bg)",
                        border: "0.5px solid var(--green)",
                        color: "var(--green-text)",
                      }
                    : {
                        background: "var(--bg-subtle)",
                        border: "0.5px solid var(--border)",
                        color: "var(--fg-muted)",
                      }
                }
              >
                All
              </Link>
              {categories.map((cat: Item) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={buildFilterUrl({
                      category: isActive ? undefined : cat.slug,
                      neighborhood: activeNeighborhood,
                    })}
                    className="px-2.5 py-1 text-xs whitespace-nowrap rounded-sm transition-colors font-medium"
                    style={
                      isActive
                        ? {
                            background: "var(--green-bg)",
                            border: "0.5px solid var(--green)",
                            color: "var(--green-text)",
                          }
                        : {
                            background: "var(--bg-subtle)",
                            border: "0.5px solid var(--border)",
                            color: "var(--fg-muted)",
                          }
                    }
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
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
              Neighborhoods
            </div>
            <Link
              href={buildFilterUrl({ category: activeCategory })}
              className="flex items-center justify-between px-3 py-1 text-sm font-medium transition-colors"
              style={{ color: !activeNeighborhood ? "var(--green)" : "var(--fg)" }}
            >
              <span>All areas</span>
            </Link>
            {neighborhoods.map((n: Item) => {
              const isActive = activeNeighborhood === n.slug;
              return (
                <Link
                  key={n.id}
                  href={buildFilterUrl({
                    category: activeCategory,
                    neighborhood: isActive ? undefined : n.slug,
                  })}
                  className="flex items-center justify-between px-3 py-1 text-sm transition-colors"
                  style={{
                    color: isActive ? "var(--green)" : "var(--fg)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span>{n.name}</span>
                  {isActive && <span className="text-xs" style={{ color: "var(--green)" }}>✓</span>}
                </Link>
              );
            })}

            <div style={{ height: "0.5px", background: "var(--border)", margin: "8px 0" }} />

            <div
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
            >
              Categories
            </div>
            <Link
              href={buildFilterUrl({ neighborhood: activeNeighborhood })}
              className="flex items-center justify-between px-3 py-1 text-sm font-medium transition-colors"
              style={{ color: !activeCategory ? "var(--green)" : "var(--fg)" }}
            >
              <span>All categories</span>
            </Link>
            {categories.map((c: Item) => {
              const isActive = activeCategory === c.slug;
              return (
                <Link
                  key={c.id}
                  href={buildFilterUrl({
                    category: isActive ? undefined : c.slug,
                    neighborhood: activeNeighborhood,
                  })}
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
          </aside>

          <div className="flex-1 p-4" style={{ background: "var(--bg)" }}>
            {businesses.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                  No businesses found matching your criteria.
                </p>
                {(activeCategory || activeNeighborhood) && (
                  <Link
                    href="/businesses"
                    className="inline-block text-xs mt-2"
                    style={{ color: "var(--green)" }}
                  >
                    Clear all filters →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
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
