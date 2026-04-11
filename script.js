document.addEventListener('DOMContentLoaded', () => {

  document.body.classList.replace('no-js', 'js-loaded');

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


  const loadElements = document.querySelectorAll('[data-animate]');

  loadElements.forEach(el => {
    const index = parseFloat(el.getAttribute('data-delay') ?? '0');
    el.style.animationDelay = `${index * 0.18}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });
  });


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


  const nav = document.querySelector('.nav');
  let ticking = false;

  const updateNav = () => {
    const scrolled = window.scrollY > 40;
    nav.style.background = scrolled
      ? 'linear-gradient(to bottom, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0) 100%)'
      : 'transparent';
    nav.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
  }, { passive: true });

});
