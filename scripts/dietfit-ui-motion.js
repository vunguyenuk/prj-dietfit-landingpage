/* Reuse v2's scroll-led product storytelling, in the original Dietfit visual theme. */
(() => {
  'use strict';
  const root = document.querySelector('.dietfit-product');
  if (!root || !('IntersectionObserver' in window)) return;
  const chapters = [...root.querySelectorAll('[data-ui-chapter]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 767px)');
  const pinnedScan = matchMedia('(min-width: 1101px) and (min-height: 900px)');
  const active = new Set();
  const clamp = value => Math.max(0,Math.min(1,value));
  const owned = ['--df-phone-lift','--df-phone-roll','--df-phone-yaw','--df-phone-scale','--df-board-lift'];
  let frame = 0;
  chapters.forEach(chapter => {
    const takeControl = event => {
      if (event.target.closest('button,input,a')) chapter.dataset.uiManual = 'true';
    };
    chapter.addEventListener('pointerdown',takeControl);
    chapter.addEventListener('focusin',takeControl);
    chapter.addEventListener('click',takeControl,true);
    chapter.addEventListener('input',takeControl,true);
  });
  function render() {
    frame = 0;
    root.classList.toggle('df-ui-motion-enabled',!reduce.matches);
    for (const chapter of chapters) {
      const rows = [...chapter.querySelectorAll('.df-meal-slot')];
      if (reduce.matches) {
        owned.forEach(name => chapter.style.removeProperty(name));
        rows.forEach(row => { row.style.removeProperty('--df-row-opacity'); row.style.removeProperty('--df-row-lift'); });
        continue;
      }
      if(!active.has(chapter) || chapter.dataset.uiManual === 'true' || chapter.dataset.scanManual === 'true') continue;
      const panel = chapter.querySelector('.df-demo-display,.df-health-board');
      const rect = panel.getBoundingClientRect();
      const progress = clamp((innerHeight - rect.top)/(innerHeight + rect.height));
      const enter = clamp(progress/0.58);
      const remain = 1-enter;
      const small = compact.matches;
      chapter.style.setProperty('--df-phone-lift',`${(remain*(small?14:42)).toFixed(2)}px`);
      chapter.style.setProperty('--df-phone-roll',`${(-remain*(small ? .8 : 3)).toFixed(2)}deg`);
      chapter.style.setProperty('--df-phone-yaw',`${(remain*(small?0:10)).toFixed(2)}deg`);
      chapter.style.setProperty('--df-phone-scale',(1-remain*(small ? .015 : .065)).toFixed(4));
      chapter.style.setProperty('--df-board-lift',`${(remain*(small?12:28)).toFixed(2)}px`);
      rows.forEach((row,i) => {
        const reveal = clamp(progress*2.4-i*.14);
        row.style.setProperty('--df-row-opacity',(.55+reveal*.45).toFixed(3));
        row.style.setProperty('--df-row-lift',`${((1-reveal)*18).toFixed(2)}px`);
      });
      if(chapter.dataset.uiChapter !== 'scan' || !pinnedScan.matches) continue;
      const steps = [...chapter.querySelectorAll('[data-scan-stage]')];
      let current = 0;
      steps.forEach((step,i) => { if(step.getBoundingClientRect().top < innerHeight*.62) current=i; });
      const state = steps[current].dataset.scanStage;
      chapter.querySelector('.df-scroll-status').textContent = `0${current+1} / 03`;
      if(chapter.dataset.motionStep !== state) {
        chapter.dataset.motionStep = state;
        chapter.dispatchEvent(new CustomEvent('dietfit:scan-step',{detail:state}));
      }
    }
  }
  function schedule() { if(!frame) frame=requestAnimationFrame(render); }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) active.add(entry.target); else active.delete(entry.target); });
    schedule();
  },{rootMargin:'120px 0px',threshold:0});
  chapters.forEach(chapter => observer.observe(chapter));
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  [reduce,compact,pinnedScan].forEach(query => query.addEventListener('change',schedule));
  render();
})();
