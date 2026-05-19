import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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

type SubItem = { name: string; section?: string; href?: string };

type NavLink = {
  name: string;
  section?: string;
  href?: string;
  page?: string;
  dropdown?: SubItem[];
};

const navLinks: NavLink[] = [
  {
    name: "THE STORY",
    dropdown: [
      { name: "The Philosophy", section: "philosophy" },
      { name: "Way of the Coco", section: "way-of-the-coco" },
    ],
  },
  { name: "MENU", href: "/reserve" },
  { name: "GIFTING", href: "/gifting" },
  { name: "ARCHIVES", href: "/archive" },
  { name: "RECIPES", href: "/recipes" },
  { name: "JOIN THE CIRCLE", href: "/join" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [mobileStoryOpen, setMobileStoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigateToSection(section: string) {
    if (location === "/") {
      scrollToSection(section);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(section), 450);
    }
  }

  function handleNavClick(link: NavLink) {
    setMobileMenuOpen(false);
    setStoryOpen(false);
    if (link.href) { navigate(link.href); return; }
    if (link.page && link.section) {
      if (location === link.page) {
        scrollToSection(link.section);
      } else {
        navigate(link.page);
        setTimeout(() => scrollToSection(link.section!), 450);
      }
      return;
    }
    if (link.section) navigateToSection(link.section);
  }

  return (
    <>
      <InfoStrip />

      <header
        className={`fixed top-[32px] left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm h-16 md:h-20"
            : "bg-transparent h-20 md:h-24"
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
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setStoryOpen(true)}
                    onMouseLeave={() => setStoryOpen(false)}
                  >
                    <button
                      className="text-xs tracking-[0.15em] font-medium text-foreground/80 hover:text-accent flex items-center gap-1 py-1 uppercase cursor-pointer group"
                      onClick={() => setStoryOpen((v) => !v)}
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${storyOpen ? "rotate-180" : ""}`}
                        strokeWidth={1.8}
                      />
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    </button>

                    <AnimatePresence>
                      {storyOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-background border border-border/60 shadow-xl"
                          style={{ borderRadius: 0 }}
                        >
                          {link.dropdown.map((sub, i) => (
                            <button
                              key={sub.name}
                              onClick={() => {
                                setStoryOpen(false);
                                if (sub.href) navigate(sub.href);
                                else if (sub.section) navigateToSection(sub.section);
                              }}
                              className={`w-full text-left px-5 py-3.5 text-[11px] tracking-[0.12em] uppercase font-medium text-foreground/70 hover:text-accent hover:bg-accent/5 transition-colors duration-200 cursor-pointer ${
                                i < link.dropdown!.length - 1 ? "border-b border-border/40" : ""
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="text-xs tracking-[0.15em] font-medium text-foreground/80 hover:text-accent relative overflow-hidden group py-1 uppercase cursor-pointer"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </button>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-foreground/80 hover:text-accent transition-colors duration-300"
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

            <nav className="flex-1 flex flex-col justify-center items-center gap-6 px-6 py-8">
              {navLinks.map((link, i) => {
                if (link.dropdown) {
                  return (
                    <div key={link.name} className="flex flex-col items-center gap-4 w-full">
                      <button
                        onClick={() => setMobileStoryOpen((v) => !v)}
                        className="font-serif text-2xl text-foreground hover:text-accent transition-colors duration-300 uppercase tracking-widest text-center cursor-pointer flex items-center gap-2"
                      >
                        {link.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${mobileStoryOpen ? "rotate-180" : ""}`}
                          strokeWidth={1.5}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileStoryOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col items-center gap-3 overflow-hidden"
                          >
                            {link.dropdown.map((sub) => (
                              <button
                                key={sub.name}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileStoryOpen(false);
                                  if (sub.href) navigate(sub.href);
                                  else if (sub.section) navigateToSection(sub.section);
                                }}
                                className="text-sm tracking-[0.14em] uppercase font-medium text-[#2D2926] hover:text-accent transition-colors duration-200 cursor-pointer"
                              >
                                {sub.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="w-8 h-px bg-border/40" />
                    </div>
                  );
                }

                return (
                  <motion.button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                    className="font-serif text-2xl text-foreground hover:text-accent transition-colors duration-300 uppercase tracking-widest text-center cursor-pointer"
                  >
                    {link.name}
                  </motion.button>
                );
              })}
            </nav>

            <div className="p-8 text-center border-t border-border/50">
              <p className="font-serif italic text-muted-foreground">
                Dark Roast & Open Road
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
