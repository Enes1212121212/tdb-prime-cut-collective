import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent } from "react";
import { IntroFilm } from "@/components/intro-film";
import marmorierung from "@/assets/marmorierung.jpg";
import { SlideFilm } from "@/components/slide-film";
import rindFilm from "@/assets/sortiment/rind.mp4.asset.json";
import rindFinal from "@/assets/sortiment/rind-final.jpg.asset.json";
import kalbFilm from "@/assets/sortiment/kalb.mp4.asset.json";
import kalbFinal from "@/assets/sortiment/kalb-final.jpg.asset.json";
import gefluegelFilm from "@/assets/sortiment/gefluegel.mp4.asset.json";
import gefluegelFinal from "@/assets/sortiment/gefluegel-final.jpg.asset.json";
import lammFilm from "@/assets/sortiment/lamm.mp4.asset.json";
import lammFinal from "@/assets/sortiment/lamm-final.jpg.asset.json";
import kuehlwagen from "@/assets/kuehlwagen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TDB Food – Premium Fleischgroßhandel Köln" },
      { name: "description", content: "Rind, Kalb, Lamm und Geflügel in Spitzenqualität. Gekühlt geliefert an Gastronomie und Handel. Bestellung per WhatsApp." },
      { property: "og:title", content: "TDB Food – Premium Fleischgroßhandel Köln" },
      { property: "og:description", content: "Fleisch in Spitzenqualität. Gekühlt geliefert. Bestellung per WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATSAPP_MESSAGE = "Hallo TDB Food, ich interessiere mich für Ihr Sortiment und möchte gerne eine Anfrage stellen.";
const WHATSAPP = `https://wa.me/4917624115839?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const PHONE_DISPLAY = "0221 29100919";
const PHONE_TEL = "tel:+4922129100919";
const EMAIL = "info@tdb-food.de";
const INSTAGRAM_URL = "https://www.instagram.com/tdb_food";
const ADDRESS = "Marconistraße 34, 50769 Köln";
const MAPS_DIR = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ---------- motion helpers ---------- */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/** progress 0..1 of element passing through the viewport */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(clamp01((vh - r.top) / (vh + r.height)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return [ref, p] as const;
}

/** words light up one by one as scroll progress advances */
function ScrollWords({ text, progress, className = "", dim = "text-ink-foreground/15", on = "text-ink-foreground" }: {
  text: string; progress: number; className?: string; dim?: string; on?: string;
}) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((w, i) => {
        const lit = progress * 2.6 - 0.2 > i / words.length;
        return <span key={i} className={`transition-colors duration-500 ${lit ? on : dim}`}>{w} </span>;
      })}
    </p>
  );
}

/* ---------- page ---------- */
function Index() {
  return (
    <main className="overflow-x-clip bg-ink">
      <Nav />
      <SceneHero />
      <SceneQualitaet />
      <SceneSortiment />
      <SceneLogistik />
      <SceneService />
      <SceneKontakt />
      <Footer />
      <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-lg transition-transform duration-500 ease-apple hover:scale-110 md:hidden">
        <WaIcon />
      </a>
    </main>
  );
}

function Nav() {
  const links = [["Qualität", "#qualitaet"], ["Sortiment", "#sortiment"], ["Lieferung", "#lieferung"], ["Kontakt", "#kontakt"]];
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-foreground/10 bg-ink/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 text-[13px] text-ink-foreground">
        <a href="#" className="font-semibold tracking-tight text-[15px]">TDB<span className="text-signal">.</span>Food</a>
        <div className="hidden gap-8 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="text-ink-foreground/70 transition-colors duration-300 hover:text-ink-foreground">{l}</a>
          ))}
        </div>
        <a href={WHATSAPP} target="_blank" rel="noreferrer" className="rounded-full bg-ink-foreground px-3.5 py-1.5 text-ink transition-opacity hover:opacity-80">Bestellen</a>
      </nav>
    </header>
  );
}

/* ---------- Scene 1: Hero ---------- */
function SceneHero() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const t = clamp01((p - 0.5) * 2);
  return (
    <section ref={ref} className="relative flex h-[92svh] min-h-[580px] flex-col justify-between overflow-hidden bg-cinema text-ink-foreground md:min-h-[720px]">
      <div className="pointer-events-none absolute -inset-x-[25%] bottom-[12%] top-[22%] md:inset-x-0 md:bottom-[8%] md:top-[10%]"
        style={{ transform: `scale(${1 + t * 0.12})` }}>
        <IntroFilm />
      </div>
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 text-center md:pt-24">
        <Reveal><p className="eyebrow">Fleischgroßhandel · Köln</p></Reveal>
        <Reveal delay={120}>
          <h1 className="mt-3 text-5xl font-semibold leading-none md:text-7xl">TDB Food</h1>
        </Reveal>
        <Reveal delay={220}><p className="mt-3 text-xl font-medium md:text-3xl">Fleisch. Auf den Punkt.</p></Reveal>
      </div>
      <div className="relative z-10 mx-auto max-w-2xl px-6 pb-7 text-center md:pb-10">
        <Reveal delay={260}><p className="mx-auto max-w-xl text-sm text-ink-muted md:text-base">Ausgewählte Qualität für Gastronomie und Handel. Gekühlt geliefert, zuverlässig wie ein Uhrwerk.</p></Reveal>
        <Reveal delay={320}>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-pill">Per WhatsApp bestellen</a>
            <a href="#qualitaet" className="link-arrow">Entdecken <span>›</span></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Scene 2: Qualität, die man sieht ---------- */
function SceneQualitaet() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  return (
    <section id="qualitaet" ref={ref} className="relative bg-ink text-ink-foreground" style={{ height: "170vh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <img src={marmorierung} alt="Marmorierung von Premium-Rindfleisch" width={1920} height={1088} loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${1.3 - p * 0.3})`, opacity: 0.3 + p * 0.45 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="eyebrow" style={{ opacity: clamp01(p * 4) }}>Qualität</p>
          <ScrollWords progress={p}
            className="display mt-4 text-[clamp(2.2rem,6vw,5rem)] leading-[1.05]"
            text="Qualität, die man sieht. Marmorierung, Farbe, Frische – geprüft bei jeder einzelnen Lieferung." />
        </div>
      </div>
    </section>
  );
}

