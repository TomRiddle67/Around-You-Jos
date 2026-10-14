import Link from "next/link";
import { Container } from "./Container";
import { MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "Businesses",    href: "/businesses" },
  { label: "Blog",          href: "/blog" },
  { label: "About",         href: "/about" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--fg)" }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "var(--green)" }}
            >
              <MapPin className="h-4 w-4 text-white" />
            </span>
            Around You
            <span style={{ color: "var(--green)" }}>Jos</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link: { label: string; href: string }) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--fg-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/ask"
              className="inline-flex items-center h-9 px-4 text-sm font-medium text-white rounded-xl transition-colors"
              style={{ background: "var(--green)" }}
            >
              Need Something?
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}