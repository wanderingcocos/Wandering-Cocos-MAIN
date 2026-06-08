import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const DEFAULT_BG = `${BASE}/images/hero-road.jpg`;

type HeroManifestoProps = {
  settings?: Record<string, string>;
};

export function HeroManifesto({ settings = {} }: HeroManifestoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const bgUrl = settings.hero_bg_url || DEFAULT_BG;
  const bgType = settings.hero_bg_type || "image";

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560 }}
      aria-label="Wandering Cocos"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, height: "110%" }}
      >
        {bgType === "video" ? (
          <video
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.6) saturate(0.85)" }}
          >
            <source src={bgUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={bgUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.6) saturate(0.85)" }}
          />
        )}
      </motion.div>

      {/* Gradient — heavier at bottom for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Tagline — bottom left, large, clean */}
      <motion.div
        className="absolute"
        style={{
          bottom: "clamp(2.5rem, 7vw, 5rem)",
          left: "clamp(1.5rem, 5vw, 5rem)",
          opacity: textOpacity,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            color: "rgba(245,238,224,0.95)",
            lineHeight: 1.05,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}
        >
          Mood first.<br />Always.
        </motion.h1>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            display: "block",
            marginTop: "1.2rem",
            fontSize: "9px",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(245,238,224,0.35)",
            fontFamily: "sans-serif",
          }}
        >
          Wandering Cocos
        </motion.span>
      </motion.div>

      {/* Scroll indicator */}
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
            color: "rgba(255,255,255,0.28)",
            fontFamily: "sans-serif",
          }}
        >
          Scroll
        </span>
        <motion.div
          style={{ width: 1, height: 32, background: "rgba(255,255,255,0.2)" }}
          animate={{ scaleY: [1, 0.35, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
