import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Eye,
  FileText,
  Globe2,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Monitor,
  Palette,
  Plus,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import type { EditableItem, SiteConfig } from "@/lib/cms";
import { initialConfig, useCMS } from "@/lib/cms";
import adminCss from "@/admin.css?url";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin Studio — Viral Zoom" }],
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
});
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD_SHA256 = "798072346d8b1ad67a2d8787644096969098861e9d72f973fb13b465c56680f3";
type Lang = "en" | "ar";
type Section = "overview" | "home" | "services" | "portfolio" | "clients" | "settings";
const labels: Record<
  Lang,
  Record<
    | Section
    | "signIn"
    | "dashboard"
    | "content"
    | "library"
    | "save"
    | "preview"
    | "logout"
    | "search"
    | "overview"
    | "welcome"
    | "hero"
    | "sections"
    | "brand"
    | "videoUrl"
    | "title"
    | "subtitle"
    | "description"
    | "imageUrl"
    | "add"
    | "items"
    | "email"
    | "phone"
    | "whatsapp"
    | "address"
    | "show"
    | "hide"
    | "edit"
    | "delete"
    | "back"
    | "theme"
    | "sites"
    | "quickActions"
    | "recent"
    | "saveHint"
    | "reset"
    | "saved"
    | "media"
    | "password"
    | "loginHint"
    | "contact"
    | "upload"
    | "name"
    | "serviceCount"
    | "projectCount"
    | "clientCount"
    | "siteReady"
    | "localNote"
    | "empty"
    | "copy"
    | "arabic"
    | "english"
    | "viewSite"
    | "confirmReset"
    | "newItem"
    | "logo"
    | "accent"
    | "sectionsHint"
    | "secureNote"
    | "signingIn"
    | "invalidLogin"
    | "chooseItem"
    | "editItem"
    | "searchPlaceholder"
    | "heroPreview"
    | "langSwitch"
    | "saveOk"
    | "basicSettings"
    | "urlTip"
    | "enabled"
    | "itemName"
    | "mobile"
    | "contentControl"
    | "general"
    | "management"
    | "allEdits",
    string
  >
