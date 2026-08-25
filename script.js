document.addEventListener('DOMContentLoaded', () => {

  document.body.classList.replace('no-js', 'js-loaded');

  const reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  const show = el => el.classList.add('is-visible');

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

  if (timeEl) {
    updateClock();
    setInterval(updateClock, 1000);
  }


  const loadElements = document.querySelectorAll('[data-animate]');

  loadElements.forEach(el => {
    if (reducedMotion) {
      show(el);
      return;
    }

    const index = Number.parseFloat(el.getAttribute('data-delay') ?? '0');
    const delay = Number.isFinite(index) ? Math.max(0, index) : 0;
    el.style.animationDelay = `${delay * 0.18}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => show(el)));
  });


  const scrollElements = document.querySelectorAll('[data-scroll-animate]');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    scrollElements.forEach(show);
  } else {
    const scrollObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            show(entry.target);
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    scrollElements.forEach(el => scrollObserver.observe(el));
  }


  // The game's keydown listener is document-wide once instantiated (it's
  // how the real Chrome dino works), so only wake it up once the footer's
  // ground strip has actually scrolled into view.
  const trexGround = document.querySelector('.trex-ground');
  let trexStarted = false;
  const startTrex = () => {
    if (!trexStarted && !reducedMotion && window.Runner) {
      trexStarted = true;
      new window.Runner('.interstitial-wrapper');
    }
  };

  if (trexGround && !reducedMotion) {
    if (!('IntersectionObserver' in window)) {
      startTrex();
    } else {
      const trexObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          startTrex();
          trexObserver.disconnect();
        }
      }, { threshold: 0.3 });
      trexObserver.observe(trexGround);
    }
  }


  const nav = document.querySelector('.nav');
  let ticking = false;

  const updateNav = () => {
    const scrolled = window.scrollY > 40;
    if (nav) {
      nav.style.background = scrolled
        ? 'linear-gradient(to bottom, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0) 100%)'
        : 'transparent';
      nav.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
    }
    ticking = false;
  };

  updateNav();

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
  }, { passive: true });

});
