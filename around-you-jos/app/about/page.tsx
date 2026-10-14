import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import {
  MapPin,
  Search,
  Store,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Compass,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Around You Jos, a community-powered local discovery platform for businesses, services, and neighborhoods in Jos, Plateau State, Nigeria.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Top Status Bar */}
        <div
          className="text-xs px-4 py-1.5 flex items-center justify-between"
          style={{
            background: "var(--green-dark)",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span>About Around You — Jos, Plateau State</span>
          <span className="hidden sm:inline">Hyperlocal Discovery</span>
        </div>

        {/* Page Header */}
        <div
          className="py-8"
          style={{
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Container size="narrow">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ background: "var(--green)" }}
              >
                <Compass className="h-3.5 w-3.5 text-white" />
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--green)" }}
              >
                Project Overview
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              About Around You Jos
            </h1>
            <p className="text-sm mt-2 max-w-2xl" style={{ color: "var(--fg-muted)" }}>
              A community-powered local discovery platform built for everyday life in Jos,
              Plateau State, Nigeria.
            </p>
          </Container>
        </div>

        {/* Main Content */}
        <div style={{ background: "var(--bg)" }} className="py-10">
          <Container size="narrow" className="space-y-10">
            {/* Mission / Problem */}
            <section
              className="p-6 rounded-lg"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="text-lg font-semibold mb-3 flex items-center gap-2"
                style={{ color: "var(--fg)" }}
              >
                <MapPin className="h-4 w-4" style={{ color: "var(--green)" }} />
                Why Local Discovery in Jos Matters
              </h2>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                <p>
                  Jos is a vibrant city filled with talented artisans, essential service
                  providers, neighborhood markets, and independent businesses. Yet finding
                  accurate, reliable information—such as a dependable mechanic, a nearby
                  printing press, a skilled tailor, or an open pharmacy—often relies on
                  informal word-of-mouth or chance.
                </p>
                <p>
                  Around You Jos was created to make local knowledge organized, accessible, and
                  practical for everyone. Whether you are a lifelong resident, a university
                  student, a new arrival, or a visitor exploring Plateau State, our goal is to
                  help you find trusted local places and services quickly and with confidence.
                </p>
              </div>
            </section>

            {/* Current Features (What works today) */}
            <section
              className="p-6 rounded-lg"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="text-lg font-semibold mb-2 flex items-center gap-2"
                style={{ color: "var(--fg)" }}
              >
                <CheckCircle2 className="h-4 w-4" style={{ color: "var(--green)" }} />
                What You Can Do Today
              </h2>
              <p className="text-xs mb-6" style={{ color: "var(--fg-subtle)" }}>
                These features are actively implemented, tested, and available right now:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-md"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-semibold text-sm" style={{ color: "var(--fg)" }}>
                    <Store className="h-4 w-4" style={{ color: "var(--green)" }} />
                    Business Directory
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    Browse local businesses categorized by sector—pharmacies, mechanics, tailoring,
                    printing, tech repair, restaurants, and supermarkets—with verified contact details.
                  </p>
                </div>

                <div
                  className="p-4 rounded-md"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-semibold text-sm" style={{ color: "var(--fg)" }}>
                    <Compass className="h-4 w-4" style={{ color: "var(--green)" }} />
                    Neighborhood Guides
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    Explore places organized by neighborhood, including Millionaires Quarters,
                    Rayfield, Tudun Wada, Anglo Jos, and Terminus, to find services closest to you.
                  </p>
                </div>

                <div
                  className="p-4 rounded-md"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-semibold text-sm" style={{ color: "var(--fg)" }}>
                    <Search className="h-4 w-4" style={{ color: "var(--green)" }} />
                    Safe Full-Text Search
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    Search businesses, neighborhoods, and categories with protected query boundary
                    validation and instant results across both web and mobile screens.
                  </p>
                </div>

                <div
                  className="p-4 rounded-md"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-semibold text-sm" style={{ color: "var(--fg)" }}>
                    <HelpCircle className="h-4 w-4" style={{ color: "var(--green)" }} />
                    Need Something? Requests
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    Can&apos;t find what you need? Submit a direct inquiry through our request form,
                    and our local directory team helps connect you with vetted providers.
                  </p>
                </div>
              </div>
            </section>

            {/* Vision / Roadmap */}
            <section
              className="p-6 rounded-lg"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="text-lg font-semibold mb-2 flex items-center gap-2"
                style={{ color: "var(--fg)" }}
              >
                <Clock className="h-4 w-4" style={{ color: "var(--fg-muted)" }} />
                Our Vision &amp; What We Are Building Next
              </h2>
              <p className="text-xs mb-4" style={{ color: "var(--fg-subtle)" }}>
                We believe in transparency. The following capabilities are planned milestones
                and not yet live:
              </p>

              <ul className="space-y-3 text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                <li className="flex items-start gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: "var(--green)" }}
                  />
                  <span>
                    <strong style={{ color: "var(--fg)" }}>Community Submissions:</strong> Enabling
                    local business owners and community members to submit new businesses and suggest
                    listing updates directly.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: "var(--green)" }}
                  />
                  <span>
                    <strong style={{ color: "var(--fg)" }}>Business Owner Verification:</strong>{" "}
                    A secure claim and verification workflow so business owners can manage their
                    operating hours, services, and photos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: "var(--green)" }}
                  />
                  <span>
                    <strong style={{ color: "var(--fg)" }}>Expanded Neighborhood Coverage:</strong>{" "}
                    Deeper, comprehensive coverage of additional neighborhoods throughout Jos North,
                    Jos South, and surrounding areas of Plateau State.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: "var(--green)" }}
                  />
                  <span>
                    <strong style={{ color: "var(--fg)" }}>Community Recommendations:</strong>{" "}
                    Authentic resident tips and curated neighborhood guides celebrating the unique
                    character of each locality.
                  </span>
                </li>
              </ul>
            </section>

            {/* Exploration Links / Call to Action */}
            <div
              className="p-6 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--fg)" }}>
                  Ready to explore Jos?
                </h3>
                <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                  Discover local businesses, find neighborhood services, or ask for assistance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/businesses"
                  className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-medium text-white rounded-md transition-opacity hover:opacity-90"
                  style={{ background: "var(--green)" }}
                >
                  Browse Businesses
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/neighborhoods"
                  className="inline-flex items-center h-9 px-4 text-xs font-medium rounded-md transition-colors"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    color: "var(--fg)",
                  }}
                >
                  View Neighborhoods
                </Link>
                <Link
                  href="/ask"
                  className="inline-flex items-center h-9 px-4 text-xs font-medium rounded-md transition-colors"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    color: "var(--fg)",
                  }}
                >
                  Need Something?
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
