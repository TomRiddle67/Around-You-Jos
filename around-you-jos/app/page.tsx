import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatBar } from "@/components/sections/StatBar";
import { NeighborhoodCards } from "@/components/sections/NeighborhoodCards";
import { Footer } from "@/components/layout/Footer";
import { getNeighborhoods, getCategories, getBusinesses } from "@/lib/data/businesses";

export default async function HomePage() {
  const [neighborhoods, categories, businesses] = await Promise.all([
    getNeighborhoods(),
    getCategories(),
    getBusinesses(),
  ]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <StatBar
        businessCount={businesses.length}
        neighborhoodCount={neighborhoods.length}
      />
      <NeighborhoodCards
        neighborhoods={neighborhoods}
        categories={categories}
      />
      <Footer />
    </>
  );
}
