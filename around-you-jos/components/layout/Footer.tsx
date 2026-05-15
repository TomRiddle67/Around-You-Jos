import Link from "next/link";
import { Container } from "./Container";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
      <Container className="py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold mb-1.5"
              style={{ color: "var(--fg)" }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: "var(--green)" }}
              >
                <MapPin className="h-3.5 w-3.5 text-white" />
              </span>
              Around You <span style={{ color: "var(--green)", marginLeft: 4 }}>Jos</span>
            </Link>
            <p className="text-xs max-w-xs" style={{ color: "var(--fg-subtle)" }}>
              Your practical guide to places, services, and neighborhoods in Jos, Nigeria.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            style={{ color: "var(--fg-muted)" }}
          >
            {[
              { label: "Neighborhoods", href: "/neighborhoods" },
              { label: "Businesses",    href: "/businesses" },
              { label: "Blog",          href: "/blog" },
              { label: "Need Something?", href: "/ask" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="transition-colors hover:underline"
                style={{ color: "var(--fg-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--fg-subtle)" }}>
          © {new Date().getFullYear()} Around You Jos. Built for Jos.
        </div>
      </Container>
    </footer>
  );
}