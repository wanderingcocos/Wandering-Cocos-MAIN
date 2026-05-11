import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSiteStatus } from "@/hooks/useSiteStatus";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const UPI_ID = "snhshbhm2-1@okhdfcbank";
const WA_NUMBER = "919899225273";

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

export default function Reserve() {
  const { mode: siteMode, loaded: siteModeLoaded } = useSiteStatus();
  const [bakeWindow, setBakeWindow] = useState<BakeWindow | null>(null);
  const [windowLoaded, setWindowLoaded] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/bake-window/current`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setBakeWindow(data); setWindowLoaded(true); })
      .catch(() => setWindowLoaded(true));
  }, []);

  const BAKE_DATE = bakeWindow ? formatBakeDate(bakeWindow.bakeDate) : "Coming Soon";
  const BOX_PRICE = bakeWindow?.boxPrice ?? 1299;
  const BOX_ORIGINAL_PRICE = bakeWindow?.originalPrice ?? 1999;
  const MAX_BOXES = bakeWindow?.maxBoxes ?? 15;

  const menuItems = bakeWindow?.items?.length
    ? bakeWindow.items.map((item, i) => ({
        num: String(i + 1).padStart(2, "0"),
        name: item.name,
        note: item.description ?? "",
      }))
    : FALLBACK_ITEMS;

  const [method, setMethod] = useState<"choose" | "whatsapp" | "form">("choose");
  const [qty, setQty] = useState<number | "">(1);
  const [occasion, setOccasion] = useState<"myself" | "gift">("myself");
  const [giftMessage, setGiftMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<"form" | "sent">("form");
  const waOpenedRef = useRef(false);

  const resolvedQty = qty === "" ? 1 : qty;
  const qtyLabel = String(resolvedQty);
  const boxWord = resolvedQty === 1 ? "Box" : "Boxes";
  const total = resolvedQty * BOX_PRICE;
  const totalFormatted = `₹${total.toLocaleString("en-IN")}`;
  const canProceed = !!(name.trim() && phone.trim() && address.trim());

  const waMessage = encodeURIComponent(
    [
      `Hi Wandering Cocos! I'd like to reserve ${qtyLabel} Wandering ${boxWord} for ${BAKE_DATE}. This is ${occasion === "gift" ? "a gift order" : "for myself"}.`,
      ``,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Delivery address: ${address.trim()}`,
      occasion === "gift" && giftMessage.trim() ? `Gift note: "${giftMessage.trim()}"` : "",
      ``,
      `Order total: ${totalFormatted}`,
      `Sending UPI payment now.`,
    ].filter(line => line !== undefined && !(line === "" && false)).join("\n")
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;
  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=Wandering%20Cocos&am=${total}&tn=Wandering%20Box%20${encodeURIComponent(BAKE_DATE)}&cu=INR`;

  const handleSendOrder = () => {
    if (!canProceed) return;
    waOpenedRef.current = true;
    setStep("sent");
    window.open(waLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">
        {/* COMPACT HERO */}
        <section className="pt-36 pb-14 px-6 md:px-14 lg:px-20" style={{ background: "#0f2419" }}>
          <div className="max-w-7xl mx-auto">
            <motion.span initial="hidden" animate="visible" custom={0} variants={fadeUp}
              className="text-[9px] tracking-[0.38em] font-medium uppercase block mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              {bakeWindow ? bakeWindow.label : "The Weekend Edit"} · <BakeDateDisplay date={BAKE_DATE} dark />
            </motion.span>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="font-serif italic leading-tight"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", color: "#ffffff" }}>
              Reserve Your Box
            </motion.h1>

            <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}
              className="mt-6 flex items-baseline gap-4 flex-wrap">
              <span className="font-serif font-medium" style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#ffffff" }}>
                ₹{BOX_PRICE.toLocaleString("en-IN")}
              </span>
              <span className="font-light line-through"
                style={{ fontSize: "clamp(1rem, 1.6vw, 1.3rem)", color: "rgba(255,255,255,0.28)", textDecorationColor: "rgba(255,255,255,0.28)" }}>
                ₹{BOX_ORIGINAL_PRICE.toLocaleString("en-IN")}
              </span>
              <span className="font-light tracking-wide"
                style={{ fontSize: "clamp(0.75rem, 1vw, 0.85rem)", color: "rgba(255,255,255,0.38)" }}>
                per box
              </span>
            </motion.div>

            <motion.p initial="hidden" animate="visible" custom={3} variants={fadeUp}
              className="mt-3 font-light"
              style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)", color: "rgba(255,255,255,0.38)", maxWidth: "380px", lineHeight: "1.7" }}>
              Baked fresh on delivery day. Comes with a branded bag. Prepaid only. Limited bakes per drop.
            </motion.p>
          </div>
        </section>

        {/* TOTE BAG HIGHLIGHT */}
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
              <p className="font-light" style={{ fontSize: "clamp(0.72rem, 0.9vw, 0.8rem)", color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>
                Carry it everywhere. Let others wonder.
              </p>
            </div>
            <div className="flex-shrink-0 text-center px-5 py-2"
              style={{ border: "1px solid rgba(200,168,130,0.3)", color: "rgba(200,168,130,0.85)" }}>
              <p className="text-[9px] tracking-[0.3em] uppercase font-medium">Included Free</p>
            </div>
          </motion.div>
        </section>

        {/* MAIN TWO-COLUMN */}
        <section className="px-6 md:px-14 lg:px-20 py-16 max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 gap-14 lg:gap-24 ${siteMode === "bake_day" ? "lg:grid-cols-2" : ""}`}>

            {/* LEFT — What's inside (bake_day only) */}
            {siteMode === "bake_day" && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
              <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-6">
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
                      <span className="text-[9px] tracking-[0.2em] font-medium uppercase text-foreground/22 pt-0.5 flex-shrink-0 w-5">
                        {item.num}
                      </span>
                      <div>
                        <p className="font-serif text-sm font-medium text-foreground leading-snug mb-0.5">{item.name}</p>
                        {item.note && <p className="text-xs text-foreground/38 leading-relaxed">{item.note}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <p className="mt-5 text-[10px] text-foreground/28 leading-relaxed">
                Every box contains all {menuItems.length} items. Baked on <BakeDateDisplay date={BAKE_DATE} />.
              </p>
            </motion.div>
            )}

            {/* RIGHT — Method picker + Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp} custom={1} className="lg:pt-0">

              {!siteModeLoaded ? (
                <div className="h-64 animate-pulse rounded bg-foreground/5" />
              ) : siteMode === "popup" ? (
                <div className="border border-border/30 p-8 text-center" style={{ background: "hsl(38 25% 97%)" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-medium text-foreground/35 mb-5">Orders Paused</p>
                  <p className="font-serif text-lg text-foreground leading-snug mb-4">We're at a pop-up this week.</p>
                  <p className="text-sm text-foreground/55 leading-relaxed mb-6">We are at a private residential pop-up this week! Online orders are closed, but we'll be back next week.</p>
                  <a href="https://chat.whatsapp.com/HH1IixIyMcCCY8jHnrlHei" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 px-8 text-xs tracking-[0.2em] uppercase font-medium text-white transition-all hover:opacity-90"
                    style={{ background: "#25D366" }}>
                    Join our WhatsApp Community
                  </a>
                </div>
              ) : siteMode === "maintenance" ? (
                <div className="border border-border/30 p-8 text-center" style={{ background: "hsl(38 25% 97%)" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-medium text-foreground/35 mb-5">Coming Soon</p>
                  <p className="font-serif text-lg text-foreground leading-snug mb-4">Baking in progress.</p>
                  <p className="text-sm text-foreground/55 leading-relaxed">Check back soon — something delicious is on its way.</p>
                </div>
              ) : siteMode === "sold_out" ? (
                <div className="border border-border/30 p-8 text-center" style={{ background: "hsl(38 25% 97%)" }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-medium text-foreground/35 mb-5">Sold Out</p>
                  <p className="font-serif text-lg text-foreground leading-snug mb-4">All boxes are claimed.</p>
                  <p className="text-sm text-foreground/55 leading-relaxed mb-6">Every box for this bake is reserved. Follow us to be the first to know about the next drop.</p>
                  <a href="https://instagram.com/wandering.cocos" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 px-8 text-xs tracking-[0.2em] uppercase font-medium border border-foreground/30 text-foreground/60 hover:border-foreground/50 hover:text-foreground transition-all">
                    Follow on Instagram
                  </a>
                </div>
              ) : (
              <>
              <AnimatePresence mode="wait">
                {method === "choose" && (
                  <motion.div key="choose" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-8">
                      How would you like to order?
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* PRIMARY — WhatsApp */}
                      <button onClick={() => setMethod("whatsapp")}
                        className="relative group flex flex-col text-left p-6 focus:outline-none transition-all duration-200 hover:shadow-lg"
                        style={{ background: "hsl(150 20% 96%)", border: "2px solid #2d5a3d" }}>
                        <span className="absolute top-3 right-3 text-[8px] tracking-[0.25em] uppercase font-semibold px-2 py-0.5 text-white"
                          style={{ background: "#2d5a3d" }}>Fastest</span>
                        <span className="text-[10px] tracking-[0.28em] uppercase font-medium mb-4 block" style={{ color: "#2d5a3d" }}>01</span>
                        <span className="font-serif text-base text-foreground leading-snug mb-2">Message us on WhatsApp</span>
                        <span className="text-xs text-foreground/50 leading-relaxed">Chat with us directly. We'll guide you through the order on WhatsApp.</span>
                        <span className="mt-5 text-[9px] tracking-[0.22em] uppercase font-semibold transition-colors" style={{ color: "#2d5a3d" }}>
                          Open WhatsApp →
                        </span>
                      </button>
                      {/* SECONDARY — Form */}
                      <button onClick={() => setMethod("form")}
                        className="group flex flex-col text-left p-6 border border-border/35 hover:border-foreground/30 transition-all duration-200 focus:outline-none"
                        style={{ background: "hsl(38 15% 98%)" }}>
                        <span className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/25 mb-4 block">02</span>
                        <span className="font-serif text-base text-foreground/70 leading-snug mb-2">Fill in your details here</span>
                        <span className="text-xs text-foreground/38 leading-relaxed">Enter your order and delivery details on the website, then confirm via WhatsApp.</span>
                        <span className="mt-5 text-[9px] tracking-[0.22em] uppercase font-medium text-foreground/35 group-hover:text-foreground/60 transition-colors">
                          Fill order form →
                        </span>
                      </button>
                    </div>
                    <p className="text-[10px] text-foreground/28 leading-relaxed">Either way, your slot is confirmed only once we receive payment.</p>
                  </motion.div>
                )}

                {method === "whatsapp" && (
                  <motion.div key="whatsapp" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <button onClick={() => setMethod("choose")}
                      className="text-[10px] tracking-[0.22em] uppercase text-foreground/30 hover:text-foreground/55 transition-colors mb-8 block">
                      ← Back
                    </button>
                    <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-8">Message us directly</span>
                    <div className="border border-border/30 p-6 mb-6" style={{ background: "hsl(38 25% 97%)" }}>
                      <p className="font-serif text-sm text-foreground mb-3 leading-snug">Chat with us on WhatsApp</p>
                      <p className="text-xs text-foreground/50 leading-relaxed mb-5">
                        Tell us your name, phone number, delivery address, and how many boxes you'd like for {BAKE_DATE}. We'll confirm availability and send payment details.
                      </p>
                      <div className="border-l-2 pl-4 py-1 mb-5" style={{ borderColor: "#2d5a3d" }}>
                        <p className="text-xs text-foreground/45 leading-relaxed">
                          We're on WhatsApp at <span className="font-medium text-foreground/65">+91 98992 25273</span>. Response time is usually within a few hours during our active days.
                        </p>
                      </div>
                      <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Wandering Cocos! I'd like to reserve a Wandering Box for ${BAKE_DATE}. Can you help me with my order?`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-14 text-xs tracking-[0.22em] font-medium uppercase transition-all duration-300 text-white hover:opacity-90"
                        style={{ background: "#2d5a3d", border: "1px solid #2d5a3d" }}>
                        Open WhatsApp
                      </a>
                    </div>
                    <p className="text-[10px] text-foreground/28 leading-relaxed mb-3">Prefer to fill in your details on the website first?</p>
                    <button onClick={() => setMethod("form")}
                      className="text-[10px] tracking-[0.2em] uppercase font-medium text-foreground/40 hover:text-foreground/65 underline underline-offset-4 transition-colors">
                      Use the order form instead
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {method === "form" && (
                <AnimatePresence mode="wait">
                  {step === "form" && (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <button onClick={() => { setMethod("choose"); setStep("form"); }}
                        className="text-[10px] tracking-[0.22em] uppercase text-foreground/30 hover:text-foreground/55 transition-colors mb-8 block">
                        ← Back
                      </button>
                      <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-8">Configure your order</span>

                      {/* Quantity */}
                      <div className="mb-8">
                        <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/45 mb-3">How many boxes?</p>
                        <input type="number" min={1} max={99} value={qty}
                          onChange={(e) => { const val = e.target.value; if (val === "") { setQty(""); return; } const n = parseInt(val, 10); if (!isNaN(n) && n >= 1) setQty(n); }}
                          onBlur={() => { if (qty === "") setQty(1); }}
                          className="w-24 h-12 border border-border/60 bg-background text-foreground text-sm font-medium text-center focus:outline-none focus:border-accent transition-colors duration-200"
                          style={{ appearance: "textfield" }} />
                      </div>

                      {/* Occasion */}
                      <div className="mb-10">
                        <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/45 mb-3">This is for?</p>
                        <div className="flex gap-2">
                          {[{ id: "myself", label: "Myself" }, { id: "gift", label: "A Gift" }].map((opt) => (
                            <button key={opt.id} onClick={() => setOccasion(opt.id as "myself" | "gift")}
                              className={`px-7 h-12 text-xs tracking-[0.18em] uppercase font-medium border transition-all duration-200 ${occasion === opt.id ? "border-accent bg-accent text-accent-foreground" : "border-border/60 text-foreground/45 hover:border-foreground/35 hover:text-foreground"}`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <AnimatePresence>
                          {occasion === "gift" && (
                            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                              <div className="border-l-2 pl-4" style={{ borderColor: "#2d5a3d" }}>
                                <p className="text-xs text-foreground/50 leading-relaxed mb-4">
                                  Gift orders include a personalised note, signature white ribbon, and kraft paper lining. Free delivery within 7km of HSR Layout, Bengaluru.
                                </p>
                                <label className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/40 block mb-2">Personal note for the recipient</label>
                                <textarea value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)}
                                  placeholder="e.g. Happy birthday! Enjoy every bite." maxLength={200} rows={3}
                                  className="w-full border border-border/50 bg-background text-foreground text-xs leading-relaxed px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 resize-none placeholder:text-foreground/25" />
                                <p className="text-[10px] text-foreground/25 mt-1 text-right">{giftMessage.length}/200</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Delivery details */}
                      <div className="mb-10">
                        <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/45 mb-4">Delivery details</p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] tracking-[0.18em] uppercase text-foreground/35 block mb-1">Full name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                              className="w-full h-11 border border-border/50 bg-background text-foreground text-xs px-4 focus:outline-none focus:border-accent transition-colors duration-200 placeholder:text-foreground/22" />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[0.18em] uppercase text-foreground/35 block mb-1">Phone number</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210"
                              className="w-full h-11 border border-border/50 bg-background text-foreground text-xs px-4 focus:outline-none focus:border-accent transition-colors duration-200 placeholder:text-foreground/22" />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[0.18em] uppercase text-foreground/35 block mb-1">Delivery address</label>
                            <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                              placeholder="Flat / building, street, area, Bengaluru" rows={2}
                              className="w-full border border-border/50 bg-background text-foreground text-xs leading-relaxed px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 resize-none placeholder:text-foreground/22" />
                          </div>
                        </div>
                      </div>

                      {/* Order summary */}
                      <div className="border border-border/35 px-5 py-4 mb-6 flex items-center justify-between gap-4" style={{ background: "hsl(38 25% 97%)" }}>
                        <p className="text-xs text-foreground/40 leading-relaxed">
                          <span className="text-foreground font-medium font-serif">{qtyLabel} Wandering {boxWord}</span>{" "}· {BAKE_DATE} · {occasion === "gift" ? "Gift order" : "Personal order"}
                        </p>
                        <span className="text-sm font-serif font-medium text-foreground flex-shrink-0">{totalFormatted}</span>
                      </div>

                      {/* Send order button — forest green */}
                      <button onClick={handleSendOrder} disabled={!canProceed}
                        className={`flex items-center justify-center w-full h-14 text-xs tracking-[0.22em] font-medium uppercase transition-all duration-300 mb-3 ${canProceed ? "cursor-pointer hover:opacity-90" : "cursor-not-allowed opacity-40"}`}
                        style={{ background: "#2d5a3d", color: "#ffffff", border: "1px solid #2d5a3d" }}>
                        Send Order on WhatsApp
                      </button>
                      {!canProceed && (
                        <p className="text-[10px] text-foreground/35 text-center">Fill in your delivery details above to continue.</p>
                      )}
                    </motion.div>
                  )}

                  {step === "sent" && (
                    <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="mb-8 pb-8 border-b border-border/25">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ background: "#2d5a3d" }}>✓</span>
                          <p className="text-sm font-serif text-foreground">Order sent on WhatsApp</p>
                        </div>
                        <p className="text-xs text-foreground/45 leading-relaxed pl-8">
                          Your order details for {qtyLabel} Wandering {boxWord} ({BAKE_DATE}) have been sent to us. We will confirm your slot once we receive your payment.
                        </p>
                      </div>

                      <div className="mb-8">
                        <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/35 mb-5">Complete your payment</p>
                        <div className="border border-border/30 p-6 mb-5" style={{ background: "hsl(38 25% 97%)" }}>
                          <div className="flex items-baseline justify-between mb-5">
                            <p className="text-xs text-foreground/50">Amount due</p>
                            <span className="text-2xl font-serif font-medium text-foreground">{totalFormatted}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="border border-border/40 p-3 bg-white flex-shrink-0">
                              <img src={`${import.meta.env.BASE_URL}images/upi-qr.png`} alt="UPI QR Code for Wandering Cocos" className="w-28 h-28 object-contain" />
                            </div>
                            <div className="flex flex-col gap-3">
                              <div>
                                <p className="text-[9px] tracking-[0.22em] uppercase text-foreground/30 mb-1">UPI ID</p>
                                <p className="text-sm font-mono text-foreground font-medium select-all">{UPI_ID}</p>
                              </div>
                              <p className="text-xs text-foreground/45 leading-relaxed">Scan with GPay, PhonePe, Paytm, or any UPI app. Use the UPI ID above to pay manually.</p>
                              <a href={upiUrl} className="inline-flex items-center text-[10px] tracking-[0.18em] uppercase font-medium text-accent hover:underline underline-offset-4 transition-colors">
                                Open UPI app on this device
                              </a>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-foreground/30 leading-relaxed">
                          Once we confirm receipt of payment, we will send you a WhatsApp confirmation. Delivery on bake day.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 flex-1 h-12 text-xs tracking-[0.18em] font-medium uppercase transition-all hover:opacity-90 text-white"
                          style={{ background: "#2d5a3d", border: "1px solid #2d5a3d" }}>
                          Open WhatsApp again
                        </a>
                        <button onClick={() => { setStep("form"); setMethod("choose"); setName(""); setPhone(""); setAddress(""); setQty(1); setGiftMessage(""); setOccasion("myself"); }}
                          className="flex-1 h-12 text-xs tracking-[0.18em] font-medium uppercase border border-border/50 text-foreground/45 hover:text-foreground hover:border-foreground/40 transition-all">
                          Start a new order
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              </>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
