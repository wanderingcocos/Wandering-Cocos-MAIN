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

type NavChild = { name: string; href: string };
type NavLink = {
  name: string;
  href?: string;
  children?: NavChild[];
  cta?: boolean;
};

const navLinks: NavLink[] = [
  { name: "HOME", href: "/" },
  {
    name: "BAKERY",
    href: "/bakery",
    children: [
      { name: "Pre-order", href: "/reserve" },
      { name: "Gifting", href: "/gifting" },
    ],
  },
  { name: "RECIPES", href: "/recipes" },
  { name: "COFFEE", href: "/coffee" },
  { name: "SHOP", href: "/shop" },
  { name: "CAFÉ", href: "/cafe" },
  {
    name: "JOURNAL",
    href: "/journal",
    children: [
      { name: "Archives", href: "/archive" },
    ],
  },
  { name: "JOIN THE CIRCLE", href: "/join" },
];

const HIDDEN_NAV = new Set(["RECIPES", "COFFEE", "SHOP", "CAFÉ"]);

function DropdownItem({ link, location, navigate, onClose }: {
  link: NavLink;
  location: string;
  navigate: (href: string) => void;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = link.href === "/"
    ? location === "/"
    : location.startsWith(link.href ?? "__none__") ||
      (link.children?.some(c => location.startsWith(c.href)) ?? false);

  function handleMouseEnter() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  }
  function handleMouseLeave() {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  }

  if (link.cta) {
    return (
      <button
        onClick={() => { navigate(link.href!); onClose?.(); }}
        className="text-[10px] tracking-[0.16em] font-medium uppercase cursor-pointer transition-all duration-200 px-4 py-1.5 border"
        style={{
          color: "var(--foreground)",
          borderColor: "rgba(45,41,38,0.35)",
          opacity: 0.85,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(45,41,38,0.7)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(45,41,38,0.35)"; }}
      >
        {link.name}
      </button>
    );
  }

  if (!link.children?.length) {
    return (
      <button
        onClick={() => { navigate(link.href!); onClose?.(); }}
        className={`text-[10px] tracking-[0.16em] font-medium relative overflow-hidden group py-1 uppercase cursor-pointer transition-colors duration-200 text-foreground/80 hover:text-accent ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
      >
        {link.name}
        <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transform ${isActive ? "translate-x-0" : "-translate-x-[101%] group-hover:translate-x-0"} transition-transform duration-300 ease-out`} />
      </button>
    );
  }

  return (
    <div
      ref={ref}
      className="flex flex-col items-start"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parent label — always visible */}
      <button
        onClick={() => { navigate(link.href!); onClose?.(); }}
        className={`text-[10px] tracking-[0.16em] font-medium relative overflow-hidden group py-1 uppercase cursor-pointer transition-colors duration-200 text-foreground/80 hover:text-accent ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
      >
        {link.name}
        <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transform ${isActive ? "translate-x-0" : "-translate-x-[101%] group-hover:translate-x-0"} transition-transform duration-300 ease-out`} />
      </button>

      {/* Child links — appear below parent on hover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-start overflow-hidden mt-1"
          >
            {link.children!.map(child => {
              const childActive = location.startsWith(child.href);
              return (
                <button
                  key={child.name}
                  onClick={() => { navigate(child.href); setOpen(false); onClose?.(); }}
                  className={`text-[9px] tracking-[0.18em] uppercase font-medium transition-colors duration-150 leading-none py-0.5 cursor-pointer ${childActive ? "text-accent" : "text-foreground/50 hover:text-accent"}`}
                >
                  {child.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <nav className="hidden md:flex items-start gap-7 lg:gap-9 pt-5">
            {navLinks.filter(l => !HIDDEN_NAV.has(l.name)).map(link => (
              <DropdownItem
                key={link.name}
                link={link}
                location={location}
                navigate={navigate}
              />
            ))}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-foreground/80 transition-colors duration-300"
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
                onClick={() => { setMobileMenuOpen(false); setMobileExpanded(null); }}
                className="text-foreground/80 hover:text-accent transition-colors duration-300 p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center items-center gap-2 px-6 py-8">
              {navLinks.filter(l => !HIDDEN_NAV.has(l.name)).map((link, i) => {
                const hasChildren = (link.children?.length ?? 0) > 0;
                const isExpanded = mobileExpanded === link.name;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 + 0.1, duration: 0.4 }}
                    className="w-full flex flex-col items-center"
                  >
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          setMobileExpanded(isExpanded ? null : link.name);
                        } else {
                          navigate(link.href!);
                          setMobileMenuOpen(false);
                          setMobileExpanded(null);
                        }
                      }}
                      className={`font-serif text-2xl transition-colors duration-300 uppercase tracking-widest text-center cursor-pointer flex items-center gap-2 py-3 ${link.cta ? "text-accent border border-accent/50 px-8 font-sans text-sm" : "text-foreground hover:text-accent"}`}
                    >
                      {link.name}
                      {hasChildren && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} strokeWidth={1.5} />
                      )}
                    </button>

                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-center gap-1 overflow-hidden"
                        >
                          {link.children!.map(child => (
                            <button
                              key={child.name}
                              onClick={() => { navigate(child.href); setMobileMenuOpen(false); setMobileExpanded(null); }}
                              className="text-sm tracking-[0.18em] uppercase text-foreground/60 hover:text-accent transition-colors duration-200 py-2"
                            >
                              {child.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
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
