import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSiteStatus } from "@/hooks/useSiteStatus";
import { WA_NUMBER } from "@/lib/constants";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { readCache, revalidate } from "@/lib/apiCache";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const BAKE_URL = `${BASE}/api/bake-window/current`;
const SETTINGS_URL = `${BASE}/api/settings`;
const DATA_TTL = 30_000;

type BakeWindowItem = { id: number; name: string; description: string | null; position: number };
type BakeWindow = {
  id: number; label: string; bakeDate: string; status: string;
  boxPrice: number; originalPrice: number; maxBoxes: number;
  notes: string | null; items: BakeWindowItem[];
};

const FALLBACK_ITEMS: { num: string; name: string; note: string }[] = [
  { num: "01", name: "The New York Bagels", note: "Cream Cheese + Toasted Onion · Sharp Cheddar + Charred Jalapeño" },
  { num: "02", name: "Almond Croissant Blondie", note: "Frangipane, toasted almonds, crackled sugar crust" },
  { num: "03", name: "Aromatic Cardamom Pistachio Cream Twist", note: "Cardamom-spiced dough, pistachio cream, crushed pistachios" },
  { num: "04", name: "Pistachio Cream Rolls", note: "Brioche, pistachio cream, crushed pistachios" },
  { num: "05", name: "Spiced Phyllo Rolls", note: "Feta cheese filling, honey glaze, sesame, dried chili" },
  { num: "06", name: "Kerala Mutta Puffs", note: "Flaky pastry, spiced Kerala egg masala" },
];

function formatBakeDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

function ComingSoonBadge({ dark = false }: { dark?: boolean }) {
  return dark ? (
    <span style={{
      display: "inline-block", fontSize: "8px", letterSpacing: "0.3em", fontWeight: 600,
      textTransform: "uppercase", background: "rgba(200,168,130,0.12)",
      border: "1px solid rgba(200,168,130,0.45)", color: "rgba(200,168,130,0.9)",
      padding: "3px 9px", verticalAlign: "middle",
    }}>Coming Soon</span>
  ) : (
    <span style={{
      display: "inline-block", fontSize: "8px", letterSpacing: "0.3em", fontWeight: 600,
      textTransform: "uppercase", background: "rgba(45,90,61,0.07)",
      border: "1px solid rgba(45,90,61,0.22)", color: "#2d5a3d",
      padding: "3px 9px", verticalAlign: "middle",
    }}>Coming Soon</span>
  );
}

function BakeDateDisplay({ date, dark = false }: { date: string; dark?: boolean }) {
  if (date === "Coming Soon") return <ComingSoonBadge dark={dark} />;
  return <>{date}</>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  max: number;
  badge: string;
  description: string;
};

function QtyControl({ qty, max, onChange }: { qty: number; max: number; onChange: (q: number) => void }) {
  const soldOut = max === 0;
  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onChange(Math.max(0, qty - 1))}
        disabled={qty === 0 || soldOut}
        className="w-9 h-9 flex items-center justify-center border border-r-0 border-border/50 text-[#2D2926] hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
      >
        −
      </button>
      <span
        className="w-10 h-9 flex items-center justify-center border border-border/50 text-sm font-medium text-foreground tabular-nums"
        style={{ background: "hsl(38 25% 97%)" }}
      >
        {soldOut ? "—" : qty}
      </span>
      <button
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max || soldOut}
        className="w-9 h-9 flex items-center justify-center border border-l-0 border-border/50 text-[#2D2926] hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
      >
        +
      </button>
    </div>
  );
}

