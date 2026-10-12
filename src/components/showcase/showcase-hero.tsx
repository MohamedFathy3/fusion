import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.mp4.asset.json";
import heroWebm from "@/assets/hero.webm.asset.json";
import whiteLogo from "@/assets/logo-white.png.asset.json";
import poster from "@/assets/poster.jpg.asset.json";
import type { Language } from "./types";
import { translate } from "./types";

export function ShowcaseHero({ language }: { language: Language }) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = (english: string, arabic: string) => translate(language, english, arabic);

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  return (
    <section className="video-section" aria-label={t("Viral Zoom showreel", "فيديو فايرال زوم")}>
      <h1 className="sr-only">Viral Zoom — {t("Creative & Digital Marketing", "الإبداع والتسويق الرقمي")}</h1>
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted={muted}
        loop
        playsInline
        poster={poster.url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={heroWebm.url} type="video/webm" />
        <source src={hero.url} type="video/mp4" />
      </video>
      <svg
        className="video-waves"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="video-wave-soft"
          d="M0 20 C300 60 460 150 720 120 C1020 95 1190 30 1440 10 L1440 180 L0 180 Z"
        />
        <path
          className="video-wave-brand"
          d="M0 42 C310 82 470 166 740 145 C1030 125 1200 48 1440 32 L1440 180 L0 180 Z"
        />
        <path
          className="video-wave-base"
          d="M0 60 C320 100 480 180 750 156 C1040 133 1210 65 1440 58 L1440 180 L0 180 Z"
        />
      </svg>
      <img src={whiteLogo.url} className="video-brand" alt="Viral Zoom" />
    </section>
  );
}
