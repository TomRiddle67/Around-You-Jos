// around-you-jos/app/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatBar } from "@/components/sections/StatBar";
import { NeighborhoodCards } from "@/components/sections/NeighborhoodCards";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatBar />
      <NeighborhoodCards />
      <Footer />
    </>
  );
}
