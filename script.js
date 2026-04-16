/* =============================================================
   JOY OLUSANYA — script.js
   1. African Language Particle System (Canvas)
   2. Sticky Navbar
   3. Mobile Nav Toggle
   4. Scroll Reveal
   ============================================================= */

// ─── 1. LANGUAGE PARTICLE SYSTEM ───────────────────────────────

const LANG_WORDS = [
  // Yorùbá
  'Yorùbá', 'Ẹ káàbọ̀', 'Odabo', 'Àṣà', 'Ìmọ̀', 'Ẹ̀kọ́',
  // Swahili
  'Swahili', 'Habari', 'Karibu', 'Asante', 'Lugha', 'Elimu',
  // Hausa
  'Hausa', 'Sannu', 'Yare', 'Ilimi', 'Harshe',
  // Igbo
  'Igbo', 'Ụzọ', 'Mmụta', 'Asụsụ', 'Ọmụmụ',
  // Amharic
  'አማርኛ', 'ሰላም', 'ቋንቋ', 'ትምህርት',
  // Zulu
  'Zulu', 'Sawubona', 'Ulimi', 'Ukufunda',
  // Wolof
  'Wolof', 'Xamal', 'Dégg', 'Kaay',
  // Twi
  'Twi', 'Akwaaba', 'Kasa', 'Nkyerɛase',
  // Shona
  'Shona', 'Makadini', 'Mutauro',
  // Kikuyu
  'Gĩkũyũ', 'Ũhoro', 'Gũtũũria',
  // Tigrinya
  'ትግርኛ', 'ቋንቋ', 'ትምህርቲ',
  // Fulani
  'Fulfulde', 'Janngo', 'Demngal',
  // Extra meaningful words
  'Àṣà', 'Ubuntu', 'Ujamaa', 'Sankofa',
];

(function initCanvas() {
  const canvas = document.getElementById('langCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 600 ? 22 : 40;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    const size = randomBetween(10, 18);
    return {
      word:  LANG_WORDS[Math.floor(Math.random() * LANG_WORDS.length)],
      x:     randomBetween(0, W),
      y:     randomBetween(-H * 0.1, H * 1.1),
      vx:    randomBetween(-0.18, 0.18),
      vy:    randomBetween(-0.35, -0.08),
      size,
      alpha: randomBetween(0.04, 0.13),
      targetAlpha: randomBetween(0.04, 0.13),
      // slow drift direction flip
      driftTimer: randomBetween(200, 600),
      driftAge:   0,
    };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function step(p) {
    p.x  += p.vx;
    p.y  += p.vy;
    p.driftAge++;

    if (p.driftAge > p.driftTimer) {
      p.vx = randomBetween(-0.18, 0.18);
      p.vy = randomBetween(-0.35, -0.08);
      p.driftAge = 0;
      p.driftTimer = randomBetween(200, 600);
    }

    // wrap vertically (drift up and wrap back)
    if (p.y < -60) {
      p.y = H + 20;
      p.x = randomBetween(0, W);
      p.word = LANG_WORDS[Math.floor(Math.random() * LANG_WORDS.length)];
    }
    if (p.y > H + 60) { p.y = -20; p.x = randomBetween(0, W); }
    if (p.x < -100)   { p.x = W + 20; }
    if (p.x > W + 100){ p.x = -20; }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `300 ${p.size}px "Cormorant Garant", serif`;
      ctx.fillStyle = document.body.classList.contains('light-mode') ? '#1a6fc4' : '#3b9eff';
      ctx.fillText(p.word, p.x, p.y);
      ctx.restore();

      step(p);
    }

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    // Clamp existing particle positions
    for (const p of particles) {
      p.x = Math.min(p.x, W);
      p.y = Math.min(p.y, H);
    }
  });
})();


// ─── 2. STICKY NAVBAR ──────────────────────────────────────────

(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ─── 3. MOBILE NAV TOGGLE ──────────────────────────────────────

(function initMobileNav() {
  const toggle  = document.getElementById('navToggle');
  const links   = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    // Animate hamburger to X
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
})();


// ─── 4. SCROLL REVEAL ──────────────────────────────────────────

(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Immediately reveal hero elements (they're above the fold)
  document.querySelectorAll('#hero [data-reveal]').forEach(el => {
    setTimeout(() => el.classList.add('revealed'), 100);
  });

  // Observe non-hero elements
  els.forEach(el => {
    if (!el.closest('#hero')) observer.observe(el);
  });

  // Also observe section headers and cards generically
  const revealTargets = document.querySelectorAll(
    '.about-card, .project-card, .skill-group, .pub-item, .timeline-item, .contact-card'
  );

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'none';
          }, (entry.target.dataset.cardDelay || 0) * 80);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)';
    el.dataset.cardDelay = i % 4; // stagger by position in group of 4
    cardObserver.observe(el);
  });

  // Section headers
  document.querySelectorAll('.section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';

    const hObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          hObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    hObs.observe(el);
  });
})();


// ─── 5. ACTIVE NAV SECTION HIGHLIGHT ──────────────────────────

(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();


// ─── 6. LIGHT / DARK MODE TOGGLE ──────────────────────────────

(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;
  const KEY  = 'joy-theme';

  // Restore saved preference
  if (localStorage.getItem(KEY) === 'light') {
    body.classList.add('light-mode');
  }

  if (!btn) return;

  btn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    localStorage.setItem(KEY, isLight ? 'light' : 'dark');

    // Subtle button spin feedback
    btn.style.transform = 'scale(0.88) rotate(20deg)';
    setTimeout(() => { btn.style.transform = ''; }, 220);
  });
})();
