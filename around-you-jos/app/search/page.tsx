import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { BusinessCard } from "@/components/business/BusinessCard";
import { searchBusinesses } from "@/lib/data/businesses";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import type { Metadata } from "next";
import type { BusinessSummary } from "@/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    description: `Search results for "${q}" in Jos, Nigeria.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const { businesses, neighborhoods } = query.length >= 2
    ? await searchBusinesses(query)
    : { businesses: [], neighborhoods: [] };

  const totalResults = businesses.length + neighborhoods.length;

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center justify-between"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <span>Search — Jos, Plateau State</span>
        </div>

        <div
          className="py-4"
          style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}
        >
          <Container>
            <form method="GET" action="/search" className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--fg-subtle)" }}
                />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search businesses, neighborhoods, services..."
                  className="w-full h-9 pl-9 pr-4 text-sm rounded-sm outline-none"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "0.5px solid var(--border)",
                    color: "var(--fg)",
                  }}
                />
              </div>
              <button
                type="submit"
                className="h-9 px-4 text-sm font-medium text-white rounded-sm"
                style={{ background: "var(--green)" }}
              >
                Search
              </button>
            </form>

            {query.length >= 2 && (
              <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                {totalResults} result{totalResults !== 1 ? "s" : ""} for{" "}
                <span style={{ color: "var(--fg)" }}>"{query}"</span>
              </p>
            )}
          </Container>
        </div>

        <div style={{ background: "var(--bg)" }} className="py-6">
          <Container>
            {query.length < 2 ? (
              <div className="py-20 text-center">
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                  Enter at least 2 characters to search.
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm mb-2" style={{ color: "var(--fg-muted)" }}>
                  No results found for "{query}"
                </p>
                <p className="text-xs" style={{ color: "var(--fg-subtle)" }}>
                  Try a different search term or{" "}
                  <Link href="/ask" style={{ color: "var(--green)" }}>
                    ask us directly →
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-8">

                {neighborhoods.length > 0 && (
                  <div>
                    <div
                      className="flex items-center justify-between pb-1 mb-3"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <h2 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
                        Neighborhoods
                      </h2>
                      <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                        {neighborhoods.length} found
                      </span>
                    </div>
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
                      style={{ background: "var(--border)" }}
                    >
                      {neighborhoods.map((n: { id: string; name: string; slug: string; description: string | null }) => (
                        <Link
                          key={n.id}
                          href={`/neighborhoods/${n.slug}`}
                          className="flex items-start gap-3 p-4"
                          style={{ background: "var(--bg-surface)" }}
                        >
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--green)" }} />
                          <div>
                            <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--green)" }}>
                              Around {n.name}
                            </div>
                            {n.description && (
                              <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
                                {n.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {businesses.length > 0 && (
                  <div>
                    <div
                      className="flex items-center justify-between pb-1 mb-3"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <h2 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
                        Businesses
                      </h2>
                      <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                        {businesses.length} found
                      </span>
                    </div>
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
                      style={{ background: "var(--border)" }}
                    >
                      {businesses.map((business: BusinessSummary) => (
                        <BusinessCard key={business.id} business={business} />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
