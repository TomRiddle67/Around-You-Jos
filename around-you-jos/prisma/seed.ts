import { PrismaClient } from "../node_modules/.prisma/client/default.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Neighborhoods
  const farinGada = await prisma.neighborhood.upsert({
    where:  { slug: "farin-gada" },
    update: {},
    create: { name: "Farin Gada", slug: "farin-gada", description: "Student essentials, food, printing, and quick errands." },
  });

  const rayfield = await prisma.neighborhood.upsert({
    where:  { slug: "rayfield" },
    update: {},
    create: { name: "Rayfield", slug: "rayfield", description: "Services, groceries, repairs, and everyday needs." },
  });

  const terminus = await prisma.neighborhood.upsert({
    where:  { slug: "terminus" },
    update: {},
    create: { name: "Terminus", slug: "terminus", description: "Markets, city-center utilities, transport, and quick buys." },
  });

  const bukuru = await prisma.neighborhood.upsert({
    where:  { slug: "bukuru" },
    update: {},
    create: { name: "Bukuru", slug: "bukuru", description: "Industry, local business, and a growing hospitality scene." },
  });

  const angloJos = await prisma.neighborhood.upsert({
    where:  { slug: "anglo-jos" },
    update: {},
    create: { name: "Anglo Jos", slug: "anglo-jos", description: "Schools, churches, and established residential calm." },
  });

  const dogonDutse = await prisma.neighborhood.upsert({
    where:  { slug: "dogon-dutse" },
    update: {},
    create: { name: "Dogon Dutse", slug: "dogon-dutse", description: "Growing neighborhood with everyday essentials and local character." },
  });

  const tudunWada = await prisma.neighborhood.upsert({
    where:  { slug: "tudun-wada" },
    update: {},
    create: { name: "Tudun Wada", slug: "tudun-wada", description: "Residential area with markets and everyday services." },
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

  const hotel = await prisma.category.upsert({
    where:  { slug: "hotel" },
    update: {},
    create: { name: "Hotel", slug: "hotel", icon: "building" },
  });

  // Businesses
  await prisma.business.upsert({
    where:  { slug: "tasty-bites-terminus" },
    update: {},
    create: {
      name: "Tasty Bites", slug: "tasty-bites-terminus",
      description: "Affordable local meals with fast service near Terminus roundabout. Known for rice dishes and local soups.",
      address: "12 Ahmadu Bello Way, Terminus, Jos",
      phone: "+2348012345678", whatsapp: "+2348012345678",
      isVerified: true, isFeatured: true,
      neighborhoodId: terminus.id, categoryId: restaurant.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "quickprint-farin-gada" },
    update: {},
    create: {
      name: "QuickPrint", slug: "quickprint-farin-gada",
      description: "Fast document printing, scanning, and photocopying. Student-friendly prices.",
      address: "45 College Road, Farin Gada, Jos",
      phone: "+2348023456789", whatsapp: "+2348023456789",
      isVerified: true, isFeatured: false,
      neighborhoodId: farinGada.id, categoryId: printing.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "rayfield-auto-repair" },
    update: {},
    create: {
      name: "Rayfield Auto Repair", slug: "rayfield-auto-repair",
      description: "Trusted mechanics serving Rayfield and surrounding areas. Fair prices, honest work.",
      address: "7 Rayfield Road, Rayfield, Jos",
      phone: "+2348034567890", whatsapp: "+2348034567890",
      isVerified: true, isFeatured: true,
      neighborhoodId: rayfield.id, categoryId: mechanic.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "jos-pharmacy-terminus" },
    update: {},
    create: {
      name: "Jos Central Pharmacy", slug: "jos-pharmacy-terminus",
      description: "Well-stocked pharmacy with genuine drugs and knowledgeable staff.",
      address: "3 Rwang Pam Street, Terminus, Jos",
      phone: "+2348045678901", whatsapp: "+2348045678901",
      isVerified: true, isFeatured: false,
      neighborhoodId: terminus.id, categoryId: pharmacy.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "stitch-king-rayfield" },
    update: {},
    create: {
      name: "Stitch King", slug: "stitch-king-rayfield",
      description: "Quality tailoring for men and women. Native wear, suits, and alterations done with care.",
      address: "15 Rayfield Road, Rayfield, Jos",
      phone: "+2348056789012", whatsapp: "+2348056789012",
      isVerified: true, isFeatured: false,
      neighborhoodId: rayfield.id, categoryId: tailoring.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "techfix-farin-gada" },
    update: {},
    create: {
      name: "TechFix", slug: "techfix-farin-gada",
      description: "Phone and laptop repairs. Fast turnaround, genuine parts, student-friendly prices.",
      address: "22 College Road, Farin Gada, Jos",
      phone: "+2348067890123", whatsapp: "+2348067890123",
      isVerified: true, isFeatured: false,
      neighborhoodId: farinGada.id, categoryId: techRepair.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "bukuru-suya-spot" },
    update: {},
    create: {
      name: "Bukuru Suya Spot", slug: "bukuru-suya-spot",
      description: "Famous suya and grilled meats. A local favourite for evening bites.",
      address: "Old Airport Road, Bukuru, Jos",
      phone: "+2348078901234", whatsapp: "+2348078901234",
      isVerified: true, isFeatured: true,
      neighborhoodId: bukuru.id, categoryId: restaurant.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "anglo-supermart" },
    update: {},
    create: {
      name: "Anglo Supermart", slug: "anglo-supermart",
      description: "Well-stocked supermarket with groceries, beverages, and household items.",
      address: "4 Anglo Jos Road, Anglo Jos, Jos",
      phone: "+2348089012345", whatsapp: "+2348089012345",
      isVerified: true, isFeatured: false,
      neighborhoodId: angloJos.id, categoryId: supermarket.id,
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
