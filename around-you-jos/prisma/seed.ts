import { PrismaClient } from "../node_modules/.prisma/client/default.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

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

  const restaurant = await prisma.category.upsert({
    where:  { slug: "restaurant" },
    update: {},
    create: { name: "Restaurant", slug: "restaurant", icon: "utensils" },
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

  await prisma.business.upsert({
    where:  { slug: "tasty-bites-terminus" },
    update: {},
    create: {
      name:          "Tasty Bites",
      slug:          "tasty-bites-terminus",
      description:   "Affordable local meals with fast service near Terminus roundabout.",
      address:       "12 Ahmadu Bello Way, Terminus, Jos",
      phone:         "+2348012345678",
      whatsapp:      "+2348012345678",
      isVerified:    true,
      isFeatured:    true,
      neighborhoodId: terminus.id,
      categoryId:     restaurant.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "quickprint-farin-gada" },
    update: {},
    create: {
      name:          "QuickPrint",
      slug:          "quickprint-farin-gada",
      description:   "Fast document printing, scanning, and photocopying. Student-friendly prices.",
      address:       "45 College Road, Farin Gada, Jos",
      phone:         "+2348023456789",
      whatsapp:      "+2348023456789",
      isVerified:    true,
      isFeatured:    false,
      neighborhoodId: farinGada.id,
      categoryId:     printing.id,
    },
  });

  await prisma.business.upsert({
    where:  { slug: "rayfield-auto-repair" },
    update: {},
    create: {
      name:          "Rayfield Auto Repair",
      slug:          "rayfield-auto-repair",
      description:   "Trusted mechanics serving Rayfield and surrounding areas. Fair prices, honest work.",
      address:       "7 Rayfield Road, Rayfield, Jos",
      phone:         "+2348034567890",
      whatsapp:      "+2348034567890",
      isVerified:    true,
      isFeatured:    true,
      neighborhoodId: rayfield.id,
      categoryId:     mechanic.id,
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });