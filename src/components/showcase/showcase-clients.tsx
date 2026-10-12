import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import c0 from "@/assets/client-0.jpg.asset.json";
import c1 from "@/assets/client-1.jpg.asset.json";
import c2 from "@/assets/client-2.jpg.asset.json";
import c3 from "@/assets/client-3.jpg.asset.json";
import c4 from "@/assets/client-4.jpg.asset.json";
import c5 from "@/assets/client-5.jpg.asset.json";
import c6 from "@/assets/client-6.jpg.asset.json";
import c7 from "@/assets/client-7.jpg.asset.json";
import c8 from "@/assets/client-8.jpg.asset.json";
import c9 from "@/assets/client-9.jpg.asset.json";
import type { Language } from "./types";
import { translate } from "./types";

const clients = [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9];

export function ShowcaseClients({ language }: { language: Language }) {
  const [showAllClients, setShowAllClients] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const clientsRef = useRef<HTMLDivElement>(null);
  const autoNextRef = useRef(true);
  const ar = language === "ar";
  const t = (english: string, arabic: string) => translate(language, english, arabic);

  const scroll = (next: boolean) => {
    clientsRef.current?.scrollBy({
      left: (next ? 1 : -1) * (ar ? -1 : 1) * 326,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (showAllClients || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      const track = clientsRef.current;
      if (!track || isPaused || document.hidden) return;

      const firstClient = track.children.item(0);
      const lastClient = track.children.item(track.children.length - 1);
      if (!firstClient || !lastClient) return;

      const trackBounds = track.getBoundingClientRect();
      const canMoveNext = autoNextRef.current
        ? (ar ? firstClient : lastClient).getBoundingClientRect().right > trackBounds.right + 1
        : (ar ? lastClient : firstClient).getBoundingClientRect().left < trackBounds.left - 1;

      if (!canMoveNext) autoNextRef.current = !autoNextRef.current;
      track.scrollBy({
        left: (autoNextRef.current !== ar ? 1 : -1) * (ar ? -1 : 1) * 163,
        behavior: "smooth",
      });
    }, 2500);

    return () => window.clearInterval(interval);
  }, [ar, isPaused, showAllClients]);

  return (
    <section className="section" id="clients">
      <div className="section-inner">
        <div className="section-heading">
          <h2>{t("Our Clients", "عملاؤنا")}</h2>
          <Button
            variant="link"
            className="gap-3 text-xs"
            onClick={() => setShowAllClients(!showAllClients)}
          >
            {showAllClients ? t("Show carousel", "عرض متحرك") : t("View all Clients", "عرض كل العملاء")}
            <ArrowUpRight />
          </Button>
        </div>
        {showAllClients ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {clients.map((client, index) => (
              <img
                key={client.asset_id}
                src={client.url}
                className="w-full rounded-sm"
                alt={t(`Client brand ${index + 1}`, `العلامة التجارية ${index + 1}`)}
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div
            className="client-row"
            dir="ltr"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("Clients previous", "العملاء السابقون")}
              title={t("Previous", "السابق")}
              onClick={() => scroll(ar)}
            >
              <ChevronLeft />
            </Button>
            <div className="client-track" ref={clientsRef} dir={ar ? "rtl" : "ltr"}>
              {clients.map((client, index) => (
                <img
                  key={client.asset_id}
                  className="client-logo"
                  src={client.url}
                  alt={t(`Client brand ${index + 1}`, `العلامة التجارية ${index + 1}`)}
                  loading="lazy"
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("Clients next", "العملاء التاليون")}
              title={t("Next", "التالي")}
              onClick={() => scroll(!ar)}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
