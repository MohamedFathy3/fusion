import { useState } from "react";
import { Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";
import type { Language, SectionId } from "./types";
import { translate } from "./types";

type Props = {
  language: Language;
  darkMode: boolean;
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  onToggleTheme: () => void;
  onLanguageChange: () => void;
};

const navigation: { id: SectionId; en: string; ar: string }[] = [
  { id: "home", en: "HOME", ar: "الرئيسية" },
  { id: "services", en: "SERVICES", ar: "خدماتنا" },
  { id: "portfolio", en: "PORTFOLIO", ar: "أعمالنا" },
  { id: "clients", en: "OUR CLIENTS", ar: "عملاؤنا" },
];

export function ShowcaseHeader({
  language,
  darkMode,
  activeSection,
  onNavigate,
  onToggleTheme,
  onLanguageChange,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ar = language === "ar";
  const t = (english: string, arabic: string) => translate(language, english, arabic);

  const navigate = (id: SectionId) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <header className="site-header" id="home">
      <div className="header-inner">
        <Button
          variant="ghost"
          className="h-auto justify-start p-0"
          aria-label="Viral Zoom home"
          onClick={() => navigate("home")}
        >
          <img className="brand-logo" src={darkMode ? whiteLogo.url : logo.url} alt="Viral Zoom" />
        </Button>
        <nav className="desktop-nav" aria-label={t("Main navigation", "القائمة الرئيسية")}>
          {navigation.map((item) => (
            <Button
              variant="ghost"
              key={item.id}
              className={`nav-item px-0 ${activeSection === item.id ? "active" : ""}`}
              onClick={() => navigate(item.id)}
            >
              {item[language]}
            </Button>
          ))}
        </nav>
        <div className="header-actions">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onToggleTheme}
            aria-label={
              darkMode ? t("Switch to light mode", "تفعيل الوضع الفاتح") : t("Switch to dark mode", "تفعيل الوضع الداكن")
            }
            title={darkMode ? t("Light mode", "الوضع الفاتح") : t("Dark mode", "الوضع الداكن")}
            aria-pressed={darkMode}
          >
            {darkMode ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            className="language-button"
            aria-label={ar ? "Switch to English" : "التبديل إلى العربية"}
            onClick={onLanguageChange}
          >
            <Globe2 className="text-primary" />
            {ar ? "English" : "العربية"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu-toggle"
            aria-label={t("Open menu", "فتح القائمة")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav">
          {navigation.map((item) => (
            <Button key={item.id} variant="ghost" onClick={() => navigate(item.id)}>
              {item[language]}
            </Button>
          ))}
        </nav>
      )}
    </header>
  );
}
