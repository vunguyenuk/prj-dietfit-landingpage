(function () {
  'use strict';
  const section = document.querySelector('.df-integrations');
  if (!section || !('IntersectionObserver' in window)) return;
  const setup = section.querySelector('#dietfit-sync-setup');
  const setupLink = section.querySelector('a[href="#dietfit-sync-setup"]');
  if (setup && setupLink) setupLink.addEventListener('click', function () { setup.open = true; });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  function sync() { section.classList.toggle('is-active', visible && !reduced.matches && !document.hidden); }
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: .1 }).observe(section);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
}());
