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

export default function Shop() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto text-center py-40">
          <motion.span
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="block text-[10px] tracking-[0.42em] uppercase font-medium mb-10"
            style={{ color: "rgba(15,36,25,0.45)" }}
          >
            Wandering Cocos · Merchandise
          </motion.span>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-serif italic leading-tight mb-8"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", color: "#0f2419" }}
          >
            Gear that earns<br />its place.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="font-light leading-relaxed mb-5"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "rgba(15,36,25,0.55)", maxWidth: "480px", margin: "0 auto 1.25rem" }}
          >
            Heavyweight basics. Nothing with a logo that screams. Everything built for the gym, the road, and the kitchen.
          </motion.p>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="font-light leading-relaxed mb-14"
            style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: "rgba(15,36,25,0.38)", maxWidth: "440px", margin: "0 auto 3.5rem" }}
          >
            Tote bags, training wear, and a few things you'll carry everywhere. The Wandering Cocos shop is being stocked with intent. Back soon.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="inline-block px-8 py-3 text-[10px] tracking-[0.35em] uppercase font-medium"
            style={{ border: "1px solid rgba(15,36,25,0.18)", color: "rgba(15,36,25,0.5)" }}
          >
            Coming Soon
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="mt-20 flex flex-col sm:flex-row justify-center gap-10"
          >
            {[
              { label: "Tote Bags", note: "Carry it everywhere. Let others wonder." },
              { label: "Training Wear", note: "Heavy GSM. Minimal branding. Earned." },
              { label: "Kitchen Goods", note: "For those who cook with discipline." },
            ].map(({ label, note }) => (
              <div key={label} className="text-center max-w-[160px] mx-auto">
                <div className="w-12 h-px mx-auto mb-4" style={{ background: "rgba(15,36,25,0.12)" }} />
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1.5" style={{ color: "rgba(15,36,25,0.5)" }}>{label}</p>
                <p className="text-[9px] leading-relaxed" style={{ color: "rgba(15,36,25,0.35)" }}>{note}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
