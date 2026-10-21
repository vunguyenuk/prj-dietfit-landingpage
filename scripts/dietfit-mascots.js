(function () {
  'use strict';
  const mascots = Array.from(document.querySelectorAll('[data-mascot-pose]'));
  if (!mascots.length || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  function sync() {
    mascots.forEach(function (mascot) {
      mascot.classList.toggle('is-mascot-active', visible.has(mascot) && !motion.matches && !document.hidden);
    });
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio >= .15) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    sync();
  }, { threshold: [0, .15] });
  mascots.forEach(function (mascot) { observer.observe(mascot); });
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
}());
