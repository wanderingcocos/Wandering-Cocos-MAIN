import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const FALLBACK_STRIP = "Bake Date Coming Soon\u2002\u00b7\u2002Pre-orders open now. Limited bakes.\u2002\u00b7\u2002Free delivery within 7km of HSR Layout, Bengaluru";

function formatBakeDateShort(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

// ── Info strip ────────────────────────────────────────────────────────────────

function InfoStrip() {
  const [message, setMessage] = useState(FALLBACK_STRIP);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/settings`).then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch(`${BASE}/api/bake-window/current`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${BASE}/api/site-status`).then(r => r.ok ? r.json() : {}).catch(() => ({})),
    ]).then(([settings, bakeWindow, status]: [Record<string, string>, { bakeDate: string; label: string } | null, { mode?: string }]) => {
      if (settings.strip_enabled === "false") { setEnabled(false); return; }
      if (settings.strip_message) { setMessage(settings.strip_message); return; }
      const mode = status?.mode ?? "maintenance";
      if (mode === "bake_day" && bakeWindow?.bakeDate) {
        const dateStr = formatBakeDateShort(bakeWindow.bakeDate);
        setMessage(`${bakeWindow.label ?? "Next Drop"}\u2002\u00b7\u2002${dateStr}\u2002\u00b7\u2002Pre-orders open now. Limited bakes.\u2002\u00b7\u2002Free delivery within 7km of HSR Layout, Bengaluru`);
      } else {
        setMessage(`Will be back soon\u2002\u00b7\u2002Wandering Cocos\u2002\u00b7\u2002Bengaluru`);
      }
    });
  }, []);

  if (!enabled) return null;

  const repeated = Array(8).fill(message).join(" \u2002\u00b7\u2002 ");

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
      style={{ height: 32, background: "#000" }}
      aria-label="Site announcement"
    >
      <motion.div
        className="flex whitespace-nowrap items-center h-full"
        style={{
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 500,
          color: "rgba(255,255,255,0.7)",
          width: "max-content",
          fontFamily: "sans-serif",
        }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 50, ease: "linear", repeat: Infinity }}
      >
        <span style={{ paddingLeft: 32, paddingRight: 32 }}>{repeated}</span>
        <span style={{ paddingLeft: 32, paddingRight: 32 }} aria-hidden="true">{repeated}</span>
      </motion.div>
    </div>
  );
}

// ── Nav data ──────────────────────────────────────────────────────────────────

type SubLink = { name: string; href: string; soon?: boolean };
type Section = { label: string; key: string; links: SubLink[] };
type Category = { name: string; key: string; href: string; sections: Section[] };

