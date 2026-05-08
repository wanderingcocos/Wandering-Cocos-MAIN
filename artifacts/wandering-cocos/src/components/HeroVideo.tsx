import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const BASE = import.meta.env.BASE_URL;

type Phase =
  | 'box'
  | 'hands'
  | 'open'
  | 'bagel'
  | 'blondie'
  | 'choco'
  | 'kerala'
  | 'phyllo'
  | 'pistachio';

const SEQUENCE: { phase: Phase; duration: number }[] = [
  { phase: 'box', duration: 5000 },
  { phase: 'hands', duration: 3500 },
  { phase: 'open', duration: 3500 },
  { phase: 'bagel', duration: 2500 },
  { phase: 'blondie', duration: 2500 },
  { phase: 'choco', duration: 2500 },
  { phase: 'kerala', duration: 2500 },
  { phase: 'phyllo', duration: 2500 },
  { phase: 'pistachio', duration: 2500 },
];

const FOOD_ITEMS: Partial<Record<Phase, string>> = {
  bagel: 'item-bagel-v2.png',
  blondie: 'item-blondie-v2.png',
  choco: 'item-choco-v2.png',
  kerala: 'item-kerala-puff-v2.png',
  phyllo: 'item-phyllo-v2.png',
  pistachio: 'item-pistachio-roll-v2.png',
};

const FOOD_PHASES = Object.keys(FOOD_ITEMS) as Phase[];

function usePhaseTimeline() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const { duration } = SEQUENCE[idx];
    timerRef.current = setTimeout(() => {
      setIdx((prev) => (prev + 1) % SEQUENCE.length);
    }, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx]);

  return { phase: SEQUENCE[idx].phase, idx };
}

export function HeroVideo() {
  const { phase } = usePhaseTimeline();
  const isFood = FOOD_PHASES.includes(phase);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      
      {/* OVERLAY: 38% dark forest green over all phases */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 40, background: 'rgba(15, 36, 25, 0.38)' }}
      />

      {/* PHASE 1: THE BOX */}
      <AnimatePresence>
        {phase === 'box' && (
          <motion.div
            key="phase-box"
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <motion.img
              src={`${BASE}images/hero-box-v2.png`}
              className="w-full h-full object-cover"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 6.2, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 2: THE HANDS */}
      <AnimatePresence>
        {phase === 'hands' && (
          <motion.div
            key="phase-hands"
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 11 }}
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.img
              src={`${BASE}images/hero-hands-v2.png`}
              className="w-full h-full object-cover"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 4.5, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 3 & FOOD: THE REVEAL & PERSISTENT BACKGROUND */}
      <AnimatePresence>
        {(phase === 'open' || isFood) && (
          <motion.div
            key="phase-open"
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 12 }}
            initial={{ clipPath: 'inset(0 50% 0 50%)' }}
            animate={{ clipPath: 'inset(0 0% 0 0%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.img
              src={`${BASE}images/hero-open-v2.png`}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 4.7, ease: 'easeOut' }}
            />
            
            {/* Dimming vignette during food phases */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: isFood ? 1 : 0 }}
              transition={{ duration: 1.0 }}
              style={{
                background: 'radial-gradient(ellipse at center, transparent 20%, rgba(15,36,25,0.65) 100%)',
                backgroundColor: 'rgba(0,0,0,0.4)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 4-9: FOOD ITEMS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
        <AnimatePresence mode="popLayout">
          {isFood && (
            <motion.div
              key={phase}
              className="absolute w-[68vmin] h-[68vmin] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 26,
              }}
            >
              <img
                src={`${BASE}images/${FOOD_ITEMS[phase]}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
