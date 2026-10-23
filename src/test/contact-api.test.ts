import { describe, expect, it } from "vitest";
import { handleApiRequest } from "@/lib/server-api";

const contactUrl = "https://fusionteck.online/api/contact";

function contactRequest(payload: unknown, origin = "https://fusionteck.online") {
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

  it("accepts the honeypot response without storing a message", async () => {
    const response = await handleApiRequest(contactRequest({ faxNumber: "bot-filled-this" }));

    expect(response?.status).toBe(200);
    await expect(response?.json()).resolves.toEqual({ received: true });
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
});
