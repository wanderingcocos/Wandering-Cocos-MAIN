import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
  body: string;
  serves: string | null;
  time: string | null;
  youtubeUrl: string | null;
  imageFilename: string | null;
  position: number;
};

function getYouTubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {}
  return null;
}

function getImageSrc(imageFilename: string | null): string | null {
  if (!imageFilename) return null;
  if (imageFilename.startsWith("/objects/")) return `/api/storage${imageFilename}`;
  return `/images/${imageFilename}`;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data) => { setRecipes(data); setLoading(false); })
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
            style={{ color: "rgba(15,36,25,0.4)" }}
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
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "rgba(15,36,25,0.55)" }}
          >
            The techniques, the ratios, the small obsessions behind each dish.
            Recipes will be added here as we document them.
          </motion.p>
        </section>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-24">
          <div style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }} />
        </div>

        {/* RECIPE GRID — renders when recipes exist, placeholder when empty */}
        <section className="py-24 px-6 md:px-14 lg:px-24 max-w-7xl mx-auto">
          {loading ? (
            <p className="font-light" style={{ fontSize: "0.95rem", color: "rgba(15,36,25,0.4)" }}>Loading…</p>
          ) : recipes.length === 0 ? (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col items-start gap-6 max-w-md"
            >
              <div
                className="flex items-center justify-center"
                style={{ width: 56, height: 56, border: "1px solid rgba(15,36,25,0.12)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ color: "rgba(15,36,25,0.3)" }}>
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
                  style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)", color: "rgba(15,36,25,0.5)" }}>
                  We are in the middle of documenting our process.
                  Each recipe will be added here when it is ready to be shared.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-20">
              {recipes.map((recipe, i) => {
                const tags = recipe.tags ? recipe.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                const imageSrc = getImageSrc(recipe.imageFilename);
                const embedId = recipe.youtubeUrl ? getYouTubeEmbedId(recipe.youtubeUrl) : null;
                return (
                  <motion.div
                    key={recipe.id}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.05}
                    className="flex flex-col gap-6"
                  >
                    {imageSrc && (
                      <div className="aspect-[4/3] overflow-hidden max-w-lg" style={{ background: "rgba(15,36,25,0.05)" }}>
                        <img src={imageSrc} alt={recipe.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tags.map((tag) => (
                            <span key={tag}
                              className="text-[9px] tracking-[0.25em] uppercase font-medium px-2 py-1"
                              style={{ background: "rgba(15,36,25,0.06)", color: "rgba(15,36,25,0.45)" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="font-serif italic leading-snug mb-1"
                        style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)", color: "#0f2419" }}>
                        {recipe.title}
                      </h3>
                      {recipe.subtitle && (
                        <p className="font-light mb-4"
                          style={{ fontSize: "0.9rem", color: "rgba(15,36,25,0.5)" }}>
                          {recipe.subtitle}
                        </p>
                      )}
                      <div className="flex gap-6 mb-5">
                        {recipe.serves && (
                          <div>
                            <span className="text-[9px] tracking-[0.25em] uppercase font-medium block mb-0.5"
                              style={{ color: "rgba(15,36,25,0.35)" }}>Serves</span>
                            <span className="font-light text-sm" style={{ color: "rgba(15,36,25,0.65)" }}>{recipe.serves}</span>
                          </div>
                        )}
                        {recipe.time && (
                          <div>
                            <span className="text-[9px] tracking-[0.25em] uppercase font-medium block mb-0.5"
                              style={{ color: "rgba(15,36,25,0.35)" }}>Time</span>
                            <span className="font-light text-sm" style={{ color: "rgba(15,36,25,0.65)" }}>{recipe.time}</span>
                          </div>
                        )}
                      </div>
                      <p className="font-light leading-relaxed max-w-2xl"
                        style={{ fontSize: "0.92rem", color: "rgba(15,36,25,0.6)", whiteSpace: "pre-line" }}>
                        {recipe.body}
                      </p>
                      {embedId && (
                        <div className="mt-8 max-w-2xl" style={{ aspectRatio: "16/9" }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${embedId}`}
                            title={recipe.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                            style={{ border: "none" }}
                          />
                        </div>
                      )}
                    </div>
                    {i < recipes.length - 1 && (
                      <div style={{ borderBottom: "1px solid rgba(15,36,25,0.08)" }} />
                    )}
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
