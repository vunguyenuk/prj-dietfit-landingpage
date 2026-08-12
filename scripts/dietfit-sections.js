(function () {
  "use strict";

  const carousel = document.querySelector('[data-dietfit-carousel]');
  const previous = document.querySelector('[data-dietfit-prev]');
  const next = document.querySelector('[data-dietfit-next]');
  if (!carousel || !previous || !next) return;

  const highlights = carousel.closest('.dietfit-highlights');
  const sticky = highlights && highlights.querySelector('.dietfit-highlights-sticky');
  const desktopQuery = window.matchMedia('(min-width: 768px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrubEnabled = false;
  let maxHorizontal = 0;
  let scrollFrame = 0;

  function cards() {
    return Array.from(carousel.querySelectorAll('.dietfit-card'));
  }

  function updateControls() {
    previous.disabled = carousel.scrollLeft <= 2;
    next.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
  }

  function move(direction) {
    const items = cards();
    const current = carousel.scrollLeft;
    const padding = parseFloat(getComputedStyle(carousel).scrollPaddingLeft) || 0;
    const target = direction > 0
      ? items.find(function (card) { return card.offsetLeft - padding > current + 2; })
      : items.reverse().find(function (card) { return card.offsetLeft - padding < current - 2; });
    if (!target) return;
    const targetLeft = target.offsetLeft - padding;
    if (scrubEnabled && highlights && sticky) {
      const sectionTop = highlights.getBoundingClientRect().top + window.scrollY;
      const verticalRange = highlights.offsetHeight - sticky.offsetHeight;
      const targetY = sectionTop + (targetLeft / Math.max(maxHorizontal, 1)) * verticalRange;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } else {
      carousel.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  }

  function syncHorizontalScroll() {
    scrollFrame = 0;
    if (!scrubEnabled || !highlights || !sticky) return;
    const sectionTop = highlights.getBoundingClientRect().top + window.scrollY;
    const verticalRange = Math.max(highlights.offsetHeight - sticky.offsetHeight, 1);
    const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / verticalRange));
    carousel.scrollLeft = progress * maxHorizontal;
    updateControls();
  }

  function requestScrollSync() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(syncHorizontalScroll);
  }

  function measureScrollScrub() {
    if (!highlights || !sticky) return;
    scrubEnabled = desktopQuery.matches && !reducedMotionQuery.matches;
    highlights.classList.toggle('dietfit-scroll-scrub', scrubEnabled);
    maxHorizontal = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    if (scrubEnabled) {
      highlights.style.setProperty('--dietfit-scroll-distance', maxHorizontal + 'px');
      syncHorizontalScroll();
    } else {
      highlights.style.removeProperty('--dietfit-scroll-distance');
    }
    updateControls();
  }

  previous.addEventListener('click', function () { move(-1); });
  next.addEventListener('click', function () { move(1); });
  carousel.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('scroll', requestScrollSync, { passive: true });
  window.addEventListener('resize', measureScrollScrub, { passive: true });
  desktopQuery.addEventListener('change', measureScrollScrub);
  reducedMotionQuery.addEventListener('change', measureScrollScrub);
  window.addEventListener('load', measureScrollScrub, { once: true });
  measureScrollScrub();
})();

(function () {
  "use strict";

  const image = document.querySelector('.dietfit-final-image[data-background-src]');
  if (!image) return;

  function loadBackground() {
    if (!image.dataset.backgroundSrc) return;
    image.style.backgroundImage = 'url("' + image.dataset.backgroundSrc + '")';
    image.removeAttribute('data-background-src');
  }

  if (!('IntersectionObserver' in window)) {
    loadBackground();
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    loadBackground();
  }, { rootMargin: '800px 0px' });

  observer.observe(image);
})();

(function () {
  "use strict";

  const section = document.querySelector('.dietfit-progress-cta');
  const sticky = section && section.querySelector('.dietfit-progress-cta__sticky');
  if (!section || !sticky) return;

  const desktopQuery = window.matchMedia('(min-width: 768px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let sectionTop = 0;
  let scrollRange = 1;
  let scrollFrame = 0;
  let enabled = false;

  function updateProgress() {
    scrollFrame = 0;
    if (!enabled) return;
    const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollRange));
    section.style.setProperty('--dietfit-progress-spread', progress.toFixed(4));
  }

  function requestProgressUpdate() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateProgress);
  }

  function measure() {
    enabled = desktopQuery.matches && !reducedMotionQuery.matches;
    section.classList.toggle('is-scroll-scrub', enabled);
    section.style.setProperty('--dietfit-progress-spread', enabled ? '0' : '1');
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    scrollRange = Math.max(section.offsetHeight - sticky.offsetHeight, 1);
    updateProgress();
  }

  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure, { once: true });
  desktopQuery.addEventListener('change', measure);
  reducedMotionQuery.addEventListener('change', measure);
  measure();
})();
