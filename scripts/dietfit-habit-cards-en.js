/* Pause each localized card independently when it leaves the carousel viewport. */
(() => {
  'use strict';
  const cards = [...document.querySelectorAll(':is(.dietfit-home--en,.dietfit-home--vi) [data-habit-motion]')];
  if (!cards.length) return;
  const vi = document.body.classList.contains('dietfit-home--vi');
  const label = (isPaused) => vi ? (isPaused ? 'Phát' : 'Tạm dừng') : (isPaused ? 'Play' : 'Pause');
  const accessibleLabel = (isPaused) => vi ? label(isPaused) + ' hoạt ảnh widget' : label(isPaused) + ' widget animation';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const paused = new Set();
  cards.forEach(card => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'df-habit-motion-toggle';
    button.textContent = label(false);
    button.setAttribute('aria-label', accessibleLabel(false));
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (paused.has(card)) paused.delete(card);
      else paused.add(card);
      const isPaused = paused.has(card);
      button.textContent = label(isPaused);
      button.setAttribute('aria-label', accessibleLabel(isPaused));
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