> = {
  en: {
    overview: "Overview",
    home: "Homepage",
    services: "Services",
    portfolio: "Portfolio",
    clients: "Clients",
    settings: "Settings",
    signIn: "Sign in",
    dashboard: "Control room",
    content: "Content",
    library: "Media library",
    save: "Save changes",
    preview: "View website",
    logout: "Sign out",
    search: "Search",
    welcome: "Your website, under control.",
    hero: "Hero section",
    sections: "Homepage sections",
    brand: "Brand identity",
    videoUrl: "Background video URL",
    title: "Headline",
    subtitle: "Supporting text",
    description: "Description",
    imageUrl: "Image URL",
    add: "Add new",
    items: "items",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    address: "Address",
    show: "Visible",
    hide: "Hidden",
    edit: "Edit",
    delete: "Remove",
    back: "Back to site",
    theme: "Light & dark",
    sites: "SITE MANAGEMENT",
    quickActions: "Quick actions",
    recent: "Recently updated",
    saveHint: "Changes save to this browser and show on this device.",
    reset: "Reset all content",
    saved: "Saved",
    media: "Media & visuals",
    password: "Password",
    loginHint: "Use your administrator credentials to continue.",
    contact: "Contact details",
    upload: "Upload image",
    name: "Name",
    serviceCount: "Services",
    projectCount: "Projects",
    clientCount: "Clients",
    siteReady: "Site status",
    localNote: "Demo data",
    empty: "No entries yet",
    copy: "Bilingual content",
    arabic: "Arabic",
    english: "English",
    viewSite: "Open website",
    confirmReset: "Reset all dashboard content to the original site values?",
    newItem: "New item",
    logo: "Primary logo URL",
    accent: "Brand accent color",
    sectionsHint:
      "Turn homepage blocks on or off. Changes reflect on the public-facing pages in this browser.",
    secureNote:
      "This demo sign-in is front-end only. Connect a server-side authentication provider before publishing publicly.",
    signingIn: "Checking…",
    invalidLogin: "Check the email and password and try again.",
    chooseItem: "Choose a record to edit.",
    editItem: "Edit item",
    searchPlaceholder: "Search sections…",
    heroPreview: "Showreel control",
    langSwitch: "Language",
    saveOk: "Changes saved successfully",
    basicSettings: "Basic settings",
    urlTip: "Tip: upload large video files to a media host and paste their direct URL here.",
    enabled: "Published",
    itemName: "Item name",
    mobile: "Mobile-friendly",
    contentControl: "Content management",
    general: "General",
    management: "MANAGEMENT",
    allEdits: "Everyday site controls",
  },
  ar: {
    overview: "نظرة عامة",
    home: "الرئيسية",
    services: "الخدمات",
    portfolio: "الأعمال",
    clients: "العملاء",
    settings: "الإعدادات",
    signIn: "تسجيل الدخول",
    dashboard: "لوحة التحكم",
    content: "المحتوى",
    library: "مكتبة الوسائط",
    save: "حفظ التغييرات",
    preview: "معاينة الموقع",
    logout: "تسجيل الخروج",
    search: "بحث",
    welcome: "موقعك… تحت سيطرتك.",
    hero: "القسم الرئيسي",
    sections: "أقسام الصفحة الرئيسية",
    brand: "هوية العلامة",
    videoUrl: "رابط فيديو الخلفية",
    title: "العنوان الرئيسي",
    subtitle: "النص التعريفي",
    description: "الوصف",
    imageUrl: "رابط الصورة",
    add: "إضافة عنصر",
    items: "عناصر",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    whatsapp: "واتساب",
    address: "العنوان",
    show: "ظاهر",
    hide: "مخفي",
    edit: "تعديل",
    delete: "حذف",
    back: "العودة للموقع",
    theme: "فاتح وداكن",
    sites: "إدارة الموقع",
    quickActions: "إجراءات سريعة",
    recent: "آخر التعديلات",
    saveHint: "تُحفظ التعديلات في هذا المتصفح وتظهر على هذا الجهاز.",
    reset: "استعادة المحتوى الأصلي",
    saved: "محفوظ",
    media: "الوسائط والصور",
    password: "كلمة المرور",
    loginHint: "أدخل بيانات المدير للمتابعة.",
    contact: "بيانات التواصل",
    upload: "رفع صورة",
    name: "الاسم",
    serviceCount: "الخدمات",
    projectCount: "المشروعات",
    clientCount: "العملاء",
    siteReady: "حالة الموقع",
    localNote: "بيانات تجريبية",
    empty: "لا توجد عناصر بعد",
    copy: "محتوى ثنائي اللغة",
    arabic: "العربية",
    english: "الإنجليزية",
    viewSite: "فتح الموقع",
    confirmReset: "هل تريد استعادة المحتوى الأصلي للموقع؟",
    newItem: "عنصر جديد",
    logo: "رابط الشعار الأساسي",
    accent: "اللون المميز للعلامة",
    sectionsHint: "أظهر أو أخفِ أقسام الصفحة الرئيسية. تظهر التعديلات على الموقع في هذا المتصفح.",
    secureNote:
      "تسجيل الدخول في هذه النسخة تجريبي من جهة الواجهة فقط. أضف مصادقة آمنة على الخادم قبل النشر العام.",
    signingIn: "جارٍ التحقق…",
    invalidLogin: "تحقق من البريد الإلكتروني وكلمة المرور.",
    chooseItem: "اختر عنصرًا لتعديله.",
    editItem: "تعديل العنصر",
    searchPlaceholder: "ابحث في الأقسام…",
    heroPreview: "التحكم بفيديو الواجهة",
    langSwitch: "اللغة",
    saveOk: "تم حفظ التغييرات بنجاح",
    basicSettings: "الإعدادات الأساسية",
    urlTip: "نصيحة: ارفع الفيديوهات الكبيرة إلى استضافة وسائط والصق رابطها المباشر هنا.",
    enabled: "منشور",
    itemName: "اسم العنصر",
    mobile: "متوافق مع الجوال",
    contentControl: "إدارة المحتوى",
    general: "عام",
    management: "الإدارة",
    allEdits: "تحكم كامل بالموقع",
  },
};
const menuItems: { id: Section; icon: typeof LayoutDashboard }[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "home", icon: Monitor },
  { id: "services", icon: Sparkles },
  { id: "portfolio", icon: ImagePlus },
  { id: "clients", icon: Users },
  { id: "settings", icon: Settings2 },
];

