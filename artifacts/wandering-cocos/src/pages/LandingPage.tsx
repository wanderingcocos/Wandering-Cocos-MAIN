import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSiteStatus } from "@/hooks/useSiteStatus";

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
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-4 md:mb-8" style={{ color: "rgba(26,26,26,0.35)" }}>
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
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-4 md:mb-8" style={{ color: "rgba(26,26,26,0.35)" }}>
                  The Philosophy
                </span>
                <h3 className="font-serif italic leading-snug mb-3 md:mb-5" style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)", color: "#1a1a1a" }}>
                  "Calories can be burnt.<br />Hidden ingredients cannot."
                </h3>
                <p className="font-light leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", color: "rgba(26,26,26,0.55)", maxWidth: "520px" }}>
                  We keep it transparent. Elevated. Honest. Because in a world of excess, true luxury is Clarity.
                </p>
              </div>
              <div>
                <div className="mb-5 md:mb-8">
                  <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-2 md:mb-3" style={{ color: "rgba(26,26,26,0.35)" }}>
                    The Cocos Balance
                  </span>
                  <p className="font-serif italic" style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", color: "rgba(26,26,26,0.6)" }}>
                    A conscious rhythm. A quiet discipline.
                  </p>
                </div>
                <div className="flex gap-4 md:gap-5">
                  <div className="flex-1 rounded-2xl py-6 px-5 md:py-10 md:px-8 text-center" style={{ background: "rgba(26,26,26,0.06)" }}>
                    <span className="font-serif italic block mb-2 md:mb-3" style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", color: "#1a1a1a" }}>90%</span>
                    <span className="font-light leading-snug" style={{ fontSize: "clamp(0.75rem, 1vw, 0.9rem)", color: "rgba(26,26,26,0.5)" }}>Clean. Move well.<br />Eat with awareness.</span>
                  </div>
                  <div className="flex-1 rounded-2xl py-6 px-5 md:py-10 md:px-8 text-center" style={{ background: "rgba(26,26,26,0.06)" }}>
                    <span className="font-serif italic block mb-2 md:mb-3" style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", color: "#1a1a1a" }}>10%</span>
                    <span className="font-light leading-snug" style={{ fontSize: "clamp(0.75rem, 1vw, 0.9rem)", color: "rgba(26,26,26,0.5)" }}>Indulgence. And when<br />you do, do it exceptionally.</span>
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
                <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-4 md:mb-8" style={{ color: "rgba(26,26,26,0.35)" }}>
                  The Earthy Way
                </span>
                <h3 className="font-serif italic leading-snug mb-3 md:mb-6" style={{ fontSize: "clamp(1.7rem, 3.5vw, 3rem)", color: "#1a1a1a" }}>
                  True luxury is found<br />in the soil.
                </h3>
                <p className="font-light leading-relaxed mb-5 md:mb-10" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", color: "rgba(26,26,26,0.55)", maxWidth: "560px" }}>
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
                    <span className="font-light" style={{ fontSize: "clamp(0.78rem, 1vw, 0.9rem)", color: "rgba(26,26,26,0.45)" }}>{note}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 4 — The Experience */}
            <motion.div
              style={{ y: card4Y, borderRadius: "24px", background: "#1a3a2a", boxShadow: "0 20px 80px rgba(0,0,0,0.3)" }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-8 md:p-16"
            >
              <span className="text-[10px] tracking-[0.3em] font-medium uppercase block mb-5 md:mb-10" style={{ color: "rgba(255,255,255,0.3)" }}>
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
                    RESERVE YOUR BOX
                  </button>
                ) : (
                  <span className="text-xs tracking-[0.22em] uppercase font-medium px-6 py-2" style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.18)" }}>
                    {siteMode === "sold_out" ? "Sold Out · Next drop coming soon" : siteMode === "popup" ? "Pop-Up this week · Orders resume next week" : "Baking in progress · Check back soon"}
                  </span>
                )}
                <p className="text-xs tracking-widest uppercase mt-4 font-light" style={{ color: "rgba(255,255,255,0.25)" }}>
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
              <span className="font-serif text-5xl md:text-7xl lg:text-[6rem] leading-none text-white font-bold drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
                Wandering Cocos: <br className="hidden md:block"/> Rare Finds. Reimagined.
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
              Curated treats with uncompromised ingredients.<br className="hidden md:block"/>
              You control the journey.
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
                  onClick={() => { const el = document.getElementById("menu"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" }); }}
                  className="w-full sm:w-64 h-14 text-xs tracking-[0.2em] font-medium uppercase whitespace-nowrap border border-accent bg-accent text-accent-foreground hover:bg-accent/90 hover:border-accent/90 transition-all"
                >
                  RESERVE YOUR BOX
                </button>
              ) : (
                <span className="w-full sm:w-64 h-14 flex items-center justify-center text-xs tracking-[0.18em] uppercase font-medium whitespace-nowrap border border-white/20 text-white/40">
                  {siteMode === "sold_out" ? "Sold Out" : siteMode === "popup" ? "Orders Paused" : "Coming Soon"}
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

        {/* CURRENT DROP SECTION */}
        <section id="menu" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-16 md:mb-20 text-center"
          >
            <span className="text-xs tracking-[0.2em] text-muted-foreground/60 font-medium uppercase block mb-5">The Launch Drop</span>
            <h2 className="font-serif italic text-4xl md:text-5xl text-foreground mb-4">
              The Wandering Box
            </h2>
            <p className="font-serif italic text-lg text-foreground/60 mb-1">
              Do you eat with your eyes first?
            </p>
            <p className="font-serif italic text-sm text-foreground/40 mb-3">
              (Good, because this is a "Don't Lick the Screen" Gallery)
            </p>
          </motion.div>

          {/* 6-item product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Card 1 — Bagels */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col group"
            >
              <div className="w-full aspect-[3/4] overflow-hidden mb-0">
                <img src={`${import.meta.env.BASE_URL}images/bagels.png`} alt="New York Style Bagels" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4 pb-5 px-1 border-t-2 mt-0" style={{ borderColor: "#2d5a3d" }}>
                <p className="font-serif text-sm font-medium text-foreground leading-snug mb-1">The New York Bagels</p>
                <p className="text-xs text-foreground/50 leading-relaxed font-light">Blistered, chewy crust. Pillowy interior. Cream Cheese + Toasted Onion or Sharp Cheddar + Charred Jalapeño. Hand-rolled, boiled, baked to order.</p>
              </div>
            </motion.div>

            {/* Card 2 — Almond Croissant Blondie */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col group"
            >
              <div className="w-full aspect-[3/4] overflow-hidden mb-0">
                <img src={`${import.meta.env.BASE_URL}images/almond-croissant-blondie.png`} alt="Almond Croissant Blondie" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4 pb-5 px-1 border-t-2 mt-0" style={{ borderColor: "#2d5a3d" }}>
                <p className="font-serif text-sm font-medium text-foreground leading-snug mb-1">Almond Croissant Blondie</p>
                <p className="text-xs text-foreground/50 leading-relaxed font-light">Fudgy, butter-rich center layered with silky almond frangipane. Crackled sugar crust. Toasted almond finish. Indulgent without apology.</p>
              </div>
            </motion.div>

            {/* Card 3 — Cardamom Pistachio Twist */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col group"
            >
              <div className="w-full aspect-[3/4] overflow-hidden mb-0">
                <img src={`${import.meta.env.BASE_URL}images/pastry-cardamom.png`} alt="Aromatic Cardamom Pistachio Cream Twist" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4 pb-5 px-1 border-t-2 mt-0" style={{ borderColor: "#2d5a3d" }}>
                <p className="font-serif text-sm font-medium text-foreground leading-snug mb-1">Aromatic Cardamom Pistachio Cream Twist</p>
                <p className="text-xs text-foreground/50 leading-relaxed font-light">Cardamom-spiced dough wound with pistachio cream, finished with crushed pistachios. Warm, fragrant, and quietly rich.</p>
              </div>
            </motion.div>

            {/* Card 4 — Pistachio Cream Rolls */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col group"
            >
              <div className="w-full aspect-[3/4] overflow-hidden mb-0">
                <img src={`${import.meta.env.BASE_URL}images/pistachio-cream-rolls.png`} alt="Pistachio Cream Rolls" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4 pb-5 px-1 border-t-2 mt-0" style={{ borderColor: "#2d5a3d" }}>
                <p className="font-serif text-sm font-medium text-foreground leading-snug mb-1">Pistachio Cream Rolls</p>
                <p className="text-xs text-foreground/50 leading-relaxed font-light">Pull-apart brioche drenched in silky pistachio cream. Soft, fragrant layers. Finished with crushed pistachios. Rich and unmistakable.</p>
              </div>
            </motion.div>

            {/* Card 5 — Spiced Phyllo Rolls */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col group"
            >
              <div className="w-full aspect-[3/4] overflow-hidden mb-0">
                <img src={`${import.meta.env.BASE_URL}images/phyllo-rolls.png`} alt="Spiced Phyllo Rolls" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4 pb-5 px-1 border-t-2 mt-0" style={{ borderColor: "#2d5a3d" }}>
                <p className="font-serif text-sm font-medium text-foreground leading-snug mb-1">Spiced Phyllo Rolls</p>
                <p className="text-xs text-foreground/50 leading-relaxed font-light">Paper-thin phyllo, shatteringly crisp. Feta cheese filling. Warm honey glaze, scattered sesame and dried chili. Sweet heat with every crunch.</p>
              </div>
            </motion.div>

            {/* Card 6 — Kerala Mutta Puffs */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col group"
            >
              <div className="w-full aspect-[3/4] overflow-hidden mb-0">
                <img src={`${import.meta.env.BASE_URL}images/kerala-mutta-puffs.png`} alt="Kerala Mutta Puffs" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4 pb-5 px-1 border-t-2 mt-0" style={{ borderColor: "#2d5a3d" }}>
                <p className="font-serif text-sm font-medium text-foreground leading-snug mb-1">Kerala Mutta Puffs</p>
                <p className="text-xs text-foreground/50 leading-relaxed font-light">Burnished, laminated pastry. Shatters at the edge, yields at the heart. Spiced Kerala egg masala within. A classic, made with intention.</p>
              </div>
            </motion.div>

          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mt-14 text-center"
          >
            {siteMode === "bake_day" ? (
              <button onClick={() => navigate("/reserve")} className="w-full max-w-md px-8 py-5 text-sm tracking-[0.2em] font-medium uppercase border border-accent bg-accent text-accent-foreground hover:bg-accent/90 hover:border-accent/90 transition-all mb-6">
                RESERVE MY BAKE BOX
              </button>
            ) : (
              <div className="w-full max-w-md px-8 py-5 mb-6 border border-border/30 text-center">
                <p className="text-xs tracking-[0.2em] uppercase font-medium text-foreground/40">
                  {siteMode === "sold_out" ? "Sold Out · Follow us for the next drop" : siteMode === "popup" ? "Pop-Up this week · Online orders resume next week" : "Baking in progress · Check back soon"}
                </p>
              </div>
            )}
            <p className="text-xs text-foreground/50 max-w-lg mx-auto leading-relaxed">
              Because we use zero chemicals and 100% natural ingredients, these treats are best enjoyed the day they arrive. We bake only what is reserved to ensure zero waste.
            </p>
          </motion.div>
        </section>

        {/* CURRENT DISCOVERIES SECTION */}
        <section id="discoveries" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <h2 className="text-xs md:text-sm tracking-[0.2em] font-medium uppercase text-muted-foreground">
              CURRENT DISCOVERIES
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Card 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-8 bg-surface">
                <img 
                  src={`${import.meta.env.BASE_URL}images/pastry-cardamom.png`}
                  alt="Aromatic Cardamom Pistachio Cream Twist"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[0.22,1,0.36,1]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
              <h3 className="font-serif text-3xl text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                Aromatic Cardamom Pistachio Cream Twist
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 font-light max-w-md">
                Hand-picked cardamom from Kerala's misty highlands, folded into delicate laminated pastry with a pistachio cream heart.
              </p>
            </motion.div>

            {/* Card 2 - Offset slightly on desktop */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="group cursor-pointer md:mt-24"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-8 bg-surface">
                <img 
                  src={`${import.meta.env.BASE_URL}images/almond-croissant-blondie.png`}
                  alt="Almond Croissant Blondie"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[0.22,1,0.36,1]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
              <h3 className="font-serif text-3xl text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                Almond Croissant Blondie
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 font-light max-w-md">
                A love letter to almond croissant lovers. A buttery, chewy blondie layered with house-made almond frangipane and finished with toasted almonds and a delicate dusting of sugar. Familiar, refined, and deeply indulgent.
              </p>
            </motion.div>
          </div>
        </section>

        {/* PHILOSOPHY — Sticky Stacking Cards */}
        <PhilosophyStackSection />

        {/* HOW WE WANDER SECTION — Phone Scroll */}
        <WayOfTheCocoSection fadeInUp={fadeInUp} />

      </main>

      <Footer />
    </div>
  );
}
