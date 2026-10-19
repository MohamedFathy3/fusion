import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { services as baseServices } from "@/lib/showcase-data";
import {
  projects as baseProjects,
  type Project,
  type ProjectCategoryId,
  type SocialMediaShowcase,
} from "@/lib/projects";
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
import hero from "@/assets/hero.mp4.asset.json";
import logo from "@/assets/logo.png.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";

export type Bilingual = { en: string; ar: string };
export type AboutValue = { title: Bilingual; text: Bilingual };
export type ProcessStep = { name: Bilingual; description: Bilingual };
export type SiteContent = {
  about: {
    seoTitle: Bilingual;
    seoDescription: Bilingual;
    heroEyebrow: Bilingual;
    heroTitle: Bilingual;
    heroTitleAccent: Bilingual;
    heroDescription: Bilingual;
    heroCta: Bilingual;
    heroImageAlt: Bilingual;
    heroCaption: Bilingual;
    storyEyebrow: Bilingual;
    storyTitle: Bilingual;
    storyParagraphs: Bilingual[];
    storyCta: Bilingual;
    valuesEyebrow: Bilingual;
    valuesTitle: Bilingual;
    valuesDescription: Bilingual;
    values: AboutValue[];
    approachEyebrow: Bilingual;
    approachTitle: Bilingual;
    approachDescription: Bilingual;
    ctaEyebrow: Bilingual;
    ctaTitle: Bilingual;
    ctaDescription: Bilingual;
    ctaButton: Bilingual;
  };
  process: {
    eyebrow: Bilingual;
    title: Bilingual;
    intro: Bilingual;
    steps: ProcessStep[];
  };
  seo: {
    siteTitle: Bilingual;
    siteDescription: Bilingual;
    homeTitle: Bilingual;
    homeDescription: Bilingual;
    servicesTitle: Bilingual;
    projectsTitle: Bilingual;
    contactTitle: Bilingual;
  };
};
export type EditableItem = {
  id: string;
  name: Bilingual;
  description: Bilingual;
  image: string;
  link?: string;
  enabled: boolean;
  projectCategory?: ProjectCategoryId;
  additionalCategories?: ProjectCategoryId[];
  projectKind?: "case-study" | "external";
  projectUrl?: string;
  imageGallery?: string[];
  socialMediaShowcase?: SocialMediaShowcase;
};
export type SiteConfig = {
  brand: { name: string; accent: string; logo: string; whiteLogo: string };
  hero: { title: Bilingual; subtitle: Bilingual; video: string; poster: string };
  sections: Record<
    "services" | "portfolio" | "clients" | "process" | "banner" | "contact",
    boolean
  >;
  services: EditableItem[];
  portfolio: EditableItem[];
  clients: EditableItem[];
  contact: { email: string; phone: string; whatsapp: string; address: Bilingual };
  content: SiteContent;
};

