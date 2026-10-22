(function () {
  'use strict';
  window.createDietfitHeroScan = function (hero) {
    const scene = hero.querySelector('.df-hero-scan');
    if (!scene || !document.body.matches('.dietfit-home--en,.dietfit-home--vi')) return null;
    const originalVi = scene.classList.contains('df-hero-scan--vi');
    const compact = window.matchMedia('(max-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const regions = Array.from(scene.querySelectorAll('[data-scan-region]'));
    const labels = Array.from(scene.querySelectorAll('.df-hero-scan__label'));
    const beam = scene.querySelector('.df-hero-scan__beam');
    const plate = scene.querySelector('.df-hero-scan__plate');
    const photoTransform=scene.querySelector('[data-scan-photo-transform]');
    const stage = hero.querySelector('.dietfit-hero-stage');
    const clamp = function (n) { return Math.max(0,Math.min(1,n)); };
    const smooth = function (n) { n=clamp(n); return n*n*(3-2*n); };
    const enter = .24,leave = .44;
    let last = -1,preparing = false,ready = false;
    function measure() {
      // Analytics is a 417×894 texture with a transparent food window at
      // x36/y193, 344×425. Measure that window, not the complete UI texture.
      const bounds=stage.getBoundingClientRect();
      const fit=originalVi ? Math.max(bounds.width/1920,bounds.height/1258) : Math.max(1,Math.min(bounds.height,(bounds.width-32)*1258/700))/1258;
      const photo=compact.matches
        ? {x:746.8418899,y:324.0055769,w:425.0804389,h:525.1720539,matrix:[.902469002,.000936185,-.000936185,.902469002,-144.377576,-56.386020]}
        : {x:743.2506904,y:307.1784222,w:432.2418090,h:534.0196768,matrix:[.848683071,-.013929955,.013929955,.848683071,-116.457111,-49.415322]};
      plate.style.width=(photo.w*fit).toFixed(3)+'px';
      plate.style.height=(photo.h*fit).toFixed(3)+'px';
      plate.style.left=(bounds.width/2+(photo.x+photo.w/2-960)*fit).toFixed(3)+'px';
      plate.style.top=(bounds.height/2+(photo.y+photo.h/2-629)*fit).toFixed(3)+'px';
      // Paths are traced in the shared 710×710 meal crop. This affine maps
      // that crop through the held hand/bowl pose into the native food window.
      const m=photo.matrix;
      // Original VI retains its unmodified 1536×1055 hand/meal texture. EN
      // paths use a 710px crop placed at x587.25/y322.5 with scale .97.
      const matrix=originalVi ? [m[0]/.97,m[1]/.97,m[2]/.97,m[3]/.97,m[4]-(m[0]*587.25+m[2]*322.5)/.97,m[5]-(m[1]*587.25+m[3]*322.5)/.97] : m;
      photoTransform.setAttribute('transform','matrix('+matrix.join(' ')+')');
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
        // Preserve the complete original arm-lowering motion. Only the
        // angular proximal elbow tip is repaired in the foreground texture.
        // At capture, still skip the duplicate camera/calculation UI crossfade.
        const cameraStart=0;
        const cameraEnd=compact.matches?171/1925:149/539;
        const native = progress<enter ? cameraStart+progress/enter*(cameraEnd-cameraStart) : progress<=leave ? hold : hold+(progress-leave)/(1-leave)*(1-hold);
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
