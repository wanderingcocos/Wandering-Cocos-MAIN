import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WA_NUMBER } from "@/lib/constants";

const faqs = [
  {
    q: "How do I order?",
    a: "Fill out the pre-order form, pay via UPI, and confirm on WhatsApp. We only bake what's pre-ordered. No walk-ins, no surprises.",
  },
  {
    q: "When is the next bake?",
    a: "Coming soon. We'll announce the date shortly. Pre-orders close once we hit capacity, so don't wait.",
  },
  {
    q: "Do you deliver across Bengaluru?",
    a: "Yes. Free delivery within 7 km of HSR Layout (Ambalipura). A standard fee applies for the rest of the city, confirmed at checkout.",
  },
  {
    q: "Can I send this as a gift?",
    a: "Absolutely. Add a personal note and the recipient's address at checkout. We'll handle the rest.",
  },
  {
    q: "What's in the box?",
    a: "Every Wandering Box comes with all 6 items from the current drop. No pick and choose. It's the full experience.",
  },
  {
    q: "Any allergens?",
    a: "Our kitchen handles wheat, nuts, dairy, and eggs. Future drops may also include meat such as mutton and chicken. We keep things clean, but we can't guarantee a fully allergen-free environment.",
  },
  {
    q: "Can I cancel?",
    a: "We bake specifically for your order, so cancellations within 24 hours of delivery are non-refundable.",
  },
  {
    q: "Bulk or corporate orders?",
    a: "Yes. Get in touch on WhatsApp at least 5 days ahead. We can handle events, offices, and celebrations.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col selection:bg-white/20">
      <Header />

      {/* Full-bleed background */}
      <div className="relative flex-grow flex flex-col bg-[#08100c]">
        <img
          src={`${import.meta.env.BASE_URL}images/faq-bg.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none object-contain sm:object-cover"
          style={{ objectPosition: "68% 55%" }}
        />
        {/* Overlay — darker at top/bottom, lighter in the middle */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: "linear-gradient(to bottom, rgba(8,12,10,0.72) 0%, rgba(8,12,10,0.42) 48%, rgba(8,12,10,0.65) 100%)",
          }}
        />

        {/* Photo watermark */}
        <div
          className="absolute bottom-4 right-5 z-10 pointer-events-none select-none"
          style={{
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.88)",
            fontFamily: "inherit",
            fontWeight: 500,
          }}
        >
          Wandering Cocos &nbsp;&middot;&nbsp; RW98+QCJ Okaukuejo, Namibia
        </div>

        <main className="relative z-10 flex-grow pt-36 pb-28 px-6 md:px-12 max-w-2xl mx-auto w-full">

          <span
            className="block mb-5 text-[10px] tracking-[0.3em] font-medium uppercase"
            style={{ color: "rgba(255,255,255,0.65)", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
          >
            FAQ
          </span>
          <h1
            className="font-serif italic leading-tight mb-14"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              color: "rgba(255,255,255,1)",
              textShadow: "0 2px 18px rgba(0,0,0,0.75)",
            }}
          >
            Quick answers.
          </h1>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {faqs.map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                >
                  <span
                    className="font-serif italic leading-snug transition-colors duration-200"
                    style={{
                      fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                      color: "rgba(255,255,255,1)",
                      textShadow: "0 1px 10px rgba(0,0,0,0.8)",
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    className="flex-shrink-0 mt-1 transition-all duration-200"
                    style={{
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                      display: "inline-block",
                      color: open === i ? "rgba(255,255,255,0.9)" : "rgba(245,238,224,0.80)",
                    }}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="pb-5 text-sm font-light leading-relaxed max-w-lg"
                        style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
              Still wondering about something?{" "}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.85)", textDecoration: "underline", textUnderlineOffset: "4px" }}
              >
                Ask us on WhatsApp.
              </a>
            </p>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
