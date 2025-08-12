// Countdown
const countdown = document.getElementById('countdown');
const eventDate = new Date("2025-08-20T00:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = eventDate - now;
    if (distance < 0) {
        countdown.innerHTML = "🎉 It's Today! 🎉";
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}, 1000);

// Carousel
const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.slide');
let index = 0;
document.getElementById('next').addEventListener('click', () => {
    index = (index + 1) % slides.length;
    carousel.style.transform = `translateX(${-index * 100}%)`;
});
document.getElementById('prev').addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    carousel.style.transform = `translateX(${-index * 100}%)`;
});

// Touch swipe for mobile
let startX = 0;
carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
carousel.addEventListener('touchend', e => {
    let diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) document.getElementById('prev').click();
    else if (diff < -50) document.getElementById('next').click();
});

// Confetti trigger
setTimeout(() => {
    startConfetti();
}, 1500);
