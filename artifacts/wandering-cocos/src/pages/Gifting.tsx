import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const WA_NUMBER = "919899225273";
const BOX_PRICE = 1299;
const BOX_ORIGINAL_PRICE = 1999;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const occasions = [
  { label: "Birthdays", icon: "○" },
  { label: "Anniversaries", icon: "◇" },
  { label: "Festive Season", icon: "◈" },
  { label: "Corporate", icon: "□" },
  { label: "Thank You", icon: "△" },
  { label: "Just Because", icon: "◯" },
];

const occasionOptions = [
  "Birthday",
  "Anniversary",
  "Festive Season",
  "Corporate",
  "Thank You",
  "Just Because",
  "Other",
];

const included = [
  "6 artisanal bakes — curated for the drop",
  "Minimal kraft gift box, sealed by hand",
  "Your personal message, handwritten",
  "Full ingredient transparency card",
];

const inputStyle = {
  background: "hsl(38 25% 97%)",
  border: "1px solid rgba(15,36,25,0.15)",
  color: "#0f2419",
  fontSize: "0.92rem",
  width: "100%",
  padding: "0.8rem 1rem",
  outline: "none",
  fontFamily: "inherit",
  fontWeight: 300,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  fontWeight: 500,
  color: "rgba(15,36,25,0.4)",
  marginBottom: "0.5rem",
};

