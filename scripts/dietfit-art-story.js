/* Paintings stay intact. Scroll changes the camera and reveals the existing UI;
   touching the Scan demo hands control to the visitor until the page is reloaded. */
(() => {
  'use strict';
  const root = document.querySelector('.dietfit-product');
  if (!root || !('IntersectionObserver' in window)) return;
  const chapters = [...root.querySelectorAll('[data-art-chapter]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1101px)');
  const active = new Set();
  const clamp = v => Math.max(0, Math.min(1, v));
  let frame = 0;
  function render() {
    frame = 0;
    const enabled = !reduce.matches;
    root.classList.toggle('df-motion-enabled', enabled);
    for (const chapter of chapters) {
      if (!enabled) {
        chapter.removeAttribute('style');
        chapter.classList.remove('is-art-visible');
        continue;
      }
      if (!active.has(chapter)) continue;
      const rect = chapter.getBoundingClientRect();
      const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      const kind = chapter.dataset.artChapter;
      const pan = (progress - .5) * (kind === 'health' ? 52 : 32);
      chapter.style.setProperty('--df-art-pan', `${pan.toFixed(2)}px`);
      chapter.style.setProperty('--df-art-lift', `${(desktop.matches ? (1-progress)*26 : 0).toFixed(2)}px`);
      chapter.style.setProperty('--df-art-scale', desktop.matches ? (0.96 + progress*.04).toFixed(4) : '1');
      chapter.style.setProperty('--df-art-turn', `${(desktop.matches ? (1-progress)*1.5 : 0).toFixed(2)}deg`);
      if (kind !== 'scan' || !desktop.matches || chapter.dataset.scanManual === 'true') continue;
      // Match each narrative step to its position in the viewport. Reverses on scroll up.
      const steps = [...chapter.querySelectorAll('[data-scan-stage]')];
      let current = 0;
      steps.forEach((step, i) => { if(step.getBoundingClientRect().top < innerHeight*.62) current = i; });
      const state = steps[current].dataset.scanStage;
      const index = chapter.querySelector('.df-scene-index b');
      index.textContent = `0${current+1} / 03`;
      if(chapter.dataset.motionStep !== state) {
        chapter.dataset.motionStep = state;
        chapter.dispatchEvent(new CustomEvent('dietfit:scan-step', {detail: state}));
      }
    }
  }
  function schedule() { if(!frame) frame = requestAnimationFrame(render); }
  const observer = new IntersectionObserver(entries => {
    for(const entry of entries) {
      if(entry.isIntersecting) active.add(entry.target); else active.delete(entry.target);
      entry.target.classList.toggle('is-art-visible', entry.isIntersecting && !reduce.matches);
    }
    schedule();
  }, {rootMargin:'120px 0px', threshold:0});
  chapters.forEach(chapter => observer.observe(chapter));
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  reduce.addEventListener('change', schedule);
  desktop.addEventListener('change', schedule);
  render();
})();
