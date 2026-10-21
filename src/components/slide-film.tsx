import { useEffect, useRef, useState } from "react";

/** Plays once each time its slide becomes active, then rests on the extracted final frame. */
export function SlideFilm({ src, still, alt, active }: { src?: string; still: string; alt: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { v.pause(); setPlaying(false); return; }
    v.muted = true;
    if (!v.src) v.src = src;
    v.currentTime = 0;
    void v.play().catch(() => setPlaying(false));
  }, [active, src]);

  return (
    <div className="absolute inset-0">
      <img src={still} alt={alt} width={1920} height={1088} loading="lazy" draggable={false}
        className="h-full w-full select-none object-cover" />
      {src && (
        <video ref={ref} muted playsInline preload="none" aria-hidden="true"
          onPlaying={() => setPlaying(true)} onEnded={() => setPlaying(false)} onError={() => setPlaying(false)}
          className={`absolute inset-0 h-full w-full object-cover ${playing ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
}
