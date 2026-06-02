/**
 * Lifestyle Media Grid — seed data
 * ─────────────────────────────────
 * Each entry has:
 *   type     : "video" | "image"
 *   src      : URL or public path (swap with real footage when available)
 *   alt      : descriptive label for accessibility / captions
 *   category : "grind" (lifting / baking / discipline) | "travel" (open roads / nature / freedom)
 *
 * To replace a clip: swap the `src` value.
 * Video cells render with autoPlay, muted, loop, playsInline.
 */

export const lifestyleMedia = [
  // ── GRIND ───────────────────────────────────────────────────────────
  {
    type: "video",
    src: "https://videos.pexels.com/video-files/4065614/4065614-uhd_2560_1440_25fps.mp4",
    alt: "Early morning gym session — barbell deadlift",
    category: "grind",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Chalk on hands, iron plates — the ritual",
    category: "grind",
  },
  {
    type: "video",
    src: "https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_25fps.mp4",
    alt: "Sourdough loaf pulled from the oven",
    category: "grind",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Clean plate, clean ingredients — intentional eating",
    category: "grind",
  },

  // ── TRAVEL ──────────────────────────────────────────────────────────
  {
    type: "video",
    src: "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_25fps.mp4",
    alt: "Open highway driving loop — coastal road",
    category: "travel",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Sunlit mountain valley — untouched wilderness",
    category: "travel",
  },
  {
    type: "video",
    src: "https://videos.pexels.com/video-files/857136/857136-hd_1920_1080_30fps.mp4",
    alt: "Wildlife in natural habitat — morning light",
    category: "travel",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Remote campfire at golden hour",
    category: "travel",
  },
  {
    type: "image",
    src: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Winding road through dense forest — freedom drive",
    category: "travel",
  },
];
