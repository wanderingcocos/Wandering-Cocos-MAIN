/**
 * HeroManifesto.tsx
 * 
 * Full-bleed hero section with the "Mood first" manifesto overlay.
 * Background image is fully controllable from the Admin → Settings panel.
 * 
 * Admin setting keys used:
 *   hero_bg_url     — URL of the background image or video
 *   hero_bg_type    — "image" or "video" (defaults to "image")
 *   hero_manifesto  — override the manifesto body text (optional)
 * 
 * Place this file at:
 *   artifacts/wandering-cocos/src/components/HeroManifesto.tsx
 * 
 * Then in Home.tsx replace your existing hero with:
 *   import { HeroManifesto } from "@/components/HeroManifesto";
 *   <HeroManifesto settings={settings} />
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// Default Cape mountain road image — replace with your own in admin
const DEFAULT_BG = `${BASE}/images/hero-road.jpg`;

const DEFAULT_MANIFESTO = ``;

const TAGLINE = "Mood first. Always.";

type HeroManifestoProps = {
  settings?: Record<string, string>;
};

export function HeroManifesto({ settings = {} }: HeroManifestoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax on the background
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  // Text fades out as you scroll away
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const bgUrl = settings.hero_bg_url || DEFAULT_BG;
  const bgType = settings.hero_bg_type || "image";
  const manifestoText = settings.hero_manifesto || DEFAULT_MANIFESTO;

  // Split into paragraphs for staggered reveal
  const paragraphs = manifestoText.split("\n").filter(Boolean);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560 }}
      aria-label="Wandering Cocos manifesto"
    >
      {/* ── Background ─────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, height: "110%" }}
      >
        {bgType === "video" ? (
          <video
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.62) saturate(0.85)" }}
          >
            <source src={bgUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={bgUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.62) saturate(0.85)" }}
          />
        )}
      </motion.div>

      {/* ── Gradient layers ────────────────────────────────────── */}
      {/* Top vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* ── Text content ───────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end"
        style={{ opacity: textOpacity }}
      >
        <div className="px-6 md:px-14 lg:px-20 pb-14 md:pb-20 max-w-3xl">

          {/* Manifesto paragraphs */}
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.3 + i * 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)",
                color: "rgba(245,238,224,0.78)",
                lineHeight: 1.72,
                marginBottom: i < paragraphs.length - 1 ? "1.1em" : "1.8em",
                fontStyle: "italic",
                letterSpacing: "0.01em",
              }}
            >
              {para}
            </motion.p>
          ))}

          {/* Tagline — larger, bolder */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.3 + paragraphs.length * 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
              color: "rgba(245,238,224,0.95)",
              lineHeight: 1.1,
              fontStyle: "italic",
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </motion.p>

          {/* Brand line */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            style={{
              display: "block",
              marginTop: "1rem",
              fontSize: "9px",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(245,238,224,0.38)",
              fontFamily: "sans-serif",
            }}
          >
            Wandering Cocos
          </motion.span>
        </div>
      </motion.div>

      {/* ── Scroll indicator ───────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) as any }}
      >
        <span
          style={{
            fontSize: "8px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "sans-serif",
          }}
        >
          Scroll
        </span>
        <motion.div
          style={{ width: 1, height: 32, background: "rgba(255,255,255,0.22)" }}
          animate={{ scaleY: [1, 0.35, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
