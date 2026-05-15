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
        <section style={{ background: "var(--green-dark)", borderBottom: "1px solid var(--border)" }} className="py-10">
          <Container size="narrow">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--green)" }}>
              Ask Around You
            </p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#ffffff" }}>
              Need something around Jos?
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Tell us what you need and we&apos;ll help you find the right place or person.
            </p>
          </Container>
        </section>

        <section className="py-10" style={{ background: "var(--bg)" }}>
          <Container size="narrow">
            <div className="rounded-xl p-6 md:p-8" style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)" }}>
              <AskForm neighborhoods={neighborhoods} />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
