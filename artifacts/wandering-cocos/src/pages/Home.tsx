import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { HeroManifesto } from "@/components/HeroManifesto";
import { lifestyleMedia } from "@/data/lifestyleMedia";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Pillar data ────────────────────────────────────────────────────────────────

const pillars = [
  {
    id: "bakery",
    href: "/bakery",
    tag: "Bakery",
    cta: "Pre-order your box",
    settingKey: "pillar_1_url",
    defaultImg: `${BASE}/images/woc-bg.png`,
    position: "object-center",
  },
  {
    id: "recipes",
    href: "/recipes",
    tag: "Recipes",
    cta: "Browse the kitchen",
    settingKey: "pillar_2_url",
    defaultImg: `${BASE}/images/woc-bg.png`,
    position: "object-top",
  },
  {
    id: "coffee",
    href: "/coffee",
    tag: "Coffee",
    cta: "Coming Soon",
    settingKey: "pillar_3_url",
    defaultImg: `${BASE}/images/woc-bg.png`,
    position: "object-center",
  },
  {
    id: "shop",
    href: "/shop",
    tag: "Shop",
    cta: "Coming Soon",
    settingKey: "pillar_4_url",
    defaultImg: `${BASE}/images/woc-bg.png`,
    position: "object-center",
  },
  {
    id: "cafe",
    href: "/cafe",
    tag: "Café",
    cta: "Coming Soon",
    settingKey: "pillar_5_url",
    defaultImg: `${BASE}/images/woc-bg.png`,
    position: "object-bottom",
  },
  {
    id: "journal",
    href: "/journal",
    tag: "Journal",
    cta: "Read the field notes",
    settingKey: "pillar_6_url",
    defaultImg: `${BASE}/images/woc-bg.png`,
    position: "object-center",
  },
];

// ── Lifestyle grid (unchanged from original) ──────────────────────────────────

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
            "Built on a rhythm of strict discipline, open roads, and absolute freedom."
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

// ── Asymmetric pillar pair ─────────────────────────────────────────────────────

type PillarDef = typeof pillars[0];

function PillarPair({
  left, right, leftImg, rightImg, flip = false,
}: {
  left: PillarDef; right: PillarDef;
  leftImg: string; rightImg: string;
  flip?: boolean;
}) {
  const [, navigate] = useLocation();
  const big = flip ? right : left;
  const bigImg = flip ? rightImg : leftImg;
  const small = flip ? left : right;
  const smallImg = flip ? leftImg : rightImg;

  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: flip ? "2fr 3fr" : "3fr 2fr",
  gridTemplateRows: "70vh",
  gap: "12px",
  padding: "12px",
  background: "#faf8f4",
      }}
    >
      {/* Big panel */}
      <motion.div
        className="relative overflow-hidden cursor-pointer group"
        style={{ gridColumn: flip ? 2 : 1, gridRow: 1 }}
        onClick={() => navigate(big.href)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={bigImg} alt={big.tag}
          className={`w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105 ${big.position}`}
          style={{ filter: "brightness(0.78) saturate(0.88)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 flex flex-col gap-3">
          <span className="text-[9px] tracking-[0.38em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
            {big.tag}
          </span>
          {big.cta !== "Coming Soon" ? (
            <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: "#ffffff" }}>
              {big.cta} →
            </span>
          ) : (
            <span className="text-[10px] tracking-[0.28em] uppercase font-medium px-3 py-1 inline-block"
              style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.18)" }}>
              Coming Soon
            </span>
          )}
        </div>
      </motion.div>

      {/* Small panel */}
      <motion.div
        className="relative overflow-hidden cursor-pointer group"
        style={{ gridColumn: flip ? 1 : 2, gridRow: 1 }}
        onClick={() => navigate(small.href)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={smallImg} alt={small.tag}
          className={`w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105 ${small.position}`}
          style={{ filter: "brightness(0.74) saturate(0.85)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
          <span className="text-[9px] tracking-[0.38em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
            {small.tag}
          </span>
          {small.cta !== "Coming Soon" ? (
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
              {small.cta} →
            </span>
          ) : (
            <span className="text-[9px] tracking-[0.28em] uppercase font-medium px-2.5 py-0.5 inline-block"
              style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.15)" }}>
              Soon
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Mobile pillar stack ───────────────────────────────────────────────────────

function MobilePillars({ pillarsWithImgs }: { pillarsWithImgs: Array<{ pillar: PillarDef; img: string }> }) {
  const [, navigate] = useLocation();
  return (
    <div className="flex flex-col gap-px">
      {pillarsWithImgs.map(({ pillar, img }, i) => (
        <motion.div
          key={pillar.id}
          className="relative overflow-hidden cursor-pointer group"
          style={{ height: "55vw", minHeight: 220 }}
          onClick={() => navigate(pillar.href)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={img} alt={pillar.tag}
            className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105 ${pillar.position}`}
            style={{ filter: "brightness(0.75) saturate(0.88)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-5 left-5 flex flex-col gap-1.5">
            <span className="text-[9px] tracking-[0.35em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
              {pillar.tag}
            </span>
            {pillar.cta !== "Coming Soon" ? (
              <span className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: "#ffffff", fontFamily: "sans-serif" }}>
                {pillar.cta} →
              </span>
            ) : (
              <span className="text-[9px] tracking-[0.25em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
                Coming Soon
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${BASE}/api/settings`)
      .then(r => r.ok ? r.json() : {})
      .then((s: Record<string, string>) => setSettings(s))
      .catch(() => {});
  }, []);

  const pillarImgs = pillars.map(p =>
    settings[p.settingKey] || p.defaultImg
  );
  const pillarsWithImgs = pillars.map((p, i) => ({ pillar: p, img: pillarImgs[i] }));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0e09" }}>
      <Header />

      <main className="flex-grow">
        {/* ── HERO — manifesto with changeable background ───────── */}
        <HeroManifesto settings={settings} />

        {/* ── LIFESTYLE MEDIA GRID ─────────────────────────────── */}
        <LifestyleGrid />

        {/* ── PILLAR GRID — desktop ────────────────────────────── */}
        <div className="hidden md:block" style={{ background: "#faf8f4", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Row 1: Bakery (big) + Recipes (small) */}
          <PillarPair
            left={pillars[0]} right={pillars[1]}
            leftImg={pillarImgs[0]} rightImg={pillarImgs[1]}
            flip={false}
          />

          {/* Row 2: Coffee (small) + Shop (big) */}
          <PillarPair
            left={pillars[2]} right={pillars[3]}
            leftImg={pillarImgs[2]} rightImg={pillarImgs[3]}
            flip={true}
          />

          {/* Row 3: Café (big) + Journal (small) */}
          <PillarPair
            left={pillars[4]} right={pillars[5]}
            leftImg={pillarImgs[4]} rightImg={pillarImgs[5]}
            flip={false}
          />
        </div>

        {/* ── PILLAR STACK — mobile ────────────────────────────── */}
        <div className="md:hidden">
          <MobilePillars pillarsWithImgs={pillarsWithImgs} />
        </div>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <div style={{ background: "#faf8f4" }}>
          <TestimonialsSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
