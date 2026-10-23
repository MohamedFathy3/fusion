import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  projects as baseProjects,
  type Project,
  type ProjectCategoryId,
  type SocialMediaShowcase,
} from "@/lib/projects";
import viralzoomPortfolio from "@/assets/viralzoom-projects.asset.json";
import websiteClientLogos from "@/assets/website-client-logos.asset.json";
import fusionLogo from "@/assets/logo.png";
import heroPoster from "@/assets/Websites & Applications Tech Workspace.png";
import heroVideo from "@/assets/Software_company_hero_video_crea…_20261023184930.mp4?url";

export type Bilingual = { en: string; ar: string };
export type AboutValue = { title: Bilingual; text: Bilingual };
export type ProcessStep = { name: Bilingual; description: Bilingual };
export type PageCopy = Record<string, Bilingual>;
type SeoPageCopy = PageCopy & { seoTitle: Bilingual; seoDescription: Bilingual };
export type PageContent = {
  common: PageCopy;
  home: SeoPageCopy;
  about: SeoPageCopy;
  services: SeoPageCopy;
  projects: SeoPageCopy;
  contact: SeoPageCopy;
  serviceDetail: PageCopy;
  projectDetail: PageCopy;
};
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
  showcaseSeedVersion?: number;
  pages: PageContent;
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
  reelsVideos?: string[];
  promoVideos?: string[];
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

function importedProjectCategory(category: string): ProjectCategoryId {
  if (category === "websites" || category === "ui-ux") return category;
  throw new Error(`Unsupported imported project category: ${category}`);
}

const importedPortfolio: EditableItem[] = viralzoomPortfolio.projects.map((project) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  image: project.image.url,
  link: project.url,
  enabled: true,
  projectCategory: importedProjectCategory(project.category),
  projectKind: "external",
  projectUrl: project.url,
}));

const importedClientLogos: EditableItem[] = websiteClientLogos.clients.map((client) => ({
  id: `client-${client.id}`,
  name: client.name,
  description: {
    en: "Website project client",
    ar: "عميل من مشاريع المواقع",
  },
  image: client.image.url,
  link: client.projectUrl,
  enabled: true,
}));

