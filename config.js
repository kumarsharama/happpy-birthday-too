const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiPieces = [];
for (let i = 0; i < 100; i++) {
    confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 50 + 50,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        tilt: Math.random() * 10 - 10
    });
}

function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.fill();
    });
    updateConfetti();
}

function updateConfetti() {
    confettiPieces.forEach(p => {
        p.y += Math.cos(p.d) + 1 + p.r / 2;
        p.x += Math.sin(p.d);
        if (p.y > confettiCanvas.height) p.y = 0;
    });
}

function startConfetti() {
    setInterval(drawConfetti, 20);
}
