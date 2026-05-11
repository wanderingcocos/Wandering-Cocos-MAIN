import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  if (imageFilename.startsWith("/objects/")) return `${BASE}/api/storage${imageFilename}`;
  return `/images/${imageFilename}`;
}

export default function RecipeDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`${BASE}/api/recipes/${params.id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.ok ? r.json() : null;
      })
      .then(data => { if (data) setRecipe(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params?.id]);

  const tags = recipe?.tags ? recipe.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const imageSrc = recipe ? getImageSrc(recipe.imageFilename) : null;
  const embedId = recipe?.youtubeUrl ? getYouTubeEmbedId(recipe.youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />
      <main className="flex-grow">
        <div className="pt-32 pb-0 px-6 md:px-14 lg:px-24 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/recipes")}
            style={{ color: "#0F2419", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            className="text-[10px] tracking-[0.28em] uppercase font-medium mb-10 flex items-center gap-2 transition-colors hover:text-foreground"
          >
            ← Recipes
          </button>
        </div>

        {loading ? (
          <div className="px-6 md:px-14 lg:px-24 max-w-4xl mx-auto pb-24 space-y-4">
            <div className="h-12 w-64 rounded animate-pulse" style={{ background: "rgba(15,36,25,0.05)" }} />
            <div className="h-4 w-48 rounded animate-pulse" style={{ background: "rgba(15,36,25,0.05)" }} />
          </div>
        ) : notFound || !recipe ? (
          <div className="px-6 md:px-14 lg:px-24 max-w-4xl mx-auto pb-24">
            <p className="font-serif italic" style={{ color: "#0F2419" }}>Recipe not found.</p>
          </div>
        ) : (
          <article className="px-6 md:px-14 lg:px-24 max-w-4xl mx-auto pb-24">
            {tags.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex flex-wrap gap-2 mb-5">
                {tags.map(tag => (
                  <span key={tag} className="text-[9px] tracking-[0.25em] uppercase font-medium px-2 py-1"
                    style={{ background: "rgba(15,36,25,0.06)", color: "#0F2419" }}>
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="font-serif italic leading-[1.1] mb-3"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: "#0f2419" }}
            >
              {recipe.title}
            </motion.h1>

            {recipe.subtitle && (
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="font-light mb-5"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)", color: "#0F2419" }}>
                {recipe.subtitle}
              </motion.p>
            )}

            {(recipe.serves || recipe.time) && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex gap-8 mb-8">
                {recipe.serves && (
                  <div>
                    <span className="text-[9px] tracking-[0.25em] uppercase font-medium block mb-0.5" style={{ color: "#0F2419" }}>Serves</span>
                    <span className="font-light text-sm" style={{ color: "rgba(15,36,25,0.65)" }}>{recipe.serves}</span>
                  </div>
                )}
                {recipe.time && (
                  <div>
                    <span className="text-[9px] tracking-[0.25em] uppercase font-medium block mb-0.5" style={{ color: "#0F2419" }}>Time</span>
                    <span className="font-light text-sm" style={{ color: "rgba(15,36,25,0.65)" }}>{recipe.time}</span>
                  </div>
                )}
              </motion.div>
            )}

            <div className="mb-10" style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }} />

            {(embedId || imageSrc) && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mb-10">
                {embedId ? (
                  <div style={{ aspectRatio: "16/9", maxWidth: "720px" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${embedId}`}
                      title={recipe.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen className="w-full h-full" style={{ border: "none" }}
                    />
                  </div>
                ) : imageSrc ? (
                  <div className="overflow-hidden" style={{ maxWidth: "720px", background: "rgba(15,36,25,0.04)" }}>
                    <img src={imageSrc} alt={recipe.title} className="w-full object-cover" />
                  </div>
                ) : null}
              </motion.div>
            )}

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
              <p className="font-light leading-relaxed"
                style={{ fontSize: "clamp(0.9rem, 1.1vw, 1rem)", color: "rgba(15,36,25,0.7)", whiteSpace: "pre-line", maxWidth: "680px" }}>
                {recipe.body}
              </p>
            </motion.div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