export const initialConfig: SiteConfig = {
  brand: { name: "Viral Zoom", accent: "#69499e", logo: logo.url, whiteLogo: whiteLogo.url },
  hero: {
    title: { en: "Creative & Digital Marketing", ar: "الإبداع والتسويق الرقمي" },
    subtitle: {
      en: "Ideas that make your brand impossible to ignore.",
      ar: "أفكار تجعل علامتك التجارية مستحيلة التجاهل.",
    },
    video: hero.url,
    poster: "",
  },
  sections: {
    services: false,
    portfolio: true,
    clients: true,
    process: true,
    banner: true,
    contact: true,
  },
  services: baseServices.map((item) => ({
    id: item.slug,
    name: item.title,
    description: item.description,
    image: item.image,
    link: `/services/${item.slug}`,
    enabled: true,
  })),
  portfolio: baseProjects.map((item) => ({
    id: item.slug,
    name: { en: item.localizedName?.en ?? item.name, ar: item.localizedName?.ar ?? item.name },
    description: item.description,
    image: item.image,
    link: item.kind === "external" ? item.url : `/projects/${item.slug}`,
    enabled: true,
    projectCategory: item.category,
    ...(item.additionalCategories ? { additionalCategories: item.additionalCategories } : {}),
    projectKind: item.kind,
    ...(item.kind === "external" ? { projectUrl: item.url } : {}),
    ...(item.kind === "case-study" && item.imageGallery ? { imageGallery: item.imageGallery } : {}),
    ...(item.kind === "case-study" && item.socialMediaShowcase
      ? { socialMediaShowcase: item.socialMediaShowcase }
      : {}),
  })),
  clients: [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9].map((item, i) => ({
    id: `client-${i + 1}`,
    name: { en: `Client ${i + 1}`, ar: `عميل ${i + 1}` },
    description: { en: "", ar: "" },
    image: item.url,
    enabled: true,
  })),
  contact: {
    email: "info@viralzoom.com",
    phone: "",
    whatsapp: "",
    address: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
  },
  content: {
    about: {
      seoTitle: {
        en: "About Viral Zoom — Creative & Digital Agency",
        ar: "عن فايرال زوم — وكالة إبداعية ورقمية",
      },
      seoDescription: {
        en: "Meet Viral Zoom, a creative and digital agency combining strategy, design and technology to help brands grow.",
        ar: "تعرف على فايرال زوم، وكالة إبداعية ورقمية تجمع الاستراتيجية والتصميم والتكنولوجيا لتنمية العلامات التجارية.",
      },
      heroEyebrow: { en: "ABOUT VIRAL ZOOM", ar: "عن فايرال زوم" },
      heroTitle: { en: "We turn bold ideas", ar: "نحوّل الأفكار" },
      heroTitleAccent: { en: "into real impact.", ar: "الجريئة لتأثير حقيقي." },
      heroDescription: {
        en: "We are a creative and digital agency bringing strategy, design and technology together to help brands move forward.",
        ar: "إحنا وكالة إبداعية ورقمية بنجمع الاستراتيجية والتصميم والتكنولوجيا عشان نساعد العلامات التجارية تتقدم.",
      },
      heroCta: { en: "Get to know us", ar: "اعرفنا أكتر" },
      heroImageAlt: {
        en: "A creative digital project by Viral Zoom",
        ar: "مشروع رقمي إبداعي من فايرال زوم",
      },
      heroCaption: { en: "Ideas made visible", ar: "أفكار تتحول لواقع" },
      storyEyebrow: { en: "WHO WE ARE", ar: "مين إحنا" },
      storyTitle: {
        en: "A creative partner for brands ready to grow.",
        ar: "شريك إبداعي للعلامات اللي مستعدة تكبر.",
      },
      storyParagraphs: [
        {
          en: "At Viral Zoom, we bring creative services and digital solutions together under one roof. From brand identity and content to websites, campaigns and production, we help shape consistent experiences that connect with people.",
          ar: "في فايرال زوم، بنجمع الخدمات الإبداعية والحلول الرقمية في مكان واحد. من الهوية والمحتوى للمواقع والحملات والإنتاج، بنساعد في بناء تجارب متناسقة تقرّب علامتك من جمهورها.",
        },
        {
          en: "Every project starts with understanding what makes your business different. Then we turn that understanding into clear ideas, thoughtful design and work made to support your next step.",
          ar: "كل مشروع بيبدأ بفهم اللي بيميّز شغلك. بعدها نحوّل الفهم لأفكار واضحة وتصميم مدروس وشغل يساعدك تاخد خطوتك الجاية.",
        },
      ],
      storyCta: { en: "Explore selected projects", ar: "شوف مشاريعنا" },
      valuesEyebrow: { en: "HOW WE THINK", ar: "طريقة تفكيرنا" },
      valuesTitle: { en: "Creative with purpose.", ar: "إبداع له هدف." },
      valuesDescription: {
        en: "Good work is more than a good-looking idea. It should make sense for your brand and move you toward a goal.",
        ar: "الشغل الحلو مش مجرد شكل جذاب؛ لازم يناسب علامتك ويقرّبك من هدفك.",
      },
      values: [
        {
          title: { en: "Start with insight", ar: "نبدأ بالفهم" },
          text: {
            en: "We learn about your brand, your audience and your goals before shaping the right direction.",
            ar: "نفهم علامتك وجمهورك وأهدافك قبل ما نحدد الاتجاه المناسب.",
          },
        },
        {
          title: { en: "Make ideas matter", ar: "نحوّل الأفكار لتأثير" },
          text: {
            en: "We bring creative thinking and practical strategy together to make every touchpoint count.",
            ar: "نجمع بين الإبداع والاستراتيجية العملية عشان كل نقطة تواصل يكون ليها أثر.",
          },
        },
        {
          title: { en: "Build for progress", ar: "نبني للتطور" },
          text: {
            en: "We test, learn and refine the work, keeping the focus on meaningful progress for your brand.",
            ar: "نختبر ونتعلم ونطوّر شغلنا، مع تركيزنا على تقدم حقيقي لعلامتك التجارية.",
          },
        },
      ],
      approachEyebrow: { en: "OUR APPROACH", ar: "منهجيتنا" },
      approachTitle: {
        en: "Think clearly. Create boldly. Keep growing.",
        ar: "فكّر بوضوح. ابتكر بجرأة. واستمر في التطور.",
      },
      approachDescription: {
        en: "We work through a clear cycle: understand the opportunity, create and test ideas, learn from what happens, then build on what works.",
        ar: "بنتبع خطوات واضحة: نفهم الفرصة، نبتكر ونختبر الأفكار، نتعلم من النتائج، وبعدها نطوّر اللي أثبت نجاحه.",
      },
      ctaEyebrow: { en: "LET'S BUILD WHAT'S NEXT", ar: "يلا نبدأ خطوتك الجاية" },
      ctaTitle: { en: "Have an idea in mind?", ar: "عندك فكرة في بالك؟" },
      ctaDescription: {
        en: "Tell us what you are working toward. We would love to hear about it.",
        ar: "احكيلنا عن هدفك، ويسعدنا نسمع فكرتك.",
      },
      ctaButton: { en: "Start a conversation", ar: "ابدأ كلامنا" },
    },
    process: {
      eyebrow: { en: "THE VIRAL ZOOM METHOD", ar: "منهجية فايرال زوم" },
      title: {
        en: "Measure. Ideate. Experiment. Read. Scale.",
        ar: "حلّل. ابتكر. جرّب. قيّم. وسّع.",
      },
      intro: {
        en: "A clear, repeatable process for meaningful results.",
        ar: "خطوات واضحة ومتكررة لتحقيق نتائج مؤثرة.",
      },
      steps: [
        {
          name: { en: "Measure", ar: "حلّل" },
          description: { en: "Find the opportunity.", ar: "نكتشف الفرص المناسبة." },
        },
        {
          name: { en: "Ideate", ar: "ابتكر" },
          description: { en: "Turn insight into ideas.", ar: "نحوّل الرؤى إلى أفكار." },
        },
        {
          name: { en: "Experiment", ar: "جرّب" },
          description: { en: "Create. Test. Iterate.", ar: "نبتكر، نختبر، ونطوّر." },
        },
        {
          name: { en: "Read", ar: "حلّل النتائج" },
          description: { en: "Learn what works.", ar: "نتعلّم مما يحقق النتائج." },
        },
        {
          name: { en: "Scale", ar: "وسّع" },
          description: { en: "Do more of what works.", ar: "نوسّع أثر ما ينجح." },
        },
      ],
    },
    seo: {
      siteTitle: { en: "Viral Zoom", ar: "فايرال زوم" },
      siteDescription: {
        en: "Creative and digital marketing agency.",
        ar: "وكالة إبداعية ورقمية للتسويق والتصميم.",
      },
      homeTitle: {
        en: "Creative & Digital Marketing | Viral Zoom",
        ar: "الإبداع والتسويق الرقمي | فايرال زوم",
      },
      homeDescription: {
        en: "Ideas that make your brand impossible to ignore.",
        ar: "أفكار تجعل علامتك التجارية مستحيلة التجاهل.",
      },
      servicesTitle: { en: "Our Services | Viral Zoom", ar: "خدماتنا | فايرال زوم" },
      projectsTitle: { en: "Our Projects | Viral Zoom", ar: "أعمالنا | فايرال زوم" },
      contactTitle: { en: "Contact Viral Zoom", ar: "تواصل مع فايرال زوم" },
    },
  },
};

