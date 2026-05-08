import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const BAKE_DATE = "Coming Soon";
const BOX_PRICE = 1299;
const BOX_ORIGINAL_PRICE = 1999;
const UPI_ID = "snhshbhm2-1@okhdfcbank";
const WA_NUMBER = "919899225273";

const menuItems = [
  {
    num: "01",
    name: "The New York Bagels",
    note: "Cream Cheese + Toasted Onion · Sharp Cheddar + Charred Jalapeño",
  },
  {
    num: "02",
    name: "Almond Croissant Blondie",
    note: "Frangipane, toasted almonds, crackled sugar crust",
  },
  {
    num: "03",
    name: "Aromatic Cardamom Pistachio Cream Twist",
    note: "Cardamom-spiced dough, pistachio cream, crushed pistachios",
  },
  {
    num: "04",
    name: "Pistachio Cream Rolls",
    note: "Brioche, pistachio cream, crushed pistachios",
  },
  {
    num: "05",
    name: "Spiced Phyllo Rolls",
    note: "Feta cheese filling, honey glaze, sesame, dried chili",
  },
  {
    num: "06",
    name: "Kerala Mutta Puffs",
    note: "Flaky pastry, spiced Kerala egg masala",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Reserve() {
  const [method, setMethod] = useState<"choose" | "whatsapp" | "form">(
    "choose",
  );
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
      occasion === "gift" && giftMessage.trim()
        ? `Gift note: "${giftMessage.trim()}"`
        : "",
      ``,
      `Order total: ${totalFormatted}`,
      `Sending UPI payment now.`,
    ]
      .filter((line) => line !== undefined && !(line === "" && false))
      .join("\n"),
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
        <section
          className="pt-36 pb-14 px-6 md:px-14 lg:px-20"
          style={{ background: "#0f2419" }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.span
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="text-[9px] tracking-[0.38em] font-medium uppercase block mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              The Weekend Edit · {BAKE_DATE}
            </motion.span>
            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="font-serif italic leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                color: "#ffffff",
              }}
            >
              Reserve Your Box
            </motion.h1>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="mt-6 flex items-baseline gap-4 flex-wrap"
            >
              <span
                className="font-serif font-medium"
                style={{
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                  color: "#ffffff",
                }}
              >
                ₹{BOX_PRICE.toLocaleString("en-IN")}
              </span>
              <span
                className="font-light line-through"
                style={{
                  fontSize: "clamp(1rem, 1.6vw, 1.3rem)",
                  color: "rgba(255,255,255,0.28)",
                  textDecorationColor: "rgba(255,255,255,0.28)",
                }}
              >
                ₹{BOX_ORIGINAL_PRICE.toLocaleString("en-IN")}
              </span>
              <span
                className="font-light tracking-wide"
                style={{
                  fontSize: "clamp(0.75rem, 1vw, 0.85rem)",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                per box · first 15 orders only
              </span>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="mt-3 font-light"
              style={{
                fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
                color: "rgba(255,255,255,0.38)",
                maxWidth: "380px",
                lineHeight: "1.7",
              }}
            >
              Baked fresh on delivery day. Comes with a branded bag. Prepaid
              only. Limited bakes per drop.
            </motion.p>
          </div>
        </section>

        {/* TOTE BAG HIGHLIGHT */}
        <section
          style={{ background: "#0f2419" }}
          className="px-6 md:px-14 lg:px-20 py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-10"
          >
            {/* Bag icon */}
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: 56,
                height: 56,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
                style={{ color: "rgba(200,168,130,0.85)" }}
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            {/* Text */}
            <div className="text-center sm:text-left flex-grow">
              <p
                className="font-serif italic"
                style={{
                  fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                  color: "#ffffff",
                  marginBottom: "0.2rem",
                }}
              >
                First 15 orders come with a Wandering Coco's Tote Bag.
              </p>
              <p
                className="font-light"
                style={{
                  fontSize: "clamp(0.72rem, 0.9vw, 0.8rem)",
                  color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.04em",
                }}
              >
                Carry it everywhere. Let others wonder.
              </p>
            </div>

            {/* Badge */}
            <div
              className="flex-shrink-0 text-center px-5 py-2"
              style={{
                border: "1px solid rgba(200,168,130,0.3)",
                color: "rgba(200,168,130,0.85)",
              }}
            >
              <p className="text-[9px] tracking-[0.3em] uppercase font-medium">
                Included Free
              </p>
            </div>
          </motion.div>
        </section>

        {/* MAIN TWO-COLUMN */}
        <section className="px-6 md:px-14 lg:px-20 py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
            {/* LEFT — What's inside */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
            >
              <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-6">
                What's in the box
              </span>
              <div className="divide-y divide-border/25">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.num}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                    className="py-4 flex gap-5 items-start"
                  >
                    <span className="text-[9px] tracking-[0.2em] font-medium uppercase text-foreground/22 pt-0.5 flex-shrink-0 w-5">
                      {item.num}
                    </span>
                    <div>
                      <p className="font-serif text-sm font-medium text-foreground leading-snug mb-0.5">
                        {item.name}
                      </p>
                      <p className="text-xs text-foreground/38 leading-relaxed">
                        {item.note}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-[10px] text-foreground/28 leading-relaxed">
                Every box contains all 6 items. Baked on {BAKE_DATE}.
              </p>
            </motion.div>

            {/* RIGHT — Method picker + Form or Confirmation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
              className="lg:pt-0"
            >
              {/* METHOD PICKER */}
              <AnimatePresence mode="wait">
                {method === "choose" && (
                  <motion.div
                    key="choose"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-8">
                      How would you like to order?
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Direct WhatsApp */}
                      <button
                        onClick={() => setMethod("whatsapp")}
                        className="group flex flex-col text-left p-6 border border-border/40 hover:border-accent transition-all duration-250 focus:outline-none"
                        style={{ background: "hsl(38 25% 97%)" }}
                      >
                        <span className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/30 mb-4 block">
                          01
                        </span>
                        <span className="font-serif text-base text-foreground leading-snug mb-2">
                          Message us on WhatsApp
                        </span>
                        <span className="text-xs text-foreground/45 leading-relaxed">
                          Chat with us directly. We'll guide you through the
                          order on WhatsApp.
                        </span>
                        <span
                          className="mt-5 text-[9px] tracking-[0.22em] uppercase font-medium group-hover:text-accent transition-colors"
                          style={{ color: "#2d5a3d" }}
                        >
                          Open WhatsApp →
                        </span>
                      </button>

                      {/* Form */}
                      <button
                        onClick={() => setMethod("form")}
                        className="group flex flex-col text-left p-6 border border-border/40 hover:border-accent transition-all duration-250 focus:outline-none"
                        style={{ background: "hsl(38 25% 97%)" }}
                      >
                        <span className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/30 mb-4 block">
                          02
                        </span>
                        <span className="font-serif text-base text-foreground leading-snug mb-2">
                          Fill in your details here
                        </span>
                        <span className="text-xs text-foreground/45 leading-relaxed">
                          Enter your order and delivery details on the website,
                          then confirm via WhatsApp.
                        </span>
                        <span
                          className="mt-5 text-[9px] tracking-[0.22em] uppercase font-medium group-hover:text-accent transition-colors"
                          style={{ color: "#2d5a3d" }}
                        >
                          Fill order form →
                        </span>
                      </button>
                    </div>

                    <p className="text-[10px] text-foreground/28 leading-relaxed">
                      Either way, your slot is confirmed only once we receive
                      payment.
                    </p>
                  </motion.div>
                )}

                {/* DIRECT WHATSAPP VIEW */}
                {method === "whatsapp" && (
                  <motion.div
                    key="whatsapp"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => setMethod("choose")}
                      className="text-[10px] tracking-[0.22em] uppercase text-foreground/30 hover:text-foreground/55 transition-colors mb-8 block"
                    >
                      ← Back
                    </button>
                    <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-8">
                      Message us directly
                    </span>

                    <div
                      className="border border-border/30 p-6 mb-6"
                      style={{ background: "hsl(38 25% 97%)" }}
                    >
                      <p className="font-serif text-sm text-foreground mb-3 leading-snug">
                        Chat with us on WhatsApp
                      </p>
                      <p className="text-xs text-foreground/50 leading-relaxed mb-5">
                        Tell us your name, phone number, delivery address, and
                        how many boxes you'd like for {BAKE_DATE}. We'll confirm
                        availability and send payment details.
                      </p>
                      <div
                        className="border-l-2 pl-4 py-1 mb-5"
                        style={{ borderColor: "#2d5a3d" }}
                      >
                        <p className="text-xs text-foreground/45 leading-relaxed">
                          We're on WhatsApp at{" "}
                          <span className="font-medium text-foreground/65">
                            +91 98992 25273
                          </span>
                          . Response time is usually within a few hours during
                          our active days.
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Wandering Cocos! I'd like to reserve a Wandering Box for ${BAKE_DATE}. Can you help me with my order?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-14 text-xs tracking-[0.22em] font-medium uppercase transition-all duration-300 text-white"
                        style={{
                          background: "#2d5a3d",
                          border: "1px solid #2d5a3d",
                        }}
                      >
                        Open WhatsApp
                      </a>
                    </div>

                    <p className="text-[10px] text-foreground/28 leading-relaxed mb-3">
                      Prefer to fill in your details on the website first?
                    </p>
                    <button
                      onClick={() => setMethod("form")}
                      className="text-[10px] tracking-[0.2em] uppercase font-medium text-foreground/40 hover:text-foreground/65 underline underline-offset-4 transition-colors"
                    >
                      Use the order form instead
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FORM — only shown when method is "form" */}
              {method === "form" && (
                <AnimatePresence mode="wait">
                  {/* STEP 1 — Order form */}
                  {step === "form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        onClick={() => {
                          setMethod("choose");
                          setStep("form");
                        }}
                        className="text-[10px] tracking-[0.22em] uppercase text-foreground/30 hover:text-foreground/55 transition-colors mb-8 block"
                      >
                        ← Back
                      </button>
                      <span className="text-[9px] tracking-[0.32em] font-medium uppercase text-foreground/30 block mb-8">
                        Configure your order
                      </span>

                      {/* Quantity */}
                      <div className="mb-8">
                        <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/45 mb-3">
                          How many boxes?
                        </p>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={qty}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              setQty("");
                              return;
                            }
                            const n = parseInt(val, 10);
                            if (!isNaN(n) && n >= 1) setQty(n);
                          }}
                          onBlur={() => {
                            if (qty === "") setQty(1);
                          }}
                          className="w-24 h-12 border border-border/60 bg-background text-foreground text-sm font-medium text-center focus:outline-none focus:border-accent transition-colors duration-200"
                          style={{ appearance: "textfield" }}
                        />
                      </div>

                      {/* Occasion */}
                      <div className="mb-10">
                        <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/45 mb-3">
                          This is for?
                        </p>
                        <div className="flex gap-2">
                          {[
                            { id: "myself", label: "Myself" },
                            { id: "gift", label: "A Gift" },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() =>
                                setOccasion(opt.id as "myself" | "gift")
                              }
                              className={`px-7 h-12 text-xs tracking-[0.18em] uppercase font-medium border transition-all duration-200 ${
                                occasion === opt.id
                                  ? "border-accent bg-accent text-accent-foreground"
                                  : "border-border/60 text-foreground/45 hover:border-foreground/35 hover:text-foreground"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        <AnimatePresence>
                          {occasion === "gift" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                                marginTop: 16,
                              }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div
                                className="border-l-2 pl-4"
                                style={{ borderColor: "#2d5a3d" }}
                              >
                                <p className="text-xs text-foreground/50 leading-relaxed mb-4">
                                  Gift orders include a personalised note,
                                  signature white ribbon, and kraft paper
                                  lining. Free delivery within 7km of HSR
                                  Layout, Bengaluru.
                                </p>
                                <label className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/40 block mb-2">
                                  Personal note for the recipient
                                </label>
                                <textarea
                                  value={giftMessage}
                                  onChange={(e) =>
                                    setGiftMessage(e.target.value)
                                  }
                                  placeholder="e.g. Happy birthday! Enjoy every bite."
                                  maxLength={200}
                                  rows={3}
                                  className="w-full border border-border/50 bg-background text-foreground text-xs leading-relaxed px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 resize-none placeholder:text-foreground/25"
                                />
                                <p className="text-[10px] text-foreground/25 mt-1 text-right">
                                  {giftMessage.length}/200
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Delivery details */}
                      <div className="mb-10">
                        <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/45 mb-4">
                          Delivery details
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] tracking-[0.18em] uppercase text-foreground/35 block mb-1">
                              Full name
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                              className="w-full h-11 border border-border/50 bg-background text-foreground text-xs px-4 focus:outline-none focus:border-accent transition-colors duration-200 placeholder:text-foreground/22"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[0.18em] uppercase text-foreground/35 block mb-1">
                              Phone number
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full h-11 border border-border/50 bg-background text-foreground text-xs px-4 focus:outline-none focus:border-accent transition-colors duration-200 placeholder:text-foreground/22"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[0.18em] uppercase text-foreground/35 block mb-1">
                              Delivery address
                            </label>
                            <textarea
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Flat / building, street, area, Bengaluru"
                              rows={2}
                              className="w-full border border-border/50 bg-background text-foreground text-xs leading-relaxed px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 resize-none placeholder:text-foreground/22"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Order summary */}
                      <div
                        className="border border-border/35 px-5 py-4 mb-6 flex items-center justify-between gap-4"
                        style={{ background: "hsl(38 25% 97%)" }}
                      >
                        <p className="text-xs text-foreground/40 leading-relaxed">
                          <span className="text-foreground font-medium font-serif">
                            {qtyLabel} Wandering {boxWord}
                          </span>{" "}
                          · {BAKE_DATE} ·{" "}
                          {occasion === "gift"
                            ? "Gift order"
                            : "Personal order"}
                        </p>
                        <span className="text-sm font-serif font-medium text-foreground flex-shrink-0">
                          {totalFormatted}
                        </span>
                      </div>

                      {/* Send order button */}
                      <button
                        onClick={handleSendOrder}
                        disabled={!canProceed}
                        className={`flex items-center justify-center w-full h-14 text-xs tracking-[0.22em] font-medium uppercase transition-all duration-300 mb-3 ${
                          canProceed
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-40"
                        }`}
                        style={{
                          background: "#0f2419",
                          color: "#ffffff",
                          border: "1px solid #0f2419",
                        }}
                      >
                        Send Order on WhatsApp
                      </button>
                      {!canProceed && (
                        <p className="text-[10px] text-foreground/35 text-center">
                          Fill in your delivery details above to continue.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 2 — Order sent, show UPI payment instructions */}
                  {step === "sent" && (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Confirmation */}
                      <div className="mb-8 pb-8 border-b border-border/25">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                            style={{ background: "#2d5a3d" }}
                          >
                            ✓
                          </span>
                          <p className="text-sm font-serif text-foreground">
                            Order sent on WhatsApp
                          </p>
                        </div>
                        <p className="text-xs text-foreground/45 leading-relaxed pl-8">
                          Your order details for {qtyLabel} Wandering {boxWord}{" "}
                          ({BAKE_DATE}) have been sent to us. We will confirm
                          your slot once we receive your payment.
                        </p>
                      </div>

                      {/* UPI Payment instructions */}
                      <div className="mb-8">
                        <p className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground/35 mb-5">
                          Complete your payment
                        </p>

                        <div
                          className="border border-border/30 p-6 mb-5"
                          style={{ background: "hsl(38 25% 97%)" }}
                        >
                          <div className="flex items-baseline justify-between mb-5">
                            <p className="text-xs text-foreground/50">
                              Amount due
                            </p>
                            <span className="text-2xl font-serif font-medium text-foreground">
                              {totalFormatted}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-5 items-start">
                            {/* QR */}
                            <div className="border border-border/40 p-3 bg-white flex-shrink-0">
                              <img
                                src={`${import.meta.env.BASE_URL}images/upi-qr.png`}
                                alt="UPI QR Code for Wandering Cocos"
                                className="w-28 h-28 object-contain"
                              />
                            </div>
                            {/* UPI details */}
                            <div className="flex flex-col gap-3">
                              <div>
                                <p className="text-[9px] tracking-[0.22em] uppercase text-foreground/30 mb-1">
                                  UPI ID
                                </p>
                                <p className="text-sm font-mono text-foreground font-medium select-all">
                                  {UPI_ID}
                                </p>
                              </div>
                              <p className="text-xs text-foreground/45 leading-relaxed">
                                Scan with GPay, PhonePe, Paytm, or any UPI app.
                                Use the UPI ID above to pay manually.
                              </p>
                              <a
                                href={upiUrl}
                                className="inline-flex items-center text-[10px] tracking-[0.18em] uppercase font-medium text-accent hover:underline underline-offset-4 transition-colors"
                              >
                                Open UPI app on this device
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* After-payment instruction */}
                        <div
                          className="border-l-2 pl-4 py-1"
                          style={{ borderColor: "#2d5a3d" }}
                        >
                          <p className="text-xs text-foreground/55 leading-relaxed">
                            Once paid, send your payment screenshot on the same
                            WhatsApp thread. Your spot is confirmed when we
                            acknowledge it.
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full h-12 text-xs tracking-[0.22em] font-medium uppercase border border-foreground/30 text-foreground/65 hover:border-foreground/60 hover:text-foreground transition-all duration-200"
                        >
                          Open WhatsApp again
                        </a>
                        <button
                          onClick={() => {
                            setStep("form");
                            setMethod("choose");
                            waOpenedRef.current = false;
                          }}
                          className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 hover:text-foreground/55 transition-colors text-center"
                        >
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

        {/* NOTICES */}
        <section
          className="px-6 md:px-14 lg:px-20 py-8 border-t border-border/20"
          style={{ background: "#faf8f4" }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Allergens",
                text: "Wheat, tree nuts, peanuts, dairy, eggs. Not suitable for severe allergy sufferers.",
              },
              {
                label: "Shelf Life",
                text: "Best on delivery day. No preservatives. Store cool and dry if keeping overnight.",
              },
              {
                label: "Legal",
                text: "All orders subject to availability. Confirmed only upon payment.",
              },
            ].map((note) => (
              <div key={note.label}>
                <span className="text-[9px] tracking-[0.3em] font-medium uppercase text-foreground/25 block mb-2">
                  {note.label}
                </span>
                <p className="text-xs text-foreground/38 leading-relaxed">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
