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
    const plate = scene.querySelector('.df-hero-scan__plate');
    const stage = hero.querySelector('.dietfit-hero-stage');
    const clamp = function (n) { return Math.max(0,Math.min(1,n)); };
    const smooth = function (n) { n=clamp(n); return n*n*(3-2*n); };
    const enter = .24,leave = .44;
    let last = -1,preparing = false,ready = false;
    function measure() {
      // Native Rive artboard is 1920 × 1258, rendered with Fit.Cover / Center.
      // These are the food image's world bounds at the held calculation frame,
      // derived from its unchanged parent transforms in each original timeline.
      const bounds=stage.getBoundingClientRect();
      const fit=Math.max(bounds.width/1920,bounds.height/1258);
      const photo=compact.matches?{y:637.8730957,w:510.3436665,h:514.0507633}:{y:626.3336966,w:518.9414741,h:522.7110248};
      plate.style.width=(photo.w*fit).toFixed(3)+'px';
      plate.style.height=(photo.h*fit).toFixed(3)+'px';
      plate.style.left=(bounds.width/2).toFixed(3)+'px';
      plate.style.top=(bounds.height/2+(photo.y-629)*fit).toFixed(3)+'px';
    }
    function prepare() {
      if(preparing)return;
      preparing=true;
      measure();ready=true;last=-1;
    }
    measure();
    return {
      finaleEntry:function () {
        const hold=compact.matches?274/1925:199/539;
        const gate=compact.matches?799/1925:374/539;
        return leave+(gate-hold)/(1-hold)*(1-leave);
      },
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

        return native;
      },
      resize:measure,
      reset:function () { last=-1; hero.classList.remove('is-hero-scanning'); scene.style.opacity='0'; }
    };
  };
}());