export function projectItemsFromConfig(items: EditableItem[]): Project[] {
  return items
    .filter((item) => !/(?:\s+\(copy\))+$/i.test(item.name.en))
    .map((item) => {
      const original = baseProjects.find((project) => project.slug === item.id);
      const category = item.projectCategory ?? original?.category ?? "branding";
      const extra = item.additionalCategories ?? original?.additionalCategories;
      if (item.projectKind === "external" || original?.kind === "external") {
        const originalExternal = original?.kind === "external" ? original : undefined;
        return {
          ...(originalExternal ?? {}),
          slug: item.id,
          name: item.name.en,
          localizedName: item.name,
          category,
          ...(extra ? { additionalCategories: extra } : {}),
          kind: "external" as const,
          projectType: originalExternal?.projectType ?? ("website" as const),
          url: item.projectUrl ?? item.link ?? originalExternal?.url ?? "/",
          image: item.image,
          description: item.description,
        };
      }
      const originalCase = original?.kind === "case-study" ? original : undefined;
      const gallery = item.imageGallery ?? originalCase?.imageGallery;
      const showcase = item.socialMediaShowcase ?? originalCase?.socialMediaShowcase;
      return {
        ...(originalCase ?? {}),
        slug: item.id,
        name: item.name.en,
        localizedName: item.name,
        category,
        ...(extra ? { additionalCategories: extra } : {}),
        kind: "case-study" as const,
        image: item.image,
        description: item.description,
        ...(gallery ? { imageGallery: gallery } : {}),
        ...(showcase ? { socialMediaShowcase: showcase } : {}),
      };
    });
}