/* ---------- Scene 3: Für jede Küche ---------- */
const PRODUCTS: { name: string; desc: string; img: string; film?: string }[] = [
  { name: "Rind", desc: "Entrecôte, Filet, Hüfte, Brust. Auf Wunsch dry-aged.", img: rindFinal.url, film: rindFilm.url },
  { name: "Kalb", desc: "Feinfaserig und zart. Schnitzel, Oberschale, Keule.", img: kalbFinal.url, film: kalbFilm.url },
  { name: "Geflügel", desc: "Hähnchenbrust, Schenkel, ganze Tiere. Täglich frisch.", img: gefluegelFinal.url, film: gefluegelFilm.url },
  { name: "Lamm", desc: "Koteletts, Keule, Schulter. Zart und aromatisch.", img: lammFinal.url, film: lammFilm.url },
];

const AUTOPLAY_MS = 4500;

function SceneSortiment() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  /* a pause made with the button stays until play is pressed again */
  const heldRef = useRef(false);
  /* start point of a drag, so only real horizontal swipes pause the slider */
  const drag = useRef({ active: false, x: 0, y: 0 });

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  /* autoplay: advance while playing and visible */
  useEffect(() => {
    if (!auto || !inView) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const cur = Math.round(el.scrollLeft / el.clientWidth);
      goTo((cur + 1) % PRODUCTS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [auto, inView]);

  /* play right away as soon as the section reaches the middle of the screen */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(!!e?.isIntersecting);
        if (e?.isIntersecting && !heldRef.current) setAuto(true);
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  const stopAuto = () => setAuto(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    /* only a horizontal swipe pauses – scrolling the page must not */
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) stopAuto();
  };

  const endDrag = () => { drag.current.active = false; };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) stopAuto();
  };


  return (
    <section id="sortiment" ref={sectionRef} className="bg-background py-28 text-foreground md:py-40">
      <div className="mx-auto mb-12 max-w-6xl px-6 text-center">
        <Reveal><p className="eyebrow">Sortiment</p></Reveal>
        <Reveal delay={100}>
          <h2 className="display mt-2 text-[clamp(2.5rem,6vw,4.5rem)]">Für jede Küche.</h2>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onWheel={onWheel}

        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto"
      >
        {PRODUCTS.map((prod, i) => (
          <div key={prod.name} className="w-full shrink-0 snap-center px-6">
            <div className="relative mx-auto h-[58svh] max-w-5xl overflow-hidden rounded-[2rem] shadow-2xl md:h-[64svh]">
              <SlideFilm src={prod.film} still={prod.img} alt={prod.name} active={inView && i === index} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-ink-foreground md:p-12">
                <div className="display text-[clamp(2.5rem,7vw,5rem)]">{prod.name}</div>
                <p className="mt-2 max-w-md text-ink-foreground/80">{prod.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* controls: progress segments, play/pause */}
      <div className="mx-auto mt-8 flex max-w-5xl items-center justify-center gap-6 px-6">
        <div className="flex gap-2">
          {PRODUCTS.map((prod, i) => (

            <button key={prod.name} type="button" aria-label={`Zu ${prod.name}`}
              onClick={() => { stopAuto(); goTo(i); }}
              className="h-1 w-10 overflow-hidden rounded-full bg-foreground/15">
              <span
                key={`${i}-${index}-${auto}`}
                className="block h-full bg-foreground"
                style={
                  i < index ? { width: "100%" }
                  : i > index ? { width: "0%" }
                  : auto && inView ? { animation: `fillbar ${AUTOPLAY_MS}ms linear forwards` }
                  : { width: "100%" }
                }
              />
            </button>
          ))}
        </div>

        <button type="button"
          aria-label={auto ? "Automatische Wiedergabe pausieren" : "Automatische Wiedergabe starten"}
          onClick={() => { const next = !auto; setAuto(next); heldRef.current = !next; }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/8 transition-colors duration-300 hover:bg-foreground/15">
          {auto ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5z" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}

/* ---------- Scene 4: Frisch unterwegs ---------- */
function SceneLogistik() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  return (
    <section id="lieferung" ref={ref} className="relative bg-ink text-ink-foreground" style={{ height: "160vh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <img src={kuehlwagen} alt="Kühlfahrzeug von TDB Food" width={1920} height={1088} loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${1.15 - p * 0.15}) translateX(${(0.5 - p) * 5}%)`, opacity: 0.45 + p * 0.45 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <p className="eyebrow" style={{ opacity: clamp01(p * 4) }}>Kühllogistik</p>
          <ScrollWords progress={p}
            className="display mt-4 max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02]"
            text="Frisch unterwegs. Lückenlose Kühlkette – vom Schlachthof bis in Ihre Küche." />
          <div className="mt-12 grid max-w-2xl gap-8 sm:grid-cols-3">
            {[["0–4 °C", "konstant gekühlt"], ["EU", "zertifizierte Betriebe"], ["Halal", "auf Anfrage"]].map(([a, b], i) => {
              const o = clamp01(p * 4 - 1.2 - i * 0.35);
              return (
                <div key={a} style={{ opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
                  <div className="text-3xl font-semibold tracking-tight">{a}</div>
                  <div className="mt-1 text-sm text-ink-muted">{b}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Scene 5: Liefergebiet & Service ---------- */
function SceneService() {
  return (
    <section className="bg-background py-36 text-foreground md:py-48">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal><p className="eyebrow">Liefergebiet & Service</p></Reveal>
        <Reveal delay={100}>
          <h2 className="display mt-3 text-[clamp(2.5rem,7vw,5.5rem)]">Heute bestellt.<br />Morgen in der Küche.</h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">Mit eigener Kühlflotte beliefern wir Restaurants, Imbisse, Hotels und Händler in Köln und der Region – pünktlich und flexibel.</p>
        </Reveal>
        <div className="mx-auto mt-20 grid max-w-4xl gap-14 sm:grid-cols-3">
          {[["Mo – Sa", "Lieferung an sechs Tagen"], ["Bis 14 Uhr", "bestellt, nächster Tag geliefert"], ["Ab 150 €", "kostenfreie Lieferung"]].map(([a, b], i) => (
            <Reveal key={a} delay={i * 120}>
              <div className="text-4xl font-semibold tracking-tight">{a}</div>
              <div className="mt-2 text-muted-foreground">{b}</div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150} className="mt-16">
          <p className="mx-auto max-w-xl text-muted-foreground">Rind, Kalb, Lamm, Geflügel und Hackfleisch – in jeder Körnung und Zuschnitt.</p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="link-arrow mt-4 text-lg">Komplette Preisliste anfragen <span>›</span></a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Scene 6: Kontakt ---------- */
function SceneKontakt() {
  return (
    <section id="kontakt" className="bg-ink py-40 text-ink-foreground md:py-56">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal><h2 className="display text-[clamp(3rem,9vw,7rem)]">Lassen Sie<br />uns reden.</h2></Reveal>
        <Reveal delay={150}><p className="mx-auto mt-6 max-w-lg text-lg text-ink-muted">Neukunde oder Stammkunde – wir sind schnell erreichbar.</p></Reveal>
        <Reveal delay={280}>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:flex-wrap">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-pill bg-whatsapp"><WaIcon /> WhatsApp schreiben</a>
            <a href={PHONE_TEL} className="link-arrow">{PHONE_DISPLAY} <span>›</span></a>
            <a href={`mailto:${EMAIL}`} className="link-arrow">{EMAIL} <span>›</span></a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="link-arrow"><IgIcon /> @tdb_food <span>›</span></a>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto mt-24 max-w-5xl px-6">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-ink-foreground/10 shadow-2xl">
            <iframe
              title={`Karte: TDB Food, ${ADDRESS}`}
              src={MAPS_EMBED}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <div className="text-xl font-semibold tracking-tight">TDB GmbH · TDB Food – Meat &amp; More</div>
              <div className="mt-1 text-ink-muted">{ADDRESS}</div>
            </div>
            <a href={MAPS_DIR} target="_blank" rel="noreferrer" className="btn-pill">Route planen</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink pb-10 text-ink-muted">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 border-t border-ink-foreground/10 pt-12 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="font-semibold text-ink-foreground">TDB Food – Meat &amp; More</div>
            <div className="mt-3 leading-relaxed">TDB GmbH<br />Marconistraße 34<br />50769 Köln</div>
          </div>
          <div>
            <div className="font-semibold text-ink-foreground">Kontakt</div>
            <div className="mt-3 flex flex-col gap-2">
              <a href={PHONE_TEL} className="transition-colors hover:text-ink-foreground">{PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-ink-foreground">{EMAIL}</a>
            </div>
          </div>
          <div>
            <div className="font-semibold text-ink-foreground">Direkt</div>
            <div className="mt-3 flex flex-col gap-2">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink-foreground">WhatsApp: 0176 24115839</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink-foreground">Instagram: @tdb_food</a>
            </div>
          </div>
          <div>
            <div className="font-semibold text-ink-foreground">Rechtliches</div>
            <div className="mt-3 flex flex-col gap-2">
              <a href="#" className="transition-colors hover:text-ink-foreground">Impressum</a>
              <a href="#" className="transition-colors hover:text-ink-foreground">Datenschutz</a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-xs">© {new Date().getFullYear()} TDB GmbH. Fleischgroßhandel.</div>
      </div>
    </footer>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
    </svg>
  );
}

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
