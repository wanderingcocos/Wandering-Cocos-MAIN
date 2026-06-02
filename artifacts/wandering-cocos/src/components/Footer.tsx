import { Link, useLocation } from "wouter";
import { Instagram } from "lucide-react";

const footerLinks = [
  { name: "Bakery", href: "/bakery" },
  { name: "Pre-order", href: "/reserve" },
  { name: "FAQ", href: "/faq" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];


export function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer style={{ background: "#0f2419" }} className="mt-auto">

      {/* Main body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 flex flex-col items-center text-center">

        {/* Large wordmark */}
        <Link
          href="/"
          className="font-serif font-medium tracking-wide transition-opacity duration-300 hover:opacity-70 block"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", color: "rgba(245,238,224,0.92)", lineHeight: 1 }}
        >
          Wandering Cocos
        </Link>

        {/* Tagline */}
        <p
          className="font-serif italic mt-4"
          style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)", color: "rgba(245,238,224,0.88)" }}
        >
          Dark Roast &amp; Open Road
        </p>

        {/* Divider */}
        <div className="w-full mt-14 mb-10" style={{ borderTop: "1px solid rgba(245,238,224,0.12)" }} />

        {/* Bottom bar */}
        <div className="w-full flex flex-col items-center gap-6">

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-200"
                style={{ color: "rgba(245,238,224,0.88)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(245,238,224,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,238,224,0.88)")}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/wandering.cocos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center border transition-all duration-300"
              style={{ borderColor: "rgba(245,238,224,0.18)", color: "rgba(245,238,224,0.88)", borderRadius: 0 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,238,224,0.7)";
                (e.currentTarget as HTMLElement).style.color = "rgba(245,238,224,1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,238,224,0.18)";
                (e.currentTarget as HTMLElement).style.color = "rgba(245,238,224,0.88)";
              }}
            >
              <Instagram className="w-3.5 h-3.5 stroke-[1.5]" />
            </a>
            <a
              href="https://wa.me/917019673652"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 flex items-center justify-center border transition-all duration-300"
              style={{ borderColor: "rgba(245,238,224,0.18)", color: "rgba(245,238,224,0.88)", borderRadius: 0 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,238,224,0.7)";
                (e.currentTarget as HTMLElement).style.color = "rgba(245,238,224,1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,238,224,0.18)";
                (e.currentTarget as HTMLElement).style.color = "rgba(245,238,224,0.88)";
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{ color: "rgba(245,238,224,0.80)" }}
          >
            © {new Date().getFullYear()} Wandering Cocos · Bengaluru
          </p>

          {/* Compliance */}
          <p
            className="text-[9px] tracking-[0.12em] uppercase"
            style={{ color: "rgba(245,238,224,0.72)" }}
          >
            FSSAI Lic. 21226010002381 · Udyam UDYAM-KR-03-0682199
          </p>

        </div>
      </div>
    </footer>
  );
}
