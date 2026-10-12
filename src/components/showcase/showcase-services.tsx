import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/showcase-data";
import type { Detail, Language } from "./types";
import { translate } from "./types";

type Props = {
  language: Language;
  onSelectDetail: (detail: Detail) => void;
};

export function ShowcaseServices({ language, onSelectDetail }: Props) {
  const servicesRef = useRef<HTMLDivElement>(null);
  const autoNextRef = useRef(true);
  const [isPaused, setIsPaused] = useState(false);
  const ar = language === "ar";
  const t = (english: string, arabic: string) => translate(language, english, arabic);

  const getStep = (track: HTMLDivElement) => {
    const firstCard = track.children.item(0);
    const secondCard = track.children.item(1);
    if (!firstCard || !secondCard) return 364;
    return Math.abs(secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left);
  };

  const scroll = (next: boolean) => {
    const track = servicesRef.current;
    if (!track) return;
    track.scrollBy({
      left: (next ? 1 : -1) * (ar ? -1 : 1) * getStep(track),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      const track = servicesRef.current;
      if (!track || isPaused || document.hidden) return;

      const firstCard = track.children.item(0);
      const lastCard = track.children.item(track.children.length - 1);
      if (!firstCard || !lastCard) return;

      const trackBounds = track.getBoundingClientRect();
      const canMoveNext = autoNextRef.current
        ? (ar ? firstCard : lastCard).getBoundingClientRect().right > trackBounds.right + 1
        : (ar ? lastCard : firstCard).getBoundingClientRect().left < trackBounds.left - 1;

      if (!canMoveNext) autoNextRef.current = !autoNextRef.current;
      scroll(autoNextRef.current !== ar);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [ar, isPaused]);

  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="section-heading">
          <h2>{t("Our Services", "خدماتنا")}</h2>
          <div className="carousel-actions" dir="ltr">
            <Button
              variant="ghost"
              className="arrow-control"
              title={t("Previous", "السابق")}
              aria-label={`services ${t("previous", "السابق")}`}
              onClick={() => scroll(ar)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              className="arrow-control"
              title={t("Next", "التالي")}
              aria-label={`services ${t("next", "التالي")}`}
              onClick={() => scroll(!ar)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
      <div
        className="service-track"
        ref={servicesRef}
        aria-label={t("Services", "الخدمات")}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
      >
        {services.map((service, index) => (
          <article className="service-card" key={service.title.en}>
            <img
              className="service-image"
              src={service.image}
              alt={service.title[language]}
              loading="lazy"
            />
            <div className="service-number">{String(index + 1).padStart(2, "0")} / VIRAL ZOOM</div>
            <h3>{service.title[language]}</h3>
            <p>{service.description[language]}</p>
            <Button
              variant="link"
              className="service-more"
              onClick={() =>
                onSelectDetail({
                  title: service.title[language],
                  description: service.description[language],
                  image: service.image,
                })
              }
            >
              {t("Read More", "اقرأ المزيد")}
              <ArrowUpRight />
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
