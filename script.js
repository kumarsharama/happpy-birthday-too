/* ========= merged script.js =========
   - loads config from window.__HB_CONFIG
   - sets hero text & image
   - special button behavior (link/modal/play)
   - music picker (2 samples + upload + localStorage)
   - carousel (click + swipe + auto)
   - countdown timer
   - triggers confetti (uses confetti.js functions)
====================================== */

(function () {
  "use strict";

  // --- Helpers ---
  const cfg = window.__HB_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // --- HERO SETUP ---
  function setupHero() {
    const titleEl = $("#heroTitle");
    const subEl = $("#heroSubtitle");
    const imageEl = $("#heroImage");

    if (titleEl && cfg.heroTitle) titleEl.innerHTML = cfg.heroTitle;
    if (subEl && cfg.heroSubtitle) subEl.innerHTML = cfg.heroSubtitle;
    if (imageEl && cfg.heroImage) imageEl.src = cfg.heroImage;
  }

  // --- SPECIAL BUTTON ---
  function setupSpecialButton() {
    const btn = $("#special-btn");
    if (!btn) return;
    btn.textContent = cfg.specialBtnText || "Surprise!";

    btn.addEventListener("click", (e) => {
      const act = cfg.specialBtnAction || { type: "link", value: "funny.html" };
      if (act.type === "link") {
        window.location.href = act.value;
      } else if (act.type === "play") {
        // toggle music
        const audio = $("#bg-music");
        if (audio) {
          if (audio.paused) { audio.play().catch(()=>{}); }
          else audio.pause();
        }
      } else if (act.type === "modal") {
        const modal = document.querySelector(act.value);
        if (modal) modal.style.display = "block";
      }
    });
  }

  // --- MUSIC PICKER & AUDIO ---
  function setupMusicPicker() {
    const picker = $("#music-picker");
    const audio = $("#bg-music");
    if (!picker || !audio) return;

    // populate default (if config defaultMusic set)
    if (cfg.defaultMusic) {
      // ensure option exists; if not, we will set audio.src directly
      const exists = Array.from(picker.options).some(opt => opt.value === cfg.defaultMusic);
      if (!exists) {
        const opt = document.createElement("option");
        opt.value = cfg.defaultMusic;
        opt.text = "Default song";
        picker.insertBefore(opt, picker.firstChild);
      }
      // set audio to saved or default
      const saved = localStorage.getItem("hb_chosen_track");
      audio.src = saved || cfg.defaultMusic;
      if (!audio.src) audio.removeAttribute("src");
    } else {
      const saved = localStorage.getItem("hb_chosen_track");
      if (saved) audio.src = saved;
    }

    picker.addEventListener("change", (evt) => {
      const val = evt.target.value;
      if (val === "custom") {
        // open file dialog
        const fi = document.createElement("input");
        fi.type = "file";
        fi.accept = "audio/*";
        fi.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          audio.src = url;
          audio.play().catch(()=>{});
          localStorage.setItem("hb_chosen_track", url);
        };
        fi.click();
      } else {
        audio.src = val;
        audio.play().catch(()=>{});
        localStorage.setItem("hb_chosen_track", val);
      }
    });

    // autoplay preference from saved
    audio.addEventListener("play", () => localStorage.setItem("hb_playing", "1"));
    audio.addEventListener("pause", () => localStorage.setItem("hb_playing", "0"));
    // try to auto-play if saved
    setTimeout(() => {
      const tryAuto = localStorage.getItem("hb_playing") === "1";
      if (tryAuto) audio.play().catch(()=>{});
    }, 800);
  }

  // --- CAROUSEL (click + swipe + dots + auto) ---
  function setupCarousel() {
    const carousel = $("#carousel");
    if (!carousel) return;
    const slides = $$(".slide", carousel);
    if (!slides.length) return;

    const prev = $("#carouselPrev"), next = $("#carouselNext"), dotsWrap = $("#carouselDots");
    let index = 0;
    let autoTimer = null;
    const interval = cfg.carouselInterval || 4000;
    const autoOn = !!cfg.carouselAuto;

    function update() {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      // dots
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        slides.forEach((_, i) => {
          const dot = document.createElement("div");
          dot.className = "carousel-dot" + (i === index ? " active" : "");
          dot.dataset.idx = i;
          dot.addEventListener("click", () => { index = i; update(); resetAuto(); });
          dotsWrap.appendChild(dot);
        });
      }
    }

    function nextSlide() { index = (index + 1) % slides.length; update(); }
    function prevSlide() { index = (index - 1 + slides.length) % slides.length; update(); }

    if (next) next.addEventListener("click", () => { nextSlide(); resetAuto(); });
    if (prev) prev.addEventListener("click", () => { prevSlide(); resetAuto(); });

    // swipe
    let startX = 0;
    carousel.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
    carousel.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      if (endX - startX > 50) prevSlide();
      resetAuto();
    });

    function resetAuto() {
      if (!autoOn) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(nextSlide, interval);
    }

    // initial
    update();
    resetAuto();
    // pause on hover
    carousel.addEventListener("mouseenter", () => clearInterval(autoTimer));
    carousel.addEventListener("mouseleave", resetAuto);
  }

  // --- COUNTDOWN ---
  function setupCountdown() {
    const target = cfg.countdownTarget;
    const el = $("#countdown");
    if (!el) return;
    if (!target) { el.style.display = "none"; return; }
    const targetTime = new Date(target).getTime();
    if (isNaN(targetTime)) { el.textContent = ""; return; }

    function tick() {
      const now = Date.now();
      const d = targetTime - now;
      if (d <= 0) {
        el.innerHTML = "🎉 It's Today! 🎉";
        // trigger confetti once
        if (typeof startConfetti === "function") startConfetti();
        clearInterval(timer);
        return;
      }
      const days = Math.floor(d / (1000 * 60 * 60 * 24));
      const hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((d % (1000 * 60)) / 1000);
      el.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  // --- CONFETTI TRIGGER ON LOAD (small delay) ---
  function triggerConfettiOnLoad() {
    setTimeout(() => {
      if (typeof startConfetti === "function") startConfetti();
    }, 1500);
  }

  // --- INIT ---
  document.addEventListener("DOMContentLoaded", () => {
    try {
      setupHero();
      setupSpecialButton();
      setupMusicPicker();
      setupCarousel();
      setupCountdown();
      triggerConfettiOnLoad();
    } catch (err) {
      console.error("Init error:", err);
    }
  });
})();
