// Load config text
document.getElementById("heroText").innerText = config.heroText;

// Show/hide grid based on config
if (!config.enableGrid) {
  document.getElementById("optionalGrid").style.display = "none";
}

// Carousel script
let currentIndex = 0;
const slides = document.getElementById("slides");
const slideCount = slides.children.length;

function showSlide(index) {
  slides.style.transform = `translateX(-${index * 100}%)`;
}

document.querySelector(".next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slideCount;
  showSlide(currentIndex);
});

document.querySelector(".prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slideCount) % slideCount;
  showSlide(currentIndex);
});

// Touch swipe support
let startX = 0;
slides.addEventListener("touchstart", e => startX = e.touches[0].clientX);
slides.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) document.querySelector(".next").click();
  if (endX - startX > 50) document.querySelector(".prev").click();
});
