import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { BusinessCard } from "@/components/business/BusinessCard";
import { getBusinesses, getCategories, getNeighborhoods } from "@/lib/data/businesses";
import type { Metadata } from "next";
import type { BusinessSummary } from "@/types";

type Item = { id: string; name: string; slug: string };

export const metadata: Metadata = {
  title: "Businesses",
  description: "Discover trusted local businesses in Jos, Nigeria.",
};

export default async function BusinessesPage() {
  const [businesses, categories, neighborhoods] = await Promise.all([
    getBusinesses(),
    getCategories(),
    getNeighborhoods(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center justify-between"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <span>Business Directory — Jos, Plateau State</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{businesses.length} businesses listed</span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container>
            <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>Local Businesses in Jos</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
              {businesses.length} businesses across {neighborhoods.length} neighborhoods
            </p>
          </Container>
        </div>

        <div className="sticky top-16 z-40 py-2" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          <Container>
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "var(--fg-muted)" }}>Filter:</span>
              {categories.map((cat: Item) => (
                <span
                  key={cat.id}
                  className="px-2.5 py-1 text-xs cursor-pointer whitespace-nowrap rounded-sm transition-colors"
                  style={{ background: "var(--bg-subtle)", border: "0.5px solid var(--border)", color: "var(--fg-muted)" }}
                >
                  {cat.name}
                </span>
              ))}
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
            {neighborhoods.map((n: Item) => (
              <a key={n.id} className="flex items-center justify-between px-3 py-1 text-sm cursor-pointer" style={{ color: "var(--fg)" }}>
                <span>{n.name}</span>
              </a>
            ))}

            <div style={{ height: "0.5px", background: "var(--border)", margin: "8px 0" }} />

            <div
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
            >
              Categories
            </div>
            {categories.map((c: Item) => (
              <a key={c.id} className="flex items-center justify-between px-3 py-1 text-sm cursor-pointer" style={{ color: "var(--fg)" }}>
                <span>{c.name}</span>
              </a>
            ))}
          </aside>

          <div className="flex-1 p-4" style={{ background: "var(--bg)" }}>
            {businesses.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>No businesses found.</p>
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
