import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { getBusinessBySlug } from "@/lib/data/businesses";
import { MapPin, Phone, MessageCircle, BadgeCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

/**
 * Dynamic metadata — each business page gets its own title and description.
 * This is critical for SEO. Google indexes each page individually.
 * "Tasty Bites | Around You Jos" is far better than "Business | Around You Jos"
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) return { title: "Business Not Found" };

  return {
    title: business.name,
    description: business.description,
  };
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  /**
   * notFound() is a Next.js function that renders the nearest not-found.tsx.
   * Always handle missing data explicitly — never let a null crash your page.
   */
  if (!business) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* Back link */}
        <div className="bg-white border-b border-neutral-200">
          <Container className="py-3">
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All businesses
            </Link>
          </Container>
        </div>

        {/* Hero */}
        <div className="bg-neutral-900 py-12">
          <Container>
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-green-400 mb-2 block">
                  {business.category.name}
                </span>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  {business.name}
                  {business.isVerified && (
                    <BadgeCheck className="h-6 w-6 text-green-400" />
                  )}
                </h1>
                <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {business.neighborhood.name}, Jos
                </span>
              </div>

              {business.isFeatured && (
                <span className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-full flex-shrink-0">
                  Featured
                </span>
              )}
            </div>
          </Container>
        </div>

        {/* Content */}
        <section className="py-10 bg-neutral-50">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <h2 className="text-base font-bold text-neutral-900 mb-3">
                    About
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {business.description}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <h2 className="text-base font-bold text-neutral-900 mb-3">
                    Location
                  </h2>
                  <p className="text-sm text-neutral-600 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                    {business.address}
                  </p>
                </div>
              </div>

              {/* Sidebar — contact */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                  <h2 className="text-sm font-bold text-neutral-900 mb-4">
                    Contact
                  </h2>
                  <div className="space-y-3">
                    {business.phone && (
                    <a 
                        href={`tel:${business.phone}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200">
                          <Phone className="h-4 w-4 text-neutral-600" />
                        </span>
                        <div>
                          <p className="text-xs text-neutral-400">Phone</p>
                          <p className="text-sm font-medium text-neutral-900">
                            {business.phone}
                          </p>
                        </div>
                      </a>
                    )}

                    {business.whatsapp && (
                    <a  
                        href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-200">
                          <MessageCircle className="h-4 w-4 text-green-700" />
                        </span>
                        <div>
                          <p className="text-xs text-green-600">WhatsApp</p>
                          <p className="text-sm font-medium text-green-900">
                            Message on WhatsApp
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                {/* Neighborhood link */}
                <Link
                  href={`/neighborhoods/${business.neighborhood.slug}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-neutral-200 hover:border-green-200 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-neutral-400">Neighborhood</p>
                    <p className="text-sm font-medium text-neutral-900">
                      Around {business.neighborhood.name}
                    </p>
                  </div>
                </Link>
              </div>

            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}