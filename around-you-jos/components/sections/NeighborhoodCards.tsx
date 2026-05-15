// around-you-jos/components/sections/NeighborhoodCards.tsx
import Link from "next/link";
import { PostsList } from "./PostsList";

const neighborhoods = [
  { name: "Farin Gada",  slug: "farin-gada",  count: 34 },
  { name: "Rayfield",    slug: "rayfield",     count: 28 },
  { name: "Terminus",    slug: "terminus",     count: 41 },
  { name: "Bukuru",      slug: "bukuru",       count: 19 },
  { name: "Millionaires Quarter",   slug: "millionaires-quarter",    count: 15 },
  { name: "Federal Lowcost", slug: "federal-lowcost",  count: 12 },
  { name: "Tudun Wada",  slug: "tudun-wada",   count: 9  },
];

const categories = [
  { name: "Restaurants",  slug: "restaurant", count: 38 },
  { name: "Pharmacies",   slug: "pharmacy",   count: 22 },
  { name: "Mechanics",    slug: "mechanic",   count: 17 },
  { name: "Printing",     slug: "printing",   count: 14 },
  { name: "Tech repair",  slug: "tech-repair",count: 19 },
  { name: "Tailors",      slug: "tailors",    count: 11 },
  { name: "Supermarkets", slug: "supermarket",count: 9  },
  { name: "Hotels",       slug: "hotel",      count: 8  },
];

const neighborhoodGrid = [
  { name: "Farin Gada",  slug: "farin-gada",  desc: "Student essentials, food, printing, quick errands" },
  { name: "Rayfield",    slug: "rayfield",     desc: "Services, groceries, repairs, everyday needs" },
  { name: "Terminus",    slug: "terminus",     desc: "Markets, city-center utilities, transport" },
  { name: "Bukuru",      slug: "bukuru",       desc: "Industry, local business, hospitality" },
  { name: "Millionaires Quarter",   slug: "millionaires-quarter",    desc: "Schools, churches, residential calm" },
  { name: "Federal Lowcost", slug: "federal-lowcost",  desc: "Everyday essentials, local character" },
];

const trustedPicks = [
  { title: "3 tailors locals keep recommending", desc: "Quality stitching. On time. Fair prices.", tag: "Tailoring" },
  { title: "2 quick laptop repair spots",        desc: "Fast turnaround. Trusted by many.",        tag: "Tech repair" },
  { title: "A small business worth supporting",  desc: "Supporting local. Great service.",          tag: "Local biz" },
];

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div
        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest"
        style={{
          color: "var(--fg-muted)",
          borderBottom: "0.5px solid var(--border)",
          letterSpacing: "0.07em",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div
      className="flex items-center justify-between pb-1 mb-2"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <h2 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{title}</h2>
      <Link href={href} className="text-xs" style={{ color: "var(--green)" }}>View all →</Link>
    </div>
  );
}

export function NeighborhoodCards() {
  return (
    <div
      className="flex"
      style={{ borderBottom: "1px solid var(--border)", minHeight: "60vh" }}
    >
      {/* Sidebar */}
      <aside
        className="hidden md:block shrink-0 py-2"
        style={{
          width: 200,
          borderRight: "1px solid var(--border)",
          background: "var(--bg-surface)",
        }}
      >
        <SidebarSection title="Neighborhoods">
          {neighborhoods.map((n) => (
            <Link
              key={n.slug}
              href={`/neighborhoods/${n.slug}`}
              className="flex items-center justify-between px-3 py-1 text-sm transition-colors"
              style={{ color: "var(--fg)" }}
            >
              <span>{n.name}</span>
              <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>{n.count}</span>
            </Link>
          ))}
          <Link href="/neighborhoods" className="block px-3 py-1 text-xs" style={{ color: "var(--green)" }}>
            View all 14 areas →
          </Link>
        </SidebarSection>

        <div style={{ height: "0.5px", background: "var(--border)", margin: "6px 0" }} />

        <SidebarSection title="Categories">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/businesses?category=${c.slug}`}
              className="flex items-center justify-between px-3 py-1 text-sm transition-colors"
              style={{ color: "var(--fg)" }}
            >
              <span>{c.name}</span>
              <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>{c.count}</span>
            </Link>
          ))}
          <Link href="/businesses" className="block px-3 py-1 text-xs" style={{ color: "var(--green)" }}>
            All categories →
          </Link>
        </SidebarSection>

        <div style={{ height: "0.5px", background: "var(--border)", margin: "6px 0" }} />

        <SidebarSection title="Quick links">
          {["Featured businesses", "Recently added", "Local guides", "Trusted picks"].map((label) => (
            <a key={label} className="block px-3 py-1 text-sm cursor-pointer" style={{ color: "var(--fg)" }}>
              {label}
            </a>
          ))}
        </SidebarSection>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4" style={{ background: "var(--bg)" }}>

        {/* Ask bar */}
        <div
          className="flex items-center justify-between gap-4 p-3 mb-4 rounded-sm"
          style={{ background: "var(--bg-subtle)", border: "0.5px solid var(--border)" }}
        >
          <div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--fg)" }}>
              Need something around Jos?
            </div>
            <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
              Tell us what you need — we'll help you find the right place or person.
            </div>
          </div>
          <Link
            href="/ask"
            className="px-4 py-2 text-sm font-medium text-white rounded-sm whitespace-nowrap shrink-0"
            style={{ background: "var(--green-dark)" }}
          >
            Ask Around You →
          </Link>
        </div>

        {/* Neighborhoods grid */}
        <div className="mb-5">
          <SectionHeader title="Explore by neighborhood" href="/neighborhoods" />
          <div
            className="grid grid-cols-2 gap-px"
            style={{ background: "var(--border)" }}
          >
            {neighborhoodGrid.map((n) => (
              <Link
                key={n.slug}
                href={`/neighborhoods/${n.slug}`}
                className="p-3 transition-colors"
                style={{ background: "var(--bg-surface)" }}
              >
                <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--green)" }}>
                  Around {n.name}
                </div>
                <div className="text-xs" style={{ color: "var(--fg-muted)" }}>{n.desc}</div>
                <div className="text-xs mt-1" style={{ color: "var(--green)" }}>Explore →</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Posts list */}
        <div className="mb-5">
          <SectionHeader title="Useful now — local guides and places" href="/blog" />
          <PostsList />
        </div>

        {/* Trusted picks */}
        <div className="mb-4">
          <SectionHeader title="Trusted local picks" href="/blog" />
          <div
            className="grid grid-cols-3 gap-px"
            style={{ background: "var(--border)" }}
          >
            {trustedPicks.map((pick, i) => (
              <div key={i} className="p-3" style={{ background: "var(--bg-surface)" }}>
                <div className="text-sm font-semibold mb-1 cursor-pointer" style={{ color: "var(--fg)" }}>
                  {pick.title}
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--fg-muted)" }}>{pick.desc}</div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-sm"
                  style={{ background: "var(--green-bg)", color: "var(--green-text)" }}
                >
                  {pick.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
