import Link from "next/link";
import type { SanityPost } from "@/sanity/queries";
import { PostsList } from "./PostsList";

interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NeighborhoodCardsProps {
  neighborhoods: Neighborhood[];
  categories: Category[];
  posts: SanityPost[];
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div
        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)", letterSpacing: "0.07em" }}
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

export function NeighborhoodCards({ neighborhoods, categories, posts }: NeighborhoodCardsProps) {
  return (
    <div className="flex" style={{ borderBottom: "1px solid var(--border)", minHeight: "60vh" }}>

      {/* Sidebar */}
      <aside
        className="hidden md:block shrink-0 py-2"
        style={{ width: 200, borderRight: "1px solid var(--border)", background: "var(--bg-surface)" }}
      >
        <SidebarSection title="Neighborhoods">
          {neighborhoods.map((n: { id: string; name: string; slug: string; description: string | null }) => (
            <Link
              key={n.slug}
              href={`/neighborhoods/${n.slug}`}
              className="flex items-center justify-between px-3 py-1 text-sm transition-colors"
              style={{ color: "var(--fg)" }}
            >
              <span>{n.name}</span>
            </Link>
          ))}
          <Link href="/neighborhoods" className="block px-3 py-1 text-xs" style={{ color: "var(--green)" }}>
            View all areas →
          </Link>
        </SidebarSection>

        <div style={{ height: "0.5px", background: "var(--border)", margin: "6px 0" }} />

        <SidebarSection title="Categories">
          {categories.map((c: { id: string; name: string; slug: string }) => (
            <Link
              key={c.slug}
              href={`/businesses?category=${c.slug}`}
              className="flex items-center justify-between px-3 py-1 text-sm transition-colors"
              style={{ color: "var(--fg)" }}
            >
              <span>{c.name}</span>
            </Link>
          ))}
          <Link href="/businesses" className="block px-3 py-1 text-xs" style={{ color: "var(--green)" }}>
            All categories →
          </Link>
        </SidebarSection>

        <div style={{ height: "0.5px", background: "var(--border)", margin: "6px 0" }} />

        <SidebarSection title="Quick links">
          {["Featured businesses", "Recently added", "Local guides", "Trusted picks"].map((label: string) => (
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
          <SectionHeader title="Now live" href="/neighborhoods" />
          <div className="grid grid-cols-2 gap-px" style={{ background: "var(--border)" }}>
            {neighborhoods.map((n: { id: string; name: string; slug: string; description: string | null }) => (
              <Link
                key={n.slug}
                href={`/neighborhoods/${n.slug}`}
                className="p-3 transition-colors"
                style={{ background: "var(--bg-surface)" }}
              >
                <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--green)" }}>
                  Around {n.name}
                </div>
                <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
                  {n.description ?? "Explore local businesses and services"}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--green)" }}>Explore →</div>
              </Link>
            ))}
            <div
              className="p-3 flex flex-col items-start justify-center"
              style={{ background: "var(--bg-subtle)" }}
            >
              <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--fg-muted)" }}>
                More neighborhoods
              </div>
              <div className="text-xs" style={{ color: "var(--fg-subtle)" }}>
                Coming soon — know an area we should cover?{" "}
                <Link href="/ask" style={{ color: "var(--green)" }}>Tell us</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Posts list */}
        <div className="mb-5">
          <SectionHeader title="Useful now — local guides and places" href="/blog" />
          <PostsList posts={posts} />
        </div>

      </main>
    </div>
  );
}
