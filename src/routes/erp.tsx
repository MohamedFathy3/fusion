import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  Building2,
  CarFront,
  Check,
  ClipboardList,
  Factory,
  GitBranch,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  UsersRound,
  Wallet,
  Wrench,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseFooter, ShowcaseHeader } from "@/components/showcase";
import type { Language, SectionId } from "@/components/showcase/types";
import { useCMS } from "@/lib/cms";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { canonicalUrl } from "@/lib/seo";
import { loadSiteConfig } from "@/lib/cms-loader";

const trialUrl = "https://acsa.professionalacademyedu.com/signup";
const loginUrl = "https://acsa.professionalacademyedu.com/auth";

const featureGroups = [
  {
    icon: ShoppingCart,
    title: { en: "Sales and point of sale", ar: "المبيعات ونقطة البيع" },
    description: {
      en: "Handle sales, invoices and POS returns in one connected workflow.",
      ar: "أدر عمليات البيع والفواتير ومرتجعات نقاط البيع من مسار عمل واحد.",
    },
    items: {
      en: ["Point of sale", "Sales invoices", "POS returns"],
      ar: ["نقطة البيع", "فواتير المبيعات", "مرتجعات نقاط البيع"],
    },
  },
  {
    icon: Boxes,
    title: { en: "Inventory and purchasing", ar: "المخزون والمشتريات" },
    description: {
      en: "Keep stock activity visible, from purchasing and transfers to product movement.",
      ar: "تابع حركة المخزون بداية من المشتريات وطلبات النقل وحتى حركة كل منتج.",
    },
    items: {
      en: ["Purchasing", "Inventory", "Stock transfers", "Product movement"],
      ar: ["المشتريات", "المخزون", "طلبات نقل المخزون", "كشف حركات المنتج"],
    },
  },
  {
    icon: UsersRound,
    title: { en: "Customers and team", ar: "العملاء والفريق" },
    description: {
      en: "Give teams the customer and sales follow-up tools they need to keep work moving.",
      ar: "وفّر للفريق أدوات متابعة العملاء والمبيعات التي تساعد على استمرار العمل.",
    },
    items: {
      en: [
        "Customer records and CRM pipeline",
        "Kanban deal follow-up",
        "Email, WhatsApp, calendar and tasks",
        "Sales representatives, roles and permissions",
      ],
      ar: [
        "ملفات العملاء ومسار CRM",
        "متابعة الصفقات بأسلوب Kanban",
        "البريد وواتساب والتقويم والمهام",
        "المندوبون والأدوار والصلاحيات",
      ],
    },
  },
  {
    icon: Wallet,
    title: { en: "Finance and reporting", ar: "المالية والتقارير" },
    description: {
      en: "Bring financial and operational reporting together for a clearer view of the business.",
      ar: "اجمع التقارير المالية والتشغيلية لتحصل على رؤية أوضح لأعمالك.",
    },
    items: {
      en: [
        "Finance",
        "Consolidated financial reports",
        "Employee finance reports",
        "Warehouse reports",
      ],
      ar: ["المالية", "التقرير المالي الموحد", "التقارير المالية للموظفين", "تقارير المخازن"],
    },
  },
  {
    icon: BriefcaseBusiness,
    title: { en: "Projects and production", ar: "المشروعات والإنتاج" },
    description: {
      en: "Follow project costs and factory operations alongside your everyday business activity.",
      ar: "تابع تكاليف المشروعات وتشغيل المصنع إلى جانب عملياتك اليومية.",
    },
    items: {
      en: ["Contracts and project costs", "Estimated profit", "Factory operations"],
      ar: ["العقود وتكاليف المشروعات", "الربح التقديري", "تشغيل المصنع"],
    },
  },
  {
    icon: GitBranch,
    title: { en: "Branches and connected work", ar: "الفروع وترابط العمليات" },
    description: {
      en: "Organize access by branch and role, with a shared operational view for your team.",
      ar: "نظّم الوصول حسب الفرع والدور، وامنح فريقك رؤية تشغيلية مترابطة.",
    },
    items: {
      en: ["Multi-branch workspace", "Branch and stock selection", "Operations integration center"],
      ar: ["مساحة عمل متعددة الفروع", "اختيار الفرع والمخزن", "مركز ترابط العمليات"],
    },
  },
] as const;

