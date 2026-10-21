(function () {
  'use strict';
  const section = document.querySelector('.dietfit-highlights--bento');
  if (!section) return;
  const rail = section.querySelector('[data-dietfit-carousel]');
  const cards = Array.from(rail.querySelectorAll('.dietfit-bento-card'));
  const previous = section.querySelector('[data-dietfit-prev]');
  const next = section.querySelector('[data-dietfit-next]');
  const current = section.querySelector('[data-dietfit-current]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let drag = null;

  function positions() {
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const origin = cards[0].offsetLeft;
    return cards.map(card => Math.min(max, Math.max(0, card.offsetLeft - origin)));
  }

  function update() {
    frame = 0;
    const points = positions();
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    previous.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max - 2;
    let closest = 0;
    points.forEach((point, index) => {
      if (Math.abs(point - rail.scrollLeft) < Math.abs(points[closest] - rail.scrollLeft)) closest = index;
    });
    if (max > 0 && rail.scrollLeft >= max - 2) closest = cards.length - 1;
    current.textContent = String(closest + 1).padStart(2, '0');
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(update); }

  function move(direction) {
    const points = positions();
    const point = direction > 0
      ? points.find(value => value > rail.scrollLeft + 16)
      : points.slice().reverse().find(value => value < rail.scrollLeft - 16);
    if (point !== undefined) rail.scrollTo({ left: point, behavior: reduce.matches ? 'instant' : 'smooth' });
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', schedule, { passive: true });
  rail.addEventListener('keydown', event => {
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      rail.scrollTo({ left: event.key === 'Home' ? 0 : rail.scrollWidth - rail.clientWidth, behavior: reduce.matches ? 'instant' : 'smooth' });
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('.dietfit-bento-copy')) return;
    drag = { id: event.pointerId, x: event.clientX, scroll: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    rail.classList.add('is-dragging');
  });
  rail.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    rail.scrollLeft = drag.scroll + drag.x - event.clientX;
  });
  function endDrag() { drag = null; rail.classList.remove('is-dragging'); }
  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);
  rail.addEventListener('lostpointercapture', endDrag);
  window.addEventListener('resize', schedule, { passive: true });
  update();
})();
