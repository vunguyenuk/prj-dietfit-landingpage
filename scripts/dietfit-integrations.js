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
  const scrollStage = section.querySelector('.df-integrations__scroll-stage');
  const apps = Array.from(section.querySelectorAll('.df-integrations__app,.df-integrations__destination'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let frame = 0;
  let rendered = null;
  let lastTime = 0;
  let pinTop = 104;
  let travel = 360;
  let pinned = false;
  const clamp = function (n) { return Math.min(1, Math.max(0, n)); };
  function targetProgress() {
    if (reduced.matches) return 1;
    const top = (pinned ? scrollStage : scene).getBoundingClientRect().top;
    return clamp((pinTop - top) / travel);
  }
  function paint(progress) {
    section.style.setProperty('--df-integration-progress', progress.toFixed(3));
    apps.forEach(function (app, index) {
      const p = clamp((progress - index * .018) / .856);
      // Smooth acceleration and deceleration, with no overshoot.
      const eased = p * p * p * (p * (p * 6 - 15) + 10);
      app.style.setProperty('--df-flight-remain', (1 - eased).toFixed(4));
      app.style.setProperty('--df-flight-scale', (.24 + .76 * eased).toFixed(4));
      app.style.setProperty('--df-flight-opacity', clamp(p * 4).toFixed(3));
      app.style.pointerEvents = p < .1 ? 'none' : '';
    });
  }
  function draw(time) {
    frame = 0;
    if (document.hidden) return;
    const target = targetProgress();
    const dt = lastTime ? Math.min(64, Math.max(1, time - lastTime)) : 16.67;
    lastTime = time;
    if (rendered === null || reduced.matches) rendered = target;
    else rendered += (target - rendered) * (1 - Math.exp(-dt / 105));
    if (Math.abs(target - rendered) < .0001) rendered = target;
    paint(rendered);
    if (rendered !== target) requestDraw();
    else lastTime = 0;
  }
  function requestDraw() {
    if ((visible || reduced.matches) && !document.hidden && !frame) frame = window.requestAnimationFrame(draw);
  }
  function measure() {
    if (!scene || !hub || !scrollStage) return;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    section.classList.remove('is-flight-ready','is-scroll-pinned');
    const height = scene.getBoundingClientRect().height;
    pinTop = Math.min(128, Math.max(88, window.innerHeight * .1));
    travel = Math.min(420, Math.max(260, window.innerHeight * .38));
    pinned = !reduced.matches && window.innerWidth >= 768 && height + pinTop + 32 <= window.innerHeight;
    section.style.setProperty('--df-integration-pin-top',pinTop.toFixed(1) + 'px');
    section.style.setProperty('--df-integration-runway',(height + travel).toFixed(1) + 'px');
    section.classList.toggle('is-scroll-pinned',pinned);
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
    rendered = targetProgress();
    paint(rendered);
  }
  function sync() {
    section.classList.toggle('is-active', visible && !reduced.matches && !document.hidden);
    if ((!visible || document.hidden) && frame) { window.cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
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
