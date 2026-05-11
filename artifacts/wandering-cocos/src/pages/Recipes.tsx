import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

type Recipe = {
  id: number;
  title: string;
  subtitle: string | null;
  tags: string | null;
  serves: string | null;
  time: string | null;
  position: number;
};

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch(`${BASE}/api/recipes`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setRecipes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">
        {/* HERO */}
        <section className="pt-36 pb-20 px-6 md:px-14 lg:px-24 max-w-7xl mx-auto">
          <motion.span
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-[10px] tracking-[0.35em] uppercase font-medium block mb-6"
            style={{ color: "#0F2419" }}
          >
            The Story · Recipes
          </motion.span>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-serif italic leading-[1.1] mb-8"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", color: "#0f2419", maxWidth: "780px" }}
          >
            From our kitchen<br />to yours.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="font-light leading-relaxed max-w-lg"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "#0F2419" }}
          >
            The techniques, the ratios, the small obsessions behind each dish.
            Recipes will be added here as we document them.
          </motion.p>
        </section>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-24">
          <div style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }} />
        </div>

        {/* RECIPE LIST */}
        <section className="py-16 px-6 md:px-14 lg:px-24 max-w-4xl mx-auto">
          {loading ? (
            <p className="font-light" style={{ fontSize: "0.95rem", color: "#0F2419" }}>Loading…</p>
          ) : recipes.length === 0 ? (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col items-start gap-6 max-w-md"
            >
              <div className="flex items-center justify-center"
                style={{ width: 56, height: 56, border: "1px solid rgba(15,36,25,0.12)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"
                  style={{ color: "#0F2419" }}>
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif italic leading-snug mb-3"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#0f2419" }}>
                  Recipes coming soon.
                </h2>
                <p className="font-light leading-relaxed"
                  style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)", color: "#0F2419" }}>
                  We are in the middle of documenting our process.
                  Each recipe will be added here when it is ready to be shared.
                </p>
              </div>
            </motion.div>
          ) : (
            <div style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }}>
              {recipes.map((recipe, i) => {
                const tags = recipe.tags ? recipe.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                return (
                  <motion.div
                    key={recipe.id}
                    variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i * 0.05}
                    style={{ borderBottom: "1px solid rgba(15,36,25,0.08)" }}
                  >
                    <button
                      onClick={() => navigate(`/recipes/${recipe.id}`)}
                      className="w-full text-left py-8 group flex items-start justify-between gap-6"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "2rem 0" }}
                    >
                      <div className="flex-1 min-w-0">
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map(tag => (
                              <span key={tag} className="text-[9px] tracking-[0.25em] uppercase font-medium px-2 py-0.5"
                                style={{ background: "rgba(15,36,25,0.06)", color: "#0F2419" }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h3 className="font-serif italic leading-snug mb-1 transition-colors group-hover:text-accent"
                          style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.5rem)", color: "#0f2419" }}>
                          {recipe.title}
                        </h3>
                        {recipe.subtitle && (
                          <p className="font-light mb-3" style={{ fontSize: "0.88rem", color: "#0F2419" }}>
                            {recipe.subtitle}
                          </p>
                        )}
                        {(recipe.serves || recipe.time) && (
                          <div className="flex gap-6 mt-2">
                            {recipe.serves && (
                              <span className="text-[10px] tracking-[0.2em] uppercase font-medium"
                                style={{ color: "#0F2419" }}>
                                Serves {recipe.serves}
                              </span>
                            )}
                            {recipe.time && (
                              <span className="text-[10px] tracking-[0.2em] uppercase font-medium"
                                style={{ color: "#0F2419" }}>
                                {recipe.time}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-xl flex-shrink-0 mt-1 transition-colors"
                        style={{ color: "#2D2926" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#0F2419")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#2D2926")}>
                        →
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