type CMSContextValue = {
  config: SiteConfig;
  ready: boolean;
  loadError: string | null;
  refresh: () => Promise<void>;
  setConfig: (next: SiteConfig) => Promise<void>;
  reset: () => Promise<void>;
};
const CMSContext = createContext<CMSContextValue | null>(null);

function isBilingual(value: unknown): value is Bilingual {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>)["en"] === "string" &&
    typeof (value as Record<string, unknown>)["ar"] === "string"
  );
}

export function isSiteConfig(value: unknown): value is SiteConfig {
  if (!value || typeof value !== "object") return false;
  const config = value as Partial<SiteConfig>;
  return (
    !!config.brand &&
    typeof config.brand.name === "string" &&
    typeof config.brand.accent === "string" &&
    typeof config.brand.logo === "string" &&
    typeof config.brand.whiteLogo === "string" &&
    !!config.hero &&
    isBilingual(config.hero.title) &&
    isBilingual(config.hero.subtitle) &&
    typeof config.hero.video === "string" &&
    typeof config.hero.poster === "string" &&
    !!config.sections &&
    ["services", "portfolio", "clients", "process", "banner", "contact"].every(
      (key) => typeof config.sections?.[key as keyof SiteConfig["sections"]] === "boolean",
    ) &&
    !!config.contact &&
    typeof config.contact.email === "string" &&
    typeof config.contact.phone === "string" &&
    typeof config.contact.whatsapp === "string" &&
    isBilingual(config.contact.address) &&
    !!config.content &&
    !!config.content.about &&
    !!config.content.process &&
    !!config.content.seo &&
    Array.isArray(config.services) &&
    Array.isArray(config.portfolio) &&
    Array.isArray(config.clients)
  );
}

