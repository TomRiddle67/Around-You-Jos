import { Container } from "@/components/layout/Container";
import { Search } from "lucide-react";
import Link from "next/link";

const quickTags = [
  "Print documents", "Food near me", "Phone repair",
  "Reliable tailor", "Mechanic", "Groceries", "Pharmacy",
];

export function HeroSection() {
  return (
    <>
      <div
        className="text-xs px-4 py-1 flex items-center justify-between"
        style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
      >
        <span>Now live in Millionaires Quarters, Jos — more neighborhoods coming soon</span>
        <div className="hidden sm:flex gap-3">
          <Link href="/businesses" style={{ color: "rgba(255,255,255,0.75)" }}>List a business</Link>
          <Link href="/ask" style={{ color: "rgba(255,255,255,0.75)" }}>Ask Around You</Link>
        </div>
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
                placeholder="What do you need today? e.g. printer, tailor, pharmacy..."
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
              className="h-9 px-4 text-sm font-medium text-white rounded-sm whitespace-nowrap"
              style={{ background: "var(--green)" }}
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <span style={{ color: "var(--fg-subtle)" }} className="mr-1">Popular:</span>
            {quickTags.map((tag: string) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 rounded-sm cursor-pointer transition-colors"
                style={{
                  border: "0.5px solid var(--green)",
                  color: "var(--green)",
                }}
              >
                {tag}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
