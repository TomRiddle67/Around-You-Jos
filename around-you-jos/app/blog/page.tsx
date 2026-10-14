import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { getAllPosts } from "@/sanity/queries";
import Link from "next/link";
import type { Metadata } from "next";
import type { SanityPost } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Local guides, useful places, and neighborhood recommendations in Jos.",
};

const categoryStyles: Record<string, { background: string; color: string }> = {
  Services:   { background: "#e8f5e0", color: "#1a5c1a" },
  Automotive: { background: "#e6f1fb", color: "#185fa5" },
  Food:       { background: "#fef3c7", color: "#854f0b" },
  Tech:       { background: "#fbeaf0", color: "#993556" },
  Health:     { background: "#f0fdf4", color: "#166534" },
  Education:  { background: "#eff6ff", color: "#1d4ed8" },
};

const fallbackStyle = { background: "#f5f5f4", color: "#57534e" };

export default async function BlogPage() {
  const posts = await getAllPosts().catch((error) => {
    console.warn("[BlogPage] Sanity posts unavailable:", error instanceof Error ? error.message : error);
    return [];
  });

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center justify-between"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <span>Local Guides & Posts — Jos, Plateau State</span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container>
            <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
              Useful Now
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
              Local guides, useful places, and neighborhood recommendations in Jos
            </p>
          </Container>
        </div>

        <div style={{ background: "var(--bg)" }} className="py-6">
          <Container>
            {posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                  No posts yet — check back soon.
                </p>
              </div>
            ) : (
              <div style={{ border: "0.5px solid var(--border)" }}>
                {posts.map((post: SanityPost, i: number) => {
                  const catStyle = categoryStyles[post.category] ?? fallbackStyle;
                  const date = new Date(post.publishedAt).toLocaleDateString("en-NG", {
                    month: "short", day: "numeric", year: "numeric",
                  });

                  return (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug.current}`}
                      className="flex gap-3 p-4 items-start transition-colors"
                      style={{
                        borderBottom: i < posts.length - 1 ? "0.5px solid var(--border)" : "none",
                        background: "var(--bg-surface)",
                      }}
                    >
                      <span
                        className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-sm"
                        style={{ ...catStyle, whiteSpace: "nowrap", minWidth: 72, textAlign: "center" }}
                      >
                        {post.category}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-0.5" style={{ color: "var(--fg)" }}>
                          {post.title}
                        </div>
                        <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
                          {post.excerpt}
                        </div>
                        {post.neighborhood && (
                          <div className="text-xs mt-1" style={{ color: "var(--green)" }}>
                            {post.neighborhood}
                          </div>
                        )}
                      </div>
                      <span className="text-xs whitespace-nowrap shrink-0" style={{ color: "var(--fg-subtle)" }}>
                        {date}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
