import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const HEADER_OFFSET = 96;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const FALLBACK_STRIP = "Bake Date Coming Soon\u2002\u00b7\u2002Pre-orders open now. Limited bakes.\u2002\u00b7\u2002Free delivery within 7km of HSR Layout, Bengaluru";

function formatBakeDateShort(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

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
      className="fixed top-0 left-0 right-0 z-[60] bg-black text-white/90 py-2 overflow-hidden"
      style={{ height: 32 }}
      aria-label="Site announcement"
    >
      <motion.div
        className="flex whitespace-nowrap text-[10px] md:text-xs tracking-widest font-medium uppercase"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 50, ease: "linear", repeat: Infinity }}
        style={{ width: "max-content" }}
      >
        <span className="px-8">{repeated}</span>
        <span className="px-8" aria-hidden="true">{repeated}</span>
      </motion.div>
    </div>
  );
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

type NavLink = {
  name: string;
  href?: string;
};

const navLinks: NavLink[] = [
  { name: "HOME", href: "/" },
  { name: "BAKERY", href: "/bakery" },
  { name: "RECIPES", href: "/recipes" },
  { name: "COFFEE", href: "/coffee" },
  { name: "SHOP", href: "/shop" },
  { name: "CAFÉ", href: "/cafe" },
  { name: "JOURNAL", href: "/journal" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleNavClick(link: NavLink) {
    setMobileMenuOpen(false);
    if (link.href) { navigate(link.href); return; }
  }

  const textColor = "text-foreground/80";
  const hoverColor = "hover:text-accent";
  const bgScrolled = "bg-background/95 backdrop-blur-md border-b border-border shadow-sm";
  const bgUnscrolled = "bg-background/90 backdrop-blur-sm border-b border-border/50";

  return (
    <>
      <InfoStrip />

      <header
        className={`fixed top-[32px] left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? `${bgScrolled} h-16 md:h-20`
            : `${bgUnscrolled} h-20 md:h-24`
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-stretch justify-between h-full">
          {/* Logo */}
          <button
            onClick={() => {
              if (location === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
            className="group self-stretch flex items-center py-1"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Wandering Cocos"
              className="h-full w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => {
              const isActive = link.href === "/"
                ? location === "/"
                : location.startsWith(link.href!);
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`text-[10px] tracking-[0.16em] font-medium relative overflow-hidden group py-1 uppercase cursor-pointer transition-colors duration-200 ${textColor} ${hoverColor} ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transform ${isActive ? "translate-x-0" : "-translate-x-[101%] group-hover:translate-x-0"} transition-transform duration-300 ease-out`} />
                </button>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`${textColor} transition-colors duration-300`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col pt-8 overflow-y-auto"
          >
            <div className="px-6 py-8 flex justify-between items-center border-b border-border/50 mt-[32px]">
              <img
                src={`${import.meta.env.BASE_URL}images/logo.png`}
                alt="Wandering Cocos"
                className="h-16 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-accent transition-colors duration-300 p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center items-center gap-7 px-6 py-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.4 }}
                  className="font-serif text-2xl text-foreground hover:text-accent transition-colors duration-300 uppercase tracking-widest text-center cursor-pointer"
                >
                  {link.name}
                </motion.button>
              ))}
            </nav>

            <div className="p-8 text-center border-t border-border/50">
              <p className="font-serif italic text-muted-foreground">
                Dark Roast &amp; Open Road
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
