import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroSteak from "@/assets/hero-steak.jpg";
import sortiment from "@/assets/sortiment.jpg";
import lieferung from "@/assets/lieferung.jpg";
import kuehlhaus from "@/assets/kuehlhaus.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TDB Food – Premium Fleischgroßhandel" },
      { name: "description", content: "Rind, Lamm, Geflügel und Hackfleisch in Spitzenqualität. Gekühlt geliefert an Gastronomie und Handel. Bestellung per WhatsApp." },
      { property: "og:title", content: "TDB Food – Premium Fleischgroßhandel" },
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
      setP(Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return [ref, p] as const;
}

function MagneticHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <h2 ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      className={`display transition-transform duration-700 ease-apple will-change-transform ${className}`}>
      {children}
    </h2>
  );
}

/* ---------- page ---------- */
function Index() {
  return (
    <main className="overflow-x-clip">
      <Nav />
      <Hero />
      <Statement />
      <Sortiment />
      <Quality />
      <Delivery />
      <Numbers />
      <Contact />
      <Footer />
      <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-lg transition-transform duration-500 ease-apple hover:scale-110 md:hidden">
        <WaIcon />
      </a>
    </main>
  );
}

function Nav() {
  const links = [["Sortiment", "#sortiment"], ["Qualität", "#qualitaet"], ["Lieferung", "#lieferung"], ["Kontakt", "#kontakt"]];
  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-40 border-b border-border/50">
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 text-[13px]">
        <a href="#" className="font-semibold tracking-tight text-[15px]">TDB<span className="text-accent">.</span>Food</a>
        <div className="hidden gap-8 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="text-foreground/70 transition-colors duration-300 hover:text-foreground">{l}</a>
          ))}
        </div>
        <a href={WHATSAPP} target="_blank" rel="noreferrer" className="rounded-full bg-foreground px-3.5 py-1.5 text-background transition-opacity hover:opacity-80">Bestellen</a>
      </nav>
    </header>
  );
}

function Hero() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const t = Math.max(0, p - 0.5) * 2; // 0 while in view top, grows as user scrolls away
  return (
    <section ref={ref} className="relative min-h-[100svh] bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-32 text-center md:pt-40"
        style={{ opacity: 1 - t * 1.4, transform: `translateY(${t * -60}px)` }}>
        <Reveal><p className="eyebrow">Fleischgroßhandel</p></Reveal>
        <Reveal delay={120}>
          <h1 className="display mt-4 text-[clamp(3rem,9vw,7.5rem)]">Fleisch.<br />Auf den Punkt.</h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-muted md:text-xl">Ausgewählte Qualität für Gastronomie und Handel. Gekühlt geliefert, zuverlässig wie ein Uhrwerk.</p>
        </Reveal>
        <Reveal delay={380}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-pill">Per WhatsApp bestellen</a>
            <a href="#sortiment" className="link-arrow">Sortiment ansehen <span>›</span></a>
          </div>
        </Reveal>
      </div>
      <div className="relative mx-auto mt-6 max-w-[1600px] md:-mt-6">
        <img src={heroSteak} alt="Dry-Aged Ribeye Steak" width={1920} height={1088} fetchPriority="high"
          className="w-full select-none"
          style={{ transform: `scale(${1 + p * 0.25}) translateY(${p * 40}px)` }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  );
}

function Statement() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const words = "Wir liefern nicht einfach Fleisch. Wir liefern das Vertrauen, dass jeder Teller gelingt.".split(" ");
  return (
    <section ref={ref} className="mx-auto max-w-5xl px-6 py-40 md:py-56">
      <p className="display text-[clamp(2rem,5vw,4rem)] leading-[1.08]">
        {words.map((w, i) => {
          const on = p * 1.9 - 0.35 > i / words.length;
          return <span key={i} className={`transition-colors duration-500 ${on ? "text-foreground" : "text-foreground/15"}`}>{w} </span>;
        })}
      </p>
    </section>
  );
}

