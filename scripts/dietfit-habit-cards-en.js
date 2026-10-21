/* Pause each EN card independently when it leaves the carousel viewport. */
(() => {
  'use strict';
  const cards = [...document.querySelectorAll('.dietfit-home--en [data-habit-motion]')];
  if (!cards.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const paused = new Set();
  cards.forEach(card => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'df-habit-motion-toggle';
    button.textContent = 'Pause';
    button.setAttribute('aria-label', 'Pause widget animation');
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (paused.has(card)) paused.delete(card);
      else paused.add(card);
      const isPaused = paused.has(card);
      button.textContent = isPaused ? 'Play' : 'Pause';
      button.setAttribute('aria-label', (isPaused ? 'Play' : 'Pause') + ' widget animation');
      button.setAttribute('aria-pressed', String(isPaused));
      sync();
    });
    card.append(button);
  });
  const sync = () => cards.forEach(card => {
    card.classList.toggle('is-habit-ready', !reduced.matches);
    card.classList.toggle('is-habit-playing', visible.has(card) && !document.hidden && !reduced.matches && !paused.has(card));
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= .4) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      sync();
    }, { threshold: [0, .4] });
    cards.forEach(card => observer.observe(card));
  }
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  sync();
})();
