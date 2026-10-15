import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { services as baseServices } from "@/lib/showcase-data";
import { projects as baseProjects } from "@/lib/projects";
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
export type EditableItem = {
  id: string;
  name: Bilingual;
  description: Bilingual;
  image: string;
  link?: string;
  enabled: boolean;
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
    services: true,
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
};

const STORAGE_KEY = "viral-zoom-cms-v1";
type CMSContextValue = {
  config: SiteConfig;
  setConfig: (next: SiteConfig) => void;
  reset: () => void;
};
const CMSContext = createContext<CMSContextValue | null>(null);

function mergeConfig(saved: Partial<SiteConfig> | null): SiteConfig {
  if (!saved || typeof saved !== "object") return initialConfig;
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
    services: Array.isArray(saved.services) ? saved.services : initialConfig.services,
    portfolio: Array.isArray(saved.portfolio) ? saved.portfolio : initialConfig.portfolio,
    clients: Array.isArray(saved.clients) ? saved.clients : initialConfig.clients,
  };
}

export function CMSProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<SiteConfig>(initialConfig);
  useEffect(() => {
    try {
      setConfigState(mergeConfig(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")));
    } catch {
      setConfigState(initialConfig);
    }
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", config.brand.accent);
  }, [config.brand.accent]);
  const value = useMemo<CMSContextValue>(
    () => ({
      config,
      setConfig(next) {
        setConfigState(next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (error) {
          console.warn(
            "The browser could not save the CMS data. Large media files should be hosted and added by URL.",
            error,
          );
        }
      },
      reset() {
        localStorage.removeItem(STORAGE_KEY);
        setConfigState(initialConfig);
      },
    }),
    [config],
  );
  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const value = useContext(CMSContext);
  if (!value) throw new Error("useCMS must be used within CMSProvider");
  return value;
}

export const CMS_STORAGE_KEY = STORAGE_KEY;
