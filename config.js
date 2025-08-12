// === User configuration (easy to change) ===
// Put values here to avoid editing main script
window.__HB_CONFIG = {
  // Hero texts
  heroTitle: "🎉 Happy Birthday!",
  heroSubtitle: "Wishing you joy, love, and laughter",
  heroImage: "image/hero.jpg",      // path to hero image (replace with your file)

  // Special button default (text & link or action)
  specialBtnText: "Surprise!",
  specialBtnAction: { type: "link", value: "funny.html" }, 
  // specialBtnAction.type: "link" | "modal" | "play" 
  // if link -> value is URL or local page; if play -> value is 'toggle-music'; modal -> CSS selector

  // Countdown target (YYYY-MM-DDTHH:MM:SS) or null to hide
  countdownTarget: "2025-08-20T00:00:00",

  // Carousel options
  carouselAuto: true,
  carouselInterval: 4000,

  // Gallery enable
  enableGrid: true,

  // Default music selection (one of the sample asset paths or null)
  defaultMusic: "assets/sample1.mp3" 
};
