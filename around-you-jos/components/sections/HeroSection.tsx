import { Container } from "@/components/layout/Container";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section style={{ background: "var(--green-dark)", borderBottom: "1px solid var(--border)" }}>
      <Container className="py-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--green)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--green)" }} />
            Jos, Plateau State · Nigeria
          </span>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3"
            style={{ color: "#ffffff" }}
          >
            Useful places, trusted services,{" "}
            <span style={{ color: "var(--green)" }}>
              and everyday help around Jos.
            </span>
          </h1>

          <p className="text-sm mb-6 max-w-xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Find what you need. Discover what&apos;s around you. Connect with people you can trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--fg-subtle)" }}
              />
              <input
                type="text"
                placeholder="What do you need? e.g. printer near Farin Gada..."
                className="w-full h-10 pl-9 pr-4 text-sm rounded-md outline-none transition-all"
                style={{
                  background: "var(--bg-surface)",
                  border: "0.5px solid var(--border)",
                  color: "var(--fg)",
                }}
              />
            </div>
            <button
              className="h-10 px-5 text-sm font-medium text-white rounded-md transition-colors whitespace-nowrap"
              style={{ background: "var(--green)" }}
            >
              Search Jos
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Print documents", "Food near me", "Phone repair", "Tailor", "Mechanic", "Pharmacy"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 text-xs rounded-sm transition-colors"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.65)",
                }}
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