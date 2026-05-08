import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENE_DURATIONS = [4000, 4500, 4500, 4500, 4500, 4500, 5000];

const ITEMS = [
  { title: "Almond Frangipane", subtitle: "Blondie", img: "/images/video-item-1-blondie.png", desc: "Decadent & Rich" },
  { title: "Cardamom", subtitle: "Pistachio Twist", img: "/images/video-item-2-choco.png", desc: "Aromatic & Refined" },
  { title: "Fluffy Pistachio", subtitle: "Cinnamon Roll", img: "/images/video-item-3-roll.png", desc: "Soft & Nutty" },
  { title: "Honey Feta", subtitle: "Phyllo Rolls", img: "/images/video-item-4-phyllo.png", desc: "Sweet & Savory" },
  { title: "Kerala", subtitle: "Egg Puffs", img: "/images/video-item-5-puff.png", desc: "Flaky & Fresh" },
];

export default function VideoPromo() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScene((s) => (s + 1) % SCENE_DURATIONS.length);
    }, SCENE_DURATIONS[scene]);
    return () => clearTimeout(timer);
  }, [scene]);

  return (
    <div className="w-full h-screen bg-[#0f2419] flex items-center justify-center overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Jost', sans-serif; }
        .grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.06;
          pointer-events: none;
          z-index: 50;
        }
      `}</style>
      
      <div className="relative w-full max-w-[177.77vh] h-full max-h-[56.25vw] aspect-video bg-[#0f2419] overflow-hidden text-[#0f2419] shadow-2xl">
        <div className="grain"></div>
        
        {/* Persistent background gradient element */}
        <motion.div 
          className="absolute top-[-50%] right-[-20%] w-[100%] h-[150%] rounded-full mix-blend-overlay opacity-30 blur-[100px]"
          animate={{ 
            backgroundColor: scene === 0 ? "#2d5a3d" : scene === 6 ? "#0f2419" : "#c8a882",
            x: scene % 2 === 0 ? "0%" : "-20%",
            y: scene % 3 === 0 ? "10%" : "-10%",
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />

        <AnimatePresence mode="sync">
          {scene === 0 && <IntroScene key="scene-0" />}
          {scene >= 1 && scene <= 5 && <ItemScene key={`scene-${scene}`} index={scene - 1} />}
          {scene === 6 && <OutroScene key="scene-6" />}
        </AnimatePresence>
        
        {/* Persistent Logo */}
        <motion.img 
          src="/images/wc-logo-wb.png" 
          alt="Wandering Cocos"
          className="absolute top-8 left-8 w-12 h-12 object-contain z-50 invert mix-blend-difference"
          animate={{
            opacity: scene === 0 || scene === 6 ? 0 : 0.8,
            scale: scene === 0 || scene === 6 ? 0.8 : 1
          }}
          transition={{ duration: 1 }}
        />

        {/* Progress Bar */}
        <div className="absolute bottom-8 left-8 flex gap-2 z-50">
          {SCENE_DURATIONS.map((_, i) => (
            <motion.div 
              key={i}
              className="h-1 bg-[#f5f0e8] opacity-30 rounded-full"
              animate={{ 
                width: i === scene ? 32 : 8,
                opacity: i === scene ? 0.8 : 0.3
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function IntroScene() {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#0f2419] flex flex-col items-center justify-center text-[#f5f0e8] z-10"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.img 
        src="/images/wc-logo-wb.png" 
        className="w-40 h-40 object-contain mb-10 filter brightness-0 invert"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
      />
      <motion.h1 
        className="font-serif text-6xl md:text-8xl font-medium tracking-wide mb-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
      >
        Wandering Cocos
      </motion.h1>
      <motion.div 
        className="w-px h-16 bg-[#c8a882] mb-6"
        initial={{ height: 0 }}
        animate={{ height: 64 }}
        transition={{ delay: 1.1, duration: 0.8, ease: "easeInOut" }}
      />
      <motion.p 
        className="font-sans text-xl tracking-[0.4em] uppercase text-[#c8a882] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        This Month's Box
      </motion.p>
    </motion.div>
  );
}

function ItemScene({ index }: { index: number }) {
  const item = ITEMS[index];
  const origins = ["0% 50%", "100% 50%", "50% 100%", "50% 0%", "0% 0%"];
  
  return (
    <motion.div 
      className="absolute inset-0 bg-[#f5f0e8] flex z-20"
      initial={{ clipPath: `circle(0% at ${origins[index % origins.length]})` }}
      animate={{ clipPath: `circle(150% at ${origins[index % origins.length]})` }}
      exit={{ zIndex: 10, opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="w-[55%] h-full flex flex-col justify-center px-16 md:px-24 relative z-10">
        <motion.p 
          className="font-sans text-[#2d5a3d] tracking-[0.3em] font-medium uppercase text-sm mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          0{index + 1}. {item.desc}
        </motion.p>
        <div className="overflow-hidden mb-2 py-2">
          <motion.h2 
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#0f2419] leading-[1.1]"
            initial={{ y: "100%", rotate: 2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            {item.title}
          </motion.h2>
        </div>
        <div className="overflow-hidden py-2">
          <motion.h3 
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#c8a882] italic leading-[1.1]"
            initial={{ y: "100%", rotate: -2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ delay: 1.1, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            {item.subtitle}
          </motion.h3>
        </div>
        
        <motion.div 
          className="mt-12 w-32 h-px bg-[#2d5a3d]"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
        />
      </div>

      <div className="w-[45%] h-full relative p-8 md:p-12 md:pr-24 flex items-center justify-center">
        <motion.div 
          className="relative w-full aspect-[3/4] rounded-t-[200px] overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.8, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        >
          <motion.img 
            src={item.img} 
            alt={item.title}
            className="w-full h-full object-cover"
            animate={{ scale: [1.15, 1] }}
            transition={{ duration: 4.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-[#2d5a3d] mix-blend-overlay opacity-10"></div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function OutroScene() {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#2d5a3d] flex flex-col items-center justify-center text-[#f5f0e8] z-30"
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="mb-14"
      >
        <img src="/images/wc-logo-wb.png" className="w-36 h-36 object-contain filter brightness-0 invert opacity-90" />
      </motion.div>
      
      <motion.h2 
        className="font-serif text-5xl md:text-7xl mb-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
      >
        Taste the Journey
      </motion.h2>
      
      <motion.p 
        className="font-sans text-lg tracking-[0.5em] uppercase text-[#c8a882] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
      >
        Bengaluru, India
      </motion.p>
    </motion.div>
  );
}
