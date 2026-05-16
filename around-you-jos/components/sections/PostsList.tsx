import Link from "next/link";
import type { SanityPost } from "@/sanity/queries";

const categoryStyles: Record<string, { background: string; color: string }> = {
  Services:   { background: "#e8f5e0", color: "#1a5c1a" },
  Automotive: { background: "#e6f1fb", color: "#185fa5" },
  Food:       { background: "#fef3c7", color: "#854f0b" },
  Tech:       { background: "#fbeaf0", color: "#993556" },
  Health:     { background: "#f0fdf4", color: "#166534" },
  Education:  { background: "#eff6ff", color: "#1d4ed8" },
};

const fallbackStyle = { background: "#f5f5f4", color: "#57534e" };

interface PostsListProps {
  posts: SanityPost[];
}

export function PostsList({ posts }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-sm py-4" style={{ color: "var(--fg-muted)" }}>
        No posts yet — check back soon.
      </p>
    );
  }

  return (
    <div>
      {posts.map((post: SanityPost, i: number) => {
        const catStyle = categoryStyles[post.category] ?? fallbackStyle;
        const date = new Date(post.publishedAt).toLocaleDateString("en-NG", {
          month: "short",
          day:   "numeric",
        });

        return (
          <Link
            href={`/blog/${post.slug.current}`}
            key={post._id}
            className="flex gap-3 py-2 cursor-pointer items-start"
            style={{ borderBottom: i < posts.length - 1 ? "0.5px solid var(--border)" : "none" }}
          >
            <span
              className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-sm"
              style={{ ...catStyle, whiteSpace: "nowrap", minWidth: 64, textAlign: "center" }}
            >
              {post.category}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm leading-snug mb-0.5 truncate" style={{ color: "var(--fg)" }}>
                {post.title}
              </div>
              <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
                {post.excerpt}
              </div>
            </div>
            <span className="text-xs whitespace-nowrap shrink-0" style={{ color: "var(--fg-subtle)" }}>
              {date}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