export default function Gifting() {
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [occasion, setOccasion] = useState("");
  const [qty, setQty] = useState<number | "">(1);
  const [giftNote, setGiftNote] = useState("");
  const [step, setStep] = useState<"form" | "sent">("form");

  const resolvedQty = qty === "" ? 1 : qty;
  const total = resolvedQty * BOX_PRICE;
  const boxWord = resolvedQty === 1 ? "Box" : "Boxes";

  const canProceed = !!(
    senderName.trim() &&
    senderPhone.trim() &&
    recipientName.trim() &&
    deliveryAddress.trim()
  );

  const waMessage = encodeURIComponent(
    [
      `Hi Wandering Cocos! I'd like to order ${resolvedQty} Gift ${boxWord}.`,
      ``,
      `From: ${senderName.trim()}`,
      `My phone: ${senderPhone.trim()}`,
      ``,
      `Gift recipient: ${recipientName.trim()}`,
      `Delivery address: ${deliveryAddress.trim()}`,
      occasion ? `Occasion: ${occasion}` : "",
      giftNote.trim() ? `Gift note: "${giftNote.trim()}"` : "",
      ``,
      `Order total: ₹${total.toLocaleString("en-IN")}`,
      `Sending UPI payment now.`,
    ]
      .filter((l) => l !== undefined)
      .join("\n")
  );

  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;

  const handleSubmit = () => {
    if (!canProceed) return;
    setStep("sent");
    window.open(waLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow">

        {/* HERO */}
        <section className="pt-36 pb-20 px-6 md:px-14 lg:px-24 max-w-7xl mx-auto">
          <motion.span
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-[10px] tracking-[0.35em] uppercase font-medium block mb-6"
            style={{ color: "rgba(15,36,25,0.4)" }}
          >
            Gifting
          </motion.span>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-serif italic leading-[1.1] mb-8"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", color: "#0f2419", maxWidth: "780px" }}
          >
            Give something rare.
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="font-light leading-relaxed max-w-xl"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "rgba(15,36,25,0.55)" }}
          >
            A Wandering Box is not a generic hamper. It is a curated selection of artisanal bakes,
            made in small batches with honest ingredients, boxed and delivered with intention.
          </motion.p>
        </section>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-24">
          <div style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }} />
        </div>

        {/* WHAT'S INSIDE */}
        <section className="py-20" style={{ background: "hsl(38 25% 96%)" }}>
        <div className="px-6 md:px-14 lg:px-24 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            >
              <span className="text-[10px] tracking-[0.35em] uppercase font-medium block mb-5"
                style={{ color: "rgba(15,36,25,0.38)" }}>
                The Box
              </span>
              <h2 className="font-serif italic leading-snug mb-6"
                style={{ fontSize: "clamp(1.9rem, 3.5vw, 3rem)", color: "#0f2419" }}>
                One box.<br />Six bakes.<br />Zero compromises.
              </h2>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif italic" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0f2419" }}>
                  ₹{BOX_PRICE.toLocaleString("en-IN")}
                </span>
                <span className="font-light line-through" style={{ fontSize: "1rem", color: "rgba(15,36,25,0.3)" }}>
                  ₹{BOX_ORIGINAL_PRICE.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="font-light text-sm" style={{ color: "rgba(15,36,25,0.4)" }}>
                First 15 orders · Launch Drop
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="space-y-0"
            >
              {included.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 py-5"
                  style={{ borderBottom: "1px solid rgba(15,36,25,0.08)" }}
                >
                  <span className="font-serif italic shrink-0 mt-0.5"
                    style={{ fontSize: "0.85rem", color: "rgba(15,36,25,0.3)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-light leading-snug"
                    style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)", color: "rgba(15,36,25,0.7)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        </section>

        {/* OCCASIONS */}
        <section className="py-20 px-6 md:px-14 lg:px-24" style={{ background: "#0f2419" }}>
          <div className="max-w-7xl mx-auto">
            <motion.span
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              className="text-[10px] tracking-[0.35em] uppercase font-medium block mb-10"
              style={{ color: "rgba(245,238,224,0.35)" }}
            >
              Occasions
            </motion.span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px"
              style={{ border: "1px solid rgba(245,238,224,0.1)" }}>
              {occasions.map((o, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                  className="flex flex-col items-center justify-center py-10 px-4 text-center"
                  style={{ borderRight: i < occasions.length - 1 ? "1px solid rgba(245,238,224,0.1)" : "none" }}
                >
                  <span className="block mb-3 font-serif"
                    style={{ fontSize: "1.4rem", color: "rgba(245,238,224,0.25)" }}>
                    {o.icon}
                  </span>
                  <span className="text-[11px] tracking-[0.18em] uppercase font-medium"
                    style={{ color: "rgba(245,238,224,0.7)" }}>
                    {o.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DIVIDER BAND */}
        <div style={{ background: "#2d5a3d", height: "3px", width: "100%" }} />

        {/* ORDER FORM */}
        <section className="pb-28" style={{ background: "hsl(38 25% 97%)" }}>
          <div className="px-6 md:px-14 lg:px-24 max-w-7xl mx-auto" style={{ paddingTop: "4rem" }}>
          <div style={{ borderLeft: "3px solid #2d5a3d", paddingLeft: "1.5rem", marginBottom: "3rem" }}>
            <motion.span
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              className="text-[10px] tracking-[0.35em] uppercase font-medium block mb-2"
              style={{ color: "rgba(15,36,25,0.38)" }}
            >
              Gift Order
            </motion.span>
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="font-serif italic leading-snug"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)", color: "#0f2419" }}
            >
              Ready to send a gift?
            </motion.h2>
          </div>

            <AnimatePresence mode="wait">
              {step === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="grid md:grid-cols-2 gap-12 md:gap-20"
                >
                  {/* LEFT col — sender + recipient */}
                  <div className="space-y-6">
                    <div>
                      <label style={labelStyle}>Your Name</label>
                      <input
                        type="text"
                        placeholder="Who is sending this gift?"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Your Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Recipient's Name</label>
                      <input
                        type="text"
                        placeholder="Who is receiving this gift?"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Delivery Address</label>
                      <textarea
                        placeholder="Full delivery address including pincode"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={3}
                        style={{ ...inputStyle, resize: "none" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                      />
                    </div>
                  </div>

                  {/* RIGHT col — occasion, qty, note, totals */}
                  <div className="space-y-6">
                    <div>
                      <label style={labelStyle}>Occasion</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        style={{ ...inputStyle, cursor: "pointer" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                      >
                        <option value="">Select an occasion (optional)</option>
                        {occasionOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Number of Boxes</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQty((q) => Math.max(1, (q === "" ? 1 : q) - 1))}
                          className="w-10 h-10 flex items-center justify-center transition-colors"
                          style={{ border: "1px solid rgba(15,36,25,0.15)", color: "#0f2419", background: "hsl(38 25% 97%)", fontSize: "1.1rem" }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                        >
                          −
                        </button>
                        <span className="font-serif italic text-2xl min-w-[2rem] text-center" style={{ color: "#0f2419" }}>
                          {resolvedQty}
                        </span>
                        <button
                          onClick={() => setQty((q) => (q === "" ? 2 : q + 1))}
                          className="w-10 h-10 flex items-center justify-center transition-colors"
                          style={{ border: "1px solid rgba(15,36,25,0.15)", color: "#0f2419", background: "hsl(38 25% 97%)", fontSize: "1.1rem" }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                        >
                          +
                        </button>
                        <span className="font-light text-sm" style={{ color: "rgba(15,36,25,0.4)" }}>
                          × ₹{BOX_PRICE.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Gift Note (optional)</label>
                      <textarea
                        placeholder="A personal message to be handwritten in the box..."
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        rows={4}
                        style={{ ...inputStyle, resize: "none" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(15,36,25,0.15)")}
                      />
                    </div>

                    {/* Total + CTA */}
                    <div className="pt-2">
                      <div className="flex items-baseline justify-between mb-6 pb-5"
                        style={{ borderBottom: "1px solid rgba(15,36,25,0.08)" }}>
                        <span className="text-[10px] tracking-[0.3em] uppercase font-medium"
                          style={{ color: "rgba(15,36,25,0.4)" }}>
                          Total
                        </span>
                        <span className="font-serif italic"
                          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "#0f2419" }}>
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={!canProceed}
                        className="w-full flex items-center justify-center gap-3 py-4 text-[11px] tracking-[0.22em] uppercase font-medium transition-all duration-300"
                        style={{
                          background: canProceed ? "#2d5a3d" : "rgba(45,90,61,0.15)",
                          color: canProceed ? "#ffffff" : "rgba(45,90,61,0.4)",
                          cursor: canProceed ? "pointer" : "not-allowed",
                        }}
                        onMouseEnter={(e) => {
                          if (canProceed) (e.currentTarget as HTMLElement).style.background = "#245033";
                        }}
                        onMouseLeave={(e) => {
                          if (canProceed) (e.currentTarget as HTMLElement).style.background = "#2d5a3d";
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Send Gift Order on WhatsApp
                      </button>

                      {!canProceed && (
                        <p className="text-center mt-3 text-[10px] tracking-wide"
                          style={{ color: "rgba(15,36,25,0.3)" }}>
                          Fill in your name, phone, recipient, and address to continue.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-lg"
                >
                  <div className="mb-6" style={{ width: 48, height: 48, border: "1px solid rgba(15,36,25,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#0f2419" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-serif italic leading-snug mb-4"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", color: "#0f2419" }}>
                    Gift order sent.
                  </h3>
                  <p className="font-light leading-relaxed mb-8"
                    style={{ fontSize: "1rem", color: "rgba(15,36,25,0.55)", maxWidth: "440px" }}>
                    Your details have opened in WhatsApp. Once we receive your message, we will confirm the order, share payment details, and coordinate delivery.
                  </p>
                  <button
                    onClick={() => setStep("form")}
                    className="text-[10px] tracking-[0.25em] uppercase font-medium transition-opacity hover:opacity-60"
                    style={{ color: "rgba(15,36,25,0.45)" }}
                  >
                    Send another gift
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