function mergeConfig(saved: SiteConfig): SiteConfig {
  return {
    ...initialConfig,
    ...saved,
    brand: { ...initialConfig.brand, ...saved.brand },
    hero: {
      ...initialConfig.hero,
      ...saved.hero,
      title: { ...initialConfig.hero.title, ...saved.hero?.title },
      subtitle: { ...initialConfig.hero.subtitle, ...saved.hero?.subtitle },
    },
    sections: { ...initialConfig.sections, ...saved.sections },
    contact: {
      ...initialConfig.contact,
      ...saved.contact,
      address: { ...initialConfig.contact.address, ...saved.contact?.address },
    },
    content: {
      ...initialConfig.content,
      ...saved.content,
      about: { ...initialConfig.content.about, ...saved.content?.about },
      process: { ...initialConfig.content.process, ...saved.content?.process },
      seo: { ...initialConfig.content.seo, ...saved.content?.seo },
    },
    services: Array.isArray(saved.services) ? saved.services : initialConfig.services,
    portfolio: Array.isArray(saved.portfolio) ? saved.portfolio : initialConfig.portfolio,
    clients: Array.isArray(saved.clients) ? saved.clients : initialConfig.clients,
  };
}

async function persistConfig(config: SiteConfig) {
  const response = await fetch("/api/site", {
    method: "PUT",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(result.error || "Could not save site content.");
  }
}

export function CMSProvider({
  children,
  serverConfig,
}: {
  children: ReactNode;
  serverConfig?: SiteConfig;
}) {
  const [config, setConfigState] = useState<SiteConfig>(() =>
    serverConfig ? mergeConfig(serverConfig) : initialConfig,
  );
  const [ready, setReady] = useState(Boolean(serverConfig));
  const [loadError, setLoadError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/site", { credentials: "same-origin" });
      if (!response.ok) throw new Error(`Content API returned ${response.status}`);
      const saved: unknown = await response.json();
      if (!isSiteConfig(saved))
        throw new Error("The content API returned an invalid site configuration.");
      setConfigState(mergeConfig(saved));
      setReady(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load site content.";
      setLoadError(message);
      throw error;
    }
  }, []);
  useEffect(() => {
    if (serverConfig) return;
    refresh().catch((error) => {
      console.error("Could not load content from the Node API.", error);
    });
  }, [refresh, serverConfig]);
  useEffect(() => {
    const syncPublishedContent = (event: StorageEvent) => {
      if (event.key !== "viral-zoom-cms-revision") return;
      void refresh().catch((error) => console.error("Could not sync published content.", error));
    };
    window.addEventListener("storage", syncPublishedContent);
    return () => window.removeEventListener("storage", syncPublishedContent);
  }, [refresh]);
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", config.brand.accent);
  }, [config.brand.accent]);
  const value = useMemo<CMSContextValue>(
    () => ({
      config,
      ready,
      loadError,
      refresh,
      async setConfig(next) {
        await persistConfig(next);
        setConfigState(mergeConfig(next));
        setLoadError(null);
        setReady(true);
        try {
          localStorage.setItem("viral-zoom-cms-revision", String(Date.now()));
        } catch {
          // Cross-tab refresh is optional when browser storage is unavailable.
        }
      },
      async reset() {
        await persistConfig(initialConfig);
        setConfigState(initialConfig);
        setLoadError(null);
        setReady(true);
        try {
          localStorage.setItem("viral-zoom-cms-revision", String(Date.now()));
        } catch {
          // Cross-tab refresh is optional when browser storage is unavailable.
        }
      },
    }),
    [config, ready, loadError, refresh],
  );
  return (
    <CMSContext.Provider value={value}>
      {!ready ? (
        <div className="cms-load-gate" role={loadError ? "alert" : "status"}>
          {loadError ? (
            <>
              <p>Could not load the website content from the server.</p>
              <small>{loadError}</small>
              <button onClick={() => refresh().catch((error) => console.error(error))}>
                Try again
              </button>
            </>
          ) : (
            <>
              <strong className="cms-load-brand">VZ</strong>
              <span className="cms-load-spinner" aria-hidden="true" />
            </>
          )}
        </div>
      ) : (
        children
      )}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const value = useContext(CMSContext);
  if (!value) throw new Error("useCMS must be used within CMSProvider");
  return value;
}
