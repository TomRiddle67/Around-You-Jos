// app/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { NeighborhoodCards } from "@/components/sections/NeighborhoodCards";
import { Footer } from "@/components/layout/Footer";

/**
 * This is a React Server Component (RSC) by default in App Router.
 * It renders on the server, sends HTML to the browser.
 * No JavaScript bundle for this component is sent to the client.
 * 
 * This page can be async — it can await database calls directly.
 * We'll use this when we wire up real data.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <NeighborhoodCards />
      </main>
      <Footer />
    </>
  );
}