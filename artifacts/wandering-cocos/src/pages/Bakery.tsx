import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { useSiteStatus } from "@/hooks/useSiteStatus";
import { WA_NUMBER } from "@/lib/constants";
import { readCache, revalidate } from "@/lib/apiCache";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const ADDONS_URL = `${BASE}/api/bakery-addons`;
const ADDONS_TTL = 60_000;

// ── Types ─────────────────────────────────────────────────────────────────────

type BakeryAddon = {
  id: number;
  title: string;
  description: string | null;
  pricePaise: number;
  imageUrl: string | null;
  available: boolean;
  preorderCloseDate: string | null;
};

// ── Bake showcase data — images swappable from admin ─────────────────────────

const showcaseBakes = [
  {
    key: "bake_showcase_1",
    defaultImg: `${BASE}/images/woc-bg.png`,
    tag: "The Wandering Box",
    name: "Artisan Sourdough",
    full: true,
  },
  {
    key: "bake_showcase_2",
    defaultImg: `${BASE}/images/woc-bg.png`,
    tag: "Fresh from the oven",
    name: "Pistachio Croissant",
    full: false,
  },
  {
    key: "bake_showcase_3",
    defaultImg: `${BASE}/images/woc-bg.png`,
    tag: "New York style",
    name: "Everything Bagel",
    full: false,
  },
];

const boxes = [
  {
    name: "The Wandering Box",
    desc: "Our signature curated box — a rotating selection of sourdough, pastries, and seasonal bakes. Different every drop.",
  },
  {
    name: "Artisan Sourdough Boule",
    desc: "72-hour cold-fermented sourdough. Dark crust, open crumb, no additives. À la carte for those who know exactly what they want.",
  },
  {
    name: "Small Wandering Box",
    desc: "Lighter version of the signature box. Perfect for two — same obsessive quality, smaller commitment.",
  },
];

const wanderSteps = [
  {
    number: "The Discovery",
    title: "We bake on nature's timing",
    body: "Not a schedule. If the elements are not at their peak, the ovens stay cold. We choose patience over production. Nature's rhythm, not a commercial one.",
  },
  {
    number: "The 72-Hour Signal",
    title: "Watch the horizon",
    body: "When the alignment is perfect, we release the signal: our Bake Window announced 72 hours in advance. A curated menu, revealed only when certain.",
  },
  {
    number: "The Secure Find",
    title: "Exclusively by reservation",
    body: "We bake only for those who commit. Once the oven is full, the window closes. No rush orders. No compromises. No exceptions.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function formatCloseDate(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "long",
    });
  } catch { return dateStr; }
}

// ── Right fixed panel ─────────────────────────────────────────────────────────

function RightPanel({ siteMode }: { siteMode: string }) {
  const [, navigate] = useLocation();

  const links = [
    {
      label: "Pre-order",
      bold: true,
      action: () => navigate("/reserve"),
      disabled: siteMode !== "bake_day",
    },
    { label: "Gift", bold: false, action: () => navigate("/gifting") },
    {
      label: "Philosophy",
      bold: false,
      action: () => document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      label: "Way of the Coco",
      bold: false,
      action: () => document.getElementById("way-of-coco")?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col items-end gap-7 pr-4 z-30 hidden md:flex"
    >
      {links.map((l) => (
        <button
          key={l.label}
          onClick={l.action}
          disabled={l.label === "Pre-order" && l.disabled}
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: 8,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: l.bold ? 600 : 500,
            fontFamily: "sans-serif",
            color: l.label === "Pre-order" && l.disabled
              ? "rgba(15,36,25,0.25)"
              : l.bold
                ? "#0f2419"
                : "rgba(15,36,25,0.52)",
            background: "none",
            border: "none",
            cursor: l.label === "Pre-order" && l.disabled ? "default" : "pointer",
            padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => {
            if (!(l.label === "Pre-order" && l.disabled))
              (e.currentTarget as HTMLButtonElement).style.color = "#0f2419";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color =
              l.bold ? "#0f2419" : "rgba(15,36,25,0.52)";
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

// ── View toggle ───────────────────────────────────────────────────────────────

function ViewToggle({ view, setView }: { view: number; setView: (n: number) => void }) {
  return (
    <div className="fixed left-4 bottom-6 z-30 flex flex-col gap-1">
      <span style={{
        fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase",
        color: "rgba(15,36,25,0.38)", fontFamily: "sans-serif", display: "block",
        marginBottom: 4,
      }}>
        View
      </span>
      <div className="flex">
        {[1, 2].map(n => (
          <button
            key={n}
            onClick={() => setView(n)}
            style={{
              width: 26, height: 26,
              border: "0.5px solid rgba(15,36,25,0.22)",
              background: view === n ? "#0f2419" : "none",
              color: view === n ? "#faf8f4" : "rgba(15,36,25,0.45)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.18s",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Showcase section (View 1 + View 2 share same data) ────────────────────────

function BakeShowcase({
  view,
  settings,
}: {
  view: number;
  settings: Record<string, string>;
}) {
  const [, navigate] = useLocation();

  const bakes = showcaseBakes.map(b => ({
    ...b,
    img: settings[b.key] || b.defaultImg,
  }));

  if (view === 2) {
    // Card grid — 4 cols
    const cardBakes = [
      { name: "Artisan Sourdough", sub: "The Wandering Box" },
      { name: "Pistachio Croissant", sub: "Fresh from the oven" },
      { name: "Everything Bagel", sub: "New York style" },
      { name: "Cardamom Knot", sub: "Seasonal special" },
      { name: "Brown Butter Cookie", sub: "The Wandering Box" },
      { name: "Seeded Rye", sub: "À la carte" },
      { name: "Olive Focaccia", sub: "Seasonal special" },
      { name: "Walnut Levain", sub: "The Wandering Box" },
    ];

    return (
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", paddingRight: 60 }}
      >
        {cardBakes.map((b, i) => (
          <div
            key={i}
            style={{ borderBottom: "0.5px solid rgba(15,36,25,0.08)", cursor: "pointer" }}
            onClick={() => navigate("/reserve")}
          >
            <div style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", background: "#1a3a20" }}>
              <img
                src={bakes[i % bakes.length]?.img || `${BASE}/images/woc-bg.png`}
                alt={b.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8) saturate(0.88)", display: "block" }}
              />
            </div>
            <div style={{ padding: "9px 10px 14px" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0f2419", fontWeight: 500, marginBottom: 2, fontFamily: "sans-serif" }}>
                {b.name}
              </div>
              <div style={{ fontSize: 8, color: "rgba(15,36,25,0.42)", fontFamily: "sans-serif" }}>
                {b.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // View 1 — full bleed + inset images
  return (
    <div style={{ paddingRight: 60 }}>
      {bakes.map((bake, i) => {
        if (bake.full) {
          return (
            <motion.div
              key={bake.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ position: "relative", width: "100%", height: "90vh", overflow: "hidden" }}
            >
              <img
                src={bake.img}
                alt={bake.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) saturate(0.88)", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.58) 100%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                <span style={{ fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", display: "block", marginBottom: 5, fontFamily: "sans-serif" }}>
                  {bake.tag}
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "rgba(255,255,255,0.92)" }}>
                  {bake.name}
                </span>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={bake.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "#faf8f4", padding: "32px 0", display: "flex", justifyContent: "center" }}
          >
            <div style={{ width: "72%", position: "relative", height: "55vh", overflow: "hidden" }}>
              <img
                src={bake.img}
                alt={bake.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75) saturate(0.86)", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.52) 100%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                <span style={{ fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 5, fontFamily: "sans-serif" }}>
                  {bake.tag}
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.2rem, 2vw, 1.7rem)", color: "rgba(255,255,255,0.9)" }}>
                  {bake.name}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="way-of-coco" style={{ background: "#0f2419", padding: "52px 80px 52px 36px" }}>
      <span style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(245,238,224,0.35)", display: "block", marginBottom: 28, fontFamily: "sans-serif" }}>
        How it works — Way of the Coco
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
        {wanderSteps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(245,238,224,0.22)", marginBottom: 8, fontFamily: "sans-serif" }}>
              {step.number}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 15, color: "rgba(245,238,224,0.88)", marginBottom: 8, lineHeight: 1.3 }}>
              {step.title}
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.72, color: "rgba(245,238,224,0.46)", fontFamily: "sans-serif" }}>
              {step.body}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── What we offer ─────────────────────────────────────────────────────────────

function WhatWeOffer({ siteMode }: { siteMode: string }) {
  const [, navigate] = useLocation();

  return (
    <section style={{ background: "#faf8f4", padding: "40px 80px 40px 36px", borderTop: "0.5px solid rgba(15,36,25,0.08)" }}>
      <span style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(15,36,25,0.35)", display: "block", marginBottom: 20, fontFamily: "sans-serif" }}>
        What we offer
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {boxes.map((box, i) => (
          <div key={i} style={{ border: "0.5px solid rgba(15,36,25,0.1)", padding: "18px 18px 22px", background: "#fff" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 15, color: "#0f2419", marginBottom: 6 }}>
              {box.name}
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.65, color: "rgba(15,36,25,0.5)", marginBottom: 14, fontFamily: "sans-serif" }}>
              {box.desc}
            </div>
            {siteMode === "bake_day" ? (
              <button
                onClick={() => navigate("/reserve")}
                style={{ fontSize: 8, letterSpacing: "0.26em", textTransform: "uppercase", color: "#0f2419", fontWeight: 600, cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "sans-serif" }}
              >
                Pre-order →
              </button>
            ) : (
              <span style={{ fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(15,36,25,0.3)", fontFamily: "sans-serif" }}>
                Next drop coming soon
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Philosophy — sticky stacking cards (preserved from original) ──────────────

function PhilosophyStack({ siteMode }: { siteMode: string }) {
  const [, navigate] = useLocation();

  const cards = [
    {
      bg: "#f5f0e8",
      tag: "Wandering Cocos",
      title: "Built for the\nConscious Eater",
      body: "We don't do ordinary indulgence. At Wandering Cocos, every creation begins with a quiet discipline. We stripped away the noise of the modern pantry: the hidden fillers, the industrial sugars, the empty compromises.",
      footer: "Only what belongs. Nothing that doesn't.",
      dark: false,
    },
    {
      bg: "#ece6da",
      tag: "The Philosophy",
      title: "\"Calories can be burnt.\nHidden ingredients cannot.\"",
      body: "We keep it transparent. Elevated. Honest. Because in a world of excess, true luxury is Clarity.",
      footer: null,
      dark: false,
      has90: true,
    },
    {
      bg: "#e0d9cc",
      tag: "The Earthy Way",
      title: "True luxury is found\nin the soil.",
      body: "We believe the most refined flavour is the one closest to the earth. Our process is a return to purity, where every element is chosen for its raw origin.",
      footer: null,
      dark: false,
      hasIngredients: true,
    },
    {
      bg: "#1a3a2a",
      tag: "The Experience",
      title: "No noise.\nNo guilt.\nNo compromise.",
      body: "Just the freedom to indulge in its cleanest, most intentional form.",
      footer: null,
      dark: true,
      hasCta: true,
    },
  ];

  return (
    <section
      id="philosophy"
      style={{ background: "#0f2419", padding: "64px 80px 64px 36px" }}
    >
      <span style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(245,238,224,0.35)", display: "block", marginBottom: 32, fontFamily: "sans-serif" }}>
        Our philosophy
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: card.bg, borderRadius: 16, padding: "32px 32px 36px", display: "flex", flexDirection: "column", gap: 12 }}
          >
            <span style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: card.dark ? "rgba(245,238,224,0.55)" : "rgba(26,26,26,0.45)", fontFamily: "sans-serif" }}>
              {card.tag}
            </span>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.3rem, 2vw, 1.9rem)", color: card.dark ? "#ffffff" : "#1a1a1a", lineHeight: 1.2, whiteSpace: "pre-line" }}>
              {card.title}
            </h3>
            <p style={{ fontSize: 11, lineHeight: 1.75, color: card.dark ? "rgba(255,255,255,0.5)" : "rgba(26,26,26,0.58)", fontFamily: "sans-serif" }}>
              {card.body}
            </p>
            {(card as any).has90 && (
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                {[{ pct: "90%", label: "Clean. Move well.\nEat with awareness." }, { pct: "10%", label: "Indulge. And when\nyou do, exceptionally." }].map(({ pct, label }) => (
                  <div key={pct} style={{ flex: 1, background: "rgba(26,26,26,0.06)", borderRadius: 12, padding: "20px 14px", textAlign: "center" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "#1a1a1a", display: "block", marginBottom: 6 }}>{pct}</span>
                    <span style={{ fontSize: 10, color: "#2D2926", whiteSpace: "pre-line", lineHeight: 1.5, fontFamily: "sans-serif" }}>{label}</span>
                  </div>
                ))}
              </div>
            )}
            {(card as any).hasIngredients && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                {[
                  { name: "Digitally-Milled Flours", note: "100% natural, additive-free. Superior nutrition baked into every bite." },
                  { name: "Botanical Nectars", note: "Dates, Coconut Sugar, raw Wildflower Honey. Sweetness in its most primal form." },
                  { name: "Noble Fats", note: "Cold-extracted and nutrient-dense. Sourced for the body's rhythm." },
                ].map(({ name, note }) => (
                  <div key={name}>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "#1a1a1a", display: "block" }}>{name}</span>
                    <span style={{ fontSize: 10, color: "#2D2926", fontFamily: "sans-serif" }}>{note}</span>
                  </div>
                ))}
              </div>
            )}
            {(card as any).hasCta && (
              <div style={{ marginTop: 16 }}>
                {siteMode === "bake_day" ? (
                  <button
                    onClick={() => navigate("/reserve")}
                    style={{ width: "100%", height: 48, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff", background: "transparent", border: "1px solid rgba(255,255,255,0.35)", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 500 }}
                  >
                    Pre-order your box
                  </button>
                ) : (
                  <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>
                    Next drop coming soon
                  </span>
                )}
              </div>
            )}
            {card.footer && (
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "rgba(26,26,26,0.55)", marginTop: "auto" }}>
                {card.footer}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Add-ons ───────────────────────────────────────────────────────────────────

function AddOnsSection() {
  const [addons, setAddons] = useState<BakeryAddon[]>([]);

  useEffect(() => {
    const cached = readCache<BakeryAddon[]>(ADDONS_URL);
    if (cached) setAddons(cached.filter(a => a.available));
    revalidate<BakeryAddon[]>(ADDONS_URL, ADDONS_TTL).then(data => {
      if (data) setAddons(data.filter(a => a.available));
    });
  }, []);

  if (!addons.length) return null;

  return (
    <section style={{ background: "#faf8f4", padding: "40px 80px 40px 36px", borderTop: "0.5px solid rgba(15,36,25,0.08)" }}>
      <span style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(15,36,25,0.35)", display: "block", marginBottom: 20, fontFamily: "sans-serif" }}>
        Add-ons
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {addons.map(addon => {
          const waText = encodeURIComponent(`Hi! I'd like to add ${addon.title} (${formatPrice(addon.pricePaise)}) to my order.`);
          const closeDate = formatCloseDate(addon.preorderCloseDate);
          return (
            <div key={addon.id} style={{ border: "0.5px solid rgba(15,36,25,0.1)", background: "#fff", overflow: "hidden" }}>
              {addon.imageUrl && (
                <img src={addon.imageUrl} alt={addon.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
              )}
              <div style={{ padding: "12px 14px 16px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "#0f2419", marginBottom: 3 }}>{addon.title}</div>
                {addon.description && <div style={{ fontSize: 10, color: "rgba(15,36,25,0.48)", lineHeight: 1.6, marginBottom: 8, fontFamily: "sans-serif" }}>{addon.description}</div>}
                <div style={{ fontSize: 11, color: "#0f2419", fontWeight: 600, marginBottom: 8, fontFamily: "sans-serif" }}>{formatPrice(addon.pricePaise)}</div>
                {closeDate && <div style={{ fontSize: 8, color: "rgba(15,36,25,0.38)", marginBottom: 10, fontFamily: "sans-serif", letterSpacing: "0.1em" }}>Order by {closeDate}</div>}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 8, letterSpacing: "0.26em", textTransform: "uppercase", color: "#0f2419", fontWeight: 600, fontFamily: "sans-serif", textDecoration: "none" }}
                >
                  Order via WhatsApp →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Bakery() {
  const [view, setView] = useState(1);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const { mode: siteMode } = useSiteStatus();

  useEffect(() => {
    fetch(`${BASE}/api/settings`)
      .then(r => r.ok ? r.json() : {})
      .then((s: Record<string, string>) => setSettings(s))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f4" }}>
      <Header />

      {/* Spacer for fixed header + info strip */}
      <div style={{ height: 92 }} />

      <main className="flex-grow relative">
        <RightPanel siteMode={siteMode} />
        <ViewToggle view={view} setView={setView} />

        {/* Bake showcase — View 1 or View 2 */}
        <BakeShowcase view={view} settings={settings} />

        {/* Below showcase — same in both views */}
        <HowItWorks />
        <WhatWeOffer siteMode={siteMode} />
        <PhilosophyStack siteMode={siteMode} />
        <AddOnsSection />
        <div style={{ background: "#faf8f4" }}>
          <TestimonialsSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
