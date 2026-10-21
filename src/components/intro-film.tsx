import { useEffect, useRef, useState } from "react";
import intro from "@/assets/tdb-intro.mp4.asset.json";
import webm from "@/assets/tdb-intro.webm.asset.json";
import finalFrame from "@/assets/tdb-intro-final.jpg.asset.json";

/** Play once per visit; the extracted final frame also handles blocked autoplay. */
export function IntroFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true;
    video.src = video.canPlayType('video/webm; codecs="vp9"') ? webm.url : intro.url;
    video.load();
    void video.play().catch(() => setPlaying(false));
    return () => video.pause();
  }, []);

  return (
    <div className="relative h-full w-full" data-intro-state={playing ? "playing" : "still"}>
      <img src={finalFrame.url} alt="Fein marmoriertes Ribeye in einer Studioaufnahme" width={1920} height={1080}
        fetchPriority="high" className="absolute inset-0 h-full w-full object-contain" />
      <video ref={ref} muted playsInline preload="none" poster={finalFrame.url} aria-hidden="true"
        onPlaying={() => setPlaying(true)} onEnded={() => setPlaying(false)} onError={() => setPlaying(false)}
        className={`absolute inset-0 h-full w-full object-contain ${playing ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}