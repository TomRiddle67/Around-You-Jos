// around-you-jos/components/sections/StatBar.tsx

const stats = [
  { value: "120+",   label: "businesses" },
  { value: "14",     label: "neighborhoods" },
  { value: "300+",   label: "trusted picks" },
  { value: "2,400+", label: "people helped" },
];

export function StatBar() {
  return (
    <div
      className="flex"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex-1 py-2 text-center"
          style={{ borderRight: i < stats.length - 1 ? "0.5px solid var(--border)" : "none" }}
        >
          <div className="text-base font-bold" style={{ color: "var(--green)" }}>
            {stat.value}
          </div>
          <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
