import path from "node:path";
import { defineConfig } from "prisma/config";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DIRECT_URL!,
  },
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const connectionString = process.env.DIRECT_URL;
      if (!connectionString) throw new Error("DIRECT_URL is not set in .env.local");
      return new PrismaPg({ connectionString });
    },
  },
});