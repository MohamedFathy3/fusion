import { Phone } from "lucide-react";
import type { FormEvent } from "react";
import worldMap from "@/assets/bg-2-e496b57f-842e-4cf1-8733-ba70e093aea4.png";
import type { Language } from "./types";
import { getPageCopy, useCMS } from "@/lib/cms";

export function ShowcaseContact({ language }: { language: Language }) {
  const { config } = useCMS();
  const contactPhone =
    config.contact.phone || getPageCopy(config, "contact", "phoneFallback", language);
  const copy = (key: string) => getPageCopy(config, "common", key, language);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();
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
          <a className="contact-phone" href={`tel:${contactPhone}`}>
            {contactPhone}
          </a>
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
            {config.contact.whatsapp && (
              <>
                {" "}
                ·{" "}
                <a href={config.contact.whatsapp} target="_blank" rel="noreferrer">
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
            <label className="sr-only" htmlFor="contact-name">
              {copy("contactName")}
            </label>
            <input
              id="contact-name"
              name="name"
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
              placeholder={copy("contactSubject")}
            />

            <label className="sr-only" htmlFor="contact-message">
              {copy("contactMessage")}
            </label>
            <textarea
              className="contact-field-wide"
              id="contact-message"
              name="message"
              placeholder={copy("contactMessage")}
              rows={5}
            />

            <button className="contact-submit contact-field-wide" type="submit" disabled>
              {copy("contactSubmit")}
            </button>
            <p className="contact-form-note contact-field-wide">{copy("contactFormNote")}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
