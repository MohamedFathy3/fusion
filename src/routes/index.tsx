import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe2, Menu, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/showcase-data";
import logo from "@/assets/logo.png.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";
import hero from "@/assets/hero.mp4.asset.json";
import heroWebm from "@/assets/hero.webm.asset.json";
import poster from "@/assets/poster.jpg.asset.json";
import p0 from "@/assets/portfolio-0.jpg.asset.json";
import p1 from "@/assets/portfolio-1.jpg.asset.json";
import p2 from "@/assets/portfolio-2.jpg.asset.json";
import p3 from "@/assets/portfolio-3.jpg.asset.json";
import p4 from "@/assets/portfolio-4.jpg.asset.json";
import p5 from "@/assets/portfolio-5.jpg.asset.json";
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

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "Viral Zoom — Creative & Digital Marketing | فايرال زوم" },
    { name: "description", content: "Explore Viral Zoom's creative and digital services, from brand identity and video production to websites and social media. اكتشف خدمات فايرال زوم الإبداعية والتسويقية." },
    { property: "og:title", content: "Viral Zoom — Creative & Digital Marketing" },
    { property: "og:description", content: "Discover our creative services, selected work and brands. اكتشف خدماتنا وأعمالنا وعملاءنا." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

type Language = "en" | "ar";
type Detail = { title: string; image?: string; description?: string };
const projects = [p0, p1, p2, p3, p4, p5];
const clients = [c0,c1,c2,c3,c4,c5,c6,c7,c8,c9];

function Index() {
  const [language, setLanguage] = useState<Language>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [showAllClients, setShowAllClients] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const videoRef = useRef<HTMLVideoElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const ar = language === "ar";
  const t = (en: string, arabic: string) => ar ? arabic : en;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = ar ? "rtl" : "ltr";
  }, [language, ar]);

  useEffect(() => {
    if (detail) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [detail]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActiveSection(id);
    setMenuOpen(false);
  };
  const scroll = (kind: "services" | "clients", next: boolean) => {
    const track = kind === "services" ? servicesRef.current : clientsRef.current;
    track?.scrollBy({ left: (next ? 1 : -1) * (ar ? -1 : 1) * (kind === "services" ? 364 : 326), behavior: "smooth" });
  };
  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { try { await video.play(); } catch { setPlaying(false); } }
    else video.pause();
  };
  const nav = [ { id:"home", en:"HOME", ar:"الرئيسية" }, { id:"services", en:"SERVICES", ar:"خدماتنا" }, { id:"portfolio", en:"PORTFOLIO", ar:"أعمالنا" }, { id:"clients", en:"OUR CLIENTS", ar:"عملاؤنا" } ];
  const arrows = (kind: "services" | "clients") => <div className="carousel-actions" dir="ltr">
    <Button variant="ghost" className="arrow-control" title={t("Previous", "السابق")} aria-label={`${kind} ${t("previous", "السابق")}`} onClick={() => scroll(kind, ar)}><ChevronLeft /></Button>
    <Button variant="ghost" className="arrow-control" title={t("Next", "التالي")} aria-label={`${kind} ${t("next", "التالي")}`} onClick={() => scroll(kind, !ar)}><ChevronRight /></Button>
  </div>;

  return (
    <div className="site" dir={ar ? "rtl" : "ltr"}>
      <header className="site-header" id="home">
        <div className="header-inner">
          <Button variant="ghost" className="h-auto p-0 justify-start" aria-label="Viral Zoom home" onClick={() => goTo("home")}><img className="brand-logo" src={logo.url} alt="Viral Zoom" /></Button>
          <nav className="desktop-nav" aria-label={t("Main navigation","القائمة الرئيسية")}>
            {nav.map(item => <Button variant="ghost" key={item.id} className={`nav-item px-0 ${activeSection === item.id ? "active" : ""}`} onClick={() => goTo(item.id)}>{item[language]}</Button>)}
          </nav>
          <div className="header-actions">
            <Button variant="ghost" className="language-button" aria-label={ar ? "Switch to English" : "التبديل إلى العربية"} onClick={() => setLanguage(ar ? "en" : "ar")}><Globe2 className="text-primary" />{ar ? "English" : "العربية"}</Button>
            <Button variant="ghost" size="icon" className="mobile-menu-toggle" aria-label={t("Open menu","فتح القائمة")} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
        {menuOpen && <nav className="mobile-nav">{nav.map(item => <Button key={item.id} variant="ghost" onClick={() => goTo(item.id)}>{item[language]}</Button>)}</nav>}
      </header>

      <main>
        <section className="video-section" aria-label={t("Viral Zoom showreel", "فيديو فايرال زوم")}>
          <h1 className="sr-only">Viral Zoom — {t("Creative & Digital Marketing", "الإبداع والتسويق الرقمي")}</h1>
          <video ref={videoRef} className="hero-video" autoPlay muted={muted} loop playsInline poster={poster.url} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
            <source src={heroWebm.url} type="video/webm" />
            <source src={hero.url} type="video/mp4" />
          </video>
          <img src={whiteLogo.url} className="video-brand" alt="Viral Zoom" />
          <div className="video-controls">
            <Button variant="ghost" size="icon" className="video-control" aria-label={muted ? t("Unmute video","تشغيل الصوت") : t("Mute video","كتم الصوت")} title={muted ? t("Unmute","تشغيل الصوت") : t("Mute","كتم الصوت")} onClick={() => setMuted(!muted)}>{muted ? <VolumeX /> : <Volume2 />}</Button>
            <Button variant="ghost" size="icon" className="video-control" aria-label={playing ? t("Pause video","إيقاف الفيديو") : t("Play video","تشغيل الفيديو")} title={playing ? t("Pause","إيقاف") : t("Play","تشغيل")} onClick={toggleVideo}>{playing ? <Pause /> : <Play />}</Button>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-inner"><div className="section-heading"><h2>{t("Our Services","خدماتنا")}</h2>{arrows("services")}</div></div>
          <div className="service-track" ref={servicesRef} aria-label={t("Services","الخدمات")}>
            {services.map((service, i) => <article className="service-card" key={service.title.en}>
              <img className="service-image" src={service.image} alt={service.title[language]} loading="lazy" />
              <div className="service-number">{String(i + 1).padStart(2,"0")} / VIRAL ZOOM</div>
              <h3>{service.title[language]}</h3><p>{service.description[language]}</p>
              <Button variant="link" className="service-more" onClick={() => setDetail({ title: service.title[language], description: service.description[language], image: service.image })}>{t("Read More","اقرأ المزيد")}<ArrowUpRight /></Button>
            </article>)}
          </div>
        </section>

        <section className="section portfolio-section" id="portfolio">
          <div className="section-inner">
            <div className="section-eyebrow">{t("SELECTED WORK","أعمال مختارة")}</div>
            <div className="section-heading"><h2>{t("Portfolio","أعمالنا")}</h2><span className="text-xs text-muted-foreground">{t("Brand identities","هويات تجارية")} / 06</span></div>
            <div className="portfolio-grid">{projects.map((project,i) => <Button key={project.asset_id} variant="ghost" className="portfolio-item" aria-label={t(`Open project ${i+1}`,`عرض المشروع ${i+1}`)} onClick={() => setDetail({ title:t("Brand identity","الهوية التجارية"), image: project.url })}><img src={project.url} alt={t(`Brand identity project ${i+1}`,`مشروع هوية تجارية ${i+1}`)} loading="lazy" /></Button>)}</div>
          </div>
        </section>

        <section className="section" id="clients">
          <div className="section-inner">
            <div className="section-heading"><h2>{t("Our Clients","عملاؤنا")}</h2><Button variant="link" className="gap-3 text-xs" onClick={() => setShowAllClients(!showAllClients)}>{showAllClients ? t("Show carousel","عرض متحرك") : t("View all Clients","عرض كل العملاء")}<ArrowUpRight /></Button></div>
            {showAllClients ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">{clients.map((client,i) => <img key={client.asset_id} src={client.url} className="w-full rounded-sm" alt={t(`Client brand ${i+1}`,`العلامة التجارية ${i+1}`)} loading="lazy" />)}</div> : <div className="client-row" dir="ltr">
              <Button variant="ghost" size="icon" aria-label={t("Clients previous","العملاء السابقون")} title={t("Previous","السابق")} onClick={() => scroll("clients", ar)}><ChevronLeft /></Button>
              <div className="client-track" ref={clientsRef} dir={ar ? "rtl" : "ltr"}>{clients.map((client,i) => <img key={client.asset_id} className="client-logo" src={client.url} alt={t(`Client brand ${i+1}`,`العلامة التجارية ${i+1}`)} loading="lazy" />)}</div>
              <Button variant="ghost" size="icon" aria-label={t("Clients next","العملاء التاليون")} title={t("Next","التالي")} onClick={() => scroll("clients", !ar)}><ChevronRight /></Button>
            </div>}
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="section-inner footer-inner"><img className="footer-logo" src={logo.url} alt="Viral Zoom" /><span>© 2026 Viral Zoom. {t("All rights reserved.","جميع الحقوق محفوظة.")}</span><Button variant="link" className="text-xs gap-3" onClick={() => goTo("home")}>{t("Back to top","إلى أعلى")}<ArrowUpRight /></Button></div></footer>
      <dialog ref={dialogRef} className="detail-dialog" onClose={() => setDetail(null)} onClick={event => { if (event.target === event.currentTarget) setDetail(null); }}>
        <Button variant="ghost" size="icon" className="dialog-close" aria-label={t("Close details","إغلاق التفاصيل")} onClick={() => setDetail(null)}><X /></Button>
        {detail?.image && <img className="detail-image" src={detail.image} alt={detail.title} />}
        <div className="detail-copy"><h3>{detail?.title}</h3>{detail?.description && <p>{detail.description}</p>}</div>
      </dialog>
    </div>
  );
}
