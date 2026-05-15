import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { getNeighborhoods } from "@/lib/data/businesses";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neighborhoods",
  description: "Explore local businesses and services by neighborhood in Jos, Nigeria.",
};

export default async function NeighborhoodsPage() {
  const neighborhoods = await getNeighborhoods();

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center justify-between"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <span>Neighborhoods — Jos, Plateau State</span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container>
            <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
              Jos Neighborhoods
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
              {neighborhoods.length} neighborhoods — browse businesses and services by area
            </p>
          </Container>
        </div>

        <div style={{ background: "var(--bg)" }} className="py-6">
          <Container>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: "var(--border)" }}
            >
              {neighborhoods.map((n) => (
                <Link
                  key={n.slug}
                  href={`/neighborhoods/${n.slug}`}
                  className="block p-4 transition-colors"
                  style={{ background: "var(--bg-surface)" }}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: "var(--green)" }}>
                    Around {n.name}
                  </div>
                  {n.description && (
                    <div className="text-xs mb-2" style={{ color: "var(--fg-muted)" }}>
                      {n.description}
                    </div>
                  )}
                  <div className="text-xs" style={{ color: "var(--green)" }}>
                    Explore →
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
