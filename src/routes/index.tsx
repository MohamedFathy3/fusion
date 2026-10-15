import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShowcaseClients,
  ShowcaseBanner,
  ShowcaseContact,
  ShowcaseFooter,
  ShowcaseHeader,
  ShowcaseHero,
  ShowcasePortfolio,
  ShowcaseProcess,
  ShowcaseServices,
} from "@/components/showcase";
import type { Language, SectionId } from "@/components/showcase/types";
import logo from "@/assets/logo.png.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Viral Zoom — Creative & Digital Marketing | فايرال زوم" },
      {
        name: "description",
        content:
          "Explore Viral Zoom's creative and digital services, from brand identity and video production to websites and social media. اكتشف خدمات فايرال زوم الإبداعية والتسويقية.",
      },
      { property: "og:title", content: "Viral Zoom — Creative & Digital Marketing" },
      {
        property: "og:description",
        content: "Discover our creative services, selected work and brands. اكتشف خدماتنا وأعمالنا وعملاءنا.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const [language, setLanguage] = useState<Language>("en");
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const ar = language === "ar";

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

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    try {
      localStorage.setItem("viral-zoom-theme", next ? "dark" : "light");
    } catch {
      // The switch still works without storage.
    }
  };

  const goTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
    setActiveSection(id);
  };

  return (
    <div className="site" dir={ar ? "rtl" : "ltr"}>
      <ShowcaseHeader
        language={language}
        darkMode={darkMode}
        activeSection={activeSection}
        onNavigate={goTo}
        onToggleTheme={toggleTheme}
        onLanguageChange={() => {
          const next = ar ? "en" : "ar";
          setLanguage(next);
          try {
            localStorage.setItem("viral-zoom-language", next);
          } catch {
            // The switch still works without storage.
          }
        }}
      />
      <main>
        <ShowcaseHero language={language} />
        <ShowcaseServices language={language} />
        <ShowcasePortfolio language={language} />
        <ShowcaseClients language={language} />
        <ShowcaseProcess language={language} />
        <ShowcaseBanner language={language} />
        <ShowcaseContact language={language} />
      </main>
      <ShowcaseFooter
        language={language}
        logo={darkMode ? whiteLogo.url : logo.url}
        onBackToTop={() => goTo("home")}
      />
    </div>
  );
}
