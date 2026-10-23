import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const { initialConfig } = await vite.ssrLoadModule("/src/lib/cms.tsx");
await mkdir("database", { recursive: true });
try {
  await writeFile(
    "database/default-site-content.json",
    JSON.stringify({ config: initialConfig }, null, 2) + "\n",
  );
  console.log("Exported database/default-site-content.json");
} finally {
  await vite.close();
}
