/* main.js — menu, audio, page transitions, scroll animations */
(function() {
  'use strict';

  // ── PAGE TRANSITION (on load) ─────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 900);

  // ── MENU TOGGLE ─────────────────────────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('menuOverlay');

  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuOverlay.classList.toggle('active');
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Close on overlay background click (not on menu items)
    menuOverlay.addEventListener('click', e => {
      if (e.target === menuOverlay || e.target.id === 'menuCanvas') {
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Stagger menu items in
    const menuItems = document.querySelectorAll('.menu-item');
    menuOverlay.addEventListener('transitionend', () => {
      if (menuOverlay.classList.contains('active')) {
        menuItems.forEach((item, i) => {
          item.style.transitionDelay = (i * 0.07) + 's';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        });
      } else {
        menuItems.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          item.style.transitionDelay = '0s';
        });
      }
    });

    // Initial state
    menuItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, color 0.3s';
    });
  }

  // ── AUDIO ────────────────────────────────────────────────────────────────
  const audio = document.getElementById('bg-audio');
  const audioBtn = document.getElementById('audioBtn');
  let audioPlaying = false;

  if (audioBtn && audio) {
    // Try autoplay on first interaction
    const startAudio = () => {
      if (!audioPlaying) {
        audio.volume = 0;
        audio.play().then(() => {
          audioPlaying = true;
          audioBtn.classList.remove('muted');
          // Fade in
          let vol = 0;
          const fadeIn = setInterval(() => {
            vol = Math.min(vol + 0.02, 0.25);
            audio.volume = vol;
            if (vol >= 0.25) clearInterval(fadeIn);
          }, 100);
        }).catch(() => {});
      }
    };

    document.addEventListener('click', startAudio, { once: true });

    audioBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (audioPlaying) {
        audio.pause();
        audioPlaying = false;
        audioBtn.classList.add('muted');
      } else {
        audio.play();
        audioPlaying = true;
        audioBtn.classList.remove('muted');
      }
    });
  }

  // ── SCROLL ANIMATIONS ────────────────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.section-label, .section-title, .section-body, .cta-link, .work-item');
  fadeEls.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

  // ── SMOOTH NAV HIDE ON SCROLL ────────────────────────────────────────────
  let lastScroll = 0;
  const nav = document.querySelector('.main-nav');
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80) {
      nav && (nav.style.transform = 'translateY(-100%)');
    } else {
      nav && (nav.style.transform = 'translateY(0)');
    }
    lastScroll = current;
  });
  if (nav) nav.style.transition = 'transform 0.4s ease';

  // ── PAGE LINK TRANSITIONS ────────────────────────────────────────────────
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const out = document.createElement('div');
        out.style.cssText = 'position:fixed;inset:0;background:#0a0a0a;z-index:2000;transform:scaleY(0);transform-origin:bottom;transition:transform 0.5s cubic-bezier(0.77,0,0.18,1)';
        document.body.appendChild(out);
        requestAnimationFrame(() => {
          out.style.transform = 'scaleY(1)';
        });
        setTimeout(() => { window.location.href = href; }, 520);
      });
    }
  });

})();
