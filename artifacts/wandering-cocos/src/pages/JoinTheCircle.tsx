import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.14, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  }),
};

const channels = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    eyebrow: "Orders · Updates · Direct line to us",
    body:
      "The easiest way to place an order, ask questions, or check on a delivery. We're right here.",
    cta: "Message us on WhatsApp",
    href: "https://chat.whatsapp.com/HH1IixIyMcCCY8jHnrlHei",
    bg: "#25D366",
    color: "#ffffff",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.783 6.857L2 30l7.343-1.925A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.834-1.594l-.418-.25-4.358 1.143 1.163-4.247-.274-.437A11.46 11.46 0 014.5 16C4.5 9.648 9.648 4.5 16 4.5S27.5 9.648 27.5 16 22.352 27.5 16 27.5zm6.29-8.47c-.344-.173-2.038-1.005-2.353-1.12-.315-.114-.545-.172-.774.173-.23.344-.888 1.12-1.088 1.35-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.022-.53.15-.702.155-.154.344-.4.516-.603.172-.2.23-.344.344-.573.115-.23.058-.431-.029-.603-.086-.173-.774-1.866-1.06-2.555-.28-.67-.563-.579-.774-.59l-.659-.011c-.23 0-.603.086-.918.43-.315.344-1.204 1.177-1.204 2.87s1.232 3.328 1.404 3.557c.172.23 2.424 3.702 5.874 5.191.82.354 1.46.566 1.958.724.823.262 1.572.225 2.164.137.66-.099 2.038-.833 2.325-1.637.287-.805.287-1.494.2-1.638-.086-.143-.315-.23-.659-.402z" />
      </svg>
    ),
  },
  {
    id: "google",
    label: "Google Reviews",
    eyebrow: "Share your experience · Help others find us",
    body: "Tried our bakes? A Google review means the world to a small team. It takes 30 seconds and helps more people find us.",
    cta: "Review us on Google",
    href: "https://g.page/r/CfrjGdYM0pA5EBM/review",
    bg: "#ffffff",
    color: "#4285F4",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6">
        <path d="M30.4 16.3c0-1-.1-2-.3-2.9H16v5.5h8.1c-.4 1.9-1.4 3.4-3 4.5v3.7h4.8c2.8-2.6 4.5-6.4 4.5-10.8z" fill="#4285F4"/>
        <path d="M16 31c4.1 0 7.5-1.3 10-3.6l-4.8-3.7c-1.4.9-3.1 1.5-5.2 1.5-4 0-7.4-2.7-8.6-6.3H2.4v3.8C4.9 27.9 10.1 31 16 31z" fill="#34A853"/>
        <path d="M7.4 18.9A9.2 9.2 0 017 16c0-1 .2-2 .4-2.9V9.3H2.4A15 15 0 001 16c0 2.4.6 4.7 1.4 6.7l5-3.8z" fill="#FBBC05"/>
        <path d="M16 6.8c2.2 0 4.2.8 5.8 2.3l4.3-4.3C23.5 2.3 20.1 1 16 1 10.1 1 4.9 4.1 2.4 9.3l5 3.8C8.6 9.5 12 6.8 16 6.8z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    eyebrow: "Visual diary · Recipes · Process",
    body:
      "Follow us on Instagram for our visual diary: the process, the textures, the failures, and the ones that made it into the box.",
    cta: "Follow on Instagram",
    href: "https://instagram.com/wandering.cocos",
    bg: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    color: "#ffffff",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6">
        <path d="M16 2.882c4.237 0 4.74.016 6.413.093 1.547.071 2.388.328 2.949.545a4.92 4.92 0 011.828 1.19 4.92 4.92 0 011.19 1.828c.217.56.474 1.402.545 2.95.077 1.673.093 2.175.093 6.412s-.016 4.74-.093 6.413c-.071 1.547-.328 2.388-.545 2.949a4.92 4.92 0 01-1.19 1.828 4.92 4.92 0 01-1.828 1.19c-.56.217-1.402.474-2.95.545-1.672.077-2.175.093-6.412.093s-4.74-.016-6.413-.093c-1.547-.071-2.388-.328-2.949-.545a4.92 4.92 0 01-1.828-1.19 4.92 4.92 0 01-1.19-1.828c-.217-.56-.474-1.402-.545-2.95C2.898 20.74 2.882 20.237 2.882 16s.016-4.74.093-6.413c.071-1.547.328-2.388.545-2.949a4.92 4.92 0 011.19-1.828 4.92 4.92 0 011.828-1.19c.56-.217 1.402-.474 2.95-.545C11.26 2.898 11.763 2.882 16 2.882M16 0c-4.31 0-4.85.018-6.543.096C7.764.174 6.6.44 5.582.831A7.8 7.8 0 002.76 2.76 7.8 7.8 0 00.831 5.582C.44 6.6.174 7.764.096 9.457.018 11.15 0 11.69 0 16s.018 4.85.096 6.543c.078 1.693.344 2.857.735 3.875A7.8 7.8 0 002.76 29.24a7.8 7.8 0 002.822 1.929c1.018.391 2.182.657 3.875.735C11.15 31.982 11.69 32 16 32s4.85-.018 6.543-.096c1.693-.078 2.857-.344 3.875-.735a7.8 7.8 0 002.822-1.929 7.8 7.8 0 001.929-2.822c.391-1.018.657-2.182.735-3.875C31.982 20.85 32 20.31 32 16s-.018-4.85-.096-6.543c-.078-1.693-.344-2.857-.735-3.875A7.8 7.8 0 0029.24 2.76 7.8 7.8 0 0026.418.831C25.4.44 24.236.174 22.543.096 20.85.018 20.31 0 16 0zm0 7.784a8.216 8.216 0 100 16.432 8.216 8.216 0 000-16.432zm0 13.549a5.333 5.333 0 110-10.666 5.333 5.333 0 010 10.666zm10.406-13.872a1.92 1.92 0 11-3.84 0 1.92 1.92 0 013.84 0z" />
      </svg>
    ),
  },
];

