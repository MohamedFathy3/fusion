import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const connectionUrl =
  process.env.DATABASE_URL ||
  `file:${resolve(process.env.DATA_DIR || "data", "fusionxtech.sqlite")}`;
if (!connectionUrl.startsWith("file:")) {
  throw new Error("DATABASE_URL must point to a SQLite file.");
}

const databasePath = connectionUrl.slice("file:".length).split("?")[0];
if (!databasePath) throw new Error("DATABASE_URL must include a SQLite file path.");
await mkdir(dirname(resolve(databasePath)), { recursive: true });

const prismaCli = resolve("node_modules", "prisma", "build", "index.js");
const result = spawnSync(process.execPath, [prismaCli, "migrate", "deploy"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exitCode = result.status ?? 1;
