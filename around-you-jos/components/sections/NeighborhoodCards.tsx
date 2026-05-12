import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArrowRight, MapPin } from "lucide-react";

const neighborhoods = [
  {
    name: "Farin Gada",
    slug: "farin-gada",
    description: "Student essentials, food, printing, quick errands.",
    badge: "Popular",
  },
  {
    name: "Rayfield",
    slug: "rayfield",
    description: "Services, groceries, repairs, everyday needs.",
    badge: null,
  },
  {
    name: "Terminus",
    slug: "terminus",
    description: "Markets, city-center utilities, transport, quick buys.",
    badge: null,
  },
  {
    name: "Bukuru",
    slug: "bukuru",
    description: "Industry, local business, and a growing hospitality scene.",
    badge: null,
  },
  {
    name: "Anglo Jos",
    slug: "anglo-jos",
    description: "Schools, churches, and established residential calm.",
    badge: null,
  },
  {
    name: "Dogon Dutse",
    slug: "dogon-dutse",
    description: "Growing neighborhood with everyday essentials and local character.",
    badge: null,
  },
];

export function NeighborhoodCards() {
  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-green-600 mb-2">
              <MapPin className="h-3 w-3" />
              Explore Around You
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Browse by neighborhood
            </h2>
          </div>
          <Link
            href="/neighborhoods"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            View all areas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {neighborhoods.map((n) => (
            <Link
              key={n.slug}
              href={`/neighborhoods/${n.slug}`}
              className="group relative flex flex-col p-5 bg-white rounded-2xl border border-neutral-200 hover:border-green-200 hover:shadow-md transition-all duration-200"
            >
              {n.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  {n.badge}
                </span>
              )}
              <h3 className="text-base font-bold text-neutral-900 mb-1.5 group-hover:text-green-600 transition-colors">
                Around {n.name}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed flex-1">
                {n.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-green-600">
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