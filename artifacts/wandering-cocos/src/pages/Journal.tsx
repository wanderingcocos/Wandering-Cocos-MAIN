import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

type JournalEvent = {
  id: number;
  title: string;
  body: string | null;
  mediaUrls: string[] | null;
  embedUrl: string | null;
  eventDate: string | null;
  published: boolean;
  createdAt: string;
};

function formatEventDate(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

function EmbedPlayer({ url }: { url: string }) {
  let embedSrc = "";

  if (url.includes("youtu.be/") || url.includes("youtube.com/watch")) {
    const videoId = url.includes("youtu.be/")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : new URL(url).searchParams.get("v") ?? "";
    embedSrc = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("instagram.com/reel") || url.includes("instagram.com/p/")) {
    const match = url.match(/\/(reel|p)\/([\w-]+)/);
    const code = match?.[2] ?? "";
    embedSrc = `https://www.instagram.com/p/${code}/embed/`;
  }

  if (!embedSrc) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ paddingBottom: "56.25%", borderRadius: 0 }}>
      <iframe
        src={embedSrc}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{ border: "none" }}
        title="Embedded media"
      />
    </div>
  );
}

function JournalCard({ event, index }: { event: JournalEvent; index: number }) {
  const mediaUrls = event.mediaUrls?.filter(Boolean) ?? [];

  return (
    <motion.article
      variants={fadeUp} initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: "-40px" }} custom={index * 0.08}
      className="border-b border-border/20 py-14 first:pt-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left — text */}
        <div>
          {event.eventDate && (
            <p className="text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: "rgba(15,36,25,0.45)" }}>
              {formatEventDate(event.eventDate)}
            </p>
          )}
          <h2
            className="font-serif italic leading-snug mb-5"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", color: "#0f2419" }}
          >
            {event.title}
          </h2>
          {event.body && (
            <p
              className="font-light leading-relaxed"
              style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)", color: "rgba(15,36,25,0.65)", whiteSpace: "pre-line" }}
            >
              {event.body}
            </p>
          )}
        </div>

        {/* Right — media */}
        <div className="space-y-4">
          {/* Image grid — up to 4 images */}
          {mediaUrls.length > 0 && (
            <div className={`grid gap-2 ${mediaUrls.length === 1 ? "grid-cols-1" : mediaUrls.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}>
              {mediaUrls.slice(0, 4).map((url, i) => (
                <div
                  key={i}
                  className={`overflow-hidden bg-muted/30 ${mediaUrls.length === 1 ? "aspect-[4/3]" : i === 0 && mediaUrls.length === 3 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
                >
                  <img
                    src={url} alt=""
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Embedded video */}
          {event.embedUrl && <EmbedPlayer url={event.embedUrl} />}
        </div>
      </div>
    </motion.article>
  );
}

export default function Journal() {
  const [events, setEvents] = useState<JournalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/journal`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">
        {/* HERO */}
        <section className="pt-36 pb-16 px-6 md:px-14 lg:px-24 max-w-7xl mx-auto">
          <motion.span
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-[10px] tracking-[0.35em] uppercase font-medium block mb-6"
            style={{ color: "#0F2419" }}
          >
            Wandering Cocos · Journal
          </motion.span>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-serif italic leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", color: "#0f2419", maxWidth: "780px" }}
          >
            Events &amp;<br />Pop-Ups.
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="font-light leading-relaxed max-w-xl"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", color: "rgba(15,36,25,0.6)" }}
          >
            Where we show up. What we made. Who we met. A running record of the road.
          </motion.p>
        </section>

        <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-24">
          <div style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }} />
        </div>

        {/* EVENTS */}
        <section className="py-14 px-6 md:px-14 lg:px-24 max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-10">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse py-10 border-b border-border/15">
                  <div className="h-3 bg-foreground/8 rounded w-32 mb-5" />
                  <div className="h-8 bg-foreground/8 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-foreground/6 rounded w-full mb-2" />
                  <div className="h-3 bg-foreground/6 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="flex flex-col items-start gap-6 max-w-md py-10"
            >
              <div className="flex items-center justify-center"
                style={{ width: 56, height: 56, border: "1px solid rgba(15,36,25,0.12)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"
                  style={{ color: "#0F2419" }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif italic leading-snug mb-3"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#0f2419" }}>
                  Nothing here yet.
                </h2>
                <p className="font-light leading-relaxed"
                  style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)", color: "rgba(15,36,25,0.55)" }}>
                  Pop-ups, events, and field notes are on their way. Check back soon.
                </p>
              </div>
            </motion.div>
          ) : (
            <div>
              {events.map((event, i) => (
                <JournalCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
