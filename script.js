const body = document.body;
const topbarNav = document.getElementById('topbarNav');
const sidebar = document.getElementById('sidebar');
const navToggle = document.getElementById('navToggleTop');
const themeButtons = document.querySelectorAll('.theme-toggle');
const navLinks = document.querySelectorAll('.tb-nav-link');
const sections = document.querySelectorAll('.content-section[id]');

function setTheme(isLight) {
  body.classList.toggle('light-mode', isLight);
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

setTheme(localStorage.getItem('theme') === 'light');

themeButtons.forEach(button => {
  button.type = 'button';
  button.addEventListener('click', () => {
    setTheme(!body.classList.contains('light-mode'));
  });
});

function closeMobileNavigation() {
  topbarNav?.classList.remove('open');
  sidebar?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
}

navToggle?.addEventListener('click', () => {
  const isOpen = !topbarNav?.classList.contains('open');
  topbarNav?.classList.toggle('open', isOpen);
  sidebar?.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navLinks.forEach(link => {
  link.addEventListener('click', closeMobileNavigation);
});

const setActiveSection = sectionId => {
  navLinks.forEach(link => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveSection(entry.target.id);
  });
}, { rootMargin: '-25% 0px -65% 0px' });

sections.forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.content-section').forEach(section => {
  section.classList.add('reveal');
  revealObserver.observe(section);
});

const canvas = document.getElementById('langCanvas');
if (canvas && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  canvas.style.display = 'none';
}
