import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
const heroRoad = `${import.meta.env.BASE_URL}images/hero-road.jpg`;
const mountainPhoto = `${import.meta.env.BASE_URL}images/mountain-kyrgyz.png`;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Testimonial = { id: number; authorName: string; location: string | null; body: string; position: number };

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col gap-5 p-8"
      style={{
        width: "clamp(280px, 32vw, 400px)",
        border: "1px solid rgba(15,36,25,0.1)",
        background: "rgba(15,36,25,0.02)",
      }}
    >
      <p
        className="font-serif italic leading-relaxed flex-1"
        style={{ fontSize: "clamp(1rem, 1.3vw, 1.1rem)", color: "#0f2419" }}
      >
        "{t.body}"
      </p>
      <div style={{ borderTop: "1px solid rgba(15,36,25,0.08)", paddingTop: "1rem" }}>
        <p
          className="text-[10px] tracking-[0.22em] uppercase font-medium"
          style={{ color: "#0F2419" }}
        >
          {t.authorName}
          {t.location && (
            <span style={{ color: "#0F2419" }}> · {t.location}</span>
          )}
        </p>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/testimonials`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setTestimonials(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const needsQuad = testimonials.length < 4;
  const items = needsQuad
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : [...testimonials, ...testimonials];
  const duration = testimonials.length * (needsQuad ? 16 : 8);

  return (
    <section className="border-t border-border/30 bg-background py-24 overflow-hidden">
      <motion.span
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="block text-[10px] tracking-[0.35em] uppercase font-medium mb-14 text-center px-6"
        style={{ color: "#0F2419" }}
      >
        What people are saying
      </motion.span>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-6"
          style={{
            animation: `marquee-scroll ${duration}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {items.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

const wanderSteps = [
  {
    number: "01",
    title: "The Discovery",
    body: "We bake on nature's timing, not a schedule. If the elements are not at their peak, the ovens stay cold. We choose patience over production. Nature's rhythm, not a commercial one.",
  },
  {
    number: "02",
    title: "The 72-Hour Signal",
    body: "Watch the horizon. When the alignment is perfect, we release the signal: our Bake Window is announced 72 hours in advance. A curated menu, revealed only when certain.",
  },
  {
    number: "03",
    title: "The Secure Find",
    body: "Exclusively by reservation. We bake only for those who commit. By eliminating waste and prioritizing integrity, we maintain absolute control. Once the oven is full, the window closes.",
  },
];

function WayOfTheCocoSection({ fadeInUp }: { fadeInUp: Record<string, unknown> }) {
  return (
    <section id="way-of-the-coco" className="relative overflow-hidden border-t border-border/40 bg-[#0c0d0a]" style={{ minHeight: "85vh" }}>
      <img
        src={`${import.meta.env.BASE_URL}images/woc-bg.png`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none object-contain sm:object-cover"
        style={{ objectPosition: "center center" }}
      />
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.42) 100%)" }} />

      <div className="relative z-10 px-8 md:px-14 lg:px-20 pt-14 pb-14 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="text-center mb-10 w-full"
        >
          <span className="text-[10px] tracking-[0.32em] font-medium uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
            The Way of the Coco
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full">
          {wanderSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col p-5 md:p-6"
              style={{ border: "1px solid rgba(255,255,255,0.18)", borderRadius: "12px", background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            >
              <h3 className="font-serif italic leading-snug mb-4" style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)", color: "#ffffff" }}>
                {step.title}
              </h3>
              <p className="font-light leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)", color: "rgba(255,255,255,0.65)", letterSpacing: "0.01em" }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialSection() {
  return (
    <section className="py-24 md:py-36 px-6 md:px-14 lg:px-20 bg-background border-t border-border/15">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 md:gap-12 lg:gap-20 items-center">

          {/* Left — ~40% text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-[40%] order-1"
          >
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.6rem, 4.5vw, 4.2rem)",
              lineHeight: 1.08,
              color: "#0f2419",
              letterSpacing: "-0.01em",
            }}>
              Somewhere<br />between the road<br />and home.
            </h2>
            <p className="mt-8 font-light leading-relaxed" style={{
              fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
              color: "rgba(45,41,38,0.58)",
              letterSpacing: "0.02em",
            }}>
              This, over everything else.
            </p>
          </motion.div>

          {/* Right — ~60% photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="w-full md:w-[60%] order-2 relative overflow-hidden"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={mountainPhoto}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 22%" }}
            />
            <div
              className="absolute bottom-4 right-5 z-10 pointer-events-none select-none"
              style={{
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.88)",
                fontWeight: 500,
              }}
            >
              Wandering Cocos &nbsp;&middot;&nbsp; Ala Archa National Park &nbsp;&middot;&nbsp; Kyrgyzstan
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a1a0f]">

          {/* Road photograph — full bleed */}
          <img
            src={heroRoad}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
            style={{ filter: "brightness(0.78)" }}
          />

          {/* Subtle gradient overlay for legibility */}
          <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(8,18,10,0.3) 0%, rgba(8,18,10,0.08) 45%, rgba(8,18,10,0.55) 100%)" }} />

          {/* Headline */}
          <div className="relative z-10 text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, delay: 0.15, ease: "easeOut" }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(3.4rem, 8.5vw, 7.5rem)",
                lineHeight: 1.04,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              Mood first.<br />Always.
            </motion.h1>
          </div>

          {/* Location marker — bottom right */}
          <div
            className="absolute bottom-4 right-5 z-10 pointer-events-none select-none"
            style={{
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.88)",
              fontWeight: 500,
            }}
          >
            Wandering Cocos &nbsp;&middot;&nbsp; Cape Town to Hermanus Road &nbsp;&middot;&nbsp; South Africa
          </div>
        </section>

        {/* EDITORIAL SECTION */}
        <EditorialSection />

        {/* HOW WE WANDER SECTION */}
        <WayOfTheCocoSection fadeInUp={fadeInUp} />

        {/* TESTIMONIALS */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
}
