import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sections = [
  {
    number: "1",
    title: "Prepaid, Made-to-Order",
    body: "Every Wandering Box is baked specifically for your order on the confirmed bake date. Because of this, we do not accept cancellations or issue refunds once payment has been received and your order has been acknowledged on WhatsApp.",
  },
  {
    number: "2",
    title: "When We Will Refund You",
    body: "We take full responsibility for errors on our end. A full refund will be issued in the following situations:",
    items: [
      { label: "Non-delivery", text: "Your order was confirmed and paid but was not delivered and no alternative was arranged." },
      { label: "Incorrect order", text: "You received a box that does not match your confirmed order." },
      { label: "Quality issue", text: "Items arrived in a condition that is clearly unfit for consumption due to a problem on our side. Photographic evidence sent within 2 hours of delivery is required." },
    ],
  },
  {
    number: "3",
    title: "How to Raise a Refund Request",
    body: "Message us on WhatsApp at +91 98992 25273 within 2 hours of your scheduled delivery time. Include your name, order details, and a photograph if relevant. We will review and respond within 24 hours.",
  },
  {
    number: "4",
    title: "Refund Method",
    body: "Approved refunds are returned via UPI to the same account used for payment, within 3 to 5 business days of approval. We do not issue refunds to a different account or via any other method.",
  },
  {
    number: "5",
    title: "No Refunds For",
    body: "Refunds will not be issued for the following:",
    items: [
      { label: "Change of mind", text: "Once payment is received and your slot is confirmed, we cannot offer refunds due to a change in preference or plans." },
      { label: "Incorrect address", text: "If an incorrect address is provided at the time of ordering and delivery fails as a result." },
      { label: "Allergen concerns", text: "Our ingredients are disclosed in full on the website and on request. We are unable to accommodate severe allergy requirements, and orders placed with known allergy risks are not eligible for refunds." },
    ],
  },
  {
    number: "6",
    title: "Contact",
    body: "For any concerns, reach us at hello@wanderingcocos.in or WhatsApp. We are a small team and we genuinely care about getting this right.",
  },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow pt-36 pb-20 px-6 md:px-14 lg:px-20">
        <div className="max-w-2xl mx-auto">

          <p className="text-[9px] tracking-[0.35em] font-medium uppercase text-[#2D2926] mb-4">
            Wandering Cocos
          </p>
          <h1 className="font-serif italic leading-tight mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1a1a1a" }}>
            Refund Policy
          </h1>
          <p className="text-xs text-[#2D2926] mb-14">
            Effective from April 2026. Operated by Wandering Cocos, Bengaluru.
          </p>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.number} className="border-t border-border/25 pt-8">
                <div className="flex gap-5 items-baseline mb-3">
                  <span className="text-[9px] tracking-[0.2em] font-medium uppercase text-[#2D2926] flex-shrink-0">
                    {section.number.padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-base font-medium text-foreground">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-8">
                  <p className="text-sm text-[#2D2926] leading-relaxed mb-4">
                    {section.body}
                  </p>
                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item.label} className="flex gap-3">
                          <span
                            className="flex-shrink-0 w-1 mt-2"
                            style={{ height: "1px", background: "#2d5a3d", marginTop: "10px" }}
                          />
                          <p className="text-sm text-[#2D2926] leading-relaxed">
                            <span className="font-medium text-foreground/70">{item.label}. </span>
                            {item.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
