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
  // Server Component fetches neighborhoods for the dropdown
  // The form receives them as props — clean data flow
  const neighborhoods = await getNeighborhoods();

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-neutral-900 py-12">
          <Container size="narrow">
            <p className="text-xs font-semibold tracking-widest uppercase text-green-400 mb-2">
              Ask Around You
            </p>
            <h1 className="text-3xl font-bold text-white mb-2">
              Need something around Jos?
            </h1>
            <p className="text-neutral-400 text-sm">
              Tell us what you need and we'll help you find the right place or person.
            </p>
          </Container>
        </section>

        <section className="py-12 bg-neutral-50">
          <Container size="narrow">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
              <AskForm neighborhoods={neighborhoods} />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}