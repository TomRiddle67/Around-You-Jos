import Link from "next/link";
import { Container } from "./Container";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <Container className="py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
                <MapPin className="h-3.5 w-3.5 text-white" />
              </span>
              Around You <span className="text-brand-500 ml-1">Jos</span>
            </Link>
            <p className="text-xs text-neutral-400 mt-1.5 max-w-xs">
              Your practical guide to places, services, and neighborhoods in Jos, Nigeria.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
            <Link href="/neighborhoods" className="hover:text-neutral-900 transition-colors">Neighborhoods</Link>
            <Link href="/businesses"    className="hover:text-neutral-900 transition-colors">Businesses</Link>
            <Link href="/blog"          className="hover:text-neutral-900 transition-colors">Blog</Link>
            <Link href="/ask"           className="hover:text-neutral-900 transition-colors">Need Something?</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-xs text-neutral-400">
          © {new Date().getFullYear()} Around You Jos. Built for Jos.
        </div>
      </Container>
    </footer>
  );
}