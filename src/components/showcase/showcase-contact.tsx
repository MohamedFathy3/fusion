import { Phone } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import worldMap from "@/assets/bg-2-e496b57f-842e-4cf1-8733-ba70e093aea4.png";
import type { Language } from "./types";
import { getPageCopy, useCMS } from "@/lib/cms";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function ShowcaseContact({ language }: { language: Language }) {
  const { config } = useCMS();
  const [submission, setSubmission] = useState<"idle" | "sending" | "success" | "error">("idle");
  const contactPhone = config.contact.phone;
  const whatsappHref = getWhatsAppHref(config.contact.whatsapp);
  const copy = (key: string) => getPageCopy(config, "common", key, language);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submission === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmission("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          faxNumber: data.get("faxNumber"),
        }),
      });
      const result = (await response.json()) as { received?: boolean };
      if (!response.ok || result.received !== true)
        throw new Error("Contact message could not be saved.");
      form.reset();
      setSubmission("success");
    } catch {
      setSubmission("error");
    }
  };
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section-inner contact-layout">
        <aside
          className="contact-info-card"
          aria-label={getPageCopy(config, "contact", "contactSectionLabel", language)}
        >
          <img className="contact-world-map" src={worldMap} alt="" aria-hidden="true" />
          <div className="contact-phone-icon">
            <Phone aria-hidden="true" />
          </div>
          {contactPhone && (
            <a className="contact-phone" href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}>
              {contactPhone}
            </a>
          )}
          <div className="contact-info-copy">
            <h3>
              {config.contact.address[language] ||
                getPageCopy(config, "contact", "connectFallback", language)}
            </h3>
            <p>{copy("contactIntro")}</p>
          </div>
          <div className="contact-info-note">
            {config.contact.email ? (
              <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
            ) : (
              copy("contactFallback")
            )}
            {whatsappHref && (
              <>
                {" "}
                ·{" "}
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  {getPageCopy(config, "contact", "whatsapp", language)}
                </a>
              </>
            )}
          </div>
        </aside>

        <div className="contact-form-panel">
          <div className="contact-eyebrow">{copy("contactEyebrow")}</div>
          <h2 id="contact-title">{copy("contactHeading")}</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              className="contact-field-honeypot"
              name="faxNumber"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="contact-name">
              {copy("contactName")}
            </label>
            <input
              id="contact-name"
              name="name"
              required
              maxLength={120}
              autoComplete="name"
              placeholder={copy("contactName")}
            />

            <label className="sr-only" htmlFor="contact-email">
              {copy("contactEmail")}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder={copy("contactEmail")}
            />

            <label className="sr-only" htmlFor="contact-subject">
              {copy("contactSubject")}
            </label>
            <input
              className="contact-field-wide"
              id="contact-subject"
              name="subject"
              maxLength={160}
              placeholder={copy("contactSubject")}
            />

            <label className="sr-only" htmlFor="contact-message">
              {copy("contactMessage")}
            </label>
            <textarea
              className="contact-field-wide"
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              placeholder={copy("contactMessage")}
              rows={5}
            />

            <button
              className="contact-submit contact-field-wide"
              type="submit"
              disabled={submission === "sending"}
            >
              {submission === "sending"
                ? getPageCopy(config, "common", "contactFormSending", language)
                : copy("contactSubmit")}
            </button>
            <p className="contact-form-note contact-field-wide" role="status" aria-live="polite">
              {submission === "success"
                ? getPageCopy(config, "common", "contactFormSuccess", language)
                : submission === "error"
                  ? getPageCopy(config, "common", "contactFormError", language)
                  : copy("contactFormNote")}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
