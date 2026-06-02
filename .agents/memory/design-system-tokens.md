---
name: Wandering Cocos design system tokens
description: CSS variable values, font stack, and card utility class for the Wandering Cocos brand
---

## Color tokens (index.css :root)
- `--background: 38 25% 96%` — warm cream, matches logo oval
- `--foreground: 22 42% 16%` — deep walnut brown (NOT cold black/charcoal)
- `--accent: 118 38% 25%` — logo-matched deep forest green (yellow-green hue, not teal)
- `--border: 35 18% 83%` — warm oak border

**Why:** Foreground was originally `0 0% 11%` (cold charcoal). User requested walnut brown to match the logo palette. Accent was `150 40% 28%` (teal-green), updated to `118 38% 25%` to match the yellow-based forest green in the logo image.

## Font stack
`--font-serif: 'Playfair Display', 'Cormorant Garamond', serif`
Both imported via @import in index.css (not index.html).
**Why:** User explicitly requested Playfair Display as the heritage serif for headings.

## card-cabinet utility (.card-cabinet)
border-radius: 1.5rem; border: 2px solid rgba(139,90,43,0.1);
background: rgba(255,252,246,0.92);
box-shadow: 0 8px 32px rgba(93,56,24,0.08), 0 2px 8px rgba(93,56,24,0.04);
Hover: shadow deepens + 2px translateY lift.
Used on: pillar cards (Home), testimonial cards, Reserve add-on cards.
**Why:** User requested "vintage wooden display cabinet" aesthetic — rounded-3xl, dual-layer warm amber/brown shadows, soft oak borders.

## Home hero — skylight illumination
Cream bg-background base. Two radial gradient overlays:
1. Primary: ellipse 90% 65% at 50% -8% — warm luminous centre fading to transparent
2. Secondary floor warmth: ellipse 130% 45% at 50% 112%
**Why:** User wanted "morning skylight through glass cafe roof onto aged wood panels."

## Reserve page add-ons section
Hardcoded RESERVE_ADDONS in Reserve.tsx (no images, premium copy). Two cards:
- Sourdough Boule ₹260 · "New · Every Bake Day"
- Small Wandering Box ₹599 · "Permanent Addition · Every Bake Day"
DB descriptions also updated via admin API PATCH /api/admin/bakery-addons/:id
Original 6-item Wandering Box is unchanged — noted in footer copy.