function ProductCard({ product, qty, onChange, highlighted }: { product: Product; qty: number; onChange: (q: number) => void highlighted?: boolean; }) {
  const soldOut = product.max === 0;
  const isLimited = !soldOut && product.max < 99;
  const selected = qty > 0;

  return (
    <div
      className="p-5 border transition-all duration-200"
      style={{
        border: highlighted
  ? "2px solid #2d5a3d"
  : selected
  ? "1.5px solid #2d5a3d"
  : soldOut
  ? "1px solid rgba(45,41,38,0.15)"
  : "1px solid rgba(45,41,38,0.2)",
background: highlighted
  ? "hsl(150 30% 95%)"
  : selected
  ? "hsl(150 20% 97%)"
  : soldOut
  ? "hsl(38 10% 97%)"
  : "hsl(38 25% 98%)",
opacity: soldOut ? 0.6 : 1,
boxShadow: highlighted ? "0 0 0 3px rgba(45,90,61,0.15)" : "none",
transform: highlighted ? "scale(1.005)" : "scale(1)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[8px] tracking-[0.25em] uppercase font-semibold px-2 py-0.5"
              style={{
                background: soldOut ? "rgba(45,41,38,0.06)" : "rgba(45,90,61,0.08)",
                color: soldOut ? "#2D2926" : "#2d5a3d",
                border: soldOut ? "1px solid rgba(45,41,38,0.12)" : "1px solid rgba(45,90,61,0.18)",
              }}
            >
              {soldOut ? "Sold Out" : product.badge}
            </span>
            {isLimited && (
              <span
                className="text-[8px] tracking-[0.2em] uppercase font-medium px-2 py-0.5"
                style={{
                  background: "rgba(180,100,30,0.07)",
                  color: "rgba(140,70,20,0.75)",
                  border: "1px solid rgba(180,100,30,0.2)",
                }}
              >
                Limited to {product.max} per drop
              </span>
            )}
          </div>
          <h3 className="font-serif text-sm text-foreground leading-snug mb-0.5">{product.name}</h3>
          <p className="text-xs text-[#2D2926] leading-relaxed">{product.description}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-3">
          <div className="text-right">
            <span className="font-serif font-medium text-sm text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="block text-[11px] line-through" style={{ color: "rgba(45,41,38,0.45)" }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {!soldOut && (
            <QtyControl qty={qty} max={product.max} onChange={onChange} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Reserve() {
  const { mode: siteMode, loaded: siteModeLoaded } = useSiteStatus();
  const [bakeWindow, setBakeWindow] = useState<BakeWindow | null>(() => {
    const c = readCache<BakeWindow | null>(BAKE_URL, DATA_TTL);
    return c !== undefined ? c : null;
  });
  const [windowLoaded, setWindowLoaded] = useState(
    () => readCache(BAKE_URL, DATA_TTL) !== undefined && readCache(SETTINGS_URL, DATA_TTL) !== undefined
  );
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>(
    () => readCache<Record<string, string>>(SETTINGS_URL, DATA_TTL) ?? {}
  );
  const orderSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let bwDone = readCache(BAKE_URL, DATA_TTL) !== undefined;
    let sDone = readCache(SETTINGS_URL, DATA_TTL) !== undefined;
    function checkDone() { if (bwDone && sDone) setWindowLoaded(true); }
    revalidate<BakeWindow | null>(BAKE_URL, d => { setBakeWindow(d); bwDone = true; checkDone(); }, () => { bwDone = true; checkDone(); });
    revalidate<Record<string, string>>(SETTINGS_URL, d => { if (d && typeof d === "object") setSiteSettings(d); sDone = true; checkDone(); }, () => { sDone = true; checkDone(); });
  }, []);

  const BAKE_DATE = bakeWindow ? formatBakeDate(bakeWindow.bakeDate) : "Coming Soon";
  const BOX_PRICE = bakeWindow?.boxPrice ?? 1299;
  const BOX_ORIGINAL_PRICE = bakeWindow?.originalPrice ?? 1999;
  const MAX_BOXES = bakeWindow?.maxBoxes ?? 15;
  const _parsedSmall = parseInt(siteSettings.max_small_boxes ?? "");
  const MAX_SMALL = Number.isNaN(_parsedSmall) ? 99 : _parsedSmall;
  const _parsedBoule = parseInt(siteSettings.max_sourdough_boules ?? "");
  const MAX_BOULE = Number.isNaN(_parsedBoule) ? 99 : _parsedBoule;

  const menuItems = bakeWindow?.items?.length
    ? bakeWindow.items.map((item, i) => ({
        num: String(i + 1).padStart(2, "0"),
        name: item.name,
        note: item.description ?? "",
      }))
    : FALLBACK_ITEMS;

  const PRODUCTS: Product[] = [
    {
      id: "big_box",
      name: "The Wandering Box",
      price: BOX_PRICE,
      originalPrice: BOX_ORIGINAL_PRICE,
      max: MAX_BOXES,
      badge: "The Full Experience",
      description: `The ultimate Wandering Cocos experience. All ${menuItems.length} items from this drop, thoughtfully curated to take you through sweet, savoury, spiced and deeply comforting flavours.`,
    },
    {
      id: "small_box",
      name: "Small Wandering Box",
      price: 599,
      max: MAX_SMALL,
      badge: "New Addition",
      description: "A smaller wandering experience. Choose any three bakes and build your own box, whether you're sharing with someone or keeping every bite for yourself.",
    },
    {
      id: "sourdough",
      name: "Artisanal Sourdough Boule",
      price: 260,
      max: MAX_BOULE,
      badge: "à la carte",
      description: "12-24 hours cold-fermented. Open crumb, Soft crust, zero additives. Available alongside or without the Wandering Box.",
    },
  ];

  const [cart, setCart] = useState<Record<string, number>>({ big_box: 1 });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<"form" | "sent">("form");

  useEffect(() => {
    if (!windowLoaded) return;
    setCart(prev => {
      const clamped = { ...prev };
      if (MAX_BOXES === 0) clamped.big_box = 0;
      if (MAX_SMALL === 0) clamped.small_box = 0;
      if (MAX_BOULE === 0) clamped.sourdough = 0;
      return clamped;
    });
  }, [windowLoaded, MAX_BOXES, MAX_SMALL, MAX_BOULE]);

  function setProductQty(id: string, qty: number) {
    setCart(c => ({ ...c, [id]: qty }));
  }

  const cartItems = PRODUCTS.filter(p => (cart[p.id] ?? 0) > 0);
  const cartTotal = cartItems.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);
  const cartHasItems = cartItems.length > 0;
  const canProceed = cartHasItems && !!(name.trim() && phone.trim() && address.trim());

  const cartLines = cartItems.map(
    p => `• ${cart[p.id]}× ${p.name} @ ₹${p.price.toLocaleString("en-IN")} = ₹${((cart[p.id] ?? 0) * p.price).toLocaleString("en-IN")}`
  );

  const waMessage = encodeURIComponent(
    [
      `Hi Wandering Cocos! I'd like to pre-order for ${BAKE_DATE}:`,
      ``,
      ...cartLines,
      ``,
      `Order total: ₹${cartTotal.toLocaleString("en-IN")}`,
      ``,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Delivery address: ${address.trim()}`,
      ``,
      `Sending UPI payment now.`,
    ].join("\n")
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;
  const upiId = siteSettings.upi_id ?? "";
  const upiUrl = upiId ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Wandering%20Cocos&am=${cartTotal}&tn=Pre-order%20${encodeURIComponent(BAKE_DATE)}&cu=INR` : "";

  function scrollToOrder() {
    if (!orderSectionRef.current) return;
    const top = orderSectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function handleSendOrder() {
    if (!canProceed) return;
    setStep("sent");
    window.open(waLink, "_blank");
  }

  function resetOrder() {
    setCart({});
    setName(""); setPhone(""); setAddress("");
    setStep("form");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">
        {/* COMPACT HERO */}
        <section className="pt-36 pb-14 px-6 md:px-14 lg:px-20" style={{ background: "#0f2419" }}>
          <div className="max-w-7xl mx-auto">
            <motion.span initial="hidden" animate="visible" custom={0} variants={fadeUp}
              className="text-[9px] tracking-[0.38em] font-medium uppercase block mb-4"
              style={{ color: "rgba(245,238,224,0.85)" }}>
              {siteMode === "popup"
                ? "Pop-Up This Week · Online Orders Paused"
                : siteMode === "maintenance"
                ? "Coming Back Soon · Baking In Progress"
                : siteMode === "chef_on_break"
                ? "Chef on Break · Back Soon"
                : <>{bakeWindow ? bakeWindow.label : "The Weekend Edit"} · <BakeDateDisplay date={BAKE_DATE} dark /></>}
            </motion.span>

            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="font-serif italic leading-tight"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", color: "#ffffff" }}>
              Pre-order Your Box
            </motion.h1>

            {siteMode === "bake_day" && (
              <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}
                className="mt-6 flex items-baseline gap-4 flex-wrap">
                <span className="font-serif font-medium" style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#ffffff" }}>
                  ₹{BOX_PRICE.toLocaleString("en-IN")}
                </span>
                <span className="font-light line-through"
                  style={{ fontSize: "clamp(1rem, 1.6vw, 1.3rem)", color: "rgba(245,238,224,0.80)", textDecorationColor: "rgba(245,238,224,0.80)" }}>
                  ₹{BOX_ORIGINAL_PRICE.toLocaleString("en-IN")}
                </span>
                <span className="font-light tracking-wide"
                  style={{ fontSize: "clamp(0.75rem, 1vw, 0.85rem)", color: "rgba(245,238,224,0.85)" }}>
                  per box
                </span>
              </motion.div>
            )}

            <motion.p initial="hidden" animate="visible" custom={3} variants={fadeUp}
              className="mt-3 font-light"
              style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)", color: "rgba(245,238,224,0.85)", maxWidth: "380px", lineHeight: "1.7" }}>
              {siteMode === "popup"
                ? "We're at a pop-up this week. Online orders are paused. We'll be back very soon."
                : siteMode === "maintenance"
                ? "We're baking in the background. Online orders will open with our next drop."
                : siteMode === "chef_on_break"
                ? "Taking a short pause to recharge, live a little more presently, and come back inspired."
                : "Baked fresh on delivery day. Comes with a branded bag. Prepaid only. Limited bakes per drop."}
            </motion.p>

            {siteMode === "bake_day" && (
              <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="mt-8">
                <button
                  onClick={scrollToOrder}
                  className="inline-flex items-center gap-2 h-11 px-7 text-[10px] tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:opacity-90"
                  style={{ background: "rgba(255,255,255,0.12)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  Pre-order Now ↓
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* TOTE BAG HIGHLIGHT — bake_day only */}
        {siteMode === "bake_day" && (
          <section style={{ background: "#0f2419" }} className="px-6 md:px-14 lg:px-20 py-10">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-10">
              <div className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ width: 56, height: 56, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                  className="w-6 h-6" style={{ color: "rgba(200,168,130,0.85)" }}>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="text-center sm:text-left flex-grow">
                <p className="font-serif italic" style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", color: "#ffffff", marginBottom: "0.2rem" }}>
                  First 50 orders come with a Wandering Coco's Tote Bag.
                </p>
                <p className="font-light" style={{ fontSize: "clamp(0.72rem, 0.9vw, 0.8rem)", color: "rgba(245,238,224,0.85)", letterSpacing: "0.04em" }}>
                  Carry it everywhere. Let others wonder.
                </p>
              </div>
              <div className="flex-shrink-0 text-center px-5 py-2"
                style={{ border: "1px solid rgba(200,168,130,0.3)", color: "rgba(200,168,130,0.85)" }}>
                <p className="text-[9px] tracking-[0.3em] uppercase font-medium">Included Free</p>
              </div>
            </motion.div>
          </section>
        )}

        {/* MAIN TWO-COLUMN */}
        <section ref={orderSectionRef} id="preorder-section" className="px-6 md:px-14 lg:px-20 py-16 max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 gap-14 lg:gap-24 ${siteMode === "bake_day" ? "lg:grid-cols-2" : ""}`}>

            {/* LEFT — What's inside (bake_day only) */}
            {siteMode === "bake_day" && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
                <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-[#2D2926] block mb-6">
                  What's in the box
                </span>
                {!windowLoaded ? (
                  <div className="space-y-3">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="py-4 flex gap-5 items-start animate-pulse">
                        <div className="w-5 h-3 bg-foreground/10 rounded mt-1 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-foreground/10 rounded w-2/3" />
                          <div className="h-2 bg-foreground/6 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-border/25">
                    {menuItems.map((item, i) => (
                      <motion.div key={item.num} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        custom={i} variants={fadeUp} className="py-4 flex gap-5 items-start">
                        <span className="text-[9px] tracking-[0.2em] font-medium uppercase text-[#2D2926] pt-0.5 flex-shrink-0 w-5">
                          {item.num}
                        </span>
                        <div>
                          <p className="font-serif text-sm font-medium text-foreground leading-snug mb-0.5">{item.name}</p>
                          {item.note && <p className="text-xs text-[#2D2926] leading-relaxed">{item.note}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <p className="mt-5 text-[10px] text-[#2D2926] leading-relaxed">
                  Every box contains all {menuItems.length} items. Baked on <BakeDateDisplay date={BAKE_DATE} />.
                </p>
              </motion.div>
            )}

            {/* RIGHT — Product selector + form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp} custom={1} className="lg:pt-0">

              {!siteModeLoaded ? (
                <div className="h-64 animate-pulse rounded bg-foreground/5" />
              ) : siteMode === "popup" ? (
                <div className="border border-border/30 p-8 text-center" style={{ background: "hsl(38 25% 97%)" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-medium text-[#2D2926] mb-5">Orders Paused</p>
                  <p className="font-serif text-lg text-foreground leading-snug mb-4">We're at a pop-up this week.</p>
                  <p className="text-sm text-[#2D2926] leading-relaxed mb-6">Online orders are closed, but we'll be back next week.</p>
                  <a href="https://chat.whatsapp.com/HH1IixIyMcCCY8jHnrlHei" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 px-8 text-xs tracking-[0.2em] uppercase font-medium text-white transition-all hover:opacity-90"
                    style={{ background: "#25D366" }}>
                    Join our WhatsApp Community
                  </a>
                </div>
              ) : siteMode === "maintenance" ? (
                <div className="border border-border/30 p-8 text-center" style={{ background: "hsl(38 25% 97%)" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-medium text-[#2D2926] mb-5">Coming Soon</p>
                  <p className="font-serif text-lg text-foreground leading-snug mb-4">Baking in progress.</p>
                  <p className="text-sm text-[#2D2926] leading-relaxed">Check back soon — something delicious is on its way.</p>
                </div>
              ) : siteMode === "sold_out" ? (
                <div className="border border-border/30 p-8 text-center" style={{ background: "hsl(38 25% 97%)" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-medium text-[#2D2926] mb-5">Sold Out</p>
                  <p className="font-serif text-lg text-foreground leading-snug mb-4">All boxes are claimed.</p>
                  <p className="text-sm text-[#2D2926] leading-relaxed mb-6">Every box for this bake is reserved. Follow us to be the first to know about the next drop.</p>
                  <a href="https://instagram.com/wandering.cocos" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 px-8 text-xs tracking-[0.2em] uppercase font-medium border border-foreground/30 text-foreground hover:border-foreground/50 transition-all">
                    Follow on Instagram
                  </a>
                </div>
              ) : siteMode === "chef_on_break" ? (
                <div className="border border-border/30 p-8" style={{ background: "hsl(38 25% 97%)" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-medium text-[#2D2926] mb-5">Chef on Break</p>
                  <p className="font-serif text-lg text-foreground leading-snug mb-5">
                    Not everything in life needs to move fast.
                  </p>
                  <p className="text-sm text-[#2D2926] leading-relaxed mb-5">
                    Some things are better done slowly with care, intention, and love for the process. We're taking a short pause to recharge and come back inspired.
                  </p>
                  <p className="font-serif italic text-sm text-foreground/70 leading-relaxed">
                    Life is not a race. Move at your own pace. Enjoy the process.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {step === "form" ? (
                    <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

                      {/* Product selector */}
                      <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-[#2D2926] block mb-6">
                        Select your items
                      </span>

                      {!windowLoaded ? (
                        <div className="space-y-3 mb-8">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 animate-pulse rounded bg-foreground/5" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3 mb-8">
                          {PRODUCTS.map(product => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              qty={cart[product.id] ?? 0}
                              onChange={qty => setProductQty(product.id, qty)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Delivery details — shown once any item is selected */}
                      <AnimatePresence>
                        {cartHasItems && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mb-8">
                              <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-[#2D2926] mb-4">Delivery details</p>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[10px] tracking-[0.18em] uppercase text-[#2D2926] block mb-1">Full name</label>
                                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                                    className="w-full h-11 border border-border/50 bg-background text-foreground text-xs px-4 focus:outline-none focus:border-accent transition-colors duration-200 placeholder:text-[#2D2926]" />
                                </div>
                                <div>
                                  <label className="text-[10px] tracking-[0.18em] uppercase text-[#2D2926] block mb-1">Phone number</label>
                                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                                    className="w-full h-11 border border-border/50 bg-background text-foreground text-xs px-4 focus:outline-none focus:border-accent transition-colors duration-200 placeholder:text-[#2D2926]" />
                                </div>
                                <div>
                                  <label className="text-[10px] tracking-[0.18em] uppercase text-[#2D2926] block mb-1">Delivery address</label>
                                  <textarea value={address} onChange={e => setAddress(e.target.value)}
                                    placeholder="Flat / building, street, area, Bengaluru" rows={2}
                                    className="w-full border border-border/50 bg-background text-foreground text-xs leading-relaxed px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 resize-none placeholder:text-[#2D2926]" />
                                </div>
                              </div>
                            </div>

                            {/* Order summary */}
                            <div className="border border-border/35 px-5 py-4 mb-6" style={{ background: "hsl(38 25% 97%)" }}>
                              <p className="text-[9px] tracking-[0.25em] uppercase font-medium text-[#2D2926] mb-3">Order summary</p>
                              <div className="space-y-2 mb-3">
                                {cartItems.map(p => (
                                  <div key={p.id} className="flex items-center justify-between gap-4">
                                    <p className="text-xs text-[#2D2926] leading-snug">
                                      <span className="text-foreground font-medium">{cart[p.id]}×</span> {p.name}
                                    </p>
                                    <span className="text-xs font-medium text-foreground flex-shrink-0">
                                      ₹{((cart[p.id] ?? 0) * p.price).toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(45,41,38,0.12)" }}>
                                <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#2D2926]">Total</p>
                                <span className="text-base font-serif font-medium text-foreground">₹{cartTotal.toLocaleString("en-IN")}</span>
                              </div>
                            </div>

                            <button onClick={handleSendOrder} disabled={!canProceed}
                              className={`flex items-center justify-center w-full h-14 text-xs tracking-[0.22em] font-medium uppercase transition-all duration-300 mb-3 ${canProceed ? "cursor-pointer hover:opacity-90" : "cursor-not-allowed opacity-40"}`}
                              style={{ background: "#2d5a3d", color: "#ffffff", border: "1px solid #2d5a3d" }}>
                              Send Pre-order on WhatsApp
                            </button>
                            {!canProceed && (
                              <p className="text-[10px] text-[#2D2926] text-center">Fill in your delivery details above to continue.</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!cartHasItems && (
                        <p className="text-[10px] text-[#2D2926] leading-relaxed">
                          Add at least one item above, then fill in your delivery details to place your pre-order.
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="mb-8 pb-8 border-b border-border/25">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ background: "#2d5a3d" }}>✓</span>
                          <p className="text-sm font-serif text-foreground">Pre-order sent on WhatsApp</p>
                        </div>
                        <p className="text-xs text-[#2D2926] leading-relaxed pl-8">
                          Your pre-order for {BAKE_DATE} has been sent to us. We'll confirm your slot once we receive payment.
                        </p>
                      </div>

                      <div className="mb-8">
                        <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-[#2D2926] mb-5">Complete your payment</p>
                        <div className="border border-border/30 p-6 mb-5" style={{ background: "hsl(38 25% 97%)" }}>
                          <div className="mb-4 space-y-2">
                            {cartItems.map(p => (
                              <div key={p.id} className="flex items-center justify-between gap-4">
                                <p className="text-xs text-[#2D2926]">
                                  <span className="font-medium text-foreground">{cart[p.id]}×</span> {p.name}
                                </p>
                                <span className="text-xs font-medium text-foreground">
                                  ₹{((cart[p.id] ?? 0) * p.price).toLocaleString("en-IN")}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-baseline justify-between pt-3 mb-5" style={{ borderTop: "1px solid rgba(45,41,38,0.1)" }}>
                            <p className="text-xs text-[#2D2926]">Amount due</p>
                            <span className="text-2xl font-serif font-medium text-foreground">₹{cartTotal.toLocaleString("en-IN")}</span>
                          </div>
                          {upiId && (
                            <div className="flex flex-col gap-3">
                              <div>
                                <p className="text-[9px] tracking-[0.22em] uppercase text-[#2D2926] mb-1">UPI ID</p>
                                <p className="text-sm font-mono text-foreground font-medium select-all">{upiId}</p>
                              </div>
                              <p className="text-xs text-[#2D2926] leading-relaxed">Pay with GPay, PhonePe, Paytm, or any UPI app.</p>
                              {upiUrl && (
                                <a href={upiUrl} className="inline-flex items-center text-[10px] tracking-[0.18em] uppercase font-medium text-accent hover:underline underline-offset-4 transition-colors">
                                  Open UPI app on this device
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-[#2D2926] leading-relaxed">
                          Once we confirm receipt of payment, we'll send you a WhatsApp confirmation. Delivery on bake day.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 flex-1 h-12 text-xs tracking-[0.18em] font-medium uppercase transition-all hover:opacity-90 text-white"
                          style={{ background: "#2d5a3d", border: "1px solid #2d5a3d" }}>
                          Open WhatsApp again
                        </a>
                        <button onClick={resetOrder}
                          className="flex-1 h-12 text-xs tracking-[0.18em] font-medium uppercase border border-border/50 text-[#2D2926] hover:text-foreground hover:border-foreground/40 transition-all">
                          Start a new order
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <TestimonialsSection />
      </main>

      <Footer />

      {/* WhatsApp floating chat button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to know more about reservations.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 50,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.08)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(37,211,102,0.45)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(37,211,102,0.35)";
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
