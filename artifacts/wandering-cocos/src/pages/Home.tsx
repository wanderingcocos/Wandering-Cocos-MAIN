import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { lifestyleMedia } from "@/data/lifestyleMedia";

const pillars = [
  {
    id: "bakery",
    href: "/bakery",
    label: "01",
    title: "Bakery",
    body: "Artisanal sourdough, bakes, and everything we make with obsessive attention to ingredient quality.",
    tag: "Pre-order Your Box",
  },
  {
    id: "recipes",
    href: "/recipes",
    label: "02",
    title: "Recipes",
    body: "High-protein meals, family curries, and travel-inspired dishes — the food we actually eat.",
    tag: "Browse Recipes",
  },
  {
    id: "coffee",
    href: "/coffee",
    label: "03",
    title: "Specialty Coffee",
    body: "Single-origin, slow pour, no shortcuts. A coffee programme built the same way we build everything.",
    tag: "Coming Soon",
  },
  {
    id: "shop",
    href: "/shop",
    label: "04",
    title: "Shop",
    body: "Heavyweight basics. Tote bags, training wear, and kitchen goods that earn their place.",
    tag: "Coming Soon",
  },
  {
    id: "cafe",
    href: "/cafe",
    label: "05",
    title: "Café",
    body: "A garden table, white linen, and a long breakfast that stretches into afternoon. Bengaluru. Soon.",
    tag: "Coming Soon",
  },
  {
    id: "journal",
    href: "/journal",
    label: "06",
    title: "Journal",
    body: "Events, pop-ups, and field notes. Where we show up, what we made, and who we met on the road.",
    tag: "Read the Journal",
  },
];

