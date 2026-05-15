import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArrowRight } from "lucide-react";

const neighborhoods = [
  { name: "Farin Gada",   slug: "farin-gada",   description: "Student essentials, food, printing, quick errands.", badge: "Popular" },
  { name: "Rayfield",     slug: "rayfield",      description: "Services, groceries, repairs, everyday needs.",      badge: null },
  { name: "Terminus",     slug: "terminus",      description: "Markets, city-center utilities, transport.",         badge: null },
  { name: "Millionaires Quarters",       slug: "millionaires-quarters",        description: "Industry, local business, hospitality.",             badge: null },
  { name: "Federal State Lowcost",    slug: "federal-state-lowcost",     description: "Schools, churches, residential calm.",               badge: null },
  { name: "Lamingo",  slug: "lamingo",   description: "Everyday essentials, local character.",              badge: null },
];

export function NeighborhoodCards() {
  return (
    <section style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
      <Container className="py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: "var(--green)" }}
            >
              Explore Around You
            </p>
            <h2 className="text-xl font-bold" style={{ color: "var(--fg)" }}>
              Browse by neighborhood
            </h2>
          </div>
          <Link href="/neighborhoods"
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: "var(--green)" }}
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "var(--border)" }}
        >
          {neighborhoods.map((n) => (
            <Link
              key={n.slug}
              href={`/neighborhoods/${n.slug}`}
              className="group relative flex flex-col p-4 transition-colors"
              style={{ background: "var(--bg-surface)" }}
            >
              {n.badge && (
                <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-sm"
                  style={{ background: "var(--green-bg)", color: "var(--green-text)" }}
                >
                  {n.badge}
                </span>
              )}
              <h3 className="text-sm font-bold mb-1 transition-colors"
                style={{ color: "var(--green)" }}
              >
                Around {n.name}
              </h3>
              <p className="text-xs leading-relaxed flex-1"
                style={{ color: "var(--fg-muted)" }}
              >
                {n.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium"
                style={{ color: "var(--green)" }}
              >
                Explore
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}