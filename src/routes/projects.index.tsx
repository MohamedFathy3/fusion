import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";
import hero from "@/assets/hero.mp4.asset.json";
import heroWebm from "@/assets/hero.webm.asset.json";
import poster from "@/assets/poster.jpg.asset.json";
import { ShowcaseFooter, ShowcaseHeader } from "@/components/showcase";
import type { Language, SectionId } from "@/components/showcase/types";
import {
  projectCategories,
  projectHasCategory,
  projects,
  type ProjectCategoryId,
} from "@/lib/projects";
import { projectItemsFromConfig, useCMS } from "@/lib/cms";
import { canonicalUrl } from "@/lib/seo";
import { translate } from "@/components/showcase/types";
import { loadSiteConfig } from "@/lib/cms-loader";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
  loader: async () => ({ siteConfig: await loadSiteConfig() }),
  head: ({ loaderData }) => ({
    links: [{ rel: "canonical", href: canonicalUrl("/projects") }],
    meta: [
      { title: loaderData?.siteConfig.content.seo.projectsTitle.en },
      {
        name: "description",
        content:
          "تصفح مشاريع Viral Zoom في السوشيال ميديا وتصميم المواقع والتطبيقات والهوية البصرية. اكتشف نماذج من أعمالنا الإبداعية.",
      },
      { property: "og:title", content: "أعمال Viral Zoom في التسويق والتصميم" },
      {
        property: "og:description",
        content:
          "مشاريع في السوشيال ميديا وتصميم المواقع والتطبيقات والهوية البصرية من Viral Zoom.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/projects") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "أعمال Viral Zoom في التسويق والتصميم" },
      {
        name: "twitter:description",
        content: "نماذج من أعمال السوشيال ميديا والمواقع والتطبيقات والهوية البصرية.",
      },
    ],
  }),
});

function ProjectsPage() {
  const { config, ready } = useCMS();
  const [language, setLanguage] = useState<Language>("en");
  const [darkMode, setDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProjectCategoryId | "all">("all");
  const navigate = useNavigate();
  const ar = language === "ar";
  const t = (english: string, arabic: string) => translate(language, english, arabic);
  const allProjects = useMemo(
    () =>
      ready ? projectItemsFromConfig(config.portfolio.filter((item) => item.enabled)) : projects,
    [config.portfolio, ready],
  );
  const visibleProjects = useMemo(
    () =>
      allProjects.filter(
        (project) => activeCategory === "all" || projectHasCategory(project, activeCategory),
      ),
    [activeCategory, allProjects],
  );
  const availableCategories = projectCategories.filter(
    (category) =>
      category.id === "all" ||
      allProjects.some((project) => projectHasCategory(project, category.id)),
  );

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

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    try {
      localStorage.setItem("viral-zoom-theme", next ? "dark" : "light");
    } catch {
      // The switch still works without storage.
    }
  };

  const navigateToSection = (id: SectionId) => {
    void navigate({ to: "/", hash: id });
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

  return (
    <div className="site projects-page" dir={ar ? "rtl" : "ltr"}>
      <ShowcaseHeader
        language={language}
        darkMode={darkMode}
        activeSection="portfolio"
        onNavigate={navigateToSection}
        onToggleTheme={toggleTheme}
        onLanguageChange={changeLanguage}
      />
      <main>
        <section
          className="projects-hero"
          aria-labelledby="projects-title"
          style={{ backgroundImage: `url("${poster.url}")` }}
        >
          <video
            className="projects-hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster={poster.url}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={heroWebm.url} type="video/webm" />
            <source src={hero.url} type="video/mp4" />
          </video>
          <div className="projects-hero-overlay" aria-hidden="true" />
          <div className="section-inner projects-hero-inner">
            <div className="projects-hero-copy">
              <p className="section-eyebrow">{t("SELECTED WORK", "أعمال مختارة")}</p>
              <h1 id="projects-title">
                {t("Every piece in our creative portfolio.", "كل مشروع في محفظتنا الإبداعية.")}
              </h1>
              <p className="projects-intro-copy">
                {t(
                  "A selection of brands and ideas brought to life by Viral Zoom.",
                  "مجموعة من العلامات والأفكار اللي حولناها لتجارب إبداعية في فايرال زوم.",
                )}
              </p>
            </div>
            <div className="projects-hero-art" aria-label={t("Featured projects", "مشاريع مختارة")}>
              {allProjects.slice(0, 3).map((project, index) => (
                <div
                  className={`projects-hero-image projects-hero-image-${index + 1}`}
                  key={project.slug}
                >
                  <img src={project.image} alt={project.name} />
                  <span>{project.name}</span>
                </div>
              ))}
              <span className="projects-hero-stamp" aria-hidden="true">
                VZ / WORKS
              </span>
            </div>
          </div>
        </section>

        <section
          className="projects-gallery section"
          aria-label={t("Project gallery", "معرض المشاريع")}
        >
          <div className="section-inner">
            <div
              className="projects-filters"
              role="group"
              aria-label={t("Filter projects by category", "تصفية المشاريع حسب الفئة")}
            >
              {availableCategories.map((category) => {
                const count =
                  category.id === "all"
                    ? allProjects.length
                    : allProjects.filter((project) => projectHasCategory(project, category.id))
                        .length;
                const selected = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    className={`projects-filter${selected ? " active" : ""}`}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category[language]}
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="projects-grid">
              {visibleProjects.map((project) => {
                const cardCategoryId =
                  activeCategory !== "all"
                    ? activeCategory
                    : project.category === "platforms-apps"
                      ? "mobile-apps"
                      : project.category === "ui-ux"
                        ? "branding"
                        : project.category;
                const cardContent = (
                  <>
                    <div className="projects-card-image-wrap">
                      <img src={project.image} alt={project.name} loading="lazy" />
                      <span className="projects-card-category">
                        {
                          projectCategories.find((category) => category.id === cardCategoryId)?.[
                            language
                          ]
                        }
                      </span>
                      {project.kind === "external" && (
                        <ArrowUpRight className="projects-card-external" aria-hidden="true" />
                      )}
                    </div>
                    <div className="projects-card-copy">
                      <h2>{project.localizedName?.[language] ?? project.name}</h2>
                      <p>{project.description[language]}</p>
                      <span className="projects-card-action">
                        {project.kind === "external"
                          ? t("Visit project", "زيارة المشروع")
                          : t("View project", "عرض المشروع")}
                        <ArrowRight aria-hidden="true" />
                      </span>
                    </div>
                  </>
                );

                return project.kind === "external" ? (
                  <a
                    className="projects-card"
                    href={project.url}
                    key={project.slug}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <Link
                    className="projects-card"
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    key={project.slug}
                  >
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <ShowcaseFooter
        language={language}
        logo={darkMode ? whiteLogo.url : logo.url}
        onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
}
