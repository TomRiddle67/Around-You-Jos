import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatBar } from "@/components/sections/StatBar";
import { NeighborhoodCards } from "@/components/sections/NeighborhoodCards";
import { Footer } from "@/components/layout/Footer";
import {
  getNeighborhoods,
  getCategories,
  getActiveBusinessesCount,
  getTrustedPicksCount,
  getPeopleHelpedCount,
} from "@/lib/data/businesses";
import { getRecentPosts, type SanityPost } from "@/sanity/queries";

export default async function HomePage() {
  const [neighborhoods, categories, businessCount, posts, trustedPicksCount, peopleHelpedCount] =
    await Promise.all([
      getNeighborhoods(),
      getCategories(),
      getActiveBusinessesCount(),
      getRecentPosts(5).catch((error): SanityPost[] => {
        console.error("[HomePage] Failed to fetch Sanity posts:", error);
        return [];
      }),
      getTrustedPicksCount(),
      getPeopleHelpedCount(),
    ]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <StatBar
        businessCount={businessCount}
        neighborhoodCount={neighborhoods.length}
        trustedPicksCount={trustedPicksCount}
        peopleHelpedCount={peopleHelpedCount}
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
