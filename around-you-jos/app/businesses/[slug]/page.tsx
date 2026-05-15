import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { getBusinessBySlug } from "@/lib/data/businesses";
import { MapPin, Phone, MessageCircle, BadgeCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: "Business Not Found" };
  return { title: business.name, description: business.description };
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center gap-2"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <Link href="/businesses" style={{ color: "rgba(255,255,255,0.65)" }}>Businesses</Link>
          <span>›</span>
          <span>{business.neighborhood.name}</span>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.9)" }}>{business.name}</span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container>
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 text-xs mb-2"
              style={{ color: "var(--fg-muted)" }}
            >
              <ArrowLeft className="h-3 w-3" /> Back to businesses
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--fg)" }}>
                  {business.name}
                  {business.isVerified && (
                    <BadgeCheck className="h-4 w-4" style={{ color: "var(--green)" }} />
                  )}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--green)" }}>
                    {business.category.name}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--fg-muted)" }}>
                    <MapPin className="h-3 w-3" />
                    {business.neighborhood.name}, Jos
                  </span>
                </div>
              </div>
              {business.isFeatured && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-sm shrink-0"
                  style={{ background: "var(--green-bg)", color: "var(--green-text)" }}
                >
                  Featured
                </span>
              )}
            </div>
          </Container>
        </div>

        <div className="flex" style={{ borderBottom: "1px solid var(--border)" }}>
          <aside
            className="hidden md:block shrink-0 p-4"
            style={{ width: 240, borderRight: "1px solid var(--border)", background: "var(--bg-surface)" }}
          >
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1.5"
              style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
            >
              Contact
            </div>

            {business.phone && (
              
                href={`tel:${business.phone}`}
                className="flex items-center gap-2 py-2 text-sm"
                style={{ color: "var(--fg)", borderBottom: "0.5px solid var(--border)" }}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--fg-muted)" }} />
                <div>
                  <div className="text-xs" style={{ color: "var(--fg-muted)" }}>Phone</div>
                  <div className="text-sm font-medium" style={{ color: "var(--fg)" }}>{business.phone}</div>
                </div>
              </a>
            )}

            {business.whatsapp && (
              
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 text-sm"
                style={{ color: "var(--fg)", borderBottom: "0.5px solid var(--border)" }}
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--green)" }} />
                <div>
                  <div className="text-xs" style={{ color: "var(--fg-muted)" }}>WhatsApp</div>
                  <div className="text-sm font-medium" style={{ color: "var(--green)" }}>Message on WhatsApp</div>
                </div>
              </a>
            )}

            <div style={{ height: "0.5px", background: "var(--border)", margin: "8px 0" }} />

            <div
              className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1.5"
              style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
            >
              Neighborhood
            </div>
            <Link
              href={`/neighborhoods/${business.neighborhood.slug}`}
              className="flex items-center gap-2 py-1 text-sm"
              style={{ color: "var(--green)" }}
            >
              <MapPin className="h-3.5 w-3.5" />
              Around {business.neighborhood.name}
            </Link>
          </aside>

          <div className="flex-1 p-5" style={{ background: "var(--bg)" }}>
            <div
              className="mb-4 p-4 rounded-sm"
              style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1.5"
                style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
              >
                About
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>
                {business.description}
              </p>
            </div>

            <div
              className="p-4 rounded-sm"
              style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1.5"
                style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
              >
                Location
              </h2>
              <p className="text-sm flex items-start gap-2" style={{ color: "var(--fg)" }}>
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--fg-muted)" }} />
                {business.address}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
