import { createServerFn } from "@tanstack/react-start";
import { isSiteConfig } from "@/lib/cms";

export const loadSiteConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { handleApiRequest } = await import("@/lib/server-api");
  const response = await handleApiRequest(new Request("http://localhost/api/site"));
  if (!response?.ok) {
    throw new Error(
      `Could not load site content from the server (${response?.status ?? "no response"}).`,
    );
  }
  const config: unknown = await response.json();
  if (!isSiteConfig(config)) {
    throw new Error("The server returned an incomplete site configuration.");
  }
  return config;
});