function LifestyleGrid() {
  const videos = lifestyleMedia.filter((m: { type: string }) => m.type === "video");
  const images = lifestyleMedia.filter((m: { type: string }) => m.type === "image");

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#0d1a0e" }}>
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "auto", gap: "3px" }}
      >
        {/* Cell 1 — large video, 7 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "1 / 8", gridRow: "1 / 3", minHeight: "420px" }}>
          {videos[0] && (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.75) saturate(0.9)" }}>
              <source src={videos[0].src} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <span className="text-[9px] tracking-[0.25em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
              The Grind
            </span>
          </div>
        </div>

        {/* Cell 2 — portrait image, 5 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "8 / 13", gridRow: "1 / 2", minHeight: "210px" }}>
          {images[0] && (
            <img src={images[0].src} alt={images[0].alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.8) saturate(0.85)" }} />
          )}
        </div>

        {/* Cell 3 — landscape image, 5 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "8 / 13", gridRow: "2 / 3", minHeight: "210px" }}>
          {images[3] && (
            <img src={images[3].src} alt={images[3].alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.75) saturate(0.85)" }} />
          )}
        </div>

        {/* Cell 4 — editorial quote row */}
        <div
          className="flex items-center justify-center px-6 md:px-14 py-10 md:py-16 text-center"
          style={{ gridColumn: "1 / 13", background: "#0d1a0e" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif italic"
            style={{ fontSize: "clamp(1.2rem, 2.5vw, 2rem)", color: "rgba(245,238,224,0.72)", maxWidth: "680px", lineHeight: 1.55 }}
          >
            "Built on a rhythm of strict discipline,<br className="hidden md:block" /> open roads, and absolute freedom."
          </motion.p>
        </div>

        {/* Cell 5 — video, 5 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "1 / 6", minHeight: "280px" }}>
          {videos[1] && (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.7) saturate(0.9)" }}>
              <source src={videos[1].src} type="video/mp4" />
            </video>
          )}
          <div className="absolute bottom-4 left-5">
            <span className="text-[9px] tracking-[0.25em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
              Open Road
            </span>
          </div>
        </div>

        {/* Cell 6 — image, 3 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "6 / 9", minHeight: "280px" }}>
          {images[1] && (
            <img src={images[1].src} alt={images[1].alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.72) saturate(0.8)" }} />
          )}
        </div>

        {/* Cell 7 — video, 4 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "9 / 13", minHeight: "280px" }}>
          {videos[2] && (
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.65) saturate(0.85)" }}>
              <source src={videos[2].src} type="video/mp4" />
            </video>
          )}
          <div className="absolute bottom-4 right-5">
            <span className="text-[9px] tracking-[0.25em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
              Wildlife
            </span>
          </div>
        </div>

        {/* Cell 8 — wide image, 8 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "1 / 9", minHeight: "200px" }}>
          {images[2] && (
            <img src={images[2].src} alt={images[2].alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.68) saturate(0.8)" }} />
          )}
        </div>

        {/* Cell 9 — image, 4 cols */}
        <div className="relative overflow-hidden" style={{ gridColumn: "9 / 13", minHeight: "200px" }}>
          {images[4] && (
            <img src={images[4].src} alt={images[4].alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.7) saturate(0.8)" }} />
          )}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const [, navigate] = useLocation();
  const isComingSoon = pillar.tag === "Coming Soon";

  return (
    <motion.button
      onClick={() => navigate(pillar.href)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="card-cabinet group text-left w-full flex flex-col p-7 focus:outline-none"
      style={{ cursor: "pointer" }}
    >
      <div className="flex items-start justify-between mb-5">
        <span className="text-[10px] tracking-[0.3em] font-medium uppercase" style={{ color: "rgba(42,72,32,0.4)" }}>
          {pillar.label}
        </span>
        {isComingSoon && (
          <span className="text-[8px] tracking-[0.25em] uppercase font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(42,72,32,0.07)", color: "rgba(42,72,32,0.45)", border: "1px solid rgba(42,72,32,0.12)" }}>
            Soon
          </span>
        )}
      </div>
      <h3
        className="font-serif italic leading-snug mb-3 transition-colors group-hover:text-accent"
        style={{ fontSize: "clamp(1.3rem, 1.8vw, 1.6rem)", color: "#2a4820" }}
      >
        {pillar.title}
      </h3>
      <p
        className="font-light leading-relaxed mb-6 flex-1"
        style={{ fontSize: "clamp(0.82rem, 1vw, 0.9rem)", color: "rgba(42,72,32,0.58)" }}
      >
        {pillar.body}
      </p>
      <span
        className="text-[9px] tracking-[0.22em] uppercase font-medium transition-colors"
        style={{ color: isComingSoon ? "rgba(42,72,32,0.3)" : "#2a4820" }}
      >
        {pillar.tag} →
      </span>
    </motion.button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">
        {/* ── HERO — Skylight illumination ─────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-background">
          {/* Primary skylight — warm luminous center from above */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 90% 65% at 50% -8%, rgba(255, 250, 228, 0.92) 0%, rgba(244, 235, 208, 0.55) 38%, transparent 68%)",
            }}
          />
          {/* Secondary warm fill from below */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 130% 45% at 50% 112%, rgba(240, 228, 196, 0.32) 0%, transparent 65%)",
            }}
          />
          {/* Faint ambient grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.022]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="block text-[10px] tracking-[0.45em] uppercase font-medium mb-10"
              style={{ color: "rgba(42, 72, 32, 0.45)" }}
            >
              Wandering Cocos
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif italic leading-tight"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", color: "#1e3a18" }}
            >
              Fit hard.<br />
              Indulge freely.<br />
              Travel deep.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-8 font-light leading-relaxed"
              style={{
                fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
                color: "rgba(42, 72, 32, 0.52)",
                maxWidth: "420px",
                margin: "2rem auto 0",
              }}
            >
              A lifestyle built on discipline, good food, and open roads.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
              className="mt-12 flex items-center justify-center gap-3"
            >
              <span className="w-6 h-px" style={{ background: "rgba(42,72,32,0.25)" }} />
              <span className="text-[9px] tracking-[0.32em] uppercase font-medium" style={{ color: "rgba(42,72,32,0.32)" }}>
                Scroll to explore
              </span>
              <span className="w-6 h-px" style={{ background: "rgba(42,72,32,0.25)" }} />
            </motion.div>
          </div>
        </section>

        {/* ── LIFESTYLE MEDIA GRID ─────────────────────────────────── */}
        <LifestyleGrid />

        {/* ── SIX PILLARS ──────────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14"
          >
            <span className="text-[10px] tracking-[0.38em] uppercase font-medium block mb-4"
              style={{ color: "rgba(42,72,32,0.42)" }}>
              What we do
            </span>
            <h2
              className="font-serif italic leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "#1e3a18", maxWidth: "520px" }}
            >
              Six pillars.<br />One discipline.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((pillar, i) => (
              <PillarCard key={pillar.id} pillar={pillar} index={i} />
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