const workflowFeatures = [
  {
    icon: ClipboardList,
    title: { en: "One operational picture", ar: "صورة تشغيلية واحدة" },
    description: {
      en: "See sales, completed orders and operating activity from a dashboard built for everyday decisions.",
      ar: "تابع المبيعات والطلبات المكتملة والنشاط التشغيلي من لوحة تدعم قراراتك اليومية.",
    },
  },
  {
    icon: ShieldCheck,
    title: { en: "Access that fits your team", ar: "صلاحيات تناسب فريقك" },
    description: {
      en: "Organize roles, permissions and branch access around the way your organization works.",
      ar: "نظّم الأدوار والصلاحيات والوصول للفروع بما يتناسب مع طريقة عمل مؤسستك.",
    },
  },
  {
    icon: BarChart3,
    title: { en: "Reports ready for action", ar: "تقارير تساعدك على التحرك" },
    description: {
      en: "Bring financial, employee and warehouse reporting closer to the people who use it.",
      ar: "قرّب التقارير المالية وتقارير الموظفين والمخازن من الأشخاص الذين يحتاجونها.",
    },
  },
] as const;

const packages = [
  {
    name: "Starter",
    audience: { en: "For small teams", ar: "للفرق الصغيرة" },
    description: {
      en: "A clear starting point for a small team that wants the essentials in one place.",
      ar: "بداية واضحة لفريق صغير يريد جمع الأساسيات في مكان واحد.",
    },
    features: {
      en: ["Basic CRM", "Up to 5 users", "1 branch", "Basic reports"],
      ar: ["CRM أساسي", "حتى 5 مستخدمين", "فرع واحد", "تقارير أساسية"],
    },
    action: { en: "Ask about Starter", ar: "اسأل عن Starter" },
    featured: false,
  },
  {
    name: "Professional",
    audience: { en: "For organized growth", ar: "للنمو المنظم" },
    description: {
      en: "More room for a growing team, additional branches and connected follow-up.",
      ar: "مساحة أكبر لفريق نامٍ وفروع إضافية ومتابعة أكثر ترابطًا.",
    },
    features: {
      en: ["Everything in Starter", "Up to 25 users", "Up to 5 branches", "Email and Calendar"],
      ar: ["كل مميزات Starter", "حتى 25 مستخدمًا", "حتى 5 فروع", "البريد الإلكتروني والتقويم"],
    },
    action: { en: "Choose Professional", ar: "اختر Professional" },
    featured: true,
  },
  {
    name: "Enterprise",
    audience: { en: "For multi-branch organizations", ar: "للمؤسسات متعددة الفروع" },
    description: {
      en: "A configurable setup for organizations with broader operating needs.",
      ar: "إعداد قابل للتخصيص للمؤسسات ذات الاحتياجات التشغيلية الأوسع.",
    },
    features: {
      en: [
        "All platform features",
        "Custom users and branches",
        "Advanced permissions",
        "Priority support",
      ],
      ar: ["كل مميزات المنصة", "مستخدمون وفروع حسب احتياجك", "صلاحيات متقدمة", "دعم بأولوية"],
    },
    action: { en: "Discuss Enterprise", ar: "ناقش باقة Enterprise" },
    featured: false,
  },
] as const;

const faqs = [
  {
    question: {
      en: "Can I try the ERP before choosing a package?",
      ar: "هل أستطيع تجربة النظام قبل اختيار الباقة؟",
    },
    answer: {
      en: "Yes. Start a 15-day trial with all modules enabled. The trial signup does not require a credit card.",
      ar: "نعم. ابدأ تجربة لمدة 15 يومًا مع تفعيل كل الموديولات، دون الحاجة إلى بطاقة ائتمان.",
    },
  },
  {
    question: {
      en: "How do I know which package fits my company?",
      ar: "كيف أعرف الباقة المناسبة لشركتي؟",
    },
    answer: {
      en: "Choose based on team size, branch count and the modules your workflow needs. We can help scope the right setup with you.",
      ar: "يعتمد الاختيار على حجم الفريق وعدد الفروع والموديولات التي يحتاجها التشغيل. نساعدك على تحديد الإعداد الأنسب.",
    },
  },
  {
    question: {
      en: "Can the ERP support specialized operations?",
      ar: "هل يدعم النظام عمليات متخصصة؟",
    },
    answer: {
      en: "The workspace includes areas for project costs, factory operations and automotive service. Contact us to discuss your workflow and requirements.",
      ar: "تتضمن المنصة أقسامًا لتكاليف المشروعات وتشغيل المصنع وخدمة السيارات. تواصل معنا لمناقشة سير العمل ومتطلباتك.",
    },
  },
] as const;

