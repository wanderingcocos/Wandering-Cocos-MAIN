import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Add recipes here when ready ───────────────────────────────────────────
// Each recipe: { id, title, subtitle, tags, body, serves, time, image? }
const recipes: {
  id: number;
  title: string;
  subtitle: string;
  tags: string[];
  body: string;
  serves: string;
  time: string;
  image?: string;
}[] = [
  {
    id: 1,
    title: "Mango Meen Curry",
    subtitle: "Inspired by Paragon Restaurant, Kozhikode",
    tags: ["Malabar", "Kerala", "Seafood", "Curry"],
    serves: "4",
    time: "45 min",
    body: `INGREDIENTS

For the curry base
— 600g firm white fish, cut into thick steaks (we used Roopchand; Seer fish / King fish also work well)
— ½ raw mango, peeled and cut into wedges
— 200 ml Kara coconut milk
— 2 tbsp coconut oil

Spice paste (grind to a smooth paste)
— 6 dry Kashmiri chillies, soaked 20 min
— 2 green chillies
— 1 tsp coriander seeds
— ½ tsp cumin seeds
— ¼ tsp fenugreek seeds, lightly toasted
— 1 tsp turmeric
— 6 shallots
— 4 cloves garlic
— 1 inch ginger

For tempering
— 1 sprig curry leaves
— 3 shallots, thinly sliced
— 2 dried red chillies
— 1 tsp mustard seeds

Salt to taste

METHOD

01. Heat coconut oil in a meen chatti (clay pot) or heavy-bottomed pan over medium heat. Add mustard seeds and let them splutter. Add the dried red chillies, sliced shallots, and curry leaves. Fry until the shallots turn golden.

02. Add the ground spice paste to the pan. Fry on low heat, stirring constantly, for 6 to 8 minutes until the oil begins to separate and the raw smell disappears. This step is where most of the depth is built — do not rush it.

03. Pour in about two-thirds of the coconut milk. Add the raw mango wedges and a generous pinch of salt. Bring to a gentle simmer and cook for 8 minutes, until the mango softens and begins to release its tartness into the gravy.

04. Carefully slide the fish steaks into the curry. Spoon the gravy over them. Do not stir. Cook uncovered on low heat for 10 to 12 minutes until the fish is just cooked through.

05. Pour in the remaining coconut milk. Gently shake the pot to incorporate. Do not let it boil after this point. Taste for salt. Finish with a drizzle of raw coconut oil.

06. Let the curry rest for at least 15 minutes before serving. Like most Kerala curries, it deepens considerably as it sits.

Serve with Malabar parotta, pathiri, or plain red rice.

NOTES

The raw mango does the work that kokum or tamarind would in other regional curries — it carries brightness without heaviness. If your mango is very tart, use one smaller piece and adjust as you go. The fenugreek is essential; do not skip it, but do not over-toast it either or it turns bitter.

At Paragon, the clay pot is non-negotiable. It holds heat differently and gives the curry its characteristic slow-cooked quality even on a short timeline. If you have one, use it.`,
  },
];
// ───────────────────────────────────────────────────────────────────────────

export default function Recipes() {
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
            The Story · Recipes
          </motion.span>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-serif italic leading-[1.1] mb-8"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", color: "#0f2419", maxWidth: "780px" }}
          >
            From our kitchen<br />to yours.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="font-light leading-relaxed max-w-lg"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "rgba(15,36,25,0.55)" }}
          >
            The techniques, the ratios, the small obsessions behind each dish.
            Recipes will be added here as we document them.
          </motion.p>
        </section>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-24">
          <div style={{ borderTop: "1px solid rgba(15,36,25,0.1)" }} />
        </div>

        {/* RECIPE GRID — renders when recipes exist, placeholder when empty */}
        <section className="py-24 px-6 md:px-14 lg:px-24 max-w-7xl mx-auto">
          {recipes.length === 0 ? (
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col items-start gap-6 max-w-md"
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  border: "1px solid rgba(15,36,25,0.12)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ color: "rgba(15,36,25,0.3)" }}>
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>

              <div>
                <h2 className="font-serif italic leading-snug mb-3"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#0f2419" }}>
                  Recipes coming soon.
                </h2>
                <p className="font-light leading-relaxed"
                  style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)", color: "rgba(15,36,25,0.5)" }}>
                  We are in the middle of documenting our process.
                  Each recipe will be added here when it is ready to be shared.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {recipes.map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                  className="flex flex-col gap-4"
                >
                  {recipe.image && (
                    <div className="aspect-[4/3] overflow-hidden" style={{ background: "rgba(15,36,25,0.05)" }}>
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recipe.tags.map((tag) => (
                        <span key={tag}
                          className="text-[9px] tracking-[0.25em] uppercase font-medium px-2 py-1"
                          style={{ background: "rgba(15,36,25,0.06)", color: "rgba(15,36,25,0.45)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-serif italic leading-snug mb-1"
                      style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)", color: "#0f2419" }}>
                      {recipe.title}
                    </h3>
                    <p className="font-light mb-4"
                      style={{ fontSize: "0.9rem", color: "rgba(15,36,25,0.5)" }}>
                      {recipe.subtitle}
                    </p>
                    <div className="flex gap-6 mb-5">
                      <div>
                        <span className="text-[9px] tracking-[0.25em] uppercase font-medium block mb-0.5"
                          style={{ color: "rgba(15,36,25,0.35)" }}>Serves</span>
                        <span className="font-light text-sm" style={{ color: "rgba(15,36,25,0.65)" }}>{recipe.serves}</span>
                      </div>
                      <div>
                        <span className="text-[9px] tracking-[0.25em] uppercase font-medium block mb-0.5"
                          style={{ color: "rgba(15,36,25,0.35)" }}>Time</span>
                        <span className="font-light text-sm" style={{ color: "rgba(15,36,25,0.65)" }}>{recipe.time}</span>
                      </div>
                    </div>
                    <p className="font-light leading-relaxed"
                      style={{ fontSize: "0.92rem", color: "rgba(15,36,25,0.6)", whiteSpace: "pre-line" }}>
                      {recipe.body}
                    </p>
                  </div>
                  {i < recipes.length - 1 && (
                    <div className="mt-4" style={{ borderBottom: "1px solid rgba(15,36,25,0.08)" }} />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}
