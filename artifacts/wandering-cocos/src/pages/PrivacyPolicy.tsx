import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sections = [
  {
    number: "1",
    title: "Information We Collect",
    intro: "Because our current model relies on direct communication, we collect the following Personal Identifiable Information (PII) when you place a pre-order:",
    items: [
      { label: "Contact Details", text: "Your name and WhatsApp phone number." },
      { label: "Delivery Information", text: "Your physical home or office address." },
      { label: "Payment Records", text: "Transaction screenshots and UPI IDs used to confirm your order." },
      { label: "Preferences", text: "Information regarding your choice of toppings and any noted allergies." },
    ],
  },
  {
    number: "2",
    title: "How We Use Your Data",
    intro: "We use your information strictly for operational purposes to ensure your Wandering Box arrives fresh and on time:",
    items: [
      { label: "Order Fulfillment", text: "To bake the correct quantity and deliver to the right location." },
      { label: "Communication", text: "To send order confirmations, payment acknowledgments, and delivery ETAs via WhatsApp." },
      { label: "Business Records", text: "To maintain the legal and financial records required for our LLP." },
      { label: "Future Updates", text: "We may occasionally notify you about new menu launches or the opening of our physical cafe, unless you ask us not to." },
    ],
  },
  {
    number: "3",
    title: "Data Sharing & Third Parties",
    intro: "We value your privacy and do not sell your data to third-party marketers. However, we share necessary details with:",
    items: [
      { label: "Delivery Partners", text: "Your name, address, and phone number are shared with our delivery personnel or third-party courier services to facilitate drop-off." },
      { label: "Legal Compliance", text: "We may disclose information if required to do so by law or to protect the rights and safety of our LLP and its owners." },
    ],
  },
  {
    number: "4",
    title: "Security of Manual Transactions",
    intro: "Since you are currently paying via personal UPI and sharing data over WhatsApp, please note:",
    items: [
      { label: "WhatsApp Security", text: "While WhatsApp uses end-to-end encryption, you are responsible for the security of your own device and account." },
      { label: "Payment Data", text: "We do not store your bank account details. We only retain the confirmation of payment (screenshots) for accounting purposes within the LLP." },
    ],
  },
  {
    number: "5",
    title: "Perishable Goods & Health Data",
    intro: null,
    items: [
      { label: "Allergy Information", text: "Any health-related data you provide (e.g. nut allergies) is treated with high sensitivity and is used solely to ensure your safety during food preparation." },
    ],
  },
  {
    number: "6",
    title: "Your Rights",
    intro: "You have the right to:",
    items: [
      { label: "Access", text: "Ask us what data we have stored for you." },
      { label: "Correct", text: "Update your delivery address or contact details." },
      { label: "Delete", text: "Request that we delete your contact information from our records after your order is fulfilled, noting that we must keep financial records for tax purposes." },
    ],
  },
  {
    number: "7",
    title: "Changes to This Policy",
    intro: "As Wandering Cocos transitions to a website-based checkout or a physical cafe, this policy will be updated to reflect new data collection methods such as cookies or email marketing. We recommend checking this page periodically.",
    items: [],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />
      <main className="flex-grow pt-36 pb-28 px-6 md:px-12 max-w-3xl mx-auto w-full">

        <div className="mb-16">
          <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-muted-foreground/50 block mb-5">
            Legal
          </span>
          <h1 className="font-serif italic text-foreground leading-tight mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
            Privacy Policy
          </h1>
          <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-xl">
            This Privacy Policy outlines how Wandering Cocos collects, uses, and protects your information as we grow from a subscription-based pre-order service into a physical bakery cafe. Since we currently operate via WhatsApp and UPI, this policy is designed to be transparent about our manual and digital data handling.
          </p>
        </div>

        <div className="space-y-14">
          {sections.map((section) => (
            <div key={section.number} className="border-t border-border/40 pt-10">
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-serif italic text-foreground/20 text-2xl leading-none flex-shrink-0">
                  {section.number}.
                </span>
                <h2 className="font-serif italic text-foreground" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
                  {section.title}
                </h2>
              </div>
              {section.intro && (
                <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">
                  {section.intro}
                </p>
              )}
              {section.items.length > 0 && (
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="font-serif italic text-foreground flex-shrink-0 text-sm mt-0.5">{item.label}:</span>
                      <span className="text-sm font-light text-muted-foreground leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-border/40 pt-10">
            <h2 className="font-serif italic text-foreground mb-5" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}>
              Contact Us
            </h2>
            <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">
              If you have questions about this policy or how your data is handled, please reach out to us directly on WhatsApp.
            </p>
            <p className="text-xs font-light text-muted-foreground/60 leading-relaxed italic">
              Legal Disclaimer: This policy is issued by Wandering Cocos. By placing a pre-order, you consent to the collection and use of your information as described above.
            </p>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
