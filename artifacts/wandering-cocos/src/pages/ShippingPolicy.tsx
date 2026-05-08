import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />
      <main className="flex-grow pt-36 pb-28 px-6 md:px-12 max-w-3xl mx-auto w-full">

        <div className="mb-16">
          <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-muted-foreground/50 block mb-5">
            Legal
          </span>
          <h1 className="font-serif italic text-foreground leading-tight mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
            Shipping & Delivery Policy
          </h1>
        </div>

        <div className="space-y-14">

          {/* Section 1 */}
          <div className="border-t border-border/40 pt-10">
            <h2 className="font-serif italic text-foreground mb-5" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
              The HSR Local Perk: Free Delivery
            </h2>
            <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">
              We are proud to support our local community. Wandering Cocos offers free delivery on all pre-ordered boxes within a 7 km radius of our kitchen in HSR (Ambalipura).
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="font-serif italic text-foreground flex-shrink-0 text-sm mt-0.5">Within the Zone:</span>
                <span className="text-sm font-light text-muted-foreground leading-relaxed">If your delivery address falls within this 7 km HSR zone, your shipping fee is automatically waived.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-serif italic text-foreground flex-shrink-0 text-sm mt-0.5">Beyond the Zone:</span>
                <span className="text-sm font-light text-muted-foreground leading-relaxed">For deliveries exceeding the 7 km radius, a standard delivery fee will apply based on the exact distance from HSR. This fee will be calculated and shared with you during your WhatsApp order confirmation.</span>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-t border-border/40 pt-10">
            <h2 className="font-serif italic text-foreground mb-5" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
              Our Delivery Process
            </h2>
            <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">
              To ensure your handcrafted bakes reach you fresh, we utilise reliable third-party delivery services such as Porter, Borzo, and others.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="font-serif italic text-foreground flex-shrink-0 text-sm mt-0.5">Dispatch Commitment:</span>
                <span className="text-sm font-light text-muted-foreground leading-relaxed">We guarantee that your Wandering Box will be prepared and dispatched from our HSR kitchen on time to meet your scheduled slot.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-serif italic text-foreground flex-shrink-0 text-sm mt-0.5">Third-Party Logistics:</span>
                <span className="text-sm font-light text-muted-foreground leading-relaxed">Please note that we do not directly employ the delivery personnel. While we strive for perfection, Wandering Cocos is not liable for transit delays or mishandling caused by third-party couriers, local traffic, or weather conditions once the box has left our care.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-serif italic text-foreground flex-shrink-0 text-sm mt-0.5">Standard Handover:</span>
                <span className="text-sm font-light text-muted-foreground leading-relaxed">Risk of loss or spoilage passes to the customer upon successful drop-off at the provided address.</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-border/40 pt-10">
            <h2 className="font-serif italic text-foreground mb-5" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
              Questions?
            </h2>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              For any queries regarding your delivery, reach out to us directly on WhatsApp. We will always do our best to make it right.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