const categories: Category[] = [
  {
    name: "Bakery", key: "bakery", href: "/bakery",
    sections: [
      {
        label: "Pre-order", key: "order", links: [
          { name: "The Wandering Box", href: "/reserve" },
          { name: "Artisan Sourdough Boule", href: "/reserve" },
          { name: "Small Box", href: "/reserve" },
          { name: "How it works", href: "/bakery#way-of-coco" },
          { name: "Delivery info", href: "/faq" },
        ],
      },
      {
        label: "The Boxes", key: "boxes", links: [
          { name: "The Wandering Box", href: "/reserve" },
          { name: "Sourdough Boule", href: "/reserve" },
          { name: "Build your own", href: "/reserve" },
        ],
      },
      {
        label: "Add-ons", key: "addons", links: [
          { name: "Jams & spreads", href: "/reserve" },
          { name: "Flavoured butters", href: "/reserve" },
          { name: "Seasonal extras", href: "/reserve" },
        ],
      },
      {
        label: "Archive", key: "archive", links: [
          { name: "Past drops", href: "/archive" },
          { name: "Customer reviews", href: "/archive" },
        ],
      },
      {
        label: "Gifting", key: "gifting", links: [
          { name: "Gift boxes", href: "/gifting" },
          { name: "Order via WhatsApp", href: "/gifting" },
          { name: "Occasions", href: "/gifting" },
        ],
      },
    ],
  },
  {
    name: "Recipes", key: "recipes", href: "/recipes",
    sections: [
      {
        label: "All Recipes", key: "all", links: [
          { name: "Browse all", href: "/recipes" },
          { name: "Most recent", href: "/recipes" },
          { name: "Quick meals", href: "/recipes" },
          { name: "Weekend cooking", href: "/recipes" },
        ],
      },
      {
        label: "High Protein", key: "protein", links: [
          { name: "Chicken & rice bowls", href: "/recipes" },
          { name: "Egg-based meals", href: "/recipes" },
          { name: "Dal & legumes", href: "/recipes" },
          { name: "Post-workout", href: "/recipes" },
        ],
      },
      {
        label: "Travel-inspired", key: "travel", links: [
          { name: "Namibia", href: "/recipes" },
          { name: "South Africa", href: "/recipes" },
          { name: "Kerala coast", href: "/recipes" },
          { name: "Mountain camps", href: "/recipes" },
        ],
      },
      {
        label: "Family Curries", key: "family", links: [
          { name: "Slow-cooked curries", href: "/recipes" },
          { name: "Sunday biryanis", href: "/recipes" },
          { name: "Comfort classics", href: "/recipes" },
        ],
      },
      {
        label: "Bakes & Breads", key: "bakes", links: [
          { name: "Sourdough at home", href: "/recipes" },
          { name: "Croissants", href: "/recipes" },
          { name: "Bagels", href: "/recipes" },
          { name: "Seasonal pastries", href: "/recipes" },
        ],
      },
    ],
  },
  {
    name: "Coffee", key: "coffee", href: "/coffee",
    sections: [
      {
        label: "Single Origin", key: "origin", links: [
          { name: "Our beans", href: "/coffee", soon: true },
          { name: "Roast profiles", href: "/coffee", soon: true },
          { name: "How we brew", href: "/coffee", soon: true },
        ],
      },
      {
        label: "Cold Brew", key: "cold", links: [
          { name: "Cold brew process", href: "/coffee", soon: true },
          { name: "Seasonal blends", href: "/coffee", soon: true },
        ],
      },
      {
        label: "The Truck", key: "truck", links: [
          { name: "Find the truck", href: "/coffee", soon: true },
          { name: "Pop-up schedule", href: "/coffee", soon: true },
        ],
      },
    ],
  },
  {
    name: "Shop", key: "shop", href: "/shop",
    sections: [
      {
        label: "All Products", key: "all", links: [
          { name: "New arrivals", href: "/shop", soon: true },
          { name: "Best sellers", href: "/shop", soon: true },
          { name: "Gift cards", href: "/shop", soon: true },
        ],
      },
      {
        label: "Training Wear", key: "wear", links: [
          { name: "Tote bags", href: "/shop", soon: true },
          { name: "Training tees", href: "/shop", soon: true },
          { name: "Caps", href: "/shop", soon: true },
        ],
      },
      {
        label: "Kitchen Goods", key: "kitchen", links: [
          { name: "Aprons", href: "/shop", soon: true },
          { name: "Bread knives", href: "/shop", soon: true },
          { name: "Linen wraps", href: "/shop", soon: true },
        ],
      },
      {
        label: "Limited Drops", key: "drops", links: [
          { name: "Current drop", href: "/shop", soon: true },
          { name: "Drop archive", href: "/shop", soon: true },
        ],
      },
    ],
  },
  {
    name: "Café", key: "cafe", href: "/cafe",
    sections: [
      {
        label: "About the Café", key: "about", links: [
          { name: "The garden café", href: "/cafe", soon: true },
          { name: "Our story", href: "/cafe", soon: true },
          { name: "HSR Layout, Bengaluru", href: "/cafe", soon: true },
        ],
      },
      {
        label: "Menu", key: "menu", links: [
          { name: "All day menu", href: "/cafe", soon: true },
          { name: "Weekend specials", href: "/cafe", soon: true },
          { name: "Coffee menu", href: "/cafe", soon: true },
        ],
      },
      {
        label: "Reservations", key: "reserve", links: [
          { name: "Book a table", href: "/cafe", soon: true },
          { name: "Private events", href: "/cafe", soon: true },
        ],
      },
    ],
  },
  {
    name: "Journal", key: "journal", href: "/journal",
    sections: [
      {
        label: "Field Notes", key: "field", links: [
          { name: "Latest notes", href: "/journal" },
          { name: "On the road", href: "/journal" },
          { name: "Wildlife & wild places", href: "/journal" },
          { name: "Reflections", href: "/journal" },
        ],
      },
      {
        label: "Pop-ups & Events", key: "popups", links: [
          { name: "Upcoming events", href: "/journal" },
          { name: "Past pop-ups", href: "/journal" },
        ],
      },
      {
        label: "Travel Stories", key: "travel", links: [
          { name: "Namibia desert", href: "/journal" },
          { name: "Cape Point", href: "/journal" },
          { name: "Quiet mountains", href: "/journal" },
          { name: "Empty beaches", href: "/journal" },
        ],
      },
      {
        label: "Behind the Bakes", key: "behind", links: [
          { name: "The bake process", href: "/journal" },
          { name: "Ingredient sourcing", href: "/journal" },
          { name: "Starting from zero", href: "/journal" },
        ],
      },
    ],
  },
];

const utilLinks = [
  { name: "Join the Circle", href: "/join" },
  { name: "Our Story", href: "/cocoswandering" },
  { name: "Gifting", href: "/gifting" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

// ── Nav overlay ───────────────────────────────────────────────────────────────

function NavOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [, navigate] = useLocation();
  const [activeCat, setActiveCat] = useState<string>("bakery");
  const [activeSec, setActiveSec] = useState<Record<string, string>>({
    bakery: "order", recipes: "all", coffee: "origin",
    shop: "all", cafe: "about", journal: "field",
  });

  const currentCat = categories.find(c => c.key === activeCat) ?? categories[0];
  const currentSec = currentCat.sections.find(s => s.key === activeSec[activeCat]) ?? currentCat.sections[0];

  function go(href: string) {
    navigate(href);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="nav-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[90] flex flex-col"
          style={{ background: "#0f2419", top: 32 }}
        >
          {/* Overlay top bar */}
          <div
            className="flex items-center justify-between px-6 flex-shrink-0"
            style={{ height: 50, borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex items-center justify-center"
              style={{ width: 32, height: 32, background: "none", border: "none", cursor: "pointer", position: "relative" }}
            >
              <span style={{
                position: "absolute", width: 18, height: 1,
                background: "rgba(245,238,224,0.7)", transform: "rotate(45deg)"
              }} />
              <span style={{
                position: "absolute", width: 18, height: 1,
                background: "rgba(245,238,224,0.7)", transform: "rotate(-45deg)"
              }} />
            </button>

            {/* Logo */}
            <button onClick={() => go("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <img
                src={`${import.meta.env.BASE_URL}images/logo.png`}
                alt="Wandering Cocos"
                style={{ height: 32, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }}
              />
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => go("/reserve")}
                style={{
                  fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "rgba(245,238,224,0.55)", background: "none", border: "none",
                  cursor: "pointer", fontFamily: "sans-serif", fontWeight: 500,
                }}
              >
                Pre-order
              </button>
            </div>
          </div>

          {/* 4-column grid — desktop */}
          <div
            className="hidden md:grid flex-1 overflow-hidden"
            style={{ gridTemplateColumns: "220px 200px 1fr 220px" }}
          >
            {/* Col 1 — category names */}
            <div
              className="flex flex-col overflow-y-auto py-9 pl-8"
              style={{ borderRight: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCat(cat.key)}
                  className="flex items-center gap-3 text-left py-2.5 pr-4"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(245,238,224,0.75)",
                    opacity: activeCat === cat.key ? 1 : 0,
                    transition: "opacity 0.2s",
                  }} />
                  <span style={{
                    fontFamily: "'Times New Roman', Georgia, serif",
                    fontSize: 22,
                    color: activeCat === cat.key ? "rgba(245,238,224,0.95)" : "rgba(245,238,224,0.32)",
                    transition: "color 0.2s",
                    lineHeight: 1.15,
                  }}>
                    {cat.name}
                  </span>
                </button>
              ))}

              {/* Utility links */}
              <div className="mt-auto pt-5 flex flex-col gap-2">
                {utilLinks.map(l => (
                  <button
                    key={l.name}
                    onClick={() => go(l.href)}
                    style={{
                      fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase",
                      color: "rgba(245,238,224,0.22)", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left", fontFamily: "sans-serif",
                      fontWeight: 500, padding: "2px 0",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,238,224,0.5)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,238,224,0.22)")}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 2 — sections */}
            <div
              className="flex flex-col overflow-y-auto py-9 pl-6"
              style={{ borderRight: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {currentCat.sections.map(sec => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSec(prev => ({ ...prev, [activeCat]: sec.key }))}
                  className="text-left py-2.5 pr-4"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: "0.5px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{
                    fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase",
                    fontFamily: "sans-serif", fontWeight: 500,
                    color: activeSec[activeCat] === sec.key
                      ? "rgba(245,238,224,0.92)"
                      : "rgba(245,238,224,0.36)",
                    transition: "color 0.15s",
                  }}>
                    {sec.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Col 3 — links */}
            <div className="flex flex-col overflow-y-auto py-9 pl-7"
              style={{ borderRight: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {currentSec.links.map(link => (
                <button
                  key={link.name}
                  onClick={() => !link.soon && go(link.href)}
                  className="text-left flex items-center justify-between py-2 pr-4"
                  style={{
                    background: "none", border: "none",
                    borderBottom: "0.5px solid rgba(255,255,255,0.05)",
                    cursor: link.soon ? "default" : "pointer",
                  }}
                >
                  <span style={{
                    fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                    fontFamily: "sans-serif", fontWeight: 500,
                    color: link.soon ? "rgba(245,238,224,0.2)" : "rgba(245,238,224,0.48)",
                    transition: "color 0.15s",
                  }}
                    onMouseEnter={e => { if (!link.soon) (e.currentTarget as HTMLElement).style.color = "rgba(245,238,224,0.92)"; }}
                    onMouseLeave={e => { if (!link.soon) (e.currentTarget as HTMLElement).style.color = "rgba(245,238,224,0.48)"; }}
                  >
                    {link.name}
                  </span>
                  {link.soon && (
                    <span style={{
                      fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase",
                      border: "0.5px solid rgba(245,238,224,0.14)", padding: "2px 5px",
                      color: "rgba(245,238,224,0.2)", fontFamily: "sans-serif",
                    }}>
                      soon
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Col 4 — placeholder for editorial images */}
            <div className="py-9 px-5 flex flex-col gap-3 overflow-hidden">
              <div className="flex gap-2 flex-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col"
                    style={{ maxHeight: 200 }}
                  >
                    <div
                      className="flex-1 rounded-sm"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                    <span style={{
                      fontSize: 8, letterSpacing: "0.26em", textTransform: "uppercase",
                      color: "rgba(245,238,224,0.3)", textAlign: "center",
                      marginTop: 6, fontFamily: "sans-serif",
                    }}>
                      {currentCat.sections[i]?.label ?? ""}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{
                fontSize: 9, letterSpacing: "0.02em", lineHeight: 1.6,
                color: "rgba(245,238,224,0.2)", fontFamily: "'Times New Roman', serif",
                fontStyle: "italic", marginTop: "auto",
              }}>
                Mood first. Always.
              </p>
            </div>
          </div>

          {/* Mobile nav — stacked */}
          <div className="md:hidden flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-0">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.1, duration: 0.4 }}
                style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
              >
                <button
                  onClick={() => go(cat.href)}
                  className="w-full text-left py-4 flex items-center justify-between"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <span style={{
                    fontFamily: "'Times New Roman', Georgia, serif",
                    fontSize: 22, color: "rgba(245,238,224,0.82)", lineHeight: 1.1,
                  }}>
                    {cat.name}
                  </span>
                  <span style={{ color: "rgba(245,238,224,0.3)", fontSize: 14 }}>›</span>
                </button>
              </motion.div>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              {utilLinks.map(l => (
                <button
                  key={l.name}
                  onClick={() => go(l.href)}
                  style={{
                    fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
                    color: "rgba(245,238,224,0.3)", background: "none", border: "none",
                    cursor: "pointer", textAlign: "left", fontFamily: "sans-serif",
                  }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [navOpen]);

  return (
    <>
      <InfoStrip />

      <header
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{
          top: 32,
          height: isScrolled ? 52 : 60,
          background: isScrolled
            ? "rgba(250,248,244,0.97)"
            : "rgba(250,248,244,0.93)",
          backdropFilter: "blur(10px)",
          borderBottom: "0.5px solid rgba(15,36,25,0.1)",
        }}
      >
        <div className="h-full flex items-center justify-between px-5 md:px-8">

          {/* Left — hamburger */}
          <button
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}
          >
            <span style={{ display: "block", width: 20, height: 1, background: "#0f2419" }} />
            <span style={{ display: "block", width: 20, height: 1, background: "#0f2419" }} />
            <span style={{ display: "block", width: 20, height: 1, background: "#0f2419" }} />
          </button>

          {/* Center — logo */}
          <button
            onClick={() => location === "/" ? window.scrollTo({ top: 0, behavior: "smooth" }) : navigate("/")}
            style={{ background: "none", border: "none", cursor: "pointer", position: "absolute", left: "50%", transform: "translateX(-50%)" }}
            aria-label="Go to homepage"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Wandering Cocos"
              style={{ height: isScrolled ? 36 : 44, width: "auto", objectFit: "contain", transition: "height 0.4s ease" }}
            />
          </button>

          {/* Right — pre-order CTA */}
          <button
            onClick={() => navigate("/reserve")}
            style={{
              fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
              fontWeight: 500, fontFamily: "sans-serif",
              color: "#0f2419", background: "none",
              border: "0.5px solid rgba(15,36,25,0.32)",
              padding: "6px 12px", cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.32)")}
          >
            Pre-order
          </button>
        </div>
      </header>

      {/* Nav overlay */}
      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
}
