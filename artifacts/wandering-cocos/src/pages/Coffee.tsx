import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Coffee() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a120c" }}>
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Warm candlelit glow — amber-gold radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 58%, rgba(155, 96, 42, 0.22) 0%, rgba(120, 70, 28, 0.08) 50%, transparent 75%)"
        }} />
        {/* Subtle warm top light */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(200, 140, 60, 0.10) 0%, transparent 60%)"
        }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center py-40">
          <motion.span
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="block text-[10px] tracking-[0.42em] uppercase font-medium mb-10"
            style={{ color: "rgba(210, 160, 95, 0.72)" }}
          >
            Wandering Cocos · Specialty Coffee
          </motion.span>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-serif italic leading-tight mb-8"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", color: "#f5ede0" }}
          >
            Slow pour.<br />Single origin.<br />No shortcuts.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="font-light leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "rgba(240, 222, 195, 0.68)", maxWidth: "480px", margin: "0 auto 1.25rem" }}
          >
            We source beans the same way we source ingredients — obsessively. Every origin chosen for altitude, process, and the farmer behind it.
          </motion.p>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="font-light leading-relaxed mb-14"
            style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: "rgba(240, 222, 195, 0.45)", maxWidth: "440px", margin: "0 auto 3.5rem" }}
          >
            The Wandering Cocos coffee programme is being crafted carefully. Cold brews, pour-overs, and single-origin espressos — all coming soon.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="inline-block px-8 py-3 text-[10px] tracking-[0.35em] uppercase font-medium"
            style={{ border: "1px solid rgba(210,160,95,0.35)", color: "rgba(210,160,95,0.75)", borderRadius: "0.5rem" }}
          >
            Coming Soon
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
          >
            {[
              { label: "Ethio Yirgacheffe", note: "Floral · Citrus · Bright" },
              { label: "Coorg Estate", note: "Dark · Earthy · Bold" },
              { label: "Kerala Robusta", note: "Rich · Spice · Full Body" },
            ].map(({ label, note }) => (
              <div key={label} className="text-center">
                <p className="text-[10px] tracking-[0.18em] uppercase font-medium mb-1"
                  style={{ color: "rgba(210,160,95,0.65)" }}>{label}</p>
                <p className="text-[9px] leading-relaxed"
                  style={{ color: "rgba(240,222,195,0.38)" }}>{note}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
