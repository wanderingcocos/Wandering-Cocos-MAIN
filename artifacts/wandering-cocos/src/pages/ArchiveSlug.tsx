import { useParams, useLocation } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const VOTER_KEY = "wc_voter_id";
const VOTED_KEY = "wc_voted_items";

function getImageSrc(imageFilename: string | null): string | null {
  if (!imageFilename) return null;
  if (imageFilename.startsWith("/objects/")) return `${BASE}/api/storage${imageFilename}`;
  return `/images/${imageFilename}`;
}

function getVoterId(): string {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(VOTER_KEY, id); }
  return id;
}

function getVotedItems(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem(VOTED_KEY) || "{}"); } catch { return {}; }
}

function saveVotedItem(itemId: number, stars: number) {
  const existing = getVotedItems();
  existing[itemId] = stars;
  localStorage.setItem(VOTED_KEY, JSON.stringify(existing));
}

type ArchiveItem = {
  id: number;
  name: string;
  description: string | null;
  imageFilename: string | null;
  position: number;
  avgStars: number;
  voteCount: number;
};

type Launch = {
  id: number;
  slug: string;
  title: string;
  bakeDate: string;
  notes: string | null;
  items: ArchiveItem[];
};

function StarRating({ itemId, avgStars, voteCount, voted, onRate }: {
  itemId: number; avgStars: number; voteCount: number; voted: number | null;
  onRate: (itemId: number, stars: number) => Promise<void>;
}) {
  const [hovering, setHovering] = useState(0);
  const [loading, setLoading] = useState(false);
  const active = hovering || voted || 0;

  async function handleClick(stars: number) {
    if (loading) return;
    setLoading(true);
    await onRate(itemId, stars);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-start gap-2 mt-3">
      <div className="flex gap-1" onMouseLeave={() => setHovering(0)} role="group" aria-label="Rate this item">
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} onClick={() => handleClick(star)} onMouseEnter={() => setHovering(star)}
            disabled={loading} aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            className="transition-transform duration-100 hover:scale-110 disabled:cursor-wait"
            style={{ background: "none", border: "none", padding: "2px", cursor: loading ? "wait" : "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={star <= active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"
              style={{ color: star <= active ? "hsl(150 40% 28%)" : "rgba(15,36,25,0.3)", transition: "all 0.1s ease" }}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </button>
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        {voteCount > 0 ? (
          <>
            <span className="font-serif italic" style={{ fontSize: "0.95rem", color: "hsl(150 40% 28%)" }}>{avgStars.toFixed(1)}</span>
            <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: "rgba(15,36,25,0.4)" }}>
              {voteCount} {voteCount === 1 ? "vote" : "votes"}
            </span>
          </>
        ) : (
          <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: "rgba(15,36,25,0.35)" }}>Be the first to rate</span>
        )}
        {voted && (
          <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: "hsl(150 40% 28%)", opacity: 0.7 }}>
            · Your vote: {voted}★
          </span>
        )}
      </div>
    </div>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(8,20,14,0.88)" }} onClick={onClose}>
      <button onClick={onClose} aria-label="Close"
        style={{ position: "absolute", top: 20, right: 24, fontSize: "2rem", lineHeight: 1, background: "none", border: "none", color: "rgba(255,255,255,0.75)", cursor: "pointer" }}>
        ×
      </button>
      <img src={src} alt={alt} onClick={e => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 2, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
    </div>
  );
}

