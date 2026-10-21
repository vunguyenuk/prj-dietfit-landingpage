(function () {
  'use strict';
  window.createDietfitHeroFinale = function (hero,stage) {
    const scene = hero.querySelector('.df-hero-finale');
    if (!scene || !document.body.classList.contains('dietfit-home--en')) return null;
    const cards = Array.from(scene.querySelectorAll('.df-hero-finale__card'));
    const phone = scene.querySelector('.df-hero-finale__phone');
    const mascot = scene.querySelector('.df-hero-finale__mascot');
    const arm = scene.querySelector('.df-hero-finale__mascot-arm');
    const screen = scene.querySelector('.df-hero-finale__screen');
    const screenImage = screen.querySelector('img');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // The compact export has a longer timeline; gate before its first card move.
    function currentGate() { return window.matchMedia('(max-width: 1024px)').matches ? 799/1925 : 374/539; }
    let gate = currentGate();
    let desired = 0,elapsed = 0,lastTime = 0,started = false,complete = false;
    let visible = true,ready = false,preparing = null;
    const origins = [];
    const clamp = function (n) { return Math.max(0,Math.min(1,n)); };
    const smooth = function (n) { n=clamp(n); return n*n*n*(n*(n*6-15)+10); };
    function measure() {
      const bounds = stage.getBoundingClientRect();
      scene.style.setProperty('--df-hero-bleed',Math.min(28,Math.max(0,bounds.left-8)).toFixed(1)+'px');
      const center = phone.getBoundingClientRect();
      cards.forEach(function (card,index) {
        const saved = card.style.transform; card.style.transform = 'none';
        const rect = card.getBoundingClientRect();
        origins[index] = {x:center.left+center.width/2-rect.left-rect.width/2,y:center.top+center.height/2-rect.top-rect.height/2};
        card.style.transform = saved;
      });
    }
    function paintScreen() {
      // Keep the ingredient list tied to scrolling after the greeting gate.
      const imageHeight = screen.clientWidth * 1311 / 404;
      const maxOffset = Math.max(0,imageHeight-screen.clientHeight);
      const firstOffset = Math.min(imageHeight*.2769,maxOffset);
      const progress = clamp((desired-gate)/(1-gate));
      screenImage.style.transform = 'translateY('+(-firstOffset-(maxOffset-firstOffset)*smooth(progress)).toFixed(2)+'px)';
    }
    function prepare() {
      if (preparing) return;
      preparing = Promise.all(Array.from(scene.querySelectorAll('img')).map(function (img) {
        img.loading = 'eager';
        return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      })).then(function () { ready=true; measure(); paintScreen(); });
    }
    function wave(time) {
      const keys = [[0,0],[550,0],[680,-8],[860,30],[1040,-14],[1230,27],[1430,-7],[1590,0],[2300,0]];
      for (let i=1;i<keys.length;i++) if(time<=keys[i][0]) {
        const a=keys[i-1],b=keys[i];return a[1]+(b[1]-a[1])*smooth((time-a[0])/(b[0]-a[0]));
      }
      return 0;
    }
    function paint() {
      // First peek and greet, then disappear fully before any surrounding UI appears.
      const peek = smooth(elapsed/480)*(1-smooth((elapsed-1720)/480));
      mascot.style.transform = 'translateY('+((1-peek)*105).toFixed(2)+'%) rotate('+(-1.5*peek).toFixed(2)+'deg)';
      arm.style.transform = 'rotate('+wave(elapsed).toFixed(2)+'deg)';
      const burst = clamp((elapsed-2360)/1300);
      cards.forEach(function (card,index) {
        const p = clamp((burst-index*.025)/.775),eased=smooth(p),origin=origins[index] || {x:0,y:0};
        card.style.transform = 'translate('+(origin.x*(1-eased)).toFixed(2)+'px,'+(origin.y*(1-eased)).toFixed(2)+'px) scale('+(.32+.68*eased).toFixed(4)+')';
        card.style.opacity = clamp(p*5).toFixed(3);
      });
      scene.dataset.phase = elapsed<480 ? 'peeking' : elapsed<1720 ? 'waving' : elapsed<2200 ? 'hiding' : elapsed<2360 ? 'waiting' : burst<1 ? 'revealing' : 'complete';
      if (burst===1) complete=true;
    }
    function reset() {
      gate=currentGate(); desired=0; elapsed=0; lastTime=0; started=false; complete=false;
      hero.classList.remove('is-hero-finale'); paint(); paintScreen();
    }
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      visible=entries[0].isIntersecting && entries[0].intersectionRatio>.1; lastTime=0;
    },{threshold:[0,.1]}) : null;
    if (observer) observer.observe(stage);
    measure(); paint();
    return {
      progress:function (value) {
        if (value<gate-.025 && (started || complete)) reset();
        desired=value;
        paintScreen();
        if (value>gate-.1) prepare();
        return Math.min(value,gate);
      },
      tick:function (progress,time) {
        if (!visible || document.hidden || motionQuery.matches || complete) { lastTime=0; return; }
        if (!started && ready && desired>=gate && progress>=gate-.001) {
          started=true; elapsed=0; lastTime=0; measure(); hero.classList.add('is-hero-finale');
        }
        if (!started) return;
        const dt=lastTime ? Math.min(64,Math.max(0,time-lastTime)) : 0;
        lastTime=time; elapsed+=dt; paint();
      },
      resize:function () { gate=currentGate(); measure(); paintScreen(); if(started)paint(); },
      reset:reset,
      destroy:function () { if(observer)observer.disconnect(); reset(); }
    };
  };
}());
