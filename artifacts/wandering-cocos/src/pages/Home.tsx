import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { lifestyleMedia } from "@/data/lifestyleMedia";

const heroRoad = `${import.meta.env.BASE_URL}images/hero-road.jpg`;
const editorialPhoto = `${import.meta.env.BASE_URL}images/editorial-kyrgyz.jpeg`;

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
        {/* ── HERO — Road photograph ───────────────────────────────── */}
        <section className="relative min-h-screen overflow-hidden bg-[#0a1a0f]">
          <img
            src={heroRoad}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
            style={{ filter: "brightness(0.78)" }}
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(8,18,10,0.18) 0%, rgba(8,18,10,0.04) 40%, rgba(8,18,10,0.62) 100%)" }}
          />
          {/* Headline — lower-left, ~68% down */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 z-10 px-8 md:px-14 lg:px-20"
            style={{ top: "66vh" }}
          >
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(4.2rem, 10.5vw, 9.5rem)",
                lineHeight: 1.14,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              Mood first.<br />Always.
            </h1>
          </motion.div>
          <div
            className="absolute bottom-4 right-5 z-10 pointer-events-none select-none"
            style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)", fontWeight: 500 }}
          >
            Wandering Cocos &nbsp;&middot;&nbsp; Cape Town to Hermanus Road &nbsp;&middot;&nbsp; South Africa
          </div>
        </section>

        {/* ── EDITORIAL — Two-column ────────────────────────────────── */}
        <section className="py-28 md:py-40 px-6 md:px-14 lg:px-20 bg-background border-t border-border/15">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24 items-stretch">

              {/* Text — 38-40%, vertically centred relative to photo */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="w-full md:w-[38%] order-1 flex flex-col justify-center"
              >
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(2.6rem, 4.5vw, 4.2rem)",
                    lineHeight: 1.08,
                    color: "#0f2419",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Somewhere<br />between the road<br />and home.
                </h2>
                <p
                  className="font-light leading-relaxed"
                  style={{
                    marginTop: "clamp(2.5rem, 5vw, 4rem)",
                    fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                    color: "rgba(45,41,38,0.58)",
                    letterSpacing: "0.02em",
                  }}
                >
                  This, over everything else.
                </p>
              </motion.div>

              {/* Photo — 60-62%, fixed height ~720px, object-fit: contain, no crop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                className="w-full md:w-[62%] order-2 relative flex items-center justify-center"
                style={{ minHeight: "480px", height: "clamp(480px, 60vw, 740px)" }}
              >
                <img
                  src={editorialPhoto}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full"
                  style={{ objectFit: "contain", objectPosition: "center center", display: "block" }}
                />
                <div
                  className="absolute bottom-2 right-3 z-10 pointer-events-none select-none"
                  style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(60,50,40,0.5)", fontWeight: 500 }}
                >
                  Wandering Cocos &nbsp;&middot;&nbsp; Ala Archa National Park &nbsp;&middot;&nbsp; Kyrgyzstan
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── LIFESTYLE MEDIA GRID — hidden, preserved for later ───── */}
        {false && <LifestyleGrid />}

        {/* ── SIX PILLARS — hidden, preserved for later ────────────── */}
        {false && (
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
        )}

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
