export function getWhatsAppHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (
        url.protocol === "https:" &&
        ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)
      ) {
        return url.href;
      }
    } catch {
      return null;
    }
    return null;
  }

  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `20${digits.slice(1)}`;

  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}