function Sortiment() {
  const items = [
    ["Rind", "Entrecôte, Filet, Hüfte, Brust. Auf Wunsch dry-aged."],
    ["Lamm", "Koteletts, Keule, Schulter. Zart und aromatisch."],
    ["Geflügel", "Hähnchenbrust, Schenkel, ganze Tiere. Täglich frisch."],
    ["Hackfleisch", "Rind, gemischt oder Lamm. In jeder Körnung."],
  ];
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  return (
    <section id="sortiment" className="bg-muted py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal><p className="eyebrow">Sortiment</p></Reveal>
        <Reveal delay={100}><MagneticHeading className="mt-3 text-[clamp(2.5rem,7vw,5.5rem)]">Alles, was Ihre<br />Küche braucht.</MagneticHeading></Reveal>
      </div>
      <div ref={ref} className="mx-auto mt-20 max-w-6xl overflow-hidden rounded-[2rem] px-0 md:px-6">
        <img src={sortiment} alt="Rind, Lamm, Geflügel und Hackfleisch" width={1920} height={1088} loading="lazy"
          className="w-full md:rounded-[2rem]" style={{ transform: `scale(${1.15 - p * 0.15})` }} />
      </div>
      <div className="mx-auto mt-20 grid max-w-6xl gap-x-12 gap-y-14 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([t, d], i) => (
          <Reveal key={t} delay={i * 110}>
            <h3 className="text-2xl font-semibold tracking-tight">{t}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{d}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-16 text-center"><a href={WHATSAPP} target="_blank" rel="noreferrer" className="link-arrow text-lg">Komplette Preisliste anfragen <span>›</span></a></Reveal>
    </section>
  );
}

function Quality() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  return (
    <section id="qualitaet" ref={ref} className="relative h-[180vh] bg-ink text-ink-foreground">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <img src={kuehlhaus} alt="Kühlhaus" width={1920} height={1088} loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${1.3 - p * 0.3})`, opacity: 0.25 + p * 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <p className="eyebrow" style={{ opacity: Math.min(1, p * 4) }}>Qualität</p>
          <h2 className="display mt-3 max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)]"
            style={{ opacity: Math.min(1, p * 3), transform: `translateY(${(1 - Math.min(1, p * 3)) * 40}px)` }}>
            Lückenlose Kühlkette.<br /><span className="text-ink-muted">Vom Schlachthof bis zu Ihnen.</span>
          </h2>
          <div className="mt-12 grid max-w-2xl gap-8 sm:grid-cols-3">
            {[["0–4 °C", "konstant gekühlt"], ["EU", "zertifizierte Betriebe"], ["Halal", "auf Anfrage"]].map(([a, b], i) => {
              const o = Math.min(1, Math.max(0, p * 4 - 1.2 - i * 0.35));
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

function Delivery() {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  return (
    <section id="lieferung" className="py-32 md:py-44">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal><p className="eyebrow">Lieferung</p></Reveal>
        <Reveal delay={100}><MagneticHeading className="mt-3 text-[clamp(2.5rem,7vw,5.5rem)]">Heute bestellt.<br />Morgen in der Küche.</MagneticHeading></Reveal>
        <Reveal delay={200}><p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">Mit eigener Kühlflotte beliefern wir Restaurants, Imbisse, Hotels und Händler – pünktlich und flexibel.</p></Reveal>
      </div>
      <div ref={ref} className="mt-20 overflow-hidden">
        <img src={lieferung} alt="Kühlfahrzeug von TDB Food" width={1920} height={1088} loading="lazy"
          className="mx-auto w-full max-w-[1600px]" style={{ transform: `translateX(${(0.5 - p) * 12}%) scale(1.1)` }} />
      </div>
      <div className="mx-auto mt-20 grid max-w-4xl gap-14 px-6 text-center sm:grid-cols-3">
        {[["Mo – Sa", "Lieferung an sechs Tagen"], ["Bis 14 Uhr", "bestellt, nächster Tag geliefert"], ["Ab 150 €", "kostenfreie Lieferung"]].map(([a, b], i) => (
          <Reveal key={a} delay={i * 120}>
            <div className="text-4xl font-semibold tracking-tight">{a}</div>
            <div className="mt-2 text-muted-foreground">{b}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Numbers() {
  return (
    <section className="bg-muted py-32 md:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center">
        <Reveal><MagneticHeading className="text-[clamp(2.5rem,6vw,4.5rem)]">Bestellen,<br />so einfach wie<br />eine Nachricht.</MagneticHeading></Reveal>
        <Reveal delay={150}>
          <ol className="space-y-8">
            {["Schreiben Sie uns per WhatsApp, was Sie brauchen.", "Wir bestätigen Menge, Preis und Liefertermin.", "Ihre Ware kommt gekühlt und pünktlich an."].map((s, i) => (
              <li key={i} className="flex gap-6">
                <span className="text-5xl font-semibold tracking-tight text-accent">{i + 1}</span>
                <span className="pt-2 text-xl leading-snug">{s}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
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
