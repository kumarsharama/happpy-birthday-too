/* lightweight confetti - generates colored circles falling
   startConfetti() - launches the animation
   stopConfetti()  - stops it (not used here)
*/
(function () {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener("resize", () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  const pieces = [];
  const count = 120;
  const colors = ["#ff6ec4","#ffcc66","#6ef0ff","#8b78ff","#ffd1e6","#7af58b"];

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * W,
      y: Math.random() * H - H,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 2 + 1,
      tilt: Math.random() * 0.8 - 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360
    });
  }

  let running = false;
  let raf = null;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let p of pieces) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      // draw little rotating rectangle as confetti
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();

      p.x += Math.sin(p.tilt) * 2;
      p.y += p.speed + Math.abs(Math.sin(p.tilt));
      p.rot += p.tilt * 2;

      if (p.y > H + 20) {
        p.y = -10;
        p.x = Math.random() * W;
      }
    }
    raf = requestAnimationFrame(draw);
  }

  window.startConfetti = function () {
    if (running) return;
    running = true;
    draw();
    // auto-stop after some time to preserve CPU (optional)
    setTimeout(() => {
      stopConfetti();
    }, 15000);
  };

  window.stopConfetti = function () {
    if (!running) return;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, W, H);
  };
})();
