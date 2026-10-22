import { describe, expect, it, vi } from "vitest";
import { handleApiRequest } from "@/lib/server-api";

const contactUrl = "https://viralzoom.tech/api/contact";

function contactRequest(payload: unknown, origin = "https://viralzoom.tech") {
  return new Request(contactUrl, {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

describe("Contact API", () => {
  it("rejects requests from another origin", async () => {
    const response = await handleApiRequest(
      contactRequest({ name: "Visitor" }, "https://attacker.example"),
    );

    expect(response?.status).toBe(403);
  });

  it("accepts the honeypot response without sending email", async () => {
    const response = await handleApiRequest(contactRequest({ website: "bot-filled-this" }));

    expect(response?.status).toBe(200);
    await expect(response?.json()).resolves.toEqual({ sent: true });
  });

  it("rejects invalid email addresses", async () => {
    const response = await handleApiRequest(
      contactRequest({
        name: "Visitor",
        email: "not-an-email",
        subject: "",
        message: "Hello",
      }),
    );

    expect(response?.status).toBe(422);
  });

  it("reports missing SMTP credentials instead of claiming delivery", async () => {
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASSWORD", "");
    try {
      const response = await handleApiRequest(
        contactRequest({
          name: "Visitor",
          email: "visitor@example.com",
          subject: "Project",
          message: "Hello",
        }),
      );

      expect(response?.status).toBe(503);
      await expect(response?.json()).resolves.toEqual({
        error: "Contact email is not configured on the server.",
      });
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