function AdminPage() {
  const cms = useCMS();
  const [lang, setLang] = useState<Lang>("ar");
  const t = labels[lang];
  const rtl = lang === "ar";
  const [authed, setAuthed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("vz-admin-session") === "ok",
  );
  const [loginEmail, setLoginEmail] = useState(ADMIN_EMAIL);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [draft, setDraft] = useState<SiteConfig>(cms.config);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setDraft(cms.config), [cms.config]);
  const sectionTitle = t[section];
  const count = useMemo(
    () => ({
      services: draft.services.length,
      portfolio: draft.portfolio.length,
      clients: draft.clients.length,
    }),
    [draft],
  );
  const update = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) =>
    setDraft((old) => ({ ...old, [key]: value }));
  const doLogin = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setLoginError("");
    try {
      const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(loginPassword));
      const digest = Array.from(new Uint8Array(bytes))
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
      if (loginEmail.trim().toLowerCase() === ADMIN_EMAIL && digest === ADMIN_PASSWORD_SHA256) {
        sessionStorage.setItem("vz-admin-session", "ok");
        setAuthed(true);
      } else setLoginError(t.invalidLogin);
    } catch {
      setLoginError(t.invalidLogin);
    } finally {
      setBusy(false);
    }
  };
  const save = () => {
    cms.setConfig(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };
  const updateRecord = (
    group: "services" | "portfolio" | "clients",
    id: string,
    change: Partial<EditableItem>,
  ) =>
    update(
      group,
      draft[group].map((item) => (item.id === id ? { ...item, ...change } : item)),
    );
  const addRecord = (group: "services" | "portfolio" | "clients") => {
    const id = `${group}-${Date.now()}`;
    const fresh: EditableItem = {
      id,
      name: { en: "New item", ar: "عنصر جديد" },
      description: { en: "", ar: "" },
      image: "",
      enabled: true,
    };
    update(group, [fresh, ...draft[group]]);
    setSelectedId(id);
  };
  const removeRecord = (group: "services" | "portfolio" | "clients", id: string) => {
    if (!window.confirm(lang === "ar" ? "حذف هذا العنصر؟" : "Remove this item?")) return;
    update(
      group,
      draft[group].filter((item) => item.id !== id),
    );
    if (selectedId === id) setSelectedId("");
  };
  const uploadImage = (event: ChangeEvent<HTMLInputElement>, done: (url: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      window.alert(
        lang === "ar"
          ? "الحد الأقصى للصورة 2 ميجابايت. استخدم رابط صورة مستضافة للملفات الأكبر."
          : "Images must be under 2 MB. Use a hosted image URL for larger files.",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => done(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  const doReset = () => {
    if (!window.confirm(t.confirmReset)) return;
    cms.reset();
    setDraft(initialConfig);
  };

  if (!authed)
    return (
      <div className="vz-login" dir={rtl ? "rtl" : "ltr"}>
        <div className="vz-login-visual">
          <a href="/" className="vz-mark" aria-label="Viral Zoom">
            VZ<span>®</span>
          </a>
          <div className="vz-visual-copy">
            <span className="vz-kicker">CREATIVE × CONTROL</span>
            <h1>
              VIRAL
              <br />
              <i>ZOOM</i>
            </h1>
            <p>
              {lang === "ar"
                ? "كل تفاصيل علامتك التجارية، في مساحة واحدة."
                : "Every detail of your brand, in one place."}
            </p>
          </div>
          <div className="vz-visual-foot">
            <span>EST. 2025</span>
            <span>CAIRO · EVERYWHERE</span>
          </div>
          <div className="vz-visual-orb" />
        </div>
        <section className="vz-login-panel">
          <div className="vz-login-head">
            <a className="vz-wordmark" href="/">
              VIRAL ZOOM<span>®</span>
            </a>
            <button className="vz-lang-button" onClick={() => setLang(rtl ? "en" : "ar")}>
              <Globe2 size={15} />
              {rtl ? "EN" : "عربي"}
            </button>
          </div>
          <form className="vz-login-form" onSubmit={doLogin}>
            <span className="vz-overline">{rtl ? "مساحة المدير" : "ADMINISTRATOR ACCESS"}</span>
            <h2>{t.signIn}</h2>
            <p>{t.loginHint}</p>
            <label>
              {t.email}
              <input
                autoComplete="username"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </label>
            <label>
              {t.password}
              <input
                autoComplete="current-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </label>
            {loginError && <div className="vz-error">{loginError}</div>}
            <button className="vz-primary-button" disabled={busy}>
              {busy ? t.signingIn : t.signIn}
              <ArrowUpRight size={16} />
            </button>
            <div className="vz-secure-note">
              <ShieldCheck size={16} />
              <span>{t.secureNote}</span>
            </div>
          </form>
          <div className="vz-login-bottom">
            <span>© VIRAL ZOOM</span>
            <a href="/">
              {t.back}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </section>
      </div>
    );

  const side = (
    <aside className={`vz-sidebar${mobileOpen ? " is-open" : ""}`}>
      <div className="vz-sidebar-brand">
        <a className="vz-brand-lockup" href="/">
          <span className="vz-brand-icon">VZ</span>
          <span>
            <b>VIRAL ZOOM</b>
            <small>CONTROL STUDIO</small>
          </span>
        </a>
        <button className="vz-mobile-close" onClick={() => setMobileOpen(false)}>
          <X size={19} />
        </button>
      </div>
      <div className="vz-workspace">
        <span className="vz-workspace-icon">V</span>
        <span>
          <b>{draft.brand.name}</b>
          <small>{lang === "ar" ? "لوحة إدارة الموقع" : "Website workspace"}</small>
        </span>
        <ChevronDown size={14} />
      </div>
      <div className="vz-nav-label">{t.management}</div>
      <nav>
        {menuItems.map(({ id, icon: Icon }) => (
          <button
            key={id}
            className={`vz-nav-item${section === id ? " active" : ""}`}
            onClick={() => {
              setSection(id);
              setSelectedId("");
              setMobileOpen(false);
            }}
          >
            <Icon size={17} />
            <span>{t[id]}</span>
            {id === "services" && <em>{count.services}</em>}
          </button>
        ))}
      </nav>
      <div className="vz-sidebar-bottom">
        <div className="vz-help">
          <CircleHelp size={17} />
          <span>
            <b>{lang === "ar" ? "تحتاج مساعدة؟" : "Need a hand?"}</b>
            <small>{lang === "ar" ? "فريقنا هنا لمساعدتك" : "We're here to help"}</small>
          </span>
          <ArrowUpRight size={14} />
        </div>
        <div className="vz-user">
          <span className="vz-avatar">A</span>
          <span>
            <b>Administrator</b>
            <small>admin@admin.com</small>
          </span>
          <button
            aria-label={t.logout}
            title={t.logout}
            onClick={() => {
              sessionStorage.removeItem("vz-admin-session");
              setAuthed(false);
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder = "",
    area = false,
  ) => (
    <label className="vz-field">
      <span>{label}</span>
      {area ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </label>
  );
  const bilingualFields = (
    title: string,
    value: { en: string; ar: string },
    onChange: (v: { en: string; ar: string }) => void,
    multiline = false,
  ) => (
    <div className="vz-bilingual">
      <div className="vz-bilingual-head">
        <span>{title}</span>
        <div>
          <i>EN</i>
          <i>عربي</i>
        </div>
      </div>
      <div className="vz-bilingual-grid">
        {field(t.english, value.en, (v) => onChange({ ...value, en: v }), "", multiline)}
        {field(t.arabic, value.ar, (v) => onChange({ ...value, ar: v }), "", multiline)}
      </div>
    </div>
  );
  const mediaInput = (label: string, value: string, onChange: (v: string) => void) => (
    <div className="vz-field">
      <span>{label}</span>
      <div className="vz-media-input">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
        <label title={t.upload}>
          <Upload size={16} />
          <input type="file" accept="image/*" onChange={(e) => uploadImage(e, onChange)} />
        </label>
      </div>
      {value && (
        <div className="vz-image-preview">
          <img src={value} alt="" />
          <button onClick={() => onChange("")}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
  const sectionSwitches = (Object.keys(draft.sections) as (keyof SiteConfig["sections"])[]).map(
    (key) => {
      const value = draft.sections[key];
      const translated: Record<string, string> = {
        services: t.services,
        portfolio: t.portfolio,
        clients: t.clients,
        process: lang === "ar" ? "خطوات العمل" : "Process",
        banner: lang === "ar" ? "البانر" : "Banner",
        contact: t.contact,
      };
      return (
        <div className="vz-section-toggle" key={key}>
          <span className="vz-switch-icon">
            <LayoutDashboard size={16} />
          </span>
          <span>
            <b>{translated[key]}</b>
            <small>{value ? t.show : t.hide}</small>
          </span>
          <button
            role="switch"
            aria-checked={value}
            className={`vz-switch${value ? " on" : ""}`}
            onClick={() => update("sections", { ...draft.sections, [key]: !value })}
          >
            <i />
          </button>
        </div>
      );
    },
  );
  const editorGroup =
    section === "services" ? "services" : section === "portfolio" ? "portfolio" : "clients";
  const records =
    section === "services" || section === "portfolio" || section === "clients"
      ? draft[editorGroup]
      : [];
  const filtered = records.filter((x) =>
    `${x.name.en} ${x.name.ar}`.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = records.find((x) => x.id === selectedId);
  const listEditor = (group: "services" | "portfolio" | "clients") => (
    <div className="vz-list-layout">
      <div className="vz-record-list">
        <div className="vz-record-toolbar">
          <label className="vz-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </label>
          <button className="vz-small-add" onClick={() => addRecord(group)}>
            <Plus size={15} />
            {t.add}
          </button>
        </div>
        <div className="vz-record-items">
          {filtered.map((item) => (
            <button
              className={`vz-record${selectedId === item.id ? " selected" : ""}`}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="vz-record-thumb">
                {item.image ? <img src={item.image} alt="" /> : <ImagePlus size={18} />}
              </span>
              <span className="vz-record-copy">
                <b>{item.name[lang] || item.name.en || t.newItem}</b>
                <small>{item.enabled ? t.enabled : t.hide}</small>
              </span>
              <ArrowLeft size={15} />
            </button>
          ))}
          {!filtered.length && <div className="vz-empty">{t.empty}</div>}
        </div>
      </div>
      <div className="vz-record-editor">
        {selected ? (
          <>
            <div className="vz-editor-head">
              <div>
                <span className="vz-overline">{t.contentControl}</span>
                <h3>{selected.name[lang] || t.editItem}</h3>
              </div>
              <button
                className="vz-icon-button danger"
                title={t.delete}
                onClick={() => removeRecord(group, selected.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="vz-form-stack">
              {bilingualFields(t.itemName, selected.name, (v) =>
                updateRecord(group, selected.id, { name: v }),
              )}
              {bilingualFields(
                t.description,
                selected.description,
                (v) => updateRecord(group, selected.id, { description: v }),
                true,
              )}
              {mediaInput(t.imageUrl, selected.image, (v) =>
                updateRecord(group, selected.id, { image: v }),
              )}
              {field(
                lang === "ar" ? "الرابط" : "Link",
                selected.link ?? "",
                (v) => updateRecord(group, selected.id, { link: v }),
                "https://…",
              )}
              <div className="vz-section-toggle compact">
                <span>
                  <b>{t.enabled}</b>
                </span>
                <button
                  className={`vz-switch${selected.enabled ? " on" : ""}`}
                  role="switch"
                  aria-checked={selected.enabled}
                  onClick={() => updateRecord(group, selected.id, { enabled: !selected.enabled })}
                >
                  <i />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="vz-editor-empty">
            <ImagePlus size={30} />
            <p>{t.chooseItem}</p>
          </div>
        )}
      </div>
    </div>
  );

  let body: ReactNode;
  if (section === "overview")
    body = (
      <>
        <div className="vz-welcome">
          <div>
            <span className="vz-overline">
              {lang === "ar" ? "مركز إدارة المحتوى" : "CONTENT CONTROL CENTER"}
            </span>
            <h2>{t.welcome}</h2>
            <p>
              {lang === "ar"
                ? "نظرة سريعة على نشاط موقعك ومحتواه."
                : "A quick look at your website and content."}
            </p>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="vz-outline-button">
            <Eye size={15} />
            {t.preview}
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="vz-stat-grid">
          <Stat
            icon={<Sparkles />}
            label={t.serviceCount}
            value={count.services}
            note={lang === "ar" ? "خدمات متاحة" : "Available services"}
          />
          <Stat
            icon={<ImagePlus />}
            label={t.projectCount}
            value={count.portfolio}
            note={lang === "ar" ? "عمل في المعرض" : "Portfolio entries"}
          />
          <Stat
            icon={<Users />}
            label={t.clientCount}
            value={count.clients}
            note={lang === "ar" ? "علامة في الشريط" : "Brands in carousel"}
          />
          <Stat
            icon={<Globe2 />}
            label={t.siteReady}
            value={lang === "ar" ? "محلي" : "Local"}
            note={lang === "ar" ? "على هذا المتصفح" : "This browser only"}
            green
          />
        </div>
        <div className="vz-overview-grid">
          <div className="vz-panel">
            <PanelTitle icon={<BarChart3 />} title={t.sections} detail={t.sectionsHint} />
            <div className="vz-toggle-list">{sectionSwitches}</div>
          </div>
          <div className="vz-panel vz-quick-panel">
            <PanelTitle
              icon={<ArrowUpRight />}
              title={t.quickActions}
              detail={
                lang === "ar" ? "اختصارات للمحتوى الأكثر استخدامًا" : "Shortcuts to everyday tasks"
              }
            />
            <div className="vz-quick-list">
              <QuickAction
                icon={<Clapperboard />}
                title={t.hero}
                detail={
                  lang === "ar" ? "عدّل فيديو ورسالة الواجهة" : "Change your hero video and copy"
                }
                onClick={() => setSection("home")}
              />
              <QuickAction
                icon={<Sparkles />}
                title={t.services}
                detail={`${count.services} ${t.items}`}
                onClick={() => setSection("services")}
              />
              <QuickAction
                icon={<FileText />}
                title={t.portfolio}
                detail={`${count.portfolio} ${t.items}`}
                onClick={() => setSection("portfolio")}
              />
              <QuickAction
                icon={<Palette />}
                title={t.brand}
                detail={lang === "ar" ? "شعار وألوان العلامة" : "Logos and brand colour"}
                onClick={() => setSection("settings")}
              />
            </div>
          </div>
        </div>
        <div className="vz-panel vz-bottom-panel">
          <PanelTitle icon={<ShieldCheck />} title={t.recent} detail={t.saveHint} />
          <div className="vz-activity">
            <span className="vz-activity-dot" />
            <div>
              <b>
                {lang === "ar" ? "لوحة التحكم جاهزة للتخصيص" : "Dashboard is ready to customize"}
              </b>
              <small>
                {lang === "ar"
                  ? "احفظ التغييرات ثم افتح الموقع في هذا المتصفح لمشاهدتها"
                  : "Save changes, then open the website in this browser to see them"}
              </small>
            </div>
            <span>{lang === "ar" ? "الآن" : "Now"}</span>
          </div>
        </div>
      </>
    );
  else if (section === "home")
    body = (
      <>
        <PageIntro
          eyebrow="01 / HOMEPAGE"
          title={t.home}
          desc={
            lang === "ar"
              ? "تحكم في فيديو الواجهة والعناوين والأقسام الظاهرة."
              : "Manage the showreel, headline and visible homepage blocks."
          }
        />
        <div className="vz-two-columns">
          <div className="vz-panel">
            <PanelTitle icon={<Video />} title={t.hero} detail={t.heroPreview} />
            <div className="vz-form-stack">
              {bilingualFields(t.title, draft.hero.title, (v) =>
                update("hero", { ...draft.hero, title: v }),
              )}
              {bilingualFields(
                t.subtitle,
                draft.hero.subtitle,
                (v) => update("hero", { ...draft.hero, subtitle: v }),
                true,
              )}
              {field(
                t.videoUrl,
                draft.hero.video,
                (v) => update("hero", { ...draft.hero, video: v }),
                "https://…/showreel.mp4",
              )}
              {field(
                lang === "ar" ? "رابط صورة الغلاف" : "Poster image URL",
                draft.hero.poster,
                (v) => update("hero", { ...draft.hero, poster: v }),
                "https://…",
              )}
            </div>
            <p className="vz-field-hint">
              <Video size={15} />
              {t.urlTip}
            </p>
          </div>
          <div className="vz-panel">
            <PanelTitle icon={<LayoutDashboard />} title={t.sections} detail={t.sectionsHint} />
            <div className="vz-toggle-list">{sectionSwitches}</div>
          </div>
        </div>
        <div className="vz-panel">
          <PanelTitle
            icon={<Eye />}
            title={t.heroPreview}
            detail={
              lang === "ar" ? "معاينة العنوان في اللغتين" : "Preview your copy in both languages"
            }
          />
          <div className="vz-hero-preview">
            <div>
              <span>ENGLISH</span>
              <h2>{draft.hero.title.en}</h2>
              <p>{draft.hero.subtitle.en}</p>
            </div>
            <div dir="rtl">
              <span>العربية</span>
              <h2>{draft.hero.title.ar}</h2>
              <p>{draft.hero.subtitle.ar}</p>
            </div>
          </div>
        </div>
      </>
    );
  else if (section === "services" || section === "portfolio" || section === "clients")
    body = (
      <>
        <PageIntro
          eyebrow={`0${section === "services" ? 2 : section === "portfolio" ? 3 : 4} / CONTENT`}
          title={sectionTitle}
          desc={
            lang === "ar"
              ? `أدر العناصر والصور والوصف باللغتين. لديك ${records.length} ${t.items}.`
              : `Manage bilingual content, imagery and visibility. ${records.length} ${t.items}.`
          }
        />
        {listEditor(editorGroup)}
      </>
    );
  else
    body = (
      <>
        <PageIntro
          eyebrow="06 / SETTINGS"
          title={t.settings}
          desc={
            lang === "ar"
              ? "اضبط هوية العلامة التجارية ومعلومات التواصل."
              : "Update your brand identity and contact details."
          }
        />
        <div className="vz-two-columns">
          <div className="vz-panel">
            <PanelTitle
              icon={<Palette />}
              title={t.brand}
              detail={
                lang === "ar" ? "المظهر الأساسي للموقع" : "The visual signature of your website"
              }
            />
            <div className="vz-form-stack">
              {field(t.name, draft.brand.name, (v) => update("brand", { ...draft.brand, name: v }))}
              {field(
                t.accent,
                draft.brand.accent,
                (v) => update("brand", { ...draft.brand, accent: v }),
                "#69499e",
              )}
              <div className="vz-colour-row">
                <span style={{ background: draft.brand.accent }} />
                <span>#69499E</span>
                <small>VIRAL ZOOM · AMETHYST</small>
              </div>
              {mediaInput(t.logo, draft.brand.logo, (v) =>
                update("brand", { ...draft.brand, logo: v }),
              )}
              {mediaInput(
                lang === "ar" ? "رابط الشعار للخلفية الداكنة" : "White logo URL",
                draft.brand.whiteLogo,
                (v) => update("brand", { ...draft.brand, whiteLogo: v }),
              )}
            </div>
          </div>
          <div className="vz-panel">
            <PanelTitle
              icon={<Globe2 />}
              title={t.contact}
              detail={
                lang === "ar"
                  ? "بيانات التواصل الظاهرة على موقعك"
                  : "Contact details shown across the website"
              }
            />
            <div className="vz-form-stack">
              {field(
                t.email,
                draft.contact.email,
                (v) => update("contact", { ...draft.contact, email: v }),
                "hello@example.com",
              )}
              {field(
                t.phone,
                draft.contact.phone,
                (v) => update("contact", { ...draft.contact, phone: v }),
                "+20 …",
              )}
              {field(
                t.whatsapp,
                draft.contact.whatsapp,
                (v) => update("contact", { ...draft.contact, whatsapp: v }),
                "https://wa.me/…",
              )}
              {bilingualFields(t.address, draft.contact.address, (v) =>
                update("contact", { ...draft.contact, address: v }),
              )}
            </div>
          </div>
        </div>
        <div className="vz-panel vz-danger-panel">
          <PanelTitle
            icon={<Settings2 />}
            title={t.basicSettings}
            detail={
              lang === "ar"
                ? "يمكن استعادة النسخة الأصلية متى شئت"
                : "Restore the original values at any time"
            }
          />
          <button className="vz-reset-button" onClick={doReset}>
            <Trash2 size={15} />
            {t.reset}
          </button>
        </div>
      </>
    );

  return (
    <div className="vz-admin" dir={rtl ? "rtl" : "ltr"}>
      {side}
      <button
        className="vz-mobile-shade"
        onClick={() => setMobileOpen(false)}
        aria-label="Close menu"
      />
      <div className="vz-main">
        <header className="vz-topbar">
          <div className="vz-top-left">
            <button className="vz-menu-button" onClick={() => setMobileOpen(true)}>
              <Menu />
            </button>
            <span className="vz-breadcrumb">
              {t.dashboard}
              <ArrowRight size={13} />
              <b>{sectionTitle}</b>
            </span>
          </div>
          <div className="vz-top-actions">
            <label className="vz-top-search">
              <Search size={15} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
              />
              <kbd>⌘ K</kbd>
            </label>
            <span className="vz-top-separator" />
            <button
              className="vz-lang-switch"
              onClick={() => setLang(rtl ? "en" : "ar")}
              title={t.langSwitch}
            >
              <Globe2 size={15} />
              {rtl ? "EN" : "عربي"}
            </button>
            <a className="vz-view-link" href="/" target="_blank" rel="noreferrer">
              <Eye size={15} />
              <span>{t.viewSite}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </header>
        <main className="vz-content">
          <div className="vz-content-top">
            {section === "overview" ? null : (
              <span className="vz-page-mark">
                VZ <i>STUDIO</i>
              </span>
            )}
            <div className="vz-header-save">
              <span className={`vz-save-state${saved ? " ok" : ""}`}>
                {saved ? (
                  <>
                    <Check size={14} />
                    {t.saved}
                  </>
                ) : (
                  <>
                    <span className="vz-save-dot" />
                    {t.localNote}
                  </>
                )}
              </span>
              <button className="vz-save-button" onClick={save}>
                <Save size={15} />
                {t.save}
              </button>
            </div>
          </div>
          {body}
        </main>
        <footer className="vz-footer">
          <span>
            VIRAL ZOOM <i>—</i> CONTROL STUDIO
          </span>
          <span>
            {t.mobile}
            <b> · </b>© 2025
          </span>
        </footer>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  note,
  green = false,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  note: string;
  green?: boolean;
}) {
  return (
    <article className="vz-stat">
      <div className="vz-stat-top">
        <span className="vz-stat-icon">{icon}</span>
        <span className={`vz-stat-badge${green ? " green" : ""}`}>
          {green ? <Check size={12} /> : <ArrowUpRight size={12} />} {green ? "100%" : "+"}
        </span>
      </div>
      <strong>{value}</strong>
      <span className="vz-stat-label">{label}</span>
      <small>{note}</small>
    </article>
  );
}
function PanelTitle({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="vz-panel-title">
      <span className="vz-panel-icon">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{detail}</p>
      </div>
    </div>
  );
}
function QuickAction({
  icon,
  title,
  detail,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button className="vz-quick-action" onClick={onClick}>
      <span>{icon}</span>
      <div>
        <b>{title}</b>
        <small>{detail}</small>
      </div>
      <ArrowUpRight size={15} />
    </button>
  );
}
function PageIntro({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="vz-page-intro">
      <span className="vz-overline">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}
