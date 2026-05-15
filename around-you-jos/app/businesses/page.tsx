import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { BusinessCard } from "@/components/business/BusinessCard";
import { getBusinesses, getCategories, getNeighborhoods } from "@/lib/data/businesses";
import type { Metadata } from "next";

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
        <section style={{ background: "var(--green-dark)", borderBottom: "1px solid var(--border)" }} className="py-10">
          <Container>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--green)" }}>
              Business Directory
            </p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#ffffff" }}>
              Local Businesses in Jos
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              {businesses.length} businesses listed across {neighborhoods.length} neighborhoods
            </p>
          </Container>
        </section>

        <section className="sticky top-16 z-40" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          <Container>
            <div className="flex items-center gap-2 py-3 overflow-x-auto">
              <span className="text-xs font-semibold whitespace-nowrap mr-1" style={{ color: "var(--fg-muted)" }}>
                Filter:
              </span>
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer whitespace-nowrap transition-colors"
                  style={{ background: "var(--bg-subtle)", color: "var(--fg-muted)", border: "0.5px solid var(--border)" }}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-10" style={{ background: "var(--bg)" }}>
          <Container>
            {businesses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>No businesses found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
                {businesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
