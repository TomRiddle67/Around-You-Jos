import Link from "next/link";
import { Container } from "./Container";
import { MapPin } from "lucide-react";

const navLinks = [
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "Businesses",    href: "/businesses" },
  { label: "Blog",          href: "/blog" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900 hover:opacity-80 transition-opacity">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <MapPin className="h-4 w-4 text-white" />
            </span>
            Around You <span className="text-brand-500 ml-1">Jos</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/ask"
            className="inline-flex items-center h-9 px-4 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors"
          >
            Need Something?
          </Link>
        </nav>
      </Container>
    </header>
  );
}