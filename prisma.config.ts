import { defineConfig } from "prisma/config";
import { relative, resolve } from "node:path";

const defaultDatabasePath = resolve(process.env.DATA_DIR || "data", "fusionxtech.sqlite");
const defaultDatabaseUrl = `file:${relative(process.cwd(), defaultDatabasePath).replaceAll("\\", "/")}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || defaultDatabaseUrl,
  },
});