function ItemCard({ item, index, voted, onRate }: {
  item: ArchiveItem; index: number; voted: number | null;
  onRate: (itemId: number, stars: number) => Promise<void>;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageSrc = getImageSrc(item.imageFilename);

  return (
    <>
      {lightboxOpen && imageSrc && <Lightbox src={imageSrc} alt={item.name} onClose={() => setLightboxOpen(false)} />}
      <div className="flex gap-6 py-7" style={{ borderBottom: "1px solid rgba(15,36,25,0.1)" }}>
        {imageSrc ? (
          <button onClick={() => setLightboxOpen(true)}
            className="flex-shrink-0 rounded-sm overflow-hidden focus:outline-none"
            style={{ width: 80, height: 80, padding: 0, background: "none", border: "none", cursor: "zoom-in" }}
            aria-label={`View full image of ${item.name}`}>
            <img src={imageSrc} alt={item.name} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
          </button>
        ) : (
          <div className="flex-shrink-0 rounded-sm flex items-center justify-center"
            style={{ width: 80, height: 80, background: "hsl(38 25% 92%)", border: "1px solid rgba(15,36,25,0.08)" }}>
            <span className="font-serif italic" style={{ fontSize: "1.4rem", color: "rgba(15,36,25,0.2)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
        <div className="flex-grow min-w-0">
          <p className="text-[9px] tracking-[0.22em] uppercase font-medium mb-1" style={{ color: "rgba(15,36,25,0.35)" }}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="font-serif font-medium leading-snug" style={{ fontSize: "1.05rem", color: "#0f2419" }}>{item.name}</h3>
          {item.description && (
            <p className="mt-1 leading-relaxed" style={{ fontSize: "0.78rem", color: "rgba(15,36,25,0.55)" }}>{item.description}</p>
          )}
          <StarRating itemId={item.id} avgStars={item.avgStars} voteCount={item.voteCount} voted={voted} onRate={onRate} />
        </div>
      </div>
    </>
  );
}

export default function ArchiveSlug() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [votedItems, setVotedItems] = useState<Record<number, number>>(getVotedItems());

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`${BASE}/api/archive/${params.slug}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.ok ? r.json() : null;
      })
      .then(data => { if (data) setLaunch(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params?.slug]);

  const handleRate = useCallback(async (itemId: number, stars: number) => {
    const voterId = getVoterId();
    try {
      const res = await fetch(`${BASE}/api/archive/items/${itemId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, voterId }),
      });
      if (!res.ok) throw new Error();
      const { avgStars, voteCount } = await res.json();
      saveVotedItem(itemId, stars);
      setVotedItems(prev => ({ ...prev, [itemId]: stars }));
      setLaunch(prev => prev ? {
        ...prev,
        items: prev.items.map(item => item.id === itemId ? { ...item, avgStars, voteCount } : item),
      } : prev);
    } catch {}
  }, []);

  const formattedDate = launch
    ? new Date(launch.bakeDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(38 25% 96%)" }}>
      <Header />
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 md:px-10 pt-20 pb-24">
        <button onClick={() => navigate("/archive")}
          className="text-[10px] tracking-[0.28em] uppercase font-medium mb-10 flex items-center gap-2 transition-colors"
          style={{ color: "rgba(15,36,25,0.38)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          ← All Archives
        </button>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-56 rounded" style={{ background: "rgba(15,36,25,0.07)" }} />
            <div className="h-4 w-36 rounded" style={{ background: "rgba(15,36,25,0.05)" }} />
          </div>
        ) : notFound || !launch ? (
          <p className="font-serif italic" style={{ color: "rgba(15,36,25,0.4)" }}>Bake day not found.</p>
        ) : (
          <>
            <div className="mb-12">
              <p className="text-[9px] tracking-[0.36em] uppercase font-medium mb-4" style={{ color: "rgba(15,36,25,0.35)" }}>
                Wandering Cocos · The Archives
              </p>
              <div className="flex items-end justify-between gap-5 pb-5" style={{ borderBottom: "2px solid #0f2419" }}>
                <div>
                  <h1 className="font-serif font-medium leading-tight mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#0f2419" }}>
                    {launch.title}
                  </h1>
                  <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: "rgba(15,36,25,0.4)" }}>{formattedDate}</p>
                </div>
                {launch.notes && (
                  <p className="font-serif italic text-right flex-shrink-0" style={{ fontSize: "0.82rem", color: "rgba(15,36,25,0.45)", maxWidth: "200px" }}>
                    {launch.notes}
                  </p>
                )}
              </div>
            </div>

            {launch.items.length === 0 ? (
              <p className="font-serif italic" style={{ color: "rgba(15,36,25,0.4)" }}>Items will be added here soon.</p>
            ) : (
              <div>
                {launch.items.map((item, idx) => (
                  <ItemCard key={item.id} item={item} index={idx} voted={votedItems[item.id] ?? null} onRate={handleRate} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
