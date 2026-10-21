(function () {
  'use strict';
  const mascots = Array.from(document.querySelectorAll('[data-mascot-pose]'));
  if (!mascots.length || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const states = new Map();
  // Coordinates refer to the supplied 1000 × 1000 pose artwork, never a redrawn face.
  const faces = {
    wave: { eyes:[[39.8,34.6],[60.4,34.6]], center:54.5 },
    exercise: { eyes:[[34.4,34.3],[55.2,34.4]], center:49 },
    writing: { eyes:[[35.2,35.2],[56.1,35.2]], center:50 },
    eating: { eyes:[[35.3,34.5],[56.5,34.6]], center:50 },
    'thumbs-up': { eyes:[[33.9,33.8],[54.6,33.8]], center:48.5 },
    glasses: { eyes:[[35.4,35],[56.3,35]], center:50 }
  };
  mascots.forEach(function (mascot, index) {
    const body = mascot.querySelector('.df-mascot__body');
    const base = body && body.querySelector('.df-mascot__base');
    const pose = faces[mascot.dataset.mascotPose];
    if (!body || !base || !pose) return;
    const face = document.createElement('span');
    face.className = 'df-mascot__face';
    face.setAttribute('aria-hidden','true');
    face.style.setProperty('--df-face-x',pose.center + '%');
    const faceImage = base.cloneNode(false);
    faceImage.removeAttribute('class');
    face.appendChild(faceImage);
    const expression = document.createElement('span');
    expression.className = 'df-mascot__expression';
    expression.appendChild(faceImage.cloneNode(false));
    face.appendChild(expression);
    const lids = pose.eyes.map(function (point) {
      const lid = document.createElement('span');
      lid.className = 'df-mascot__eyelid';
      lid.style.left = (point[0] - .7) + '%';
      lid.style.top = (point[1] - .8) + '%';
      // Sample the existing fur between the eyebrows to cover the eye during a blink.
      lid.style.backgroundImage = 'url("' + base.getAttribute('src') + '")';
      face.appendChild(lid);
      return lid;
    });
    body.appendChild(face);
    mascot.style.setProperty('--df-breath-duration',(4.7 + index * .43) + 's');
    mascot.style.setProperty('--df-motion-offset',(-index * 1.13) + 's');
    states.set(mascot,{ lids:lids, timer:0, animations:[] });
  });
  function stopBlink(state) {
    window.clearTimeout(state.timer);
    state.timer = 0;
    state.animations.forEach(function (animation) { animation.cancel(); });
    state.animations = [];
  }
  function scheduleBlink(mascot, first) {
    const state = states.get(mascot);
    if (!state || state.timer || !mascot.classList.contains('is-mascot-active')) return;
    state.timer = window.setTimeout(function () {
      state.timer = 0;
      if (!mascot.classList.contains('is-mascot-active')) return;
      state.animations = state.lids.map(function (lid) {
        return lid.animate([
          { transform:'scaleY(0)', offset:0 },
          { transform:'scaleY(1)', offset:.42 },
          { transform:'scaleY(1)', offset:.54 },
          { transform:'scaleY(0)', offset:1 }
        ],{ duration:220, easing:'cubic-bezier(.4,0,.2,1)' });
      });
      scheduleBlink(mascot, false);
    }, first ? 1100 + Math.random() * 1900 : 3100 + Math.random() * 4300);
  }
  function sync() {
    mascots.forEach(function (mascot) {
      const active = visible.has(mascot) && !motion.matches && !document.hidden && mascot.getBoundingClientRect().width > 0;
      const wasActive = mascot.classList.contains('is-mascot-active');
      mascot.classList.toggle('is-mascot-active',active);
      const state = states.get(mascot);
      if (!active && state) stopBlink(state);
      if (active && !wasActive) scheduleBlink(mascot,true);
    });
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio >= .15) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    sync();
  }, { threshold:[0,.15] });
  mascots.forEach(function (mascot) { observer.observe(mascot); });
  motion.addEventListener('change',sync);
  window.addEventListener('resize',sync,{ passive:true });
  document.addEventListener('visibilitychange',sync);
}());
