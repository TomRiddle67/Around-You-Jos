import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Single neighborhood for now — Millionaires Quarters
  const millionairesQuarters = await prisma.neighborhood.upsert({
    where:  { slug: "millionaires-quarters" },
    update: {},
    create: {
      name: "Millionaires Quarters",
      slug: "millionaires-quarters",
      description: "An upscale residential neighborhood with trusted local businesses and everyday services.",
    },
  });

  // Categories
  const restaurant = await prisma.category.upsert({
    where:  { slug: "restaurant" },
    update: {},
    create: { name: "Restaurant", slug: "restaurant", icon: "utensils" },
  });

  const pharmacy = await prisma.category.upsert({
    where:  { slug: "pharmacy" },
    update: {},
    create: { name: "Pharmacy", slug: "pharmacy", icon: "pill" },
  });

  const mechanic = await prisma.category.upsert({
    where:  { slug: "mechanic" },
    update: {},
    create: { name: "Mechanic", slug: "mechanic", icon: "wrench" },
  });

  const printing = await prisma.category.upsert({
    where:  { slug: "printing" },
    update: {},
    create: { name: "Printing", slug: "printing", icon: "printer" },
  });

  const techRepair = await prisma.category.upsert({
    where:  { slug: "tech-repair" },
    update: {},
    create: { name: "Tech Repair", slug: "tech-repair", icon: "cpu" },
  });

  const tailoring = await prisma.category.upsert({
    where:  { slug: "tailoring" },
    update: {},
    create: { name: "Tailoring", slug: "tailoring", icon: "scissors" },
  });

  const supermarket = await prisma.category.upsert({
    where:  { slug: "supermarket" },
    update: {},
    create: { name: "Supermarket", slug: "supermarket", icon: "shopping-cart" },
  });

  // Placeholder businesses — all in Millionaires Quarters
  // Swap these for real verified businesses once you have the data
  await prisma.business.upsert({
    where:  { slug: "mq-tasty-bites" },
    update: {},
    create: {
      name: "Tasty Bites", slug: "mq-tasty-bites",
      description: "Affordable local meals with fast service. Known for rice dishes and local soups.",
      address: "Millionaires Quarters, Jos",
      phone: "+2348012345678", whatsapp: "+2348012345678",
      isVerified: false, isFeatured: true,
      neighborhoodId: millionairesQuarters.id, categoryId: restaurant.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "mq-quickprint" },
    update: {},
    create: {
      name: "QuickPrint", slug: "mq-quickprint",
      description: "Fast document printing, scanning, and photocopying.",
      address: "Millionaires Quarters, Jos",
      phone: "+2348023456789", whatsapp: "+2348023456789",
      isVerified: false, isFeatured: false,
      neighborhoodId: millionairesQuarters.id, categoryId: printing.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "mq-auto-repair" },
    update: {},
    create: {
      name: "MQ Auto Repair", slug: "mq-auto-repair",
      description: "Trusted mechanics serving the area. Fair prices, honest work.",
      address: "Millionaires Quarters, Jos",
      phone: "+2348034567890", whatsapp: "+2348034567890",
      isVerified: false, isFeatured: true,
      neighborhoodId: millionairesQuarters.id, categoryId: mechanic.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "mq-pharmacy" },
    update: {},
    create: {
      name: "MQ Central Pharmacy", slug: "mq-pharmacy",
      description: "Well-stocked pharmacy with genuine drugs and knowledgeable staff.",
      address: "Millionaires Quarters, Jos",
      phone: "+2348045678901", whatsapp: "+2348045678901",
      isVerified: false, isFeatured: false,
      neighborhoodId: millionairesQuarters.id, categoryId: pharmacy.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "mq-stitch-king" },
    update: {},
    create: {
      name: "Stitch King", slug: "mq-stitch-king",
      description: "Quality tailoring for men and women. Native wear, suits, and alterations.",
      address: "Millionaires Quarters, Jos",
      phone: "+2348056789012", whatsapp: "+2348056789012",
      isVerified: false, isFeatured: false,
      neighborhoodId: millionairesQuarters.id, categoryId: tailoring.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "mq-techfix" },
    update: {},
    create: {
      name: "TechFix", slug: "mq-techfix",
      description: "Phone and laptop repairs. Fast turnaround, genuine parts.",
      address: "Millionaires Quarters, Jos",
      phone: "+2348067890123", whatsapp: "+2348067890123",
      isVerified: false, isFeatured: false,
      neighborhoodId: millionairesQuarters.id, categoryId: techRepair.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "mq-supermart" },
    update: {},
    create: {
      name: "MQ Supermart", slug: "mq-supermart",
      description: "Well-stocked supermarket with groceries, beverages, and household items.",
      address: "Millionaires Quarters, Jos",
      phone: "+2348089012345", whatsapp: "+2348089012345",
      isVerified: false, isFeatured: false,
      neighborhoodId: millionairesQuarters.id, categoryId: supermarket.id,
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
