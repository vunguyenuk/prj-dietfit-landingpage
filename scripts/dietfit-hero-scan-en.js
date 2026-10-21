(function () {
  'use strict';
  window.createDietfitHeroScan = function (hero) {
    const scene = hero.querySelector('.df-hero-scan');
    if (!scene || !document.body.classList.contains('dietfit-home--en')) return null;
    const compact = window.matchMedia('(max-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const regions = Array.from(scene.querySelectorAll('[data-scan-region]'));
    const labels = Array.from(scene.querySelectorAll('.df-hero-scan__label'));
    const beam = scene.querySelector('.df-hero-scan__beam');
    const summary = scene.querySelector('.df-hero-scan__summary');
    const clamp = function (n) { return Math.max(0,Math.min(1,n)); };
    const smooth = function (n) { n=clamp(n); return n*n*(3-2*n); };
    const enter = .24,leave = .44;
    let last = -1,preparing = false,ready = false;
    function prepare() {
      if (preparing) return;
      preparing = true;
      Promise.all(Array.from(scene.querySelectorAll('img')).map(function (img) {
        img.loading = 'eager';
        return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      })).then(function () { ready=true; last=-1; });
    }
    return {
      render:function (progress) {
        // Hold the native hero immediately before calculating. Add one scroll chapter,
        // then map back into the unchanged native timeline and its existing finale gate.
        const hold = compact.matches ? 274/1925 : 199/539;
        const native = progress<enter ? progress/enter*hold : progress<=leave ? hold : hold+(progress-leave)/(1-leave)*(1-hold);
        if (progress>.12) prepare();
        if (progress===last) return native;
        last = progress;
        const t = clamp((progress-enter)/(leave-enter));
        const active = ready && !reduced.matches && progress>enter && progress<leave;
        hero.classList.toggle('is-hero-scanning',active);
        scene.style.opacity = active ? (smooth(t/.12)*(1-smooth((t-.88)/.12))).toFixed(3) : '0';
        regions.forEach(function (path,index) {
          const reveal = smooth((t-.12-index*.065)/.26);
          path.style.strokeDashoffset = (1-reveal).toFixed(4);
          path.style.fillOpacity = (.055*reveal).toFixed(4);
        });
        labels.forEach(function (label,index) {
          const reveal = smooth((t-.30-index*.10)/.14);
          label.style.opacity = reveal.toFixed(3);
          label.style.transform = 'translateY('+((1-reveal)*6).toFixed(2)+'px)';
        });
        beam.style.transform = 'translateY('+(clamp(t/.72)*530).toFixed(2)+'%)';
        beam.style.opacity = (smooth(t/.08)*(1-smooth((t-.62)/.12))*.8).toFixed(3);
        summary.style.opacity = smooth((t-.70)/.12).toFixed(3);
        return native;
      },
      reset:function () { last=-1; hero.classList.remove('is-hero-scanning'); scene.style.opacity='0'; }
    };
  };
}());
