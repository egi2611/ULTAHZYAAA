// Lilin: tombol buka kartu muncul setelah ditiup (klik api atau goyang HP)
window.addEventListener('DOMContentLoaded', function() {
  const cakeSection = document.querySelector('.cake-section');
  const flame = cakeSection ? cakeSection.querySelector('.flame') : null;
  const card = document.querySelector('.card');
  const openInstruction = document.querySelector('.open-instruction');
  const tapInstruction = document.querySelector('.tap-instruction');
  let lilinMati = false;

  function matikanLilin() {
    if (lilinMati) return;
    lilinMati = true;
    if (flame) flame.style.opacity = 0;
    setTimeout(() => {
      card.classList.add('show-btn');
      if (openInstruction) openInstruction.style.display = 'block';
    }, 400);
  }

  // Tap api (laptop/desktop)
  if (flame) {
    flame.addEventListener('click', function() {
      matikanLilin();
    });
  }

  // Goyang HP (mobile)
  let lastX = null, lastY = null, lastZ = null, lastTime = 0;
  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(e) {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const now = Date.now();
      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(acc.x - lastX);
        const deltaY = Math.abs(acc.y - lastY);
        const deltaZ = Math.abs(acc.z - lastZ);
        if ((deltaX + deltaY + deltaZ) > 18 && (now - lastTime) > 600) {
          matikanLilin();
          lastTime = now;
        }
      }
      lastX = acc.x; lastY = acc.y; lastZ = acc.z;
    });
  }

  // Tampilkan instruksi klik jika tombol sudah muncul
  const observer = new MutationObserver(() => {
    if (card.classList.contains('show-btn') && tapInstruction) {
      tapInstruction.style.display = 'block';
    }
  });
  observer.observe(card, { attributes: true, attributeFilter: ['class'] });

  // fallback jika tidak ada lilin
  if (!flame) {
    card.classList.add('show-btn');
    if (openInstruction) openInstruction.style.display = 'block';
    if (tapInstruction) tapInstruction.style.display = 'block';
  }
});
// Tambahkan bintang-bintang dekorasi saat kartu dibuka
function addStars() {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;
  starsContainer.innerHTML = '';
  const starSVG = '<svg viewBox="0 0 20 20"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" fill="#fff0f5" stroke="#800000" stroke-width="1.2"/></svg>';
  for (let i = 0; i < 12; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random()*90 + '%';
    star.style.left = Math.random()*90 + '%';
    star.style.animationDelay = (Math.random()*2) + 's';
    star.innerHTML = starSVG;
    starsContainer.appendChild(star);
  }
}
// Animasi buka kartu ucapan & confetti
// Animasi buka kartu (setelah tombol muncul)
window.addEventListener('DOMContentLoaded', function() {
  const card = document.querySelector('.card');
  const btn = document.querySelector('.open-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      card.classList.add('open');
      btn.style.display = 'none';
      addStars();
    });
  }
});

// Confetti animasi lucu
const canvas = document.querySelector('.confetti');
const ctx = canvas.getContext('2d');
let W, H;
function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resize);
resize();
const confettiCount = 40;
const confettiColors = ['#800000', '#fff0f5', '#ffb6c1', '#c71585', '#f08080'];
const confetti = Array.from({length: confettiCount}, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  r: 6 + Math.random() * 8,
  d: 2 + Math.random() * 2,
  color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
  tilt: Math.random() * 10 - 5,
  tiltAngle: 0,
  tiltAngleIncremental: (Math.random() * 0.07) + 0.05
}));
function drawConfetti() {
  ctx.clearRect(0, 0, W, H);
  confetti.forEach(c => {
    ctx.beginPath();
    ctx.lineWidth = c.r;
    ctx.strokeStyle = c.color;
    ctx.moveTo(c.x + c.tilt + c.r/3, c.y);
    ctx.lineTo(c.x + c.tilt, c.y + c.r);
    ctx.stroke();
  });
  updateConfetti();
  requestAnimationFrame(drawConfetti);
}
function updateConfetti() {
  confetti.forEach(c => {
    c.y += c.d;
    c.tiltAngle += c.tiltAngleIncremental;
    c.tilt = Math.sin(c.tiltAngle) * 10;
    if (c.y > H) {
      c.x = Math.random() * W;
      c.y = -10;
    }
  });
}
drawConfetti();
