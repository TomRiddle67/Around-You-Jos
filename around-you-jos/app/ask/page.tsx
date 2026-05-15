import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { AskForm } from "@/components/sections/AskForm";
import { getNeighborhoods } from "@/lib/data/businesses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Need Something?",
  description: "Tell us what you need and we'll help you find the right place or person in Jos.",
};

export default async function AskPage() {
  const neighborhoods = await getNeighborhoods();

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center justify-between"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <span>Ask Around You — Jos, Plateau State</span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container size="narrow">
            <h1 className="text-base font-semibold" style={{ color: "var(--fg)" }}>
              Need something around Jos?
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
              Tell us what you need and we'll help you find the right place or person.
            </p>
          </Container>
        </div>

        <div className="flex" style={{ borderBottom: "1px solid var(--border)" }}>
          <aside
            className="hidden md:block shrink-0 p-4"
            style={{ width: 200, borderRight: "1px solid var(--border)", background: "var(--bg-surface)" }}
          >
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-2 pb-1.5"
              style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
            >
              How it works
            </div>
            {[
              "Fill in your name and phone",
              "Describe what you need",
              "Choose your area",
              "We reach out via call or WhatsApp",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2 py-2 text-xs"
                style={{ color: "var(--fg-muted)", borderBottom: "0.5px solid var(--border)" }}
              >
                <span
                  className="shrink-0 h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--green-bg)", color: "var(--green-text)" }}
                >
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </aside>

          <div className="flex-1 p-5" style={{ background: "var(--bg)" }}>
            <div
              className="p-5 rounded-sm max-w-lg"
              style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)" }}
            >
              <AskForm neighborhoods={neighborhoods} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
