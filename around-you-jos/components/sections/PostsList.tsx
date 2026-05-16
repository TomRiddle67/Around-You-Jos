const posts = [
  {
    category: "Services",
    catStyle: { background: "#e8f5e0", color: "#1a5c1a" },
    title: "Where to print documents fast around Farin Gada",
    description: "Places with quick service, good quality and fair prices.",
    date: "May 10",
  },
  {
    category: "Automotive",
    catStyle: { background: "#e6f1fb", color: "#185fa5" },
    title: "Reliable mechanics around Rayfield — trusted by locals",
    description: "Good work, fair prices, honest turnaround times.",
    date: "May 8",
  },
  {
    category: "Food",
    catStyle: { background: "#fef3c7", color: "#854f0b" },
    title: "Affordable food spots near Terminus that won't break the bank",
    description: "Tasty meals, reasonable prices, fast service.",
    date: "May 7",
  },
  {
    category: "Tech",
    catStyle: { background: "#fbeaf0", color: "#993556" },
    title: "Phone repair places students use in Jos — fast, fair prices",
    description: "Quick fixes, good prices, reliable service.",
    date: "May 5",
  },
  {
    category: "Services",
    catStyle: { background: "#e8f5e0", color: "#1a5c1a" },
    title: "Best tailors in Jos for fast, quality work",
    description: "On time, quality stitching, fair rates.",
    date: "May 3",
  },
];

export function PostsList() {
  return (
    <div>
      {posts.map((post: { category: string; catStyle: Record<string, string>; title: string; description: string; date: string }, i: number) => (
        <div
          key={i}
          className="flex gap-3 py-2 cursor-pointer items-start"
          style={{
            borderBottom: i < posts.length - 1 ? "0.5px solid var(--border)" : "none",
          }}
        >
          <span
            className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-sm"
            style={{ ...post.catStyle, whiteSpace: "nowrap", letterSpacing: "0.04em", minWidth: 64, textAlign: "center" }}
          >
            {post.category}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm leading-snug mb-0.5 truncate" style={{ color: "var(--fg)" }}>
              {post.title}
            </div>
            <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
              {post.description}
            </div>
          </div>
          <span className="text-xs whitespace-nowrap shrink-0" style={{ color: "var(--fg-subtle)" }}>
            {post.date}
          </span>
        </div>
      ))}
    </div>
  );
}
