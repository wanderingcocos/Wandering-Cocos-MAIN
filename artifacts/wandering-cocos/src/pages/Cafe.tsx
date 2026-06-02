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

export default function Cafe() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f7f3ed" }}>
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Soft garden light wash */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.55) 0%, transparent 70%)"
        }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center py-40">
          <motion.span
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="block text-[10px] tracking-[0.42em] uppercase font-medium mb-10"
            style={{ color: "rgba(85,100,75,0.55)" }}
          >
            Wandering Cocos · Café
          </motion.span>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-serif italic leading-tight mb-8"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", color: "#2a3520" }}
          >
            A table in the garden.<br />Nowhere to be.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="font-light leading-relaxed mb-5"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "rgba(42,53,32,0.6)", maxWidth: "490px", margin: "0 auto 1.25rem" }}
          >
            White linen. Dappled light. A long breakfast that stretches into afternoon. The Wandering Cocos café is designed around that feeling.
          </motion.p>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="font-light leading-relaxed mb-14"
            style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: "rgba(42,53,32,0.4)", maxWidth: "440px", margin: "0 auto 3.5rem" }}
          >
            An outdoor dining experience in the works — garden seating, honest food, and a menu rooted in the same philosophy as everything we make. Location reveal coming soon.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="inline-block px-8 py-3 text-[10px] tracking-[0.35em] uppercase font-medium"
            style={{ border: "1px solid rgba(85,100,75,0.25)", color: "rgba(85,100,75,0.65)" }}
          >
            Coming Soon
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {[
              { label: "Garden Seating", note: "Open-air, always" },
              { label: "Weekend Brunch", note: "No rush, ever" },
              { label: "Clean Menu", note: "Real ingredients" },
              { label: "Bengaluru", note: "Location TBA" },
            ].map(({ label, note }) => (
              <div key={label} className="text-center">
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: "rgba(42,53,32,0.45)" }}>{label}</p>
                <p className="text-[9px] italic" style={{ color: "rgba(42,53,32,0.3)" }}>{note}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
