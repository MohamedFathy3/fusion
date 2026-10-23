import { useCMS } from "@/lib/cms";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function ShowcaseWhatsApp() {
  const { config } = useCMS();
  const href = getWhatsAppHref(config.contact.whatsapp);
  if (!href) return null;

  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      <span className="whatsapp-float-halo" aria-hidden="true" />
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M16 3.2A12.6 12.6 0 0 0 5.2 22.3L3.5 28.5l6.4-1.7A12.7 12.7 0 1 0 16 3.2Zm0 22.9c-2 0-4-.5-5.7-1.6l-.4-.2-3.8 1 1-3.7-.3-.4A10.2 10.2 0 1 1 16 26.1Zm5.6-7.6c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.3 8.3 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.3c-.3-.6-.5-.5-.8-.5h-.6c-.3 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5a12 12 0 0 0 4.7 4.2c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4l-.6-.3Z" />
      </svg>
    </a>
  );
}