function getSalesWhatsAppHref(number: string, language: Language, packageName?: string) {
  const href = getWhatsAppHref(number);
  if (!href) return null;
  const url = new URL(href);
  url.searchParams.set(
    "text",
    packageName
      ? language === "ar"
        ? `مرحبًا، أريد تفاصيل باقة ${packageName} في Fusion X ERP ومعرفة مدى مناسبتها لشركتي.`
        : `Hi, I'm interested in the ${packageName} package for Fusion X ERP. Please help me see if it fits my business.`
      : language === "ar"
        ? "مرحبًا، أريد معرفة تفاصيل Fusion X ERP والباقات المناسبة لشركتي."
        : "Hi, I would like to learn more about Fusion X ERP and the right package for my business.",
  );
  return url.toString();
}

export const Route = createFileRoute("/erp")({
  component: ErpPage,
  loader: async () => ({ siteConfig: await loadSiteConfig() }),
  head: () => ({
    links: [{ rel: "canonical", href: canonicalUrl("/erp") }],
    meta: [
      { title: "Fusion X ERP | Business Operations Platform" },
      {
        name: "description",
        content:
          "Explore Fusion X ERP: point of sale, sales, inventory, purchasing, finance, reports, branches and specialized operations in one workspace.",
      },
      { property: "og:title", content: "Fusion X ERP | Business Operations Platform" },
      {
        property: "og:description",
        content:
          "A connected ERP for sales, inventory, finance, branches and everyday business operations.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/erp") },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ErpPage() {
  const { config } = useCMS();
  const [language, setLanguage] = useState<Language>("en");
  const [darkMode, setDarkMode] = useState(true);
  const ar = language === "ar";
  const salesHref = getSalesWhatsAppHref(config.contact.whatsapp || config.contact.phone, language);

  useEffect(() => {
    try {
      setDarkMode(localStorage.getItem("fusionxtech-theme") !== "light");
      setLanguage(localStorage.getItem("fusionxtech-language") === "ar" ? "ar" : "en");
    } catch {
      // Keep the default language and dark mode when browser storage is unavailable.
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

  const changeLanguage = () => {
    const next = ar ? "en" : "ar";
    setLanguage(next);
    try {
      localStorage.setItem("fusionxtech-language", next);
    } catch {
      // The switch still works without storage.
    }
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    try {
      localStorage.setItem("fusionxtech-theme", next ? "dark" : "light");
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
    <div className="site erp-page" dir={ar ? "rtl" : "ltr"}>
      <ShowcaseHeader
        language={language}
        darkMode={darkMode}
        activeSection="erp"
        onNavigate={(id: SectionId) => {
          if (id === "home") window.location.assign("/");
          else window.location.assign(`/#${id}`);
        }}
        onToggleTheme={toggleTheme}
        onLanguageChange={changeLanguage}
      />
      <main>
        <section className="erp-hero" aria-labelledby="erp-hero-title">
          <div className="erp-hero-grid" aria-hidden="true" />
          <div className="section-inner erp-hero-inner">
            <div className="erp-hero-copy">
              <span className="erp-eyebrow">
                <span />
                {ar ? "من منتجات Fusion X.tech" : "A Fusion X.tech product"}
              </span>
              <h1 id="erp-hero-title">
                {ar ? (
                  <>
                    شغّل شركتك من
                    <br />
                    <span>مكان واحد.</span>
                  </>
                ) : (
                  <>
                    Run your business
                    <br />
                    <span>from one place.</span>
                  </>
                )}
              </h1>
              <p>
                {ar
                  ? "Fusion X ERP يربط المبيعات والمخزون والمشتريات والمالية والفروع في مساحة عمل واحدة تساعد فريقك يشوف الصورة كاملة ويتابع كل عملية بوضوح."
                  : "Fusion X ERP connects sales, inventory, purchasing, finance and branches in one workspace—so your team can see the bigger picture and keep every operation moving."}
              </p>
              <div className="erp-hero-actions">
                <a className="erp-button erp-button-primary" href={trialUrl}>
                  {ar ? "ابدأ تجربة مجانية لمدة 15 يومًا" : "Start your 15-day free trial"}
                  {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                </a>
                <a className="erp-button erp-button-secondary" href="#erp-features">
                  {ar ? "اكتشف مميزات النظام" : "Explore the ERP features"}
                  <ArrowDown aria-hidden="true" />
                </a>
              </div>
              <div className="erp-hero-assurance">
                <Check aria-hidden="true" />
                {ar
                  ? "15 يومًا · كل الموديولات مفعّلة · بدون بطاقة ائتمان"
                  : "15 days · All modules enabled · No credit card"}
              </div>
              <a className="erp-login-link" href={loginUrl}>
                {ar ? "لديك حساب بالفعل؟ تسجيل الدخول" : "Already have an account? Sign in"}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>

            <div
              className="erp-hero-visual"
              aria-label={ar ? "معاينة موديولات ERP" : "ERP modules preview"}
            >
              <div className="erp-visual-topbar">
                <div className="erp-visual-brand">
                  <span className="erp-brand-mark">FX</span>
                  <span>
                    <strong>FUSION X</strong>
                    <small>ERP WORKSPACE</small>
                  </span>
                </div>
                <span className="erp-visual-status">
                  <span />
                  {ar ? "مساحة عمل موحدة" : "Connected workspace"}
                </span>
              </div>
              <div className="erp-visual-heading">
                <div>
                  <small>{ar ? "إدارة أعمالك" : "YOUR OPERATIONS"}</small>
                  <strong>{ar ? "نظرة شاملة" : "One clear view"}</strong>
                </div>
                <Building2 aria-hidden="true" />
              </div>
              <div className="erp-visual-cards">
                <div>
                  <ShoppingCart aria-hidden="true" />
                  <span>{ar ? "المبيعات" : "Sales"}</span>
                </div>
                <div>
                  <PackageCheck aria-hidden="true" />
                  <span>{ar ? "المخزون" : "Inventory"}</span>
                </div>
                <div>
                  <Wallet aria-hidden="true" />
                  <span>{ar ? "المالية" : "Finance"}</span>
                </div>
                <div>
                  <GitBranch aria-hidden="true" />
                  <span>{ar ? "الفروع" : "Branches"}</span>
                </div>
              </div>
              <div className="erp-visual-activity">
                <div className="erp-visual-activity-heading">
                  <span>{ar ? "مسارات العمل" : "WORKFLOWS"}</span>
                  <span>{ar ? "متصلة" : "CONNECTED"}</span>
                </div>
                <div className="erp-visual-flow">
                  <span>
                    <ShoppingCart aria-hidden="true" />
                    {ar ? "البيع" : "Sales"}
                  </span>
                  <i aria-hidden="true" />
                  <span>
                    <Boxes aria-hidden="true" />
                    {ar ? "المخزون" : "Stock"}
                  </span>
                  <i aria-hidden="true" />
                  <span>
                    <BarChart3 aria-hidden="true" />
                    {ar ? "التقارير" : "Reports"}
                  </span>
                </div>
              </div>
              <div className="erp-visual-footer">
                <ShieldCheck aria-hidden="true" />
                {ar
                  ? "صلاحيات وفروع حسب إعداد شركتك"
                  : "Access and branches configured for your team"}
              </div>
              <span className="erp-visual-orbit erp-visual-orbit-one" aria-hidden="true" />
              <span className="erp-visual-orbit erp-visual-orbit-two" aria-hidden="true" />
            </div>
          </div>
          <a
            className="erp-scroll-cue"
            href="#erp-features"
            aria-label={ar ? "اكتشف المميزات" : "Explore features"}
          >
            <span />
            {ar ? "اكتشف المنصة" : "Explore the platform"}
          </a>
        </section>

        <section
          className="erp-intro section"
          id="erp-features"
          aria-labelledby="erp-features-title"
        >
          <div className="section-inner">
            <div className="erp-section-heading">
              <p className="section-eyebrow">
                {ar ? "منصة واحدة. عمليات مترابطة." : "ONE PLATFORM. CONNECTED OPERATIONS."}
              </p>
              <h2 id="erp-features-title">
                {ar ? "كل جزء من الشغل له مكان واضح." : "Every part of the work has a place."}
              </h2>
              <p>
                {ar
                  ? "من أول عملية بيع إلى التقارير والمتابعة، اجمع أدوات فريقك في نظام واحد بدل التنقل بين ملفات ومنصات متفرقة."
                  : "From the first sale to reporting and follow-up, bring your team's tools into one system instead of juggling scattered files and platforms."}
              </p>
            </div>
            <div className="erp-feature-grid">
              {featureGroups.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article className="erp-feature-card" key={feature.title.en}>
                    <div className="erp-feature-card-top">
                      <span className="erp-feature-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="erp-feature-index">0{index + 1}</span>
                    </div>
                    <h3>{feature.title[language]}</h3>
                    <p>{feature.description[language]}</p>
                    <ul>
                      {feature.items[language].map((item) => (
                        <li key={item}>
                          <Check aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="erp-operations section" aria-labelledby="erp-operations-title">
          <div className="section-inner erp-operations-inner">
            <div className="erp-operations-copy">
              <p className="section-eyebrow">{ar ? "وضوح من أول يوم" : "CLARITY FROM DAY ONE"}</p>
              <h2 id="erp-operations-title">
                {ar
                  ? "مش مجرد برنامج. طريقة أهدى لإدارة الشغل."
                  : "More than software. A clearer way to run work."}
              </h2>
              <p>
                {ar
                  ? "صُممت المنصة لتقرب الفرق والبيانات والعمليات من بعضها، وتساعدك تتابع ما يحدث في شركتك من شاشة تشغيل واحدة."
                  : "The platform brings teams, information and operations closer together, helping you follow what's happening across your business from one operational view."}
              </p>
              <a className="erp-text-link" href={trialUrl}>
                {ar ? "جرّب مساحة العمل بنفسك" : "Explore the workspace yourself"}
                {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </a>
            </div>
            <div className="erp-workflow-list">
              {workflowFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article className="erp-workflow-item" key={feature.title.en}>
                    <span className="erp-workflow-number">0{index + 1}</span>
                    <span className="erp-workflow-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{feature.title[language]}</h3>
                      <p>{feature.description[language]}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="erp-specialized section"
          aria-label={ar ? "موديولات متخصصة" : "Specialized modules"}
        >
          <div className="section-inner erp-specialized-inner">
            <div>
              <p className="section-eyebrow">
                {ar ? "جاهز لطبيعة شغلك" : "BUILT AROUND YOUR OPERATION"}
              </p>
              <h2>{ar ? "موديولات متخصصة لنشاطك." : "Specialized modules for your operation."}</h2>
            </div>
            <div className="erp-specialized-cards">
              <article>
                <Factory aria-hidden="true" />
                <h3>{ar ? "تشغيل المصنع" : "Factory operations"}</h3>
                <p>
                  {ar
                    ? "تابع التشغيل والتكلفة المخططة والفعلية."
                    : "Follow operations and planned versus actual costs."}
                </p>
              </article>
              <article>
                <CarFront aria-hidden="true" />
                <h3>{ar ? "خدمة السيارات" : "Automotive service"}</h3>
                <p>
                  {ar
                    ? "مساحة عمل مخصصة لسير عمليات خدمة السيارات."
                    : "A dedicated workspace for automotive service workflows."}
                </p>
              </article>
              <article>
                <Wrench aria-hidden="true" />
                <h3>{ar ? "المشروعات والتكلفة" : "Projects and costing"}</h3>
                <p>
                  {ar
                    ? "تابع العقود والتكاليف والمستخلصات والربح التقديري."
                    : "Track contracts, costs, claims and estimated profit."}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="erp-pricing section"
          id="erp-packages"
          aria-labelledby="erp-packages-title"
        >
          <div className="section-inner">
            <div className="erp-section-heading">
              <p className="section-eyebrow">
                {ar ? "ثلاث طرق للبدء" : "THREE WAYS TO GET STARTED"}
              </p>
              <h2 id="erp-packages-title">
                {ar ? "باقة تناسب حجم فريقك." : "A package that fits your team."}
              </h2>
              <p>
                {ar
                  ? "ابدأ بالاحتياج الحالي، وبعدها وسّع المستخدمين والفروع والموديولات مع نمو شركتك."
                  : "Start with what you need today, then grow users, branches and modules as your business evolves."}
              </p>
            </div>
            <div className="erp-package-grid">
              {packages.map((pack) => {
                const packageHref = getSalesWhatsAppHref(
                  config.contact.whatsapp || config.contact.phone,
                  language,
                  pack.name,
                );
                return (
                  <article
                    className={`erp-package-card${pack.featured ? " erp-package-featured" : ""}`}
                    key={pack.name}
                  >
                    {pack.featured && (
                      <span className="erp-package-badge">
                        {ar ? "اختيار الفرق النامية" : "FOR GROWING TEAMS"}
                      </span>
                    )}
                    <p className="erp-package-audience">{pack.audience[language]}</p>
                    <h3>{pack.name}</h3>
                    <p className="erp-package-description">{pack.description[language]}</p>
                    <ul>
                      {pack.features[language].map((feature) => (
                        <li key={feature}>
                          <Check aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      className={`erp-button ${pack.featured ? "erp-button-primary" : "erp-button-secondary"}`}
                      href={packageHref ?? "/contact"}
                      target={packageHref ? "_blank" : undefined}
                      rel={packageHref ? "noopener noreferrer" : undefined}
                    >
                      {pack.action[language]}
                      {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                    </a>
                  </article>
                );
              })}
            </div>
            <p className="erp-pricing-note">
              {ar
                ? "عدد المستخدمين والفروع والموديولات المناسبة يتحدد حسب احتياج شركتك. تواصل معنا للحصول على عرض يناسب طريقة تشغيلك."
                : "The right user count, branches and modules depend on your business. Contact us for an offer that fits the way you operate."}
            </p>
          </div>
        </section>

        <section className="erp-trial section" aria-labelledby="erp-trial-title">
          <div className="section-inner erp-trial-panel">
            <div className="erp-trial-mark" aria-hidden="true">
              FX
            </div>
            <div className="erp-trial-copy">
              <p className="section-eyebrow">
                {ar ? "ابدأ بخطوة بسيطة" : "START WITH A SIMPLE STEP"}
              </p>
              <h2 id="erp-trial-title">
                {ar ? "شوف النظام على احتياجك أنت." : "See how it fits your business."}
              </h2>
              <p>
                {ar
                  ? "افتح مساحة تجربة لمدة 15 يومًا، استكشف الموديولات، وبعدها اختار الباقة المناسبة لك."
                  : "Create a 15-day trial workspace, explore the modules, then choose the package that works for you."}
              </p>
            </div>
            <div className="erp-trial-actions">
              <a className="erp-button erp-button-primary" href={trialUrl}>
                {ar ? "ابدأ التجربة المجانية" : "Start the free trial"}
                <ArrowUpRight aria-hidden="true" />
              </a>
              {salesHref && (
                <a
                  className="erp-trial-whatsapp"
                  href={salesHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageIcon />
                  {ar ? "اسألنا على واتساب عن الباقات" : "Ask us about packages on WhatsApp"}
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="erp-faq section" aria-labelledby="erp-faq-title">
          <div className="section-inner erp-faq-inner">
            <div className="erp-faq-heading">
              <p className="section-eyebrow">{ar ? "قبل ما تبدأ" : "BEFORE YOU START"}</p>
              <h2 id="erp-faq-title">
                {ar ? "أسئلة بنسمعها كتير." : "Questions worth answering."}
              </h2>
              <p>
                {ar
                  ? "إجابات واضحة تساعدك تبدأ وأنت عارف الخطوة الجاية."
                  : "Straight answers to help you take the next step with confidence."}
              </p>
              <a
                className="erp-text-link"
                href={salesHref ?? "/contact"}
                target={salesHref ? "_blank" : undefined}
                rel={salesHref ? "noopener noreferrer" : undefined}
              >
                {ar ? "تحدث مع فريقنا" : "Talk to our team"}
                {ar ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </a>
            </div>
            <div className="erp-faq-list">
              {faqs.map((faq) => (
                <details key={faq.question.en}>
                  <summary>
                    {faq.question[language]}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{faq.answer[language]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ShowcaseFooter
        language={language}
        logo={darkMode ? config.brand.whiteLogo : config.brand.logo}
        onBackToTop={backToTop}
      />
    </div>
  );
}

function MessageIcon() {
  return <MessageCircle aria-hidden="true" />;
}
