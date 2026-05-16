import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatBar } from "@/components/sections/StatBar";
import { NeighborhoodCards } from "@/components/sections/NeighborhoodCards";
import { Footer } from "@/components/layout/Footer";
import { getNeighborhoods, getCategories, getBusinesses } from "@/lib/data/businesses";
import { getRecentPosts } from "@/sanity/queries";

export default async function HomePage() {
  const [neighborhoods, categories, businesses, posts] = await Promise.all([
    getNeighborhoods(),
    getCategories(),
    getBusinesses(),
    getRecentPosts(5),
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
        posts={posts}
      />
      <Footer />
    </>
  );
}
