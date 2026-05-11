import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeGreeting() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  const greetings = [
    { time: [5, 11], line: "Good morning.", sub: "Fresh out of the oven." },
    { time: [11, 15], line: "Good afternoon.", sub: "Something warm is waiting." },
    { time: [15, 20], line: "Good evening.", sub: "You made it just in time." },
    { time: [20, 24], line: "Evening.", sub: "Late hours, fresh bakes." },
    { time: [0, 5], line: "You're up early.", sub: "So are we." },
  ];

  const hour = new Date().getHours();
  const greeting = greetings.find(g => hour >= g.time[0] && hour < g.time[1])
    ?? { line: "Hello there.", sub: "Welcome in." };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center cursor-pointer"
          style={{ background: "#0f2419" }}
        >
          {/* Subtle noise grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              opacity: 0.045,
            }}
          />

          {/* Logo */}
          <motion.img
            src={`${import.meta.env.BASE_URL}images/wc-logo-wb.png`}
            alt="Wandering Cocos"
            className="w-16 h-16 object-contain mb-10"
            style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
          />

          {/* Greeting */}
          <motion.p
            className="font-serif italic text-center"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#ffffff", lineHeight: 1.15 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          >
            {greeting.line}
          </motion.p>

          {/* Sub line */}
          <motion.p
            className="font-light tracking-widest uppercase text-center mt-4"
            style={{ fontSize: "clamp(0.65rem, 0.85vw, 0.78rem)", color: "rgba(200,168,130,0.92)", letterSpacing: "0.32em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
          >
            {greeting.sub}
          </motion.p>

          {/* Dismiss hint */}
          <motion.p
            className="absolute bottom-8 font-light tracking-widest uppercase"
            style={{ fontSize: "9px", color: "rgba(245,238,224,0.78)", letterSpacing: "0.28em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            Tap anywhere to enter
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
