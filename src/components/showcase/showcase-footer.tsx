import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "./types";
import { translate } from "./types";

type Props = {
  language: Language;
  logo: string;
  onBackToTop: () => void;
};

export function ShowcaseFooter({ language, logo, onBackToTop }: Props) {
  const t = (english: string, arabic: string) => translate(language, english, arabic);

  return (
    <footer className="site-footer">
      <div className="section-inner footer-inner">
        <img className="footer-logo" src={logo} alt="Viral Zoom" />
        <span>© 2026 Viral Zoom. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</span>
        <Button variant="link" className="gap-3 text-xs" onClick={onBackToTop}>
          {t("Back to top", "إلى أعلى")}
          <ArrowUpRight />
        </Button>
      </div>
    </footer>
  );
}
