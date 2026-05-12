import { Container } from "@/components/layout/Container";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-900">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <Container className="relative py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-green-400 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Jos, Plateau State · Nigeria
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Useful places, trusted services,{" "}
            <span className="text-green-400">and everyday help around Jos.</span>
          </h1>

          <p className="text-base text-neutral-400 mb-8 max-w-xl leading-relaxed">
            Find what you need. Discover what&apos;s around you. Connect with people you can trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="What do you need today?"
                className="w-full h-12 pl-10 pr-4 text-sm bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            <button className="h-12 px-6 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors whitespace-nowrap">
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Print documents", "Food near me", "Phone repair", "Reliable tailor", "Groceries"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-white/8 hover:bg-white/12 border border-white/10 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}