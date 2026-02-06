// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
let mx = -100, my = -100;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
document.querySelectorAll('.btn, a').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ── Blob follow ──
const blob = document.getElementById('blob');
let bx = window.innerWidth/2, by = window.innerHeight/2;
function animBlob() {
  bx += (mx - bx - blob.offsetWidth/2) * 0.06;
  by += (my - by - blob.offsetHeight/2) * 0.06;
  blob.style.left = bx + 'px';
  blob.style.top  = by + 'px';
  requestAnimationFrame(animBlob);
}
animBlob();

// ── Particle Canvas ──
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 40;
    this.size = Math.random() * 2.2 + 0.4;
    this.speedY = -(Math.random() * 0.6 + 0.15);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = 0;
    this.maxOp = Math.random() * 0.5 + 0.15;
    this.life = 0;
    this.maxLife = Math.random() * 120 + 80;
    const cols = ['255,107,107','255,217,61','107,203,255','180,140,255'];
    this.color = cols[Math.floor(Math.random()*cols.length)];
  }
  update() {
    this.life++;
    if (this.life < this.maxLife * 0.15) this.opacity = (this.life / (this.maxLife * 0.15)) * this.maxOp;
    else if (this.life > this.maxLife * 0.75) this.opacity = ((this.maxLife - this.life) / (this.maxLife * 0.25)) * this.maxOp;
    else this.opacity = this.maxOp;

    this.x += this.speedX;
    this.y += this.speedY;
    if (this.life >= this.maxLife) this.reset(false);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 70; i++) particles.push(new Particle());

function loop() {
  ctx.clearRect(0,0,W,H);
  const grd = ctx.createRadialGradient(W/2,H/2,H*0.2, W/2,H/2,H*0.85);
  grd.addColorStop(0,'rgba(6,6,16,0)');
  grd.addColorStop(1,'rgba(6,6,16,0.55)');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,W,H);

  particles.forEach(p => { p.update(); p.draw(); });

  particles.forEach(p => {
    const dx = p.x - mx, dy = p.y - my;
    const dist = Math.sqrt(dx*dx+dy*dy);
    if (dist < 120) {
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${p.color},${0.18 * (1 - dist/120)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  });

  requestAnimationFrame(loop);
}
loop();
