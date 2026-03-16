document.addEventListener('DOMContentLoaded', () => {

  // ── Live Bangkok clock ───────────────────────────────────────────────────
  const timeEl = document.getElementById('nav-time');

  const updateClock = () => {
    timeEl.textContent = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Bangkok',
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  updateClock();
  setInterval(updateClock, 1000);


  // ── Page-load staggered fade-up (nav + hero meta) ────────────────────────
  // Nav and meta both delay until after the lamp has arrived (~2.4s and ~3.3s)
  const loadElements = document.querySelectorAll('[data-animate]');

  loadElements.forEach(el => {
    const index = parseFloat(el.getAttribute('data-delay') ?? '0');
    el.style.animationDelay = `${index * 0.3}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });
  });


  // ── Scroll-triggered reveal ──────────────────────────────────────────────
  const scrollObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('[data-scroll-animate]').forEach(el => {
    scrollObserver.observe(el);
  });


  // ── Nav frosted glass on scroll ──────────────────────────────────────────
  const nav = document.querySelector('.nav');
  let ticking = false;

  const updateNav = () => {
    const scrolled = window.scrollY > 40;
    nav.style.background = scrolled
      ? 'linear-gradient(to bottom, rgba(11,9,7,0.92) 0%, transparent 100%)'
      : 'transparent';
    nav.style.backdropFilter = scrolled ? 'blur(14px)' : 'none';
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
  }, { passive: true });

});