export default function JoinTheCircle() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* FULL-SCREEN HERO — Cape Point, Cape Town */}
      <section className="relative flex-grow flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#0d1a1f]">

        {/* Background image */}
        <img
          src={`${import.meta.env.BASE_URL}images/join-cape-point.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none select-none object-contain sm:object-cover"
          style={{ objectPosition: "center 40%", zIndex: 0 }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a1f]/60 via-transparent to-transparent" />

        {/* Photo watermark */}
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
          Wandering Cocos &nbsp;&middot;&nbsp; JFXP+8R8 Cape Point, Cape Town, South Africa
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-36">

          <motion.span
            initial="hidden" animate="visible" custom={0} variants={fadeUp}
            className="text-[9px] tracking-[0.4em] font-medium uppercase block mb-6"
            style={{ color: "rgba(245,238,224,0.88)" }}
          >
            The Circle · Wandering Cocos
          </motion.span>

          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="font-serif italic leading-tight mb-6"
            style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)", color: "#ffffff" }}
          >
            Join the Circle
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fadeUp}
            className="font-light leading-relaxed mb-3"
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", color: "rgba(255,255,255,0.9)", maxWidth: "480px", margin: "0 auto 3.5rem", textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}
          >
            Let's be honest, no one goes looking for websites anymore. That's why we live where you already are.
          </motion.p>

          {/* Channel cards */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {channels.map((ch, i) => (
              <motion.a
                key={ch.id}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                initial="hidden"
                animate="visible"
                custom={3 + i}
                variants={fadeUp}
                className="group flex flex-col items-start text-left rounded-none p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  minWidth: "220px",
                  flex: 1,
                  maxWidth: "280px",
                }}
              >
                {/* Icon + label */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                    style={{ background: ch.bg, color: ch.color }}
                  >
                    {ch.icon}
                  </span>
                  <span className="text-[10px] tracking-[0.22em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {ch.label}
                  </span>
                </div>

                {/* Eyebrow tags */}
                <p className="text-[9px] tracking-[0.18em] uppercase mb-3" style={{ color: "rgba(245,238,224,0.80)" }}>
                  {ch.eyebrow}
                </p>

                {/* Body */}
                <p className="text-xs leading-relaxed mb-5 flex-grow" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {ch.body}
                </p>

                {/* CTA row */}
                <span
                  className="text-[10px] tracking-[0.22em] uppercase font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
                  style={{ color: "#ffffff" }}
                >
                  {ch.cta}
                  <span className="text-base leading-none">→</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
