import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionUrl = process.env.DATABASE_URL || "file:./data/fusionxtech.sqlite";
const adapter = new PrismaBetterSqlite3({ url: connectionUrl });
const prisma = new PrismaClient({ adapter });
const contentPath =
  process.env.DEFAULT_CONTENT_FILE ||
  new URL("../database/default-site-content.json", import.meta.url);
const document = JSON.parse(await readFile(contentPath, "utf8")) as {
  config: {
    brand: unknown;
    hero: unknown;
    sections: unknown;
    contact: unknown;
    content: unknown;
    services: Array<{ id: string }>;
    portfolio: Array<{ id: string }>;
    clients: Array<{ id: string }>;
  };
};
const { config } = document;

try {
  await prisma.$transaction(async (tx) => {
    await tx.siteSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        brand: JSON.stringify(config.brand),
        hero: JSON.stringify(config.hero),
        sections: JSON.stringify(config.sections),
        contact: JSON.stringify(config.contact),
        content: JSON.stringify(config.content),
      },
      update: {
        brand: JSON.stringify(config.brand),
        hero: JSON.stringify(config.hero),
        sections: JSON.stringify(config.sections),
        contact: JSON.stringify(config.contact),
        content: JSON.stringify(config.content),
      },
    });

    await tx.contentItem.deleteMany();
    const rows = [
      ...config.services.map((item, position) => ({
        collection: "services",
        itemId: item.id,
        position,
        content: JSON.stringify(item),
      })),
      ...config.portfolio.map((item, position) => ({
        collection: "projects",
        itemId: item.id,
        position,
        content: JSON.stringify(item),
      })),
      ...config.clients.map((item, position) => ({
        collection: "clients",
        itemId: item.id,
        position,
        content: JSON.stringify(item),
      })),
    ];
    await tx.contentItem.createMany({ data: rows });
  });
  console.log(
    `Seeded SQLite with Prisma: ${config.services.length} services, ${config.portfolio.length} projects, ${config.clients.length} clients.`,
  );
} finally {
  await prisma.$disconnect();
}
