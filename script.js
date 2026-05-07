/* =============================================================
   JOY OLUSANYA — script.js
   1. African Language Particle System (Canvas)
   2. Sidebar Active Nav Highlight
   3. Mobile Sidebar Toggle
   4. Scroll Reveal
   5. Light / Dark Theme
   ============================================================= */

// ─── 1. LANGUAGE PARTICLE SYSTEM ───────────────────────────────

const LANG_WORDS = [
  'Yorùbá', 'Ẹ káàbọ̀', 'Odabo', 'Àṣà', 'Ìmọ̀', 'Ẹ̀kọ́',
  'Swahili', 'Habari', 'Karibu', 'Asante', 'Lugha', 'Elimu',
  'Hausa', 'Sannu', 'Yare', 'Ilimi', 'Harshe',
  'Igbo', 'Ụzọ', 'Mmụta', 'Asụsụ', 'Ọmụmụ',
  'አማርኛ', 'ሰላም', 'ቋንቋ', 'ትምህርት',
  'Zulu', 'Sawubona', 'Ulimi', 'Ukufunda',
  'Wolof', 'Xamal', 'Dégg', 'Kaay',
  'Twi', 'Akwaaba', 'Kasa', 'Nkyerɛase',
  'Shona', 'Makadini', 'Mutauro',
  'Gĩkũyũ', 'Ũhoro', 'Gũtũũria',
  'ትግርኛ', 'Fulfulde', 'Janngo',
  'Ubuntu', 'Ujamaa', 'Sankofa', 'Àṣà',
];

// Canvas particle system disabled
(function initCanvas() {
  const canvas = document.getElementById('langCanvas');
  if (canvas) canvas.style.display = 'none';
})();


// ─── 2. SIDEBAR ACTIVE NAV ────────────────────────────────────

(function initSidebarNav() {
  const links    = document.querySelectorAll('.sb-nav-link');
  const sections = document.querySelectorAll('.content-section[id]');
  if (!links.length || !sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.sb-nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => obs.observe(s));
})();


// ─── 3. MOBILE SIDEBAR TOGGLE ────────────────────────────────

(function initMobileSidebar() {
  const toggle  = document.getElementById('navToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close when a sidebar nav link is clicked on mobile
  sidebar.querySelectorAll('.sb-nav-link').forEach(a => {
    a.addEventListener('click', () => {
      sidebar.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Close on outside tap
  document.addEventListener('click', e => {
    if (window.innerWidth <= 700 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
})();


// ─── 4. SCROLL REVEAL ────────────────────────────────────────

(function initReveal() {
  const targets = document.querySelectorAll(
    '.news-list li, .ri-item, .pub-list li, .proj-list li, .exp-list > li, .service-list li, .blog-list li, .intro-awards .award-item, .skill-chip'
  );

  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = (Number(e.target.dataset.idx) || 0) * 50;
        setTimeout(() => {
          e.target.style.opacity    = '1';
          e.target.style.transform  = 'none';
        }, delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    el.dataset.idx = i % 6;
    obs.observe(el);
  });

  // Section headings
  document.querySelectorAll('.cs-heading, .cs-divider').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    const hObs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity   = '1';
          e.target.style.transform = 'none';
          hObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    hObs.observe(el);
  });
})();


// ─── 5. LIGHT / DARK THEME ───────────────────────────────────

(function initTheme() {
  const KEY  = 'joy-theme';
  const body = document.body;

  // Restore saved preference on load
  if (localStorage.getItem(KEY) === 'light') {
    body.classList.add('light-mode');
  }

  function toggle() {
    const isLight = body.classList.toggle('light-mode');
    localStorage.setItem(KEY, isLight ? 'light' : 'dark');
  }

  // Wire every button with class theme-toggle
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggle);
  });
})();


// ─── NAV TOGGLE BUTTON STYLE ────────────────────────────────
// Shared hamburger style for mobile bar

(function styleNavToggle() {
  const btn = document.getElementById('navToggle');
  if (!btn) return;
  btn.style.cssText = `
    display: flex; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 4px;
  `;
  btn.querySelectorAll('span').forEach(s => {
    s.style.cssText = `
      display: block; width: 20px; height: 1.5px;
      background: var(--cream, #e8f4ff);
      transition: transform 0.3s ease, opacity 0.3s ease;
    `;
  });
})();