const legacyConfig: SiteConfig = {
  brand: {
    name: "Fusion X.tech",
    accent: "#08bdf3",
    logo: fusionLogo,
    whiteLogo: fusionLogo,
  },
  hero: {
    title: { en: "Creative & Digital Marketing", ar: "الإبداع والتسويق الرقمي" },
    subtitle: {
      en: "Ideas that make your brand impossible to ignore.",
      ar: "أفكار تجعل علامتك التجارية مستحيلة التجاهل.",
    },
    video: "",
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
  services: [],
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
    ...(item.kind === "case-study" && item.reelsVideos ? { reelsVideos: item.reelsVideos } : {}),
    ...(item.kind === "case-study" && item.promoVideos ? { promoVideos: item.promoVideos } : {}),
    ...(item.kind === "case-study" && item.socialMediaShowcase
      ? { socialMediaShowcase: item.socialMediaShowcase }
      : {}),
  })),
  clients: [],
  contact: {
    email: "info@fusionteck.online",
    phone: "01222291024",
    whatsapp: "",
    address: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
  },
  content: {
    about: {
      seoTitle: {
        en: "About Fusion X.tech — Creative & Digital Agency",
        ar: "عن Fusion X.tech — وكالة إبداعية ورقمية",
      },
      seoDescription: {
        en: "Meet Fusion X.tech, a creative and digital agency combining strategy, design and technology to help brands grow.",
        ar: "تعرف على Fusion X.tech، وكالة إبداعية ورقمية تجمع الاستراتيجية والتصميم والتكنولوجيا لتنمية العلامات التجارية.",
      },
      heroEyebrow: { en: "ABOUT FUSION X.TECH", ar: "عن Fusion X.tech" },
      heroTitle: { en: "We turn bold ideas", ar: "نحوّل الأفكار" },
      heroTitleAccent: { en: "into real impact.", ar: "الجريئة لتأثير حقيقي." },
      heroDescription: {
        en: "We are a creative and digital agency bringing strategy, design and technology together to help brands move forward.",
        ar: "إحنا وكالة إبداعية ورقمية بنجمع الاستراتيجية والتصميم والتكنولوجيا عشان نساعد العلامات التجارية تتقدم.",
      },
      heroCta: { en: "Get to know us", ar: "اعرفنا أكتر" },
      heroImageAlt: {
        en: "A creative digital project by Fusion X.tech",
        ar: "مشروع رقمي إبداعي من Fusion X.tech",
      },
      heroCaption: { en: "Ideas made visible", ar: "أفكار تتحول لواقع" },
      storyEyebrow: { en: "WHO WE ARE", ar: "مين إحنا" },
      storyTitle: {
        en: "A creative partner for brands ready to grow.",
        ar: "شريك إبداعي للعلامات اللي مستعدة تكبر.",
      },
      storyParagraphs: [
        {
          en: "At Fusion X.tech, we bring creative services and digital solutions together under one roof. From brand identity and content to websites, campaigns and production, we help shape consistent experiences that connect with people.",
          ar: "في Fusion X.tech، بنجمع الخدمات الإبداعية والحلول الرقمية في مكان واحد. من الهوية والمحتوى للمواقع والحملات والإنتاج، بنساعد في بناء تجارب متناسقة تقرّب علامتك من جمهورها.",
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
      eyebrow: { en: "THE FUSION X.TECH METHOD", ar: "منهجية Fusion X.tech" },
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
      siteTitle: { en: "Fusion X.tech", ar: "Fusion X.tech" },
      siteDescription: {
        en: "Creative and digital marketing agency.",
        ar: "وكالة إبداعية ورقمية للتسويق والتصميم.",
      },
      homeTitle: {
        en: "Fusion X.tech",
        ar: "Fusion X.tech",
      },
      homeDescription: {
        en: "Ideas that make your brand impossible to ignore.",
        ar: "أفكار تجعل علامتك التجارية مستحيلة التجاهل.",
      },
      servicesTitle: { en: "Our Services | Fusion X.tech", ar: "خدماتنا | Fusion X.tech" },
      projectsTitle: { en: "Our Projects | Fusion X.tech", ar: "أعمالنا | Fusion X.tech" },
      contactTitle: { en: "Contact Fusion X.tech", ar: "تواصل مع Fusion X.tech" },
    },
    pages: {
      common: {
        navHome: { en: "HOME", ar: "الرئيسية" },
        navAbout: { en: "ABOUT", ar: "من نحن" },
        navContact: { en: "CONTACT", ar: "تواصل معنا" },
        navServices: { en: "SERVICES", ar: "خدماتنا" },
        navProjects: { en: "PROJECTS", ar: "مشاريعنا" },
        navClients: { en: "OUR CLIENTS", ar: "عملاؤنا" },
        footerCopyright: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
        footerBackToTop: { en: "Back to top", ar: "إلى أعلى" },
        contactHeading: { en: "SEND A MESSAGE", ar: "ابعتلنا رسالة" },
        contactEyebrow: { en: "LET'S CHAT", ar: "يلا نتكلم" },
        contactIntro: {
          en: "Have a project in mind? Tell us what you are looking to create.",
          ar: "عندك مشروع في بالك؟ احكيلنا نفسك تعمل إيه.",
        },
        contactFallback: {
          en: "Call us to talk through your next idea.",
          ar: "اتصل بينا واحكيلنا عن فكرتك الجديدة.",
        },
        contactFormNote: {
          en: "Send us a message and we’ll get back to you soon.",
          ar: "ابعتلنا رسالتك وهنرد عليك في أقرب وقت.",
        },
        contactFormSending: { en: "Sending your message…", ar: "جارٍ إرسال رسالتك…" },
        contactFormSuccess: {
          en: "Your message was sent successfully.",
          ar: "تم إرسال رسالتك بنجاح.",
        },
        contactFormError: {
          en: "We couldn’t send your message. Please try again or email us directly.",
          ar: "ما قدرناش نبعت رسالتك. حاول تاني أو ابعتلنا على الإيميل مباشرة.",
        },
        contactName: { en: "Name", ar: "الاسم" },
        contactEmail: { en: "Email", ar: "البريد الإلكتروني" },
        contactSubject: { en: "Subject", ar: "الموضوع" },
        contactMessage: { en: "Message", ar: "اكتب رسالتك" },
        contactSubmit: { en: "Let's Talk", ar: "يلا نتكلم" },
      },
      home: {
        seoTitle: {
          en: "Fusion X.tech",
          ar: "Fusion X.tech",
        },
        seoDescription: {
          en: "Ideas that make your brand impossible to ignore.",
          ar: "أفكار تجعل علامتك التجارية مستحيلة التجاهل.",
        },
        heroLabel: { en: "Fusion X.tech showreel", ar: "فيديو Fusion X.tech" },
        serviceIntroEyebrow: {
          en: "Creative services, made for growth",
          ar: "خدمات إبداعية تنمّي شغلك",
        },
        serviceIntroTitle: { en: "Big ideas.", ar: "أفكار كبيرة." },
        serviceIntroAccent: { en: "Real impact.", ar: "وتأثير حقيقي." },
        serviceIntroDescription: {
          en: "From the first spark to the final detail, we bring strategy, creativity and technology together to move your brand forward.",
          ar: "من أول فكرة لآخر تفصيلة، بنجمع بين الاستراتيجية والإبداع والتكنولوجيا عشان نحرّك علامتك التجارية لقدّام.",
        },
        serviceIntroCta: { en: "Explore our services", ar: "اكتشف خدماتنا" },
        serviceIntroCount: { en: "ways to grow your brand", ar: "خدمات لتنمية علامتك" },
        serviceImageAlt: {
          en: "Creative digital experience designed by Fusion X.tech",
          ar: "تجربة رقمية إبداعية من Fusion X.tech",
        },
        serviceImageCaption: { en: "Strategy meets creativity", ar: "الاستراتيجية تلتقي بالإبداع" },
        serviceAll: { en: "View all services", ar: "شوف كل خدماتنا" },
        servicePrevious: { en: "Previous", ar: "السابق" },
        serviceNext: { en: "Next", ar: "التالي" },
        serviceReadMore: { en: "Read More", ar: "اقرأ المزيد" },
        serviceSectionLabel: { en: "Services", ar: "الخدمات" },
        servicesEyebrow: { en: "WHAT WE DO", ar: "ماذا نقدم" },
        servicesHeading: { en: "Our Services", ar: "خدماتنا" },
        portfolioEyebrow: { en: "SELECTED WORK", ar: "أعمال مختارة" },
        portfolioHeading: { en: "Projects", ar: "مشاريعنا" },
        portfolioAll: { en: "View all projects", ar: "عرض كل المشاريع" },
        portfolioProjectLabel: { en: "View project", ar: "عرض المشروع" },
        clientsHeading: { en: "Our Clients", ar: "عملاؤنا" },
        clientsAll: { en: "View all Clients", ar: "عرض كل العملاء" },
        clientsCarousel: { en: "Show carousel", ar: "عرض متحرك" },
        clientsPrevious: { en: "Clients previous", ar: "العملاء السابقون" },
        clientsNext: { en: "Clients next", ar: "العملاء التاليون" },
        clientsPreviousTitle: { en: "Previous", ar: "السابق" },
        clientsNextTitle: { en: "Next", ar: "التالي" },
        processEyebrow: { en: "THE FUSION X.TECH METHOD", ar: "منهجية Fusion X.tech" },
        processTitle: {
          en: "Measure. Ideate. Experiment. Read. Scale.",
          ar: "حلّل. ابتكر. جرّب. قيّم. وسّع.",
        },
        processIntro: {
          en: "A clear, repeatable process for meaningful results.",
          ar: "خطوات واضحة ومتكررة لتحقيق نتائج مؤثرة.",
        },
        processStep1Title: { en: "Measure", ar: "حلّل" },
        processStep1Description: { en: "Find the opportunity.", ar: "نكتشف الفرص المناسبة." },
        processStep2Title: { en: "Ideate", ar: "ابتكر" },
        processStep2Description: { en: "Turn insight into ideas.", ar: "نحوّل الرؤى إلى أفكار." },
        processStep3Title: { en: "Experiment", ar: "جرّب" },
        processStep3Description: { en: "Create. Test. Iterate.", ar: "نبتكر، نختبر، ونطوّر." },
        processStep4Title: { en: "Read", ar: "حلّل النتائج" },
        processStep4Description: { en: "Learn what works.", ar: "نتعلّم مما يحقق النتائج." },
        processStep5Title: { en: "Scale", ar: "وسّع" },
        processStep5Description: { en: "Do more of what works.", ar: "نوسّع أثر ما ينجح." },
        bannerAlt: {
          en: "Fusion X.tech: creative ideas, powerful results, your brand amplified.",
          ar: "Fusion X.tech: أفكار إبداعية ونتائج قوية تعزز علامتك التجارية.",
        },
        bannerLabel: { en: "Fusion X.tech creative agency", ar: "وكالة Fusion X.tech الإبداعية" },
        serviceImage: { en: fusionLogo, ar: fusionLogo },
      },
      about: {
        seoTitle: {
          en: "About Fusion X.tech — Creative & Digital Agency",
          ar: "عن Fusion X.tech — وكالة إبداعية ورقمية",
        },
        seoDescription: {
          en: "Meet Fusion X.tech, a creative and digital agency combining strategy, design and technology to help brands grow.",
          ar: "تعرف على Fusion X.tech، وكالة إبداعية ورقمية تجمع الاستراتيجية والتصميم والتكنولوجيا لتنمية العلامات التجارية.",
        },
        heroImage: { en: fusionLogo, ar: fusionLogo },
        heroEyebrow: { en: "ABOUT FUSION X.TECH", ar: "عن Fusion X.tech" },
        heroTitle: { en: "We turn bold ideas", ar: "نحوّل الأفكار" },
        heroTitleAccent: { en: "into real impact.", ar: "الجريئة لتأثير حقيقي." },
        heroDescription: {
          en: "We are a creative and digital agency bringing strategy, design and technology together to help brands move forward.",
          ar: "إحنا وكالة إبداعية ورقمية بنجمع الاستراتيجية والتصميم والتكنولوجيا عشان نساعد العلامات التجارية تتقدم.",
        },
        heroCta: { en: "Get to know us", ar: "اعرفنا أكتر" },
        heroImageAlt: {
          en: "A creative digital project by Fusion X.tech",
          ar: "مشروع رقمي إبداعي من Fusion X.tech",
        },
        heroCaption: { en: "Ideas made visible", ar: "أفكار تتحول لواقع" },
        storyEyebrow: { en: "WHO WE ARE", ar: "مين إحنا" },
        storyTitle: {
          en: "A creative partner for brands ready to grow.",
          ar: "شريك إبداعي للعلامات اللي مستعدة تكبر.",
        },
        storyParagraph1: {
          en: "At Fusion X.tech, we bring creative services and digital solutions together under one roof. From brand identity and content to websites, campaigns and production, we help shape consistent experiences that connect with people.",
          ar: "في Fusion X.tech، بنجمع الخدمات الإبداعية والحلول الرقمية في مكان واحد. من الهوية والمحتوى للمواقع والحملات والإنتاج، بنساعد في بناء تجارب متناسقة تقرّب علامتك من جمهورها.",
        },
        storyParagraph2: {
          en: "Every project starts with understanding what makes your business different. Then we turn that understanding into clear ideas, thoughtful design and work made to support your next step.",
          ar: "كل مشروع بيبدأ بفهم اللي بيميّز شغلك. بعدها نحوّل الفهم لأفكار واضحة وتصميم مدروس وشغل يساعدك تاخد خطوتك الجاية.",
        },
        storyCta: { en: "Explore selected projects", ar: "شوف مشاريعنا" },
        valuesEyebrow: { en: "HOW WE THINK", ar: "طريقة تفكيرنا" },
        valuesTitle: { en: "Creative with purpose.", ar: "إبداع له هدف." },
        valuesDescription: {
          en: "Good work is more than a good-looking idea. It should make sense for your brand and move you toward a goal.",
          ar: "الشغل الحلو مش مجرد شكل جذاب؛ لازم يناسب علامتك ويقرّبك من هدفك.",
        },
        value1Title: { en: "Start with insight", ar: "نبدأ بالفهم" },
        value1Text: {
          en: "We learn about your brand, your audience and your goals before shaping the right direction.",
          ar: "نفهم علامتك وجمهورك وأهدافك قبل ما نحدد الاتجاه المناسب.",
        },
        value2Title: { en: "Make ideas matter", ar: "نحوّل الأفكار لتأثير" },
        value2Text: {
          en: "We bring creative thinking and practical strategy together to make every touchpoint count.",
          ar: "نجمع بين الإبداع والاستراتيجية العملية عشان كل نقطة تواصل يكون ليها أثر.",
        },
        value3Title: { en: "Build for progress", ar: "نبني للتطور" },
        value3Text: {
          en: "We test, learn and refine the work, keeping the focus on meaningful progress for your brand.",
          ar: "نختبر ونتعلم ونطوّر شغلنا، مع تركيزنا على تقدم حقيقي لعلامتك التجارية.",
        },
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
        approachMarkFirst: { en: "IDEAS", ar: "أفكار" },
        approachMarkSecond: { en: "IN MOTION", ar: "في حركة" },
      },
      services: {
        heroImage: { en: fusionLogo, ar: fusionLogo },
        seoTitle: { en: "Our Services | Fusion X.tech", ar: "خدماتنا | Fusion X.tech" },
        seoDescription: {
          en: "Discover creative and digital services from Fusion X.tech.",
          ar: "اكتشف الخدمات الإبداعية والرقمية من Fusion X.tech.",
        },
        heroAlt: {
          en: "A creative digital project by Fusion X.tech",
          ar: "مشروع رقمي إبداعي من Fusion X.tech",
        },
        heroEyebrow: { en: "IDEAS INTO IMPACT", ar: "من الفكرة للتأثير" },
        heroTitle: { en: "Services that", ar: "خدمات" },
        heroTitleAccent: { en: "move you forward.", ar: "تحرّكك لقدّام." },
        heroDescription: {
          en: "Creative thinking, smart strategy and standout execution — all working together for your brand.",
          ar: "إبداع واستراتيجية وتنفيذ مميز — كلهم مع بعض عشان علامتك التجارية.",
        },
        heroCta: { en: "Explore services", ar: "اكتشف خدماتنا" },
        listEyebrow: { en: "HOW WE HELP", ar: "إزاي نساعدك" },
        listHeading: { en: "What we do best", ar: "خدماتنا" },
        listDescription: {
          en: "Everything your brand needs to get noticed, connect and grow.",
          ar: "كل اللي علامتك محتاجاه عشان تتميز وتتواصل وتكبر.",
        },
        listCount: { en: "SERVICES", ar: "خدمة" },
        viewDetails: { en: "View details for", ar: "تفاصيل خدمة" },
        viewService: { en: "View service", ar: "تفاصيل الخدمة" },
      },
      projects: {
        seoTitle: { en: "Our Projects | Fusion X.tech", ar: "أعمالنا | Fusion X.tech" },
        seoDescription: {
          en: "Explore creative projects by Fusion X.tech.",
          ar: "اكتشف المشاريع الإبداعية من Fusion X.tech.",
        },
        heroEyebrow: { en: "SELECTED WORK", ar: "أعمال مختارة" },
        heroTitle: {
          en: "Every piece in our creative portfolio.",
          ar: "كل مشروع في محفظتنا الإبداعية.",
        },
        heroDescription: {
          en: "A selection of brands and ideas brought to life by Fusion X.tech.",
          ar: "مجموعة من العلامات والأفكار اللي حولناها لتجارب إبداعية في Fusion X.tech.",
        },
        featuredLabel: { en: "Featured projects", ar: "مشاريع مختارة" },
        allFilter: { en: "All", ar: "الكل" },
        openProject: { en: "View project", ar: "عرض المشروع" },
        visitProject: { en: "Visit project", ar: "زيارة المشروع" },
        galleryLabel: { en: "Project gallery", ar: "معرض المشاريع" },
        filterLabel: { en: "Filter projects by category", ar: "تصفية المشاريع حسب الفئة" },
        categoryAll: { en: "All", ar: "الكل" },
        categorySocialMedia: { en: "Social media", ar: "السوشيال ميديا" },
        categoryWebsites: { en: "Websites", ar: "المواقع" },
        categoryMobileApps: { en: "Apps & platforms", ar: "التطبيقات والمنصات" },
        categoryBranding: { en: "Branding & UI/UX", ar: "الهوية وتصميم UI/UX" },
        empty: {
          en: "No projects in this category yet.",
          ar: "لا توجد مشاريع في هذا التصنيف بعد.",
        },
      },
      contact: {
        heroImage: { en: fusionLogo, ar: fusionLogo },
        seoTitle: { en: "Contact Fusion X.tech", ar: "تواصل مع Fusion X.tech" },
        seoDescription: {
          en: "Tell us what you are looking to create and let's start a conversation.",
          ar: "احكيلنا عن فكرتك ويلا نبدأ نتكلم.",
        },
        heroAlt: {
          en: "Creative digital work by Fusion X.tech",
          ar: "أعمال رقمية إبداعية من Fusion X.tech",
        },
        heroEyebrow: { en: "LET'S MAKE SOMETHING GREAT", ar: "يلا نعمل حاجة مميزة" },
        heroTitle: { en: "Let's talk", ar: "خلّينا" },
        heroTitleAccent: { en: "about your next idea.", ar: "نتكلم عن فكرتك الجاية." },
        heroDescription: {
          en: "A new project, a big idea or just a question — we're ready to listen.",
          ar: "مشروع جديد، فكرة كبيرة أو حتى استفسار — إحنا جاهزين نسمعك.",
        },
        heroCta: { en: "Get in touch", ar: "تواصل معنا" },
        mapEyebrow: { en: "GOOD IDEAS TRAVEL", ar: "الأفكار الحلوة بتوصل" },
        mapTitle: { en: "One connected world.", ar: "عالم واحد يجمعنا." },
        mapDescription: {
          en: "Wherever you are, let's make something meaningful together.",
          ar: "أينما كنت، يلا نعمل حاجة ليها معنى سوا.",
        },
        mapCoordinate: { en: "CREATIVE CONNECTIONS — EVERYWHERE", ar: "تواصل إبداعي — في كل مكان" },
        contactSectionLabel: { en: "Contact details", ar: "بيانات التواصل" },
        connectFallback: { en: "Let's connect", ar: "خلّينا نتواصل" },
        phoneFallback: { en: "01222291024", ar: "01222291024" },
        whatsapp: { en: "WhatsApp", ar: "واتساب" },
      },
      serviceDetail: {
        notFound: { en: "Service not found", ar: "الخدمة غير موجودة" },
        browse: { en: "Browse services", ar: "تصفح الخدمات" },
        all: { en: "All services", ar: "كل الخدمات" },
        eyebrow: { en: "FUSION X.TECH / SERVICE", ar: "Fusion X.tech / خدماتنا" },
        cta: { en: "Start a project", ar: "ابدأ مشروعك" },
        benefitsEyebrow: { en: "THE RIGHT MOVE FOR YOUR BRAND", ar: "الخطوة الصح لعلامتك" },
        benefitsTitle: { en: "Make your next move count.", ar: "خلّي خطوتك الجاية تفرق." },
        overviewTitle: { en: "How we help", ar: "إزاي بنساعدك" },
        overviewDescription: {
          en: "We shape every project around your goals, your audience and the way your brand needs to grow. Our team brings the right creative and strategic thinking together to deliver work that feels distinctive and works hard for your business.",
          ar: "بنصمم كل مشروع على حسب أهدافك وجمهورك وطريقة نمو علامتك التجارية. فريقنا بيجمع الإبداع والتفكير الاستراتيجي عشان نقدم شغل مميز ويدعم نجاح أعمالك.",
        },
        relatedEyebrow: { en: "MORE WAYS TO GROW", ar: "خدمات تانية لتنمية شغلك" },
        relatedTitle: { en: "Explore our services", ar: "اكتشف خدماتنا" },
        contact: { en: "Talk to our team", ar: "اتكلم مع فريقنا" },
      },
      projectDetail: {
        notFound: { en: "Project not found", ar: "المشروع غير موجود" },
        browse: { en: "Browse projects", ar: "تصفح الأعمال" },
        all: { en: "All projects", ar: "كل المشاريع" },
        selected: { en: "SELECTED WORK", ar: "أعمال مختارة" },
        artwork: { en: "Project artwork", ar: "تصميم المشروع" },
        enlargePost: { en: "Enlarge", ar: "تكبير" },
        socialEyebrow: { en: "CONTENT THAT CONNECTS", ar: "محتوى يقرّب علامتك من جمهورها" },
        socialTitle: { en: "Our social media creative", ar: "بصمتنا على السوشيال ميديا" },
        metricsNote: {
          en: "Concept preview · sample metrics",
          ar: "معاينة تجريبية · أرقام افتراضية",
        },
        campaignEyebrow: { en: "CAMPAIGN SNAPSHOT", ar: "ملخص أداء الحملة" },
        campaignTitle: {
          en: "Creative work, measurable growth.",
          ar: "إبداع يصنع فرقًا قابلًا للقياس.",
        },
        campaignDescription: {
          en: "A sample view of reach and audience growth across the campaign.",
          ar: "نظرة تجريبية على الوصول ونمو الجمهور عبر الحملة.",
        },
        growthEyebrow: { en: "COMMUNITY GROWTH", ar: "نمو المجتمع" },
        growthTitle: { en: "One idea. Every platform.", ar: "فكرة واحدة.. وحضور على كل منصة." },
        filmEyebrow: { en: "CAMPAIGN FILM", ar: "فيديو الحملة" },
        filmTitle: { en: "The story, in motion.", ar: "الحكاية وهي بتتحرك." },
        galleryEyebrow: { en: "CAMPAIGN GALLERY", ar: "معرض الحملة" },
        galleryLabel: { en: "Social media image gallery", ar: "معرض صور السوشيال ميديا" },
        galleryTitle: {
          en: "Eight creative pieces. One visual identity.",
          ar: "8 تصميمات إبداعية.. بهوية واحدة.",
        },
        galleryDescription: {
          en: "Select any image to view it larger.",
          ar: "اضغط على أي صورة لمشاهدتها بحجم أكبر.",
        },
        campaignImage: { en: "Campaign image", ar: "صورة الحملة" },
        campaignDesign: { en: "Campaign design", ar: "تصميم الحملة" },
        campaignVideo: { en: "Campaign video", ar: "فيديو الحملة" },
        expandedDialog: { en: "Expanded project image", ar: "الصورة المكبرة للمشروع" },
        overviewEyebrow: { en: "PROJECT OVERVIEW", ar: "نبذة عن المشروع" },
        ctaEyebrow: { en: "HAVE A PROJECT IN MIND?", ar: "عندك مشروع في بالك؟" },
        ctaTitle: {
          en: "Let's create something worth remembering.",
          ar: "يلا نعمل حاجة تفضل في الذاكرة.",
        },
        cta: { en: "Start a project", ar: "ابدأ مشروعك" },
        closeImage: { en: "Close image", ar: "إغلاق الصورة" },
        expandedImage: { en: "Expanded project artwork", ar: "تصميم المشروع بحجم مكبر" },
        platformCreative: { en: "Platform-specific creative", ar: "محتوى مناسب لكل منصة" },
        visualIdentity: { en: "Consistent visual identity", ar: "هوية بصرية متناسقة" },
        performanceOptimization: {
          en: "Performance-led optimization",
          ar: "تحسين مستمر حسب الأداء",
        },
      },
      showcaseSeedVersion: 1,
    },
  },
};

const fusionTechServices: EditableItem[] = [
  {
    id: "web-app-development",
    name: { en: "Websites & Applications", ar: "المواقع والتطبيقات" },
    description: {
      en: "We design and build fast, responsive websites and web applications around your customers and business workflows.",
      ar: "نصمم ونطور مواقع وتطبيقات ويب سريعة ومتوافقة مع كل الأجهزة، حسب احتياجات عملك وعملائك.",
    },
    image: fusionLogo,
    link: "/services/web-app-development",
    enabled: true,
  },
  {
    id: "software-solutions",
    name: { en: "Custom Software Solutions", ar: "حلول برمجية مخصصة" },
    description: {
      en: "From internal tools to customer-facing platforms, we build software that makes everyday business operations simpler.",
      ar: "من أدوات إدارة العمل إلى المنصات الرقمية، نبني برمجيات تسهّل العمليات اليومية وتخدم أهداف شركتك.",
    },
    image: fusionLogo,
    link: "/services/software-solutions",
    enabled: true,
  },
  {
    id: "technology-consulting",
    name: { en: "Technology Consulting", ar: "الاستشارات التقنية" },
    description: {
      en: "Get practical technical guidance to choose the right tools, plan integrations and move your digital projects forward.",
      ar: "نساعدك في اختيار الأدوات المناسبة وتخطيط التكاملات واتخاذ قرارات تقنية عملية لتطوير مشروعاتك الرقمية.",
    },
    image: fusionLogo,
    link: "/services/technology-consulting",
    enabled: true,
  },
];

export const initialConfig: SiteConfig = {
  ...legacyConfig,
  brand: {
    name: "Fusion X.tech",
    accent: "#08bdf3",
    logo: fusionLogo,
    whiteLogo: fusionLogo,
  },
  hero: {
    title: { en: "Software & Digital Solutions", ar: "البرمجيات والحلول الرقمية" },
    subtitle: {
      en: "We build practical technology for ambitious businesses.",
      ar: "نبني حلولًا تقنية عملية للشركات الطموحة.",
    },
    video: heroVideo,
    poster: heroPoster,
  },
  sections: {
    services: true,
    portfolio: true,
    clients: true,
    process: true,
    banner: false,
    contact: true,
  },
  services: fusionTechServices,
  portfolio: importedPortfolio,
  clients: importedClientLogos,
  contact: {
    email: "",
    phone: "01064621943",
    whatsapp: "",
    address: { en: "", ar: "" },
  },
  content: {
    ...legacyConfig.content,
    about: {
      ...legacyConfig.content.about,
      seoTitle: {
        en: "About Fusion X.tech — Software & Digital Solutions",
        ar: "عن Fusion X.tech — البرمجيات والحلول الرقمية",
      },
      seoDescription: {
        en: "Fusion X.tech builds websites, applications and custom software for ambitious businesses.",
        ar: "تطور Fusion X.tech المواقع والتطبيقات والحلول البرمجية المخصصة للشركات الطموحة.",
      },
      heroEyebrow: { en: "ABOUT FUSION X.TECH", ar: "عن Fusion X.tech" },
      heroTitle: { en: "Technology that", ar: "تقنية" },
      heroTitleAccent: { en: "moves business forward.", ar: "تدفع أعمالك للأمام." },
      heroDescription: {
        en: "We turn business needs into clear, useful digital products and software.",
        ar: "نحوّل احتياجات الأعمال إلى منتجات رقمية وبرمجيات واضحة وعملية.",
      },
      heroImageAlt: { en: "Fusion X.tech logo", ar: "شعار Fusion X.tech" },
      storyTitle: {
        en: "A technology partner for your next step.",
        ar: "شريك تقني لخطوتك القادمة.",
      },
      storyParagraphs: [
        {
          en: "Fusion X.tech helps businesses plan and build digital tools that solve real problems. Our work spans websites, web applications, custom software and practical technology consulting.",
          ar: "تساعد Fusion X.tech الشركات على تخطيط وبناء أدوات رقمية تحل مشكلات حقيقية، من المواقع وتطبيقات الويب إلى البرمجيات المخصصة والاستشارات التقنية.",
        },
        {
          en: "We focus on understanding your goals first, then choosing a clear, maintainable solution that can grow with your business.",
          ar: "نبدأ بفهم أهدافك، ثم نختار حلًا واضحًا وقابلًا للتطوير ليستمر مع نمو أعمالك.",
        },
      ],
      valuesEyebrow: { en: "HOW WE WORK", ar: "منهجية عملنا" },
      valuesTitle: { en: "Built around real needs.", ar: "حلول تبدأ من احتياج حقيقي." },
      valuesDescription: {
        en: "Good technology is useful, reliable and designed around the people who use it.",
        ar: "التقنية الجيدة عملية وموثوقة ومصممة لتناسب الأشخاص الذين يستخدمونها.",
      },
      approachTitle: {
        en: "Understand. Design. Build. Improve.",
        ar: "نفهم. نصمم. نطور. ونحسّن.",
      },
      approachDescription: {
        en: "We work in clear steps: understand the challenge, shape the solution, build and test it, then improve based on what you need.",
        ar: "نعمل بخطوات واضحة: نفهم التحدي، ونصمم الحل، ثم نطوره ونختبره ونحسّنه وفق احتياجاتك.",
      },
      ctaEyebrow: { en: "LET'S BUILD WHAT'S NEXT", ar: "لنبدأ خطوتك القادمة" },
    },
    process: {
      ...legacyConfig.content.process,
      eyebrow: { en: "HOW WE BUILD", ar: "كيف نطوّر حلولك" },
      title: { en: "From challenge to working solution.", ar: "من التحدي إلى حل فعّال." },
      intro: {
        en: "A practical process keeps your project clear, focused and ready to grow.",
        ar: "منهج عملي يجعل مشروعك واضحًا ومركزًا وقابلًا للتطور.",
      },
      steps: [
        {
          name: { en: "Discover", ar: "نكتشف" },
          description: {
            en: "Understand your goals and requirements.",
            ar: "نفهم أهدافك ومتطلباتك.",
          },
        },
        {
          name: { en: "Plan", ar: "نخطط" },
          description: {
            en: "Choose the right approach and priorities.",
            ar: "نحدد النهج والأولويات المناسبة.",
          },
        },
        {
          name: { en: "Build", ar: "نطوّر" },
          description: {
            en: "Create and test the solution with care.",
            ar: "نبني الحل ونختبره بعناية.",
          },
        },
        {
          name: { en: "Launch", ar: "نطلق" },
          description: { en: "Prepare your product for real users.", ar: "نجهز منتجك للمستخدمين." },
        },
        {
          name: { en: "Improve", ar: "نحسّن" },
          description: {
            en: "Keep learning and refining over time.",
            ar: "نواصل التعلم والتحسين.",
          },
        },
      ],
    },
    seo: {
      ...legacyConfig.content.seo,
      siteTitle: { en: "Fusion X.tech", ar: "Fusion X.tech" },
      siteDescription: {
        en: "Websites, applications, custom software and technology consulting.",
        ar: "مواقع وتطبيقات وبرمجيات مخصصة واستشارات تقنية.",
      },
      homeTitle: { en: "Fusion X.tech", ar: "Fusion X.tech" },
      homeDescription: {
        en: "We build practical websites, applications and software solutions for ambitious businesses.",
        ar: "نبني مواقع وتطبيقات وحلولًا برمجية عملية للشركات الطموحة.",
      },
      servicesTitle: {
        en: "Technology Services | Fusion X.tech",
        ar: "خدمات التقنية | Fusion X.tech",
      },
      projectsTitle: { en: "Projects | Fusion X.tech", ar: "المشروعات | Fusion X.tech" },
      contactTitle: { en: "Contact Fusion X.tech", ar: "تواصل مع Fusion X.tech" },
    },
    pages: {
      ...legacyConfig.content.pages,
      common: {
        ...legacyConfig.content.pages.common,
        contactIntro: {
          en: "Tell us what you are looking to build. Your message will appear in our dashboard inbox.",
          ar: "احكيلنا عن الحل اللي محتاجه. رسالتك هتوصل مباشرة إلى صندوق الرسائل في لوحة التحكم.",
        },
        contactFallback: {
          en: "Use the form to send us a message.",
          ar: "استخدم النموذج لإرسال رسالة لفريقنا.",
        },
        contactFormNote: {
          en: "Your message is delivered securely to our dashboard inbox.",
          ar: "رسالتك بتوصل بأمان إلى صندوق الرسائل في لوحة التحكم.",
        },
        contactFormSuccess: {
          en: "Your message was received. We’ll be in touch soon.",
          ar: "وصلتنا رسالتك، وهنكون على تواصل معاك قريبًا.",
        },
        contactFormError: {
          en: "We couldn’t save your message. Please try again.",
          ar: "ما قدرناش نحفظ رسالتك. حاول مرة تانية.",
        },
      },
      home: {
        ...legacyConfig.content.pages.home,
        seoTitle: { en: "Fusion X.tech", ar: "Fusion X.tech" },
        seoDescription: {
          en: "We build practical websites, applications and software solutions for ambitious businesses.",
          ar: "نبني مواقع وتطبيقات وحلولًا برمجية عملية للشركات الطموحة.",
        },
        heroLabel: { en: "Fusion X.tech software solutions", ar: "حلول Fusion X.tech التقنية" },
        processStep1Title: { en: "Discover", ar: "نكتشف" },
        processStep1Description: {
          en: "Understand your goals and requirements.",
          ar: "نفهم أهدافك ومتطلباتك.",
        },
        processStep2Title: { en: "Plan", ar: "نخطط" },
        processStep2Description: {
          en: "Choose the right approach and priorities.",
          ar: "نحدد النهج والأولويات المناسبة.",
        },
        processStep3Title: { en: "Build", ar: "نطوّر" },
        processStep3Description: {
          en: "Create and test the solution with care.",
          ar: "نبني الحل ونختبره بعناية.",
        },
        processStep4Title: { en: "Launch", ar: "نطلق" },
        processStep4Description: {
          en: "Prepare your product for real users.",
          ar: "نجهز منتجك للمستخدمين.",
        },
        processStep5Title: { en: "Improve", ar: "نحسّن" },
        processStep5Description: {
          en: "Keep learning and refining over time.",
          ar: "نواصل التعلم والتحسين.",
        },
        serviceImageAlt: {
          en: "Fusion X.tech software solutions",
          ar: "حلول Fusion X.tech التقنية",
        },
        serviceImageCaption: {
          en: "Technology made practical",
          ar: "تقنية عملية تناسب أعمالك",
        },
        bannerAlt: {
          en: "Fusion X.tech software and digital solutions",
          ar: "حلول Fusion X.tech البرمجية والرقمية",
        },
        bannerLabel: { en: "Fusion X.tech", ar: "Fusion X.tech" },
        serviceIntroEyebrow: {
          en: "Technology built for real work",
          ar: "تقنية تخدم احتياجاتك",
        },
        serviceIntroTitle: { en: "Build smarter.", ar: "ابنِ بشكل أذكى." },
        serviceIntroAccent: { en: "Move forward.", ar: "وتقدّم بثقة." },
        serviceIntroDescription: {
          en: "From websites and applications to tailored software, we turn business needs into dependable digital solutions.",
          ar: "من المواقع والتطبيقات إلى البرمجيات المخصصة، نحوّل احتياجات أعمالك إلى حلول رقمية موثوقة.",
        },
        serviceIntroCount: { en: "technology services", ar: "خدمات تقنية" },
        processEyebrow: { en: "THE FUSION X.TECH APPROACH", ar: "منهجية Fusion X.tech" },
        processTitle: {
          en: "Technology made useful.",
          ar: "تقنية عملية تصنع فرقًا.",
        },
        processIntro: {
          en: "Clear steps, thoughtful engineering and solutions built around your goals.",
          ar: "خطوات واضحة وحلول تقنية مدروسة ومبنية حول أهدافك.",
        },
      },
      about: {
        ...legacyConfig.content.pages.about,
        heroImage: { en: fusionLogo, ar: fusionLogo },
        seoTitle: {
          en: "About Fusion X.tech — Software & Digital Solutions",
          ar: "عن Fusion X.tech — البرمجيات والحلول الرقمية",
        },
        seoDescription: {
          en: "Meet Fusion X.tech, a technology company building useful digital products and software.",
          ar: "تعرف على Fusion X.tech، شركة تقنية تطور منتجات رقمية وبرمجيات عملية.",
        },
        heroEyebrow: { en: "ABOUT FUSION X.TECH", ar: "عن Fusion X.tech" },
        heroTitle: { en: "Technology that", ar: "تقنية" },
        heroTitleAccent: { en: "moves business forward.", ar: "تدفع أعمالك للأمام." },
        heroDescription: {
          en: "We turn business needs into clear, useful digital products and software.",
          ar: "نحوّل احتياجات الأعمال إلى منتجات رقمية وبرمجيات واضحة وعملية.",
        },
        heroImageAlt: { en: "Fusion X.tech software solutions", ar: "حلول Fusion X.tech التقنية" },
        heroCaption: {
          en: "Digital solutions built with purpose",
          ar: "حلول رقمية مصممة لهدف واضح",
        },
        storyTitle: {
          en: "A technology partner for your next step.",
          ar: "شريك تقني لخطوتك القادمة.",
        },
        storyParagraph1: {
          en: "Fusion X.tech helps businesses plan and build digital tools that solve real problems. Our work spans websites, web applications, custom software and practical technology consulting.",
          ar: "تساعد Fusion X.tech الشركات على تخطيط وبناء أدوات رقمية تحل مشكلات حقيقية، من المواقع وتطبيقات الويب إلى البرمجيات المخصصة والاستشارات التقنية.",
        },
        storyParagraph2: {
          en: "We focus on understanding your goals first, then choosing a clear, maintainable solution that can grow with your business.",
          ar: "نبدأ بفهم أهدافك، ثم نختار حلًا واضحًا وقابلًا للتطوير ليستمر مع نمو أعمالك.",
        },
        storyCta: { en: "Tell us about your project", ar: "احكيلنا عن مشروعك" },
        valuesEyebrow: { en: "HOW WE WORK", ar: "منهجية عملنا" },
        valuesTitle: { en: "Built around real needs.", ar: "حلول تبدأ من احتياج حقيقي." },
        valuesDescription: {
          en: "Good technology is useful, reliable and designed around the people who use it.",
          ar: "التقنية الجيدة عملية وموثوقة ومصممة لتناسب الأشخاص الذين يستخدمونها.",
        },
        value1Title: { en: "Understand first", ar: "نفهم احتياجك أولًا" },
        value1Text: {
          en: "We learn about your goals and workflows before choosing a technical direction.",
          ar: "نتعرف على أهدافك وطريقة عملك قبل تحديد الاتجاه التقني المناسب.",
        },
        value2Title: { en: "Keep it practical", ar: "حلول عملية" },
        value2Text: {
          en: "We focus on clear, maintainable software that makes work easier.",
          ar: "نركز على برمجيات واضحة وقابلة للصيانة لتسهيل العمل.",
        },
        value3Title: { en: "Build for growth", ar: "نبني للتطور" },
        value3Text: {
          en: "We design solutions that can evolve as your business needs change.",
          ar: "نصمم حلولًا قابلة للتطور مع تغير احتياجات أعمالك.",
        },
      },
      services: {
        ...legacyConfig.content.pages.services,
        heroImage: { en: fusionLogo, ar: fusionLogo },
        seoTitle: {
          en: "Technology Services | Fusion X.tech",
          ar: "خدمات التقنية | Fusion X.tech",
        },
        seoDescription: {
          en: "Explore web and app development, custom software and technology consulting from Fusion X.tech.",
          ar: "اكتشف خدمات تطوير المواقع والتطبيقات والبرمجيات المخصصة والاستشارات التقنية من Fusion X.tech.",
        },
        heroAlt: {
          en: "Fusion X.tech technology services",
          ar: "خدمات Fusion X.tech التقنية",
        },
        heroEyebrow: { en: "TECHNOLOGY SERVICES", ar: "خدمات تقنية" },
        heroTitle: { en: "Technology for", ar: "تقنية" },
        heroTitleAccent: { en: "your next chapter.", ar: "لخطوتك القادمة." },
        heroDescription: {
          en: "Web and app development, custom software and practical technology guidance.",
          ar: "تطوير المواقع والتطبيقات والبرمجيات المخصصة والاستشارات التقنية العملية.",
        },
        listHeading: { en: "What we build", ar: "ما الذي نطوره" },
        listDescription: {
          en: "Digital products and software designed around your real needs.",
          ar: "منتجات رقمية وبرمجيات مصممة حول احتياجاتك الفعلية.",
        },
      },
      projects: {
        ...legacyConfig.content.pages.projects,
        seoTitle: { en: "Projects | Fusion X.tech", ar: "المشروعات | Fusion X.tech" },
        seoDescription: {
          en: "Explore digital products and software projects by Fusion X.tech.",
          ar: "اكتشف المنتجات الرقمية والمشروعات البرمجية من Fusion X.tech.",
        },
        heroEyebrow: { en: "OUR WORK", ar: "أعمالنا" },
        heroTitle: { en: "Digital products", ar: "منتجات رقمية" },
        heroDescription: {
          en: "Selected websites, applications and software solutions.",
          ar: "مجموعة من المواقع والتطبيقات والحلول البرمجية.",
        },
      },
      serviceDetail: {
        ...legacyConfig.content.pages.serviceDetail,
        eyebrow: { en: "FUSION X.TECH / SERVICE", ar: "Fusion X.tech / خدماتنا" },
        benefitsEyebrow: { en: "BUILT AROUND YOUR GOALS", ar: "مصممة حول أهدافك" },
        benefitsTitle: { en: "Make technology work for you.", ar: "خلّي التقنية تخدمك." },
        overviewTitle: { en: "How we help", ar: "كيف نساعدك" },
        relatedEyebrow: { en: "MORE TECHNOLOGY SERVICES", ar: "خدمات تقنية أخرى" },
        overviewDescription: {
          en: "We shape each solution around your goals, users and technical requirements, then build it to be clear, reliable and maintainable.",
          ar: "نصمم كل حل حول أهدافك ومستخدميك ومتطلباتك التقنية، ثم نطوره ليكون واضحًا وموثوقًا وقابلًا للصيانة.",
        },
      },
      contact: {
        ...legacyConfig.content.pages.contact,
        heroImage: { en: fusionLogo, ar: fusionLogo },
        seoTitle: { en: "Contact Fusion X.tech", ar: "تواصل مع Fusion X.tech" },
        seoDescription: {
          en: "Contact Fusion X.tech about a website, application or software project.",
          ar: "تواصل مع Fusion X.tech لمناقشة موقع أو تطبيق أو مشروع برمجي.",
        },
        heroAlt: { en: "Fusion X.tech logo", ar: "شعار Fusion X.tech" },
        heroEyebrow: { en: "GET IN TOUCH", ar: "تواصل معنا" },
        heroTitle: { en: "Let's talk", ar: "خلّينا" },
        heroTitleAccent: { en: "about your next build.", ar: "نتكلم عن مشروعك القادم." },
        heroDescription: {
          en: "Tell us what you need and our team will follow up with you.",
          ar: "احكيلنا عن احتياجك وفريقنا هيتواصل معاك.",
        },
        mapEyebrow: { en: "LET'S CONNECT", ar: "نتواصل معًا" },
        mapTitle: { en: "Your next idea starts here.", ar: "فكرتك القادمة تبدأ هنا." },
        mapDescription: {
          en: "Tell us about the website, application or software you need.",
          ar: "احكيلنا عن الموقع أو التطبيق أو الحل البرمجي اللي محتاجه.",
        },
        mapCoordinate: {
          en: "FUSION X.TECH · SOFTWARE & DIGITAL SOLUTIONS",
          ar: "Fusion X.tech · حلول برمجية ورقمية",
        },
        phoneFallback: { en: "01064621943", ar: "01064621943" },
      },
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
      const reelsVideos = item.reelsVideos ?? originalCase?.reelsVideos;
      const promoVideos = item.promoVideos ?? originalCase?.promoVideos;
      const showcase = item.socialMediaShowcase ?? originalCase?.socialMediaShowcase;
      return {
        ...(originalCase ?? {}),
        slug: item.id,
        name: item.name.en,
        localizedName: item.name,
        category,
        ...(extra ? { additionalCategories: extra } : {}),
        kind: "case-study" as const,
        ...(item.link ? { link: item.link } : {}),
        image: item.image,
        description: item.description,
        ...(gallery ? { imageGallery: gallery } : {}),
        ...(reelsVideos ? { reelsVideos } : {}),
        ...(promoVideos ? { promoVideos } : {}),
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

export function mergeSiteConfig(saved: SiteConfig): SiteConfig {
  const savedPages = saved.content?.pages;
  return {
    ...initialConfig,
    ...saved,
    brand: { ...initialConfig.brand, ...saved.brand },
    hero: {
      ...initialConfig.hero,
      ...saved.hero,
      title: { ...initialConfig.hero.title, ...saved.hero?.title },
      subtitle: { ...initialConfig.hero.subtitle, ...saved.hero?.subtitle },
      video: saved.hero?.video || initialConfig.hero.video,
      poster: saved.hero?.poster || initialConfig.hero.poster,
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
      pages: {
        common: { ...initialConfig.content.pages.common, ...savedPages?.common },
        home: { ...initialConfig.content.pages.home, ...savedPages?.home },
        about: { ...initialConfig.content.pages.about, ...savedPages?.about },
        services: { ...initialConfig.content.pages.services, ...savedPages?.services },
        projects: { ...initialConfig.content.pages.projects, ...savedPages?.projects },
        contact: { ...initialConfig.content.pages.contact, ...savedPages?.contact },
        serviceDetail: {
          ...initialConfig.content.pages.serviceDetail,
          ...savedPages?.serviceDetail,
        },
        projectDetail: {
          ...initialConfig.content.pages.projectDetail,
          ...savedPages?.projectDetail,
        },
      },
    },
    services: Array.isArray(saved.services) ? saved.services : initialConfig.services,
    portfolio: Array.isArray(saved.portfolio) ? saved.portfolio : initialConfig.portfolio,
    clients: Array.isArray(saved.clients) ? saved.clients : initialConfig.clients,
  };
}

export function getPageCopy(
  config: SiteConfig,
  page: keyof PageContent,
  key: string,
  language: "en" | "ar",
) {
  return config.content.pages[page][key]?.[language] ?? "";
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
    serverConfig ? mergeSiteConfig(serverConfig) : initialConfig,
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
      setConfigState(mergeSiteConfig(saved));
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
      if (event.key !== "fusionxtech-cms-revision") return;
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
        setConfigState(mergeSiteConfig(next));
        setLoadError(null);
        setReady(true);
        try {
          localStorage.setItem("fusionxtech-cms-revision", String(Date.now()));
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
          localStorage.setItem("fusionxtech-cms-revision", String(Date.now()));
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
