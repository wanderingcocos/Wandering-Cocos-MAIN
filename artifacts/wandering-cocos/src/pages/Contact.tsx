import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WA_NUMBER } from "@/lib/constants";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Header />

      <main className="flex-grow flex flex-col pb-0 overflow-hidden">

        {/* Full-height contact area */}
        <div className="relative flex-1 flex flex-col justify-end px-6 md:px-14 pb-12" style={{ minHeight: "calc(100vh - 120px)" }}>

          {/* Centred background logo crest */}
          <div className="select-none pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}images/woc-logo-mark.png`}
              alt=""
              className="w-[72vw] max-w-3xl opacity-[0.08]"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>

          {/* Contact details — bottom-left editorial grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-x-14 gap-y-8">
            <div>
              <span className="text-[9px] tracking-[0.3em] font-medium uppercase text-[#2D2926] block mb-3">
                Email Us
              </span>
              <a
                href="mailto:hello@wanderingcocos.in"
                className="font-serif italic text-foreground hover:text-accent transition-colors"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.4rem)" }}
              >
                hello@wanderingcocos.in
              </a>
            </div>

            <div>
              <span className="text-[9px] tracking-[0.3em] font-medium uppercase text-[#2D2926] block mb-3">
                WhatsApp
              </span>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif italic text-foreground hover:text-accent transition-colors"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.4rem)" }}
              >
                +91 98765 43210
              </a>
            </div>

            <div>
              <span className="text-[9px] tracking-[0.3em] font-medium uppercase text-[#2D2926] block mb-3">
                Based In
              </span>
              <p className="font-serif italic text-foreground/70" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}>
                HSR Layout, Bengaluru
              </p>
            </div>

            <div>
              <span className="text-[9px] tracking-[0.3em] font-medium uppercase text-[#2D2926] block mb-3">
                Order Window
              </span>
              <p className="font-serif italic text-foreground/70" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}>
                Announced 72 hrs in advance
              </p>
            </div>
          </div>

        </div>

        <Footer />
      </main>
    </div>
  );
}
