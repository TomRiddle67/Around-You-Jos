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

/**
 * This page is a React Server Component.
 * It's async — it can await database calls directly.
 * No API route needed. No useEffect. No loading spinner.
 * The server builds the complete HTML and sends it to the browser.
 */
export default async function BusinessesPage() {
  // These run in parallel — faster than sequential awaits
  const [businesses, categories, neighborhoods] = await Promise.all([
    getBusinesses(),
    getCategories(),
    getNeighborhoods(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <section className="bg-neutral-900 py-12">
          <Container>
            <p className="text-xs font-semibold tracking-widest uppercase text-green-400 mb-2">
              Business Directory
            </p>
            <h1 className="text-3xl font-bold text-white mb-2">
              Local Businesses in Jos
            </h1>
            <p className="text-neutral-400 text-sm">
              {businesses.length} businesses listed across {neighborhoods.length} neighborhoods
            </p>
          </Container>
        </section>

        {/* Filter bar */}
        <section className="border-b border-neutral-200 bg-white sticky top-16 z-40">
          <Container>
            <div className="flex items-center gap-2 py-3 overflow-x-auto">
              <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap mr-1">
                Filter:
              </span>
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-green-50 hover:text-green-700 rounded-full cursor-pointer whitespace-nowrap transition-colors"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* Business grid */}
        <section className="py-12 bg-neutral-50">
          <Container>
            {businesses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-400 text-sm">No businesses found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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