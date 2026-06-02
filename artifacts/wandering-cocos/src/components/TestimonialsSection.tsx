import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Testimonial = { id: number; authorName: string; location: string | null; body: string; position: number };

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col gap-5 p-8"
      style={{
        width: "clamp(280px, 32vw, 400px)",
        borderRadius: "1.5rem",
        border: "2px solid rgba(139, 90, 43, 0.1)",
        background: "rgba(255, 252, 246, 0.92)",
        boxShadow: "0 6px 24px rgba(93, 56, 24, 0.07), 0 2px 6px rgba(93, 56, 24, 0.04)",
      }}
    >
      <p
        className="font-serif italic leading-relaxed flex-1"
        style={{ fontSize: "clamp(1rem, 1.3vw, 1.1rem)", color: "#2a4820" }}
      >
        "{t.body}"
      </p>
      <div style={{ borderTop: "1px solid rgba(139, 90, 43, 0.1)", paddingTop: "1rem" }}>
        <p
          className="text-[10px] tracking-[0.22em] uppercase font-medium"
          style={{ color: "rgba(42,72,32,0.55)" }}
        >
          {t.authorName}
          {t.location && (
            <span style={{ color: "rgba(42,72,32,0.38)" }}> · {t.location}</span>
          )}
        </p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
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
        style={{ color: "rgba(42,72,32,0.45)" }}
      >
        What people are saying
      </motion.span>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-6 px-6"
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
