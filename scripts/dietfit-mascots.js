(function () {
  'use strict';
  const mascots = Array.from(document.querySelectorAll('[data-mascot-pose]'));
  if (!mascots.length || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const states = new Map();
  const gameIdle = document.body.classList.contains('dietfit-home--en');
  const penPath = 'M30 43L40 49L45 54L48 61L43 70L27 72L16 65V54L25 49Z';
  const bookPath = 'M48 51L67 48L71 50L69 72L47 76L45 71L46 57Z';
  function mask(path, inverse) {
    const full = inverse ? 'M0 0H100V100H0Z' : '';
    return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="white" fill-rule="evenodd" d="' + full + path + '"/></svg>') + '")';
  }
  function copy(base) {
    const img = base.cloneNode(false);
    img.removeAttribute('class'); img.removeAttribute('style'); img.removeAttribute('id');
    return img;
  }
  function articulate(mascot,body,base,face) {
    const writing = mascot.dataset.mascotPose === 'writing';
    let original = getComputedStyle(base).maskImage || 'none';
    if (writing && original === 'none') original = mask(penPath,true);
    base.style.setProperty('--df-original-mask',original);
    base.style.maskImage = 'linear-gradient(transparent 46%,#000 49%,#000 85%,transparent 90%)' + (original !== 'none' ? ',' + original : '');
    base.style.maskComposite = 'intersect';
    const head = document.createElement('span'); head.className = 'df-mascot__head';
    head.style.maskImage = 'linear-gradient(#000 50%,transparent 56%)' + (original !== 'none' ? ',' + original : '') + (writing ? ',' + mask(bookPath,true) : '');
    head.style.maskComposite = 'intersect';
    head.append(copy(base),face); body.append(head);
    const feet = document.createElement('span'); feet.className = 'df-mascot__feet';
    feet.append(copy(base)); mascot.append(feet);
    let pen = null;
    if (writing) {
      const prop = document.createElement('span'); prop.className = 'df-mascot__prop';
      prop.style.maskImage = mask(bookPath,false); prop.append(copy(base)); body.append(prop);
      pen = body.querySelector('.df-integrations__pen') || copy(base);
      pen.classList.add('df-mascot__pen'); body.append(pen);
    }
    mascot.classList.add('df-mascot--game');
    return {body:body,head:head,face:face,pen:pen,arm:body.querySelector('.df-mascot__arm'),writing:writing};
  }
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
    const rig = gameIdle ? articulate(mascot,body,base,face) : null;
    states.set(mascot,{ lids:lids, timer:0, animations:[],rig:rig,gestureTimer:0,gestures:[] });
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
      const doubleBlink = state.rig && Math.random() < .18;
      state.animations = state.lids.map(function (lid) {
        const frames = doubleBlink ? [
          {transform:'scaleY(0)',offset:0},{transform:'scaleY(1)',offset:.17},
          {transform:'scaleY(0)',offset:.34},{transform:'scaleY(0)',offset:.60},
          {transform:'scaleY(1)',offset:.76},{transform:'scaleY(0)',offset:1}
        ] : [
          { transform:'scaleY(0)', offset:0 },
          { transform:'scaleY(1)', offset:.42 },
          { transform:'scaleY(1)', offset:.54 },
          { transform:'scaleY(0)', offset:1 }
        ];
        return lid.animate(frames,{ duration:doubleBlink ? 360 : (state.rig ? 165 : 220), easing:'cubic-bezier(.4,0,.2,1)' });
      });
      scheduleBlink(mascot, false);
    }, first ? 1100 + Math.random() * 1900 : 3100 + Math.random() * 4300);
  }
  function stopGesture(state) {
    window.clearTimeout(state.gestureTimer); state.gestureTimer = 0;
    state.gestures.forEach(function (animation) { animation.cancel(); }); state.gestures = [];
  }
  function scheduleGesture(mascot, first, after) {
    const state = states.get(mascot);
    if (!state || !state.rig || state.gestureTimer || !mascot.classList.contains('is-mascot-active')) return;
    const rig = state.rig;
    const waving = mascot.dataset.mascotPose === 'wave';
    const rest = first ? 450 + Math.random() * 1100 : (rig.writing ? 400 + Math.random() * 1100 : 3100 + Math.random() * 3900);
    state.gestureTimer = window.setTimeout(function () {
      state.gestureTimer = 0;
      if (!mascot.classList.contains('is-mascot-active')) return;
      state.gestures.forEach(function (animation) { animation.cancel(); }); state.gestures = [];
      const duration = rig.writing ? 1900 + Math.random() * 700 : waving ? 2100 + Math.random() * 450 : 2700 + Math.random() * 900;
      const direction = waving ? 1 : Math.random() > .5 ? 1 : -1;
      function play(element,frames) {
        if (!element) return;
        const animation = element.animate(frames.map(function (frame) {
          return Object.assign({easing:'cubic-bezier(.4,0,.25,1)'},frame);
        }),{duration:duration,easing:'linear'});
        if (animation.finished) animation.finished.catch(function () {});
        state.gestures.push(animation);
      }
      // Anticipation -> transfer weight -> settle. Feet remain in a separate grounded layer.
      play(rig.body,[
        {translate:'0 0',rotate:'0deg',offset:0},
        {translate:(-.25 * direction) + '% .1%',rotate:(-.45 * direction) + 'deg',offset:.16},
        {translate:(waving ? '.8% -.45%' : (.6 * direction) + '% .2%'),rotate:(waving ? 1.8 : 1.15 * direction) + 'deg',offset:.43},
        {translate:(.25 * direction) + '% 0',rotate:(.35 * direction) + 'deg',offset:.77},
        {translate:'0 0',rotate:'0deg',offset:1}
      ]);
      // The glance leads the head; the head follows the torso with a different rhythm.
      play(rig.face,[
        {transform:'translate(0,0)',offset:0},
        {transform:rig.writing ? 'translate(.1%,.5%)' : 'translate(' + (.45 * direction) + '%,.1%)',offset:.10},
        {transform:rig.writing ? 'translate(.1%,.4%)' : 'translate(' + (.3 * direction) + '%,.05%)',offset:.72},
        {transform:'translate(0,0)',offset:1}
      ]);
      play(rig.head,[
        {transform:'translate(0,0) rotate(0deg)',offset:0},
        {transform:'translate(' + (-.2 * direction) + '%,.1%) rotate(' + (-.6 * direction) + 'deg)',offset:.24},
        {transform:rig.writing ? 'translate(.15%,.65%) rotate(2deg)' : 'translate(' + (.45 * direction) + '%,.25%) rotate(' + (1.7 * direction) + 'deg)',offset:.52},
        {transform:'translate(.05%,.1%) rotate(.25deg)',offset:.83},
        {transform:'translate(0,0) rotate(0deg)',offset:1}
      ]);
      if (rig.pen) play(rig.pen,[
        {transform:'rotate(0)',offset:0},{transform:'rotate(-1deg)',offset:.14},
        {transform:'rotate(2.4deg) translate(.2%,.1%)',offset:.25},{transform:'rotate(-1.5deg)',offset:.32},
        {transform:'rotate(1.8deg)',offset:.40},{transform:'rotate(-.7deg)',offset:.46},
        {transform:'rotate(-.7deg)',offset:.63},{transform:'rotate(2deg)',offset:.72},
        {transform:'rotate(-1deg)',offset:.79},{transform:'rotate(.8deg)',offset:.88},{transform:'rotate(0)',offset:1}
      ]);
      if (rig.arm) play(rig.arm,waving ? window.dietfitMascotWave.keyframes() : [
        {transform:'rotate(0)',offset:0},{transform:'rotate(-3deg)',offset:.15},
        {transform:'rotate(13deg)',offset:.32},{transform:'rotate(-5deg)',offset:.45},
        {transform:'rotate(9deg)',offset:.57},{transform:'rotate(1deg)',offset:.79},{transform:'rotate(0)',offset:1}
      ]);
      scheduleGesture(mascot,false,duration);
    },rest + (after || 0));
  }
  function sync() {
    mascots.forEach(function (mascot) {
      const active = visible.has(mascot) && !motion.matches && !document.hidden && mascot.getBoundingClientRect().width > 0;
      const wasActive = mascot.classList.contains('is-mascot-active');
      mascot.classList.toggle('is-mascot-active',active);
      const state = states.get(mascot);
      if (!active && state) { stopBlink(state); stopGesture(state); }
      if (active && !wasActive) { scheduleBlink(mascot,true); scheduleGesture(mascot,true); }
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
