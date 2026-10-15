import { useEffect, useState } from "react";
import { ArrowDown, ArrowDownLeft } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";
import website from "@/assets/website.jpg.asset.json";
import worldMap from "@/assets/bg-2-e496b57f-842e-4cf1-8733-ba70e093aea4.png";
import { ShowcaseContact, ShowcaseFooter, ShowcaseHeader } from "@/components/showcase";
import type { Language, SectionId } from "@/components/showcase/types";
import { translate } from "@/components/showcase/types";

export const Route = createFileRoute("/contact/")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Viral Zoom | تواصل مع فايرال زوم" },
      {
        name: "description",
        content:
          "Have a project in mind? Get in touch with Viral Zoom. عندك مشروع في بالك؟ تواصل مع فايرال زوم.",
      },
      { property: "og:title", content: "Contact Viral Zoom | تواصل مع فايرال زوم" },
      {
        property: "og:description",
        content: "Tell us what you are looking to create and let's start a conversation.",
      },
    ],
  }),
});

function ContactPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const ar = language === "ar";
  const t = (english: string, arabic: string) => translate(language, english, arabic);

  useEffect(() => {
    try {
      setDarkMode(localStorage.getItem("viral-zoom-theme") === "dark");
      setLanguage(localStorage.getItem("viral-zoom-language") === "ar" ? "ar" : "en");
    } catch {
      // Keep the default language and light mode when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    return () => document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = ar ? "rtl" : "ltr";
  }, [language, ar]);

  const navigateToSection = (id: SectionId) => {
    void navigate({ to: "/", hash: id });
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    try {
      localStorage.setItem("viral-zoom-theme", next ? "dark" : "light");
    } catch {
      // The switch still works without storage.
    }
  };

  const changeLanguage = () => {
    const next = ar ? "en" : "ar";
    setLanguage(next);
    try {
      localStorage.setItem("viral-zoom-language", next);
    } catch {
      // The switch still works without storage.
    }
  };

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <div className="site contact-page" dir={ar ? "rtl" : "ltr"}>
      <ShowcaseHeader
        language={language}
        darkMode={darkMode}
        activeSection="contact"
        onNavigate={navigateToSection}
        onToggleTheme={toggleTheme}
        onLanguageChange={changeLanguage}
      />
      <main>
        <section className="contact-page-hero" aria-labelledby="contact-page-title">
          <img
            className="contact-page-hero-image"
            src={website.url}
            alt={t("Creative digital work by Viral Zoom", "أعمال رقمية إبداعية من فايرال زوم")}
          />
          <div className="contact-page-hero-shade" />
          <div className="contact-page-hero-content">
            <p className="section-eyebrow">{t("LET'S MAKE SOMETHING GREAT", "يلا نعمل حاجة مميزة")}</p>
            <h1 id="contact-page-title">
              {t("Let's talk", "خلّينا")}
              <br />
              <span>{t("about your next idea.", "نتكلم عن فكرتك الجاية.")}</span>
            </h1>
            <p>
              {t(
                "A new project, a big idea or just a question — we're ready to listen.",
                "مشروع جديد، فكرة كبيرة أو حتى استفسار — إحنا جاهزين نسمعك.",
              )}
            </p>
            <a className="contact-page-hero-cta" href="#contact">
              {t("Get in touch", "تواصل معنا")}
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <span className="contact-page-hero-index" aria-hidden="true">VZ — 01</span>
        </section>

        <div className="contact-page-form">
          <ShowcaseContact language={language} />
        </div>

        <section className="contact-map-section" aria-labelledby="contact-map-title">
          <img className="contact-map-image" src={worldMap} alt="" aria-hidden="true" />
          <div className="contact-map-shade" />
          <div className="section-inner contact-map-content">
            <div>
              <p className="contact-map-eyebrow">{t("GOOD IDEAS TRAVEL", "الأفكار الحلوة بتوصل")}</p>
              <h2 id="contact-map-title">
                {t("One connected world.", "عالم واحد يجمعنا.")}
              </h2>
              <p>
                {t(
                  "Wherever you are, let's make something meaningful together.",
                  "أينما كنت، يلا نعمل حاجة ليها معنى سوا.",
                )}
              </p>
            </div>
            <span className="contact-map-mark" aria-hidden="true">
              VZ
              <ArrowDownLeft />
            </span>
            <span className="contact-map-coordinate" aria-hidden="true">CREATIVE CONNECTIONS — EVERYWHERE</span>
          </div>
        </section>
      </main>
      <ShowcaseFooter language={language} logo={darkMode ? whiteLogo.url : logo.url} onBackToTop={backToTop} />
    </div>
  );
}
