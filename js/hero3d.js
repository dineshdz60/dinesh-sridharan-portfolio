/* hero3d.js — immersive-g style: soft off-white animated particle field */
(function() {

   // — HERO CANVAS ————————————————————————————
   const heroCanvas = document.getElementById('heroCanvas');
    if (!heroCanvas) return;

   const ctx = heroCanvas.getContext('2d');
    let W, H;

   function resize() {
         W = heroCanvas.width = window.innerWidth;
         H = heroCanvas.height = window.innerHeight;
   }
    resize();
    window.addEventListener('resize', resize);

   // Color palette inspired by immersive-g: off-white / warm light gray
   const BG_COLOR = '#e8e8e8';
    const PARTICLE_COLORS = [
          'rgba(200,198,194,0.7)',
          'rgba(180,178,172,0.5)',
          'rgba(220,218,214,0.6)',
          'rgba(160,158,154,0.4)',
          'rgba(240,238,234,0.8)',
        ];

   // Noise helper (simplex-like using sin)
   function noise(x, y, t) {
         return (
                 Math.sin(x * 0.8 + t * 0.3) *
                 Math.cos(y * 0.6 + t * 0.2) +
                 Math.sin(x * 0.3 - y * 0.5 + t * 0.15) * 0.5
               );
   }

   // Particle class
   class Particle {
         constructor() { this.reset(true); }
         reset(initial) {
                 this.x = Math.random() * W;
                 this.y = initial ? Math.random() * H : -20;
                 this.baseX = this.x;
                 this.baseY = this.y;
                 this.size = 1.5 + Math.random() * 3.5;
                 this.speed = 0.15 + Math.random() * 0.35;
                 this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
                 this.angle = Math.random() * Math.PI * 2;
                 this.drift = (Math.random() - 0.5) * 0.6;
                 this.life = 0;
                 this.maxLife = 180 + Math.random() * 300;
                 this.phase = Math.random() * Math.PI * 2;
         }
         update(t) {
                 this.life++;
                 const nx = noise(this.x * 0.004, this.y * 0.004, t);
                 this.x += Math.cos(this.angle + nx * 2) * this.speed + this.drift * 0.3;
                 this.y += this.speed * 0.6 + Math.sin(nx + this.phase) * 0.3;
                 this.angle += 0.008;
                 if (this.life > this.maxLife || this.y > H + 20 || this.x < -20 || this.x > W + 20) {
                           this.reset(false);
                 }
         }
         draw(ctx, t) {
                 const alpha = Math.min(1, Math.sin((this.life / this.maxLife) * Math.PI)) ;
                 ctx.save();
                 ctx.globalAlpha = alpha * 0.85;
                 ctx.fillStyle = this.color;
                 ctx.beginPath();
                 ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                 ctx.fill();
                 ctx.restore();
         }
   }

   // Flow lines
   class FlowLine {
         constructor() { this.reset(); }
         reset() {
                 this.x = Math.random() * W;
                 this.y = Math.random() * H;
                 this.points = [{x: this.x, y: this.y}];
                 this.maxPoints = 40 + Math.floor(Math.random() * 60);
                 this.speed = 0.5 + Math.random() * 1.2;
                 this.life = 0;
                 this.maxLife = 180 + Math.random() * 200;
                 this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
                 this.width = 0.3 + Math.random() * 0.8;
         }
         update(t) {
                 this.life++;
                 const last = this.points[this.points.length - 1];
                 const nx = noise(last.x * 0.003, last.y * 0.003, t);
                 const angle = nx * Math.PI * 3;
                 const newX = last.x + Math.cos(angle) * this.speed;
                 const newY = last.y + Math.sin(angle) * this.speed;
                 this.points.push({x: newX, y: newY});
                 if (this.points.length > this.maxPoints) this.points.shift();
                 if (this.life > this.maxLife || newX < -50 || newX > W + 50 || newY < -50 || newY > H + 50) {
                           this.reset();
                 }
         }
         draw(ctx) {
                 if (this.points.length < 2) return;
                 const alpha = Math.min(0.35, Math.sin((this.life / this.maxLife) * Math.PI) * 0.35);
                 ctx.save();
                 ctx.globalAlpha = alpha;
                 ctx.strokeStyle = this.color;
                 ctx.lineWidth = this.width;
                 ctx.lineCap = 'round';
                 ctx.lineJoin = 'round';
                 ctx.beginPath();
                 ctx.moveTo(this.points[0].x, this.points[0].y);
                 for (let i = 1; i < this.points.length; i++) {
                           ctx.lineTo(this.points[i].x, this.points[i].y);
                 }
                 ctx.stroke();
                 ctx.restore();
         }
   }

   // Init
   const PARTICLE_COUNT = 120;
    const FLOW_COUNT = 25;
    const particles = Array.from({length: PARTICLE_COUNT}, () => new Particle());
    const flowLines = Array.from({length: FLOW_COUNT}, () => new FlowLine());

   // Mouse interaction
   let mouse = {x: W / 2, y: H / 2};
    heroCanvas.addEventListener('mousemove', e => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
    });

   let t = 0;
    function animate() {
          requestAnimationFrame(animate);
          t += 0.008;

      // Fill background
      ctx.fillStyle = BG_COLOR;
          ctx.fillRect(0, 0, W, H);

      // Subtle radial gradient overlay at mouse position
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, Math.max(W, H) * 0.6);
          grad.addColorStop(0, 'rgba(250,249,245,0.18)');
          grad.addColorStop(0.4, 'rgba(232,232,232,0.0)');
          grad.addColorStop(1, 'rgba(200,198,194,0.12)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);

      // Draw flow lines
      flowLines.forEach(fl => { fl.update(t); fl.draw(ctx); });

      // Draw particles
      particles.forEach(p => { p.update(t); p.draw(ctx, t); });

      // Subtle vignette
      const vignette = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
          vignette.addColorStop(0, 'rgba(232,232,232,0)');
          vignette.addColorStop(1, 'rgba(210,208,204,0.25)');
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, W, H);
    }

   animate();

   // — MENU CANVAS (keep minimal - just dark bg) ———————————————
   const menuCanvas = document.getElementById('menuCanvas');
    if (!menuCanvas) return;

   const mCtx = menuCanvas.getContext('2d');
    let mW, mH;
    function mResize() {
          mW = menuCanvas.width = window.innerWidth;
          mH = menuCanvas.height = window.innerHeight;
    }
    mResize();
    window.addEventListener('resize', mResize);

   // Minimal dark particles for menu overlay
   class MenuParticle {
         constructor() { this.reset(); }
         reset() {
                 this.x = Math.random() * mW;
                 this.y = Math.random() * mH;
                 this.size = 1 + Math.random() * 2;
                 this.speed = 0.1 + Math.random() * 0.25;
                 this.life = Math.random() * 200;
                 this.maxLife = 200 + Math.random() * 200;
         }
         update() {
                 this.life++;
                 this.y -= this.speed;
                 this.x += (Math.random() - 0.5) * 0.3;
                 if (this.life > this.maxLife || this.y < 0) this.reset();
         }
         draw(ctx) {
                 const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.4;
                 ctx.save();
                 ctx.globalAlpha = alpha;
                 ctx.fillStyle = 'rgba(255,255,255,0.6)';
                 ctx.beginPath();
                 ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                 ctx.fill();
                 ctx.restore();
         }
   }

   const menuParticles = Array.from({length: 60}, () => new MenuParticle());

   function animateMenu() {
         requestAnimationFrame(animateMenu);
         mCtx.clearRect(0, 0, mW, mH);
         menuParticles.forEach(p => { p.update(); p.draw(mCtx); });
   }
    animateMenu();

})();
