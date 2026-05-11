import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Launch = {
  id: number;
  slug: string;
  title: string;
  bakeDate: string;
  notes: string | null;
  items: { id: number }[];
};

export default function TheArchives() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch(`${BASE}/api/archive`)
      .then(r => r.json())
      .then(data => { setLaunches(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const sorted = [...launches].reverse();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(38 25% 96%)" }}>
      <Header />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 md:px-10 pt-20 pb-24">
        <div className="mb-16">
          <p className="text-[9px] tracking-[0.36em] uppercase font-medium mb-5"
            style={{ color: "#0F2419" }}>
            Wandering Cocos
          </p>
          <h1 className="font-serif font-medium leading-none mb-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", color: "#0f2419" }}>
            The Archives
          </h1>
          <p className="font-serif italic leading-relaxed max-w-lg"
            style={{ fontSize: "1.05rem", color: "#0F2419" }}>
            Every drop, preserved. Rate what you loved so we know what to bring back.
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="py-6 animate-pulse flex justify-between items-center"
                style={{ borderBottom: "1px solid rgba(15,36,25,0.08)" }}>
                <div className="space-y-2">
                  <div className="h-5 w-48 rounded" style={{ background: "rgba(15,36,25,0.07)" }} />
                  <div className="h-3 w-32 rounded" style={{ background: "rgba(15,36,25,0.05)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="font-serif italic" style={{ fontSize: "1rem", color: "#0F2419" }}>
            Could not load the archives. Try again later.
          </p>
        )}

        {!loading && !error && launches.length === 0 && (
          <p className="font-serif italic" style={{ fontSize: "1rem", color: "#0F2419" }}>
            Nothing in the archives yet. Check back after the first bake day.
          </p>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }}>
            {sorted.map(launch => {
              const date = new Date(launch.bakeDate + "T00:00:00");
              const formattedDate = date.toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              });
              const itemCount = launch.items.length;

              return (
                <button
                  key={launch.id}
                  onClick={() => navigate(`/archive/${launch.slug}`)}
                  className="w-full text-left group flex items-center justify-between gap-6"
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid rgba(15,36,25,0.1)",
                    cursor: "pointer",
                    padding: "1.75rem 0",
                  }}
                >
                  <div>
                    <h2 className="font-serif font-medium mb-1.5 transition-colors group-hover:text-accent"
                      style={{ fontSize: "1.2rem", color: "#0f2419" }}>
                      {launch.title}
                    </h2>
                    <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: "#0F2419" }}>
                      {formattedDate}
                      {itemCount > 0 ? ` · ${itemCount} ${itemCount === 1 ? "item" : "items"}` : ""}
                      {launch.notes ? ` · ${launch.notes}` : ""}
                    </p>
                  </div>
                  <span className="text-xl flex-shrink-0 transition-colors"
                    style={{ color: "#0F2419" }}>
                    →
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
