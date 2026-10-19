import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesColumnIncreasing,
  Lightbulb,
  Search,
  TrendingUp,
} from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";
import website from "@/assets/website.jpg.asset.json";
import type { Language, SectionId } from "@/components/showcase/types";
import { ShowcaseFooter, ShowcaseHeader } from "@/components/showcase";
import { canonicalUrl } from "@/lib/seo";
import { useCMS } from "@/lib/cms";
import { loadSiteConfig } from "@/lib/cms-loader";
export const Route = createFileRoute("/about/")({
  component: AboutPage,
  loader: async () => ({ siteConfig: await loadSiteConfig() }),
  head: ({ loaderData }) => ({
    links: [{ rel: "canonical", href: canonicalUrl("/about") }],
    meta: [
      { title: loaderData?.siteConfig.content.about.seoTitle.en },
      {
        name: "description",
        content: loaderData?.siteConfig.content.about.seoDescription.en,
      },
      { property: "og:title", content: loaderData?.siteConfig.content.about.seoTitle.en },
      { property: "og:url", content: canonicalUrl("/about") },
      {
        property: "og:description",
        content: loaderData?.siteConfig.content.about.seoDescription.en,
      },
    ],
  }),
});

function AboutPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const { config } = useCMS();
  const about = config.content.about;
  const ar = language === "ar";

  useEffect(() => {
    try {
      setDarkMode(localStorage.getItem("viral-zoom-theme") !== "light");
      setLanguage(localStorage.getItem("viral-zoom-language") === "ar" ? "ar" : "en");
    } catch {
      // Keep the default language and dark mode when storage is unavailable.
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
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <div className="site about-page" dir={ar ? "rtl" : "ltr"}>
      <ShowcaseHeader
        language={language}
        darkMode={darkMode}
        activeSection="about"
        onNavigate={navigateToSection}
        onToggleTheme={toggleTheme}
        onLanguageChange={changeLanguage}
      />
      <main>
        <section className="about-hero" aria-labelledby="about-title">
          <div className="section-inner about-hero-inner">
            <div className="about-hero-copy">
              <p className="section-eyebrow">{about.heroEyebrow[language]}</p>
              <h1 id="about-title">
                {about.heroTitle[language]}
                <br />
                <span>{about.heroTitleAccent[language]}</span>
              </h1>
              <p>{about.heroDescription[language]}</p>
              <a className="about-hero-cta" href="#about-story">
                {about.heroCta[language]}
                <ArrowDown aria-hidden="true" />
              </a>
            </div>
            <div className="about-hero-art">
              <img src={website.url} alt={about.heroImageAlt[language]} />
              <span className="about-hero-art-caption">{about.heroCaption[language]}</span>
              <span className="about-hero-art-stamp" aria-hidden="true">
                VZ
                <br />
                STUDIO
              </span>
            </div>
          </div>
        </section>

        <section
          className="about-story section"
          id="about-story"
          aria-labelledby="about-story-title"
        >
          <div className="section-inner about-story-inner">
            <div className="about-story-label">
              <span className="section-eyebrow">{about.storyEyebrow[language]}</span>
              <span className="about-story-index">01 / VZ</span>
            </div>
            <div className="about-story-copy">
              <h2 id="about-story-title">{about.storyTitle[language]}</h2>
              <p>{about.storyParagraphs[0][language]}</p>
              <p>{about.storyParagraphs[1][language]}</p>
              <Link className="about-inline-link" to="/projects">
                {about.storyCta[language]}
                {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </Link>
            </div>
          </div>
        </section>

        <section className="about-values section" aria-labelledby="about-values-title">
          <div className="section-inner">
            <div className="about-values-heading">
              <div>
                <p className="section-eyebrow">{about.valuesEyebrow[language]}</p>
                <h2 id="about-values-title">{about.valuesTitle[language]}</h2>
              </div>
              <p>{about.valuesDescription[language]}</p>
            </div>
            <div className="about-values-grid">
              {about.values.map(({ title, text }, index) => {
                const Icon = [Search, Lightbulb, ChartNoAxesColumnIncreasing][index] ?? Search;
                return (
                  <article className="about-value-card" key={title.en}>
                    <span className="about-value-number">0{index + 1}</span>
                    <span className="about-value-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{title[language]}</h3>
                    <p>{text[language]}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="about-approach section" aria-labelledby="about-approach-title">
          <div className="section-inner about-approach-inner">
            <div>
              <p className="section-eyebrow">{about.approachEyebrow[language]}</p>
              <h2 id="about-approach-title">{about.approachTitle[language]}</h2>
              <p>{about.approachDescription[language]}</p>
            </div>
            <div className="about-approach-mark" aria-hidden="true">
              <TrendingUp />
              <span>
                IDEAS
                <br />
                IN MOTION
              </span>
            </div>
          </div>
        </section>

        <section className="about-cta section">
          <div className="section-inner about-cta-inner">
            <div>
              <p className="section-eyebrow">{about.ctaEyebrow[language]}</p>
              <h2>{about.ctaTitle[language]}</h2>
              <p>{about.ctaDescription[language]}</p>
            </div>
            <Link to="/" hash="contact" className="about-cta-link">
              {about.ctaButton[language]}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <ShowcaseFooter
        language={language}
        logo={darkMode ? whiteLogo.url : logo.url}
        onBackToTop={backToTop}
      />
    </div>
  );
}
