import { Button } from "@/components/ui/button";
import p0 from "@/assets/portfolio-0.jpg.asset.json";
import p1 from "@/assets/portfolio-1.jpg.asset.json";
import p2 from "@/assets/portfolio-2.jpg.asset.json";
import p3 from "@/assets/portfolio-3.jpg.asset.json";
import p4 from "@/assets/portfolio-4.jpg.asset.json";
import p5 from "@/assets/portfolio-5.jpg.asset.json";
import type { Detail, Language } from "./types";
import { translate } from "./types";

const projects = [
  { asset: p0, name: "Bio Derma Group" },
  { asset: p1, name: "DR. Mohamed Diaa Sarhan (Sarhan Obesity Clinic)" },
  { asset: p2, name: "Egy Marks" },
  { asset: p3, name: "El Masia Pack" },
  { asset: p4, name: "Feedmix" },
  { asset: p5, name: "El Fayrouz" },
];

type Props = {
  language: Language;
  onSelectDetail: (detail: Detail) => void;
};

export function ShowcasePortfolio({ language, onSelectDetail }: Props) {
  const t = (english: string, arabic: string) => translate(language, english, arabic);

  return (
    <section className="section portfolio-section" id="portfolio">
      <div className="section-inner">
        <div className="section-eyebrow">{t("SELECTED WORK", "أعمال مختارة")}</div>
        <div className="section-heading">
          <h2>{t("Portfolio", "أعمالنا")}</h2>
          <span className="text-xs text-muted-foreground">{t("Brand identities", "هويات تجارية")} / 06</span>
        </div>
        <div className="portfolio-grid">
          {projects.map(({ asset, name }, index) => (
            <Button
              key={asset.asset_id}
              variant="ghost"
              className="portfolio-item"
              aria-label={t(`View ${name}`, `عرض ${name}`)}
              onClick={() => onSelectDetail({ title: name, image: asset.url })}
            >
              <img
                src={asset.url}
                alt={name}
                loading="lazy"
              />
              <span className="portfolio-label">{name}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
