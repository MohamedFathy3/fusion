import banner from "@/assets/Viral Zoom Creative Agency Banner.png";
import type { Language } from "./types";
import { translate } from "./types";

export function ShowcaseBanner({ language }: { language: Language }) {
  return (
    <section
      className="showcase-banner"
      aria-label={translate(language, "Viral Zoom creative agency", "وكالة فايرال زوم الإبداعية")}
    >
      <img
        className="showcase-banner-image"
        src={banner}
        alt={translate(
          language,
          "Viral Zoom: creative ideas, powerful results, your brand amplified.",
          "فايرال زوم: أفكار إبداعية ونتائج قوية تعزز علامتك التجارية.",
        )}
        decoding="async"
      />
    </section>
  );
}