(function () {
  'use strict';
  const section = document.querySelector('.df-integrations');
  if (!section) return;
  const setup = section.querySelector('#dietfit-sync-setup');
  const setupLink = section.querySelector('a[href="#dietfit-sync-setup"]');
  if (setup && setupLink) setupLink.addEventListener('click', function () { setup.open = true; });
  if (!('IntersectionObserver' in window)) return;
  const scene = section.querySelector('.df-integrations__scene');
  const hub = section.querySelector('.df-integrations__hub');
  const apps = Array.from(section.querySelectorAll('.df-integrations__app,.df-integrations__destination'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let frame = 0;
  const clamp = function (n) { return Math.min(1, Math.max(0, n)); };
  function draw() {
    frame = 0;
    if (document.hidden) return;
    const rect = scene.getBoundingClientRect();
    const progress = clamp((window.innerHeight * .84 - rect.top) / Math.min(rect.height * .95, window.innerHeight * .8));
    section.style.setProperty('--df-integration-progress', reduced.matches ? '1' : progress.toFixed(3));
    apps.forEach(function (app, index) {
      const p = reduced.matches ? 1 : clamp((progress - index * .025) / .8);
      const eased = 1 - Math.pow(1 - p, 3);
      app.style.setProperty('--df-flight-remain', (1 - eased).toFixed(4));
      app.style.setProperty('--df-flight-scale', (.24 + .76 * eased).toFixed(4));
      app.style.setProperty('--df-flight-opacity', clamp(p * 4).toFixed(3));
      app.style.pointerEvents = p < .1 ? 'none' : '';
    });
  }
  function requestDraw() {
    if ((visible || reduced.matches) && !document.hidden && !frame) frame = window.requestAnimationFrame(draw);
  }
  function measure() {
    if (!scene || !hub) return;
    section.classList.remove('is-flight-ready');
    const sceneRect = scene.getBoundingClientRect();
    const center = hub.getBoundingClientRect();
    const x = center.left - sceneRect.left + center.width / 2;
    const y = center.top - sceneRect.top + center.height / 2;
    apps.forEach(function (app) {
      const resting = app.getBoundingClientRect();
      app.style.setProperty('--df-flight-x', (x - (resting.left - sceneRect.left + resting.width / 2)).toFixed(2) + 'px');
      app.style.setProperty('--df-flight-y', (y - (resting.top - sceneRect.top + resting.height / 2)).toFixed(2) + 'px');
    });
    section.classList.toggle('is-flight-ready', !reduced.matches);
    draw();
  }
  function sync() {
    section.classList.toggle('is-active', visible && !reduced.matches && !document.hidden);
    if (!document.hidden) requestDraw();
  }
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }, { rootMargin:'160px 0px', threshold:0 }).observe(section);
  scene.addEventListener('focusin', function (event) {
    const app = event.target.closest('.df-integrations__app');
    if (app) app.classList.add('is-focused');
  });
  scene.addEventListener('focusout', function (event) {
    const app = event.target.closest('.df-integrations__app');
    if (app) app.classList.remove('is-focused');
  });
  window.addEventListener('scroll', requestDraw, { passive:true });
  window.addEventListener('resize', measure, { passive:true });
  window.addEventListener('load', measure, { once:true });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(scene);
  reduced.addEventListener('change', function () { measure(); sync(); });
  document.addEventListener('visibilitychange', sync);
  measure();
}());
