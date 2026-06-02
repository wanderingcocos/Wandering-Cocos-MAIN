import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSiteStatus } from "@/hooks/useSiteStatus";

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
      {/* Background image */}
      <img
        src={`${import.meta.env.BASE_URL}images/woc-bg.png`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none object-contain sm:object-cover"
        style={{ objectPosition: "center center" }}
      />
      {/* Subtle dark vignette for text legibility — keeps image vivid */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.42) 100%)" }} />

      <div className="relative z-10 px-8 md:px-14 lg:px-20 pt-14 pb-14 max-w-7xl mx-auto flex flex-col items-center">

        {/* Section label */}
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

        {/* 3-column ghost cards */}
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

function PhilosophyStackSection() {
  const [, navigate] = useLocation();
  const { mode: siteMode } = useSiteStatus();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const card2Y = useTransform(scrollYProgress, [0.14, 0.36], ["108%", "0%"]);
  const card3Y = useTransform(scrollYProgress, [0.42, 0.63], ["108%", "0%"]);
  const card4Y = useTransform(scrollYProgress, [0.68, 0.88], ["108%", "0%"]);
  const ctaOpacity = useTransform(scrollYProgress, [0.88, 0.98], [0, 1]);
  const ctaPointerEvents = useTransform(ctaOpacity, (v) => (v > 0.5 ? "auto" : "none"));

  return (
    <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
      <div
        id="philosophy"
        className="sticky top-0 overflow-hidden"
        style={{ height: "100dvh", backgroundColor: "#0f2419" }}
      >
        {/* Full-width card stack */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-12 pt-[104px] pb-4 md:pt-32 md:pb-12">
          <div className="relative w-full max-w-5xl flex-1 min-h-0" style={{ maxHeight: "min(820px, calc(100dvh - 176px))" }}>

            {/* Card 1 — Built for the Conscious Eater */}
            <div
              className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-14"
              style={{ borderRadius: "24px", background: "#f5f0e8", boxShadow: "0 12px 60px rgba(0,0,0,0.14)" }}
            >
              <div>
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-4 md:mb-8" style={{ color: "#2D2926" }}>
                  Wandering Cocos
                </span>
                <h3 className="font-serif italic leading-snug mb-2 md:mb-3" style={{ fontSize: "clamp(1.7rem, 3.5vw, 3rem)", color: "#1a1a1a" }}>
                  Built for the<br />Conscious Eater
                </h3>
                <p className="font-light leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", color: "rgba(26,26,26,0.6)", maxWidth: "560px" }}>
                  We don't do ordinary indulgence.<br />At Wandering Cocos, every creation begins with a quiet discipline. We stripped away the noise of the modern pantry: the hidden fillers, the industrial sugars, the empty compromises.
                </p>
              </div>
              <p className="font-serif italic" style={{ fontSize: "clamp(1rem, 1.8vw, 1.4rem)", color: "rgba(26,26,26,0.65)", lineHeight: "1.6" }}>
                Only what belongs. Nothing that doesn't.
              </p>
            </div>

            {/* Card 2 — The Philosophy + The Cocos Balance */}
            <motion.div
              style={{ y: card2Y, borderRadius: "24px", background: "#ece6da", boxShadow: "0 16px 70px rgba(0,0,0,0.16)" }}
              className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-14"
            >
              <div>
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-4 md:mb-8" style={{ color: "#2D2926" }}>
                  The Philosophy
                </span>
                <h3 className="font-serif italic leading-snug mb-3 md:mb-5" style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)", color: "#1a1a1a" }}>
                  "Calories can be burnt.<br />Hidden ingredients cannot."
                </h3>
                <p className="font-light leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", color: "#2D2926", maxWidth: "520px" }}>
                  We keep it transparent. Elevated. Honest. Because in a world of excess, true luxury is Clarity.
                </p>
              </div>
              <div>
                <div className="mb-5 md:mb-8">
                  <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-2 md:mb-3" style={{ color: "#2D2926" }}>
                    The Cocos Balance
                  </span>
                  <p className="font-serif italic" style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", color: "rgba(26,26,26,0.6)" }}>
                    A conscious rhythm. A quiet discipline.
                  </p>
                </div>
                <div className="flex gap-4 md:gap-5">
                  <div className="flex-1 rounded-2xl py-6 px-5 md:py-10 md:px-8 text-center" style={{ background: "rgba(26,26,26,0.06)" }}>
                    <span className="font-serif italic block mb-2 md:mb-3" style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", color: "#1a1a1a" }}>90%</span>
                    <span className="font-light leading-snug" style={{ fontSize: "clamp(0.75rem, 1vw, 0.9rem)", color: "#2D2926" }}>Clean. Move well.<br />Eat with awareness.</span>
                  </div>
                  <div className="flex-1 rounded-2xl py-6 px-5 md:py-10 md:px-8 text-center" style={{ background: "rgba(26,26,26,0.06)" }}>
                    <span className="font-serif italic block mb-2 md:mb-3" style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", color: "#1a1a1a" }}>10%</span>
                    <span className="font-light leading-snug" style={{ fontSize: "clamp(0.75rem, 1vw, 0.9rem)", color: "#2D2926" }}>Indulgence. And when<br />you do, do it exceptionally.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 — The Earthy Way */}
            <motion.div
              style={{ y: card3Y, borderRadius: "24px", background: "#e0d9cc", boxShadow: "0 18px 75px rgba(0,0,0,0.17)" }}
              className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-14"
            >
              <div>
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-4 md:mb-8" style={{ color: "#2D2926" }}>
                  The Earthy Way
                </span>
                <h3 className="font-serif italic leading-snug mb-3 md:mb-6" style={{ fontSize: "clamp(1.7rem, 3.5vw, 3rem)", color: "#1a1a1a" }}>
                  True luxury is found<br />in the soil.
                </h3>
                <p className="font-light leading-relaxed mb-5 md:mb-10" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", color: "#2D2926", maxWidth: "560px" }}>
                  We believe the most refined flavour is the one closest to the earth. Our process is a return to purity, where every element is chosen for its raw origin.
                </p>
              </div>
              <div className="space-y-3 md:space-y-5">
                {[
                  { name: "Digitally-Milled Flours", note: "We use 100% natural, additive-free flour. Superior nutrition and easier digestion, baked into every bite." },
                  { name: "Botanical Nectars", note: "Sun-cured Dates, mineral-dense Coconut Sugar, and raw Wildflower Honey. Sweetness in its most primal form." },
                  { name: "Noble Fats", note: "Cold-extracted and nutrient-dense. Sourced for the body's rhythm, not the shelf-life." },
                ].map(({ name, note }, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="font-serif italic flex-shrink-0" style={{ fontSize: "clamp(1rem, 1.5vw, 1.3rem)", color: "#1a1a1a" }}>{name}</span>
                    <span className="font-light" style={{ fontSize: "clamp(0.78rem, 1vw, 0.9rem)", color: "#2D2926" }}>{note}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 4 — The Experience */}
            <motion.div
              style={{ y: card4Y, borderRadius: "24px", background: "#1a3a2a", boxShadow: "0 20px 80px rgba(0,0,0,0.3)" }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-8 md:p-16"
            >
              <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-5 md:mb-10" style={{ color: "rgba(245,238,224,0.85)" }}>
                The Experience
              </span>
              <p className="font-serif italic leading-tight mb-5 md:mb-8" style={{ fontSize: "clamp(2rem, 4vw, 3.8rem)", color: "#ffffff" }}>
                No noise.<br />No guilt.<br />No compromise.
              </p>
              <p className="font-light leading-relaxed mb-7 md:mb-12" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", color: "rgba(255,255,255,0.5)", maxWidth: "380px" }}>
                Just the freedom to indulge in its cleanest, most intentional form.
              </p>
              <motion.div style={{ opacity: ctaOpacity, pointerEvents: ctaPointerEvents }} className="flex flex-col items-center">
                {siteMode === "bake_day" ? (
                  <button
                    onClick={() => navigate("/reserve")}
                    className="w-72 h-14 text-xs tracking-[0.22em] font-medium uppercase transition-all duration-300"
                    style={{ background: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.4)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    PRE-ORDER YOUR BOX
                  </button>
                ) : (
                  <span className="text-xs tracking-[0.22em] uppercase font-medium px-6 py-2" style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.18)" }}>
                    {siteMode === "sold_out" ? "Sold Out · Next drop coming soon" : siteMode === "popup" ? "Pop-Up this week · Orders resume next week" : siteMode === "chef_on_break" ? "Chef on Break · Back soon" : "Baking in progress · Check back soon"}
                  </span>
                )}
                <p className="text-xs tracking-widest uppercase mt-4 font-light" style={{ color: "rgba(245,238,224,0.75)" }}>
                  Limited batches. Crafted with intent.
                </p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { mode: siteMode } = useSiteStatus();
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-28 overflow-hidden bg-[#0a1a0f]">
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ filter: "brightness(0.55) saturate(0.85)" }}
          >
            <source src={`${import.meta.env.BASE_URL}images/bakery-ref-video.mp4`} type="video/mp4" />
          </video>

          {/* Dark gradient overlays for legibility */}
          <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(10,26,15,0.45) 0%, rgba(10,26,15,0.15) 45%, rgba(10,26,15,0.65) 100%)" }} />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-12 md:mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: "easeOut" } }
              }}
              className="mb-6"
            >
              <span className="text-xs md:text-sm tracking-[0.3em] font-medium uppercase text-white/70">
                THE NEXT CHAPTER
              </span>
            </motion.div>

            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2, ease: "easeOut" } }
              }}
              className="flex flex-col gap-2 md:gap-6"
            >
              <span className="font-serif text-4xl md:text-5xl lg:text-[5rem] leading-none text-white font-bold drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
                Wandering Cocos: Artisanal Sourdough &amp; Bakes.
              </span>
            </motion.h1>

            <motion.p 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 1, delay: 0.6 } }
              }}
              className="mt-8 md:mt-12 text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed font-light"
            >
              Stay Fit. Eat Real. Indulge often.<br className="hidden md:block"/>
              Curated treats with uncompromised ingredients.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.9, ease: "easeOut" } }
              }}
              id="join"
              className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              {siteMode === "bake_day" ? (
                <button
                  onClick={() => navigate("/reserve")}
                  className="w-full sm:w-64 h-14 text-xs tracking-[0.2em] font-medium uppercase whitespace-nowrap border border-accent bg-accent text-accent-foreground hover:bg-accent/90 hover:border-accent/90 transition-all"
                >
                  PRE-ORDER YOUR BOX
                </button>
              ) : (
                <span className="w-full sm:w-64 h-14 flex items-center justify-center text-xs tracking-[0.18em] uppercase font-medium whitespace-nowrap border border-white/20 text-white/40">
                  {siteMode === "sold_out" ? "Sold Out" : siteMode === "popup" ? "Orders Paused" : siteMode === "chef_on_break" ? "Chef on Break" : "Coming Soon"}
                </span>
              )}
              <button
                onClick={() => navigate("/join")}
                className="w-full sm:w-64 h-14 text-xs tracking-[0.2em] font-medium uppercase whitespace-nowrap border border-white/70 text-white hover:bg-white hover:text-[#0a1a0f] transition-all"
              >
                JOIN THE CIRCLE
              </button>
            </motion.div>
          </div>
        </section>

        {/* PHILOSOPHY — Sticky Stacking Cards */}
        <PhilosophyStackSection />

        {/* HOW WE WANDER SECTION — Phone Scroll */}
        <WayOfTheCocoSection fadeInUp={fadeInUp} />

        {/* TESTIMONIALS */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
}
