(function () {
  'use strict';
  const section = document.querySelector('.df-integrations');
  if (!section) return;
  const scene = section.querySelector('.df-integrations__scene');
  const hub = section.querySelector('.df-integrations__hub');
  if (!scene || !hub || !('IntersectionObserver' in window) || !scene.animate) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const apps = Array.from(scene.querySelectorAll('.df-integrations__app'));
  const porters = Array.from(scene.querySelectorAll('.df-integrations__porter'));
  const animations = new Set();
  let visible = false;
  let startVisible = false;
  let started = false;
  let complete = false;
  let focusLocked = false;
  let generation = 0;
  const limit = function (n, low, high) { return Math.max(low,Math.min(high,n)); };
  const shift = function (x,y,scale) { return 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) scale(' + scale + ')'; };
  const cell = function (index) { return 'translate(' + (index % 4 * -25) + '%,' + (Math.floor(index / 4) * -25) + '%)'; };
  const eligible = function () { return !reduced.matches && window.innerWidth > 700 && window.innerHeight >= 480; };
  const ease = 'cubic-bezier(.4,0,.25,1)';

  function settle() {
    generation++;
    complete = true;
    started = false;
    animations.forEach(function (animation) { animation.cancel(); });
    animations.clear();
    section.classList.remove('is-delivery-ready');
    apps.forEach(function (app) {
      app.classList.add('is-placed'); app.classList.remove('is-being-carried');
      const tile = app.querySelector('.df-integrations__tile');
      tile.style.transform = ''; tile.style.opacity = '';
    });
    porters.forEach(function (porter) {
      porter.style.transform = ''; porter.classList.remove('is-working');
      porter.classList.add('is-resting');
      porter.classList.toggle('is-writing',!!porter.querySelector('.df-integrations__notetaker'));
      porter.querySelector('.df-integrations__facing').style.transform = '';
      porter.querySelector('.df-integrations__atlas').style.transform = cell(0);
    });
  }
  function sync() {
    const active = visible && !document.hidden && !reduced.matches;
    section.classList.toggle('is-active',active);
    animations.forEach(function (animation) { if (active) animation.play(); else animation.pause(); });
  }
  function animate(element, frames, options) {
    const animation = element.animate(frames,Object.assign({ fill:'both',easing:ease },options));
    animations.add(animation);
    animation.finished.catch(function () {});
    if (!visible || document.hidden) animation.pause();
    return animation;
  }
  async function tween(element,frames,duration,token,options) {
    if (token !== generation) throw new Error('Scene settled');
    const animation = animate(element,frames,Object.assign({ duration:duration },options));
    try {
      await animation.finished;
      if (token !== generation) throw new Error('Scene settled');
      const last = frames[frames.length - 1];
      if (last.transform !== undefined) element.style.transform = last.transform;
      if (last.opacity !== undefined) element.style.opacity = last.opacity;
    } finally { animations.delete(animation); animation.cancel(); }
  }
  function pose(rig,frames,duration,token) {
    return tween(rig.atlas,frames.concat(frames[frames.length - 1]).map(function (index) { return { transform:cell(index),easing:'steps(1,end)' }; }),duration,token,{ easing:'linear' });
  }
  function hand(rig,position,direction) {
    return { x:rig.home.x + position.x + rig.size * (direction > 0 ? .78 : .22), y:rig.home.y + position.y + rig.size * .61 };
  }
  function cardFrame(card,point,scale,opacity) {
    return { transform:shift(point.x - card.rest.x,point.y - card.rest.y,scale),opacity:opacity };
  }
  async function turn(rig,direction,card,token) {
    if (rig.direction === direction) return;
    const point = hand(rig,rig.position,direction);
    const movingCard = card ? tween(card.tile,[cardFrame(card,card.point,.66,1),cardFrame(card,point,.66,1)],240,token) : Promise.resolve();
    // Quarter view -> front -> opposite quarter view: the artwork actually changes pose.
    await Promise.all([(async function () {
      await pose(rig,[1,0],120,token);
      rig.direction = direction;
      rig.facing.style.transform = 'scaleX(' + direction + ')';
      await pose(rig,[0,1],120,token);
    }()),movingCard]);
    if (card) card.point = point;
  }
  async function walk(rig,to,card,token) {
    const dx = to.x - rig.position.x,dy = to.y - rig.position.y;
    if (Math.hypot(dx,dy) < 2) return;
    await turn(rig,dx >= 0 ? 1 : -1,card,token);
    const duration = limit(Math.hypot(dx,dy) / (card ? .21 : .26),520,1600);
    const frames = card ? [8,9,10,11] : [2,3,4,5];
    const gait = animate(rig.atlas,frames.concat(frames[0]).map(function (index) { return { transform:cell(index),easing:'steps(1,end)' }; }),{ duration:400,iterations:Infinity,easing:'linear' });
    const jobs = [tween(rig.porter,[{transform:shift(rig.position.x,rig.position.y,1)},{transform:shift(to.x,to.y,1)}],duration,token)];
    const destination = hand(rig,to,rig.direction);
    if (card) jobs.push(tween(card.tile,[cardFrame(card,card.point,.66,1),cardFrame(card,destination,.66,1)],duration,token));
    try {
      await Promise.all(jobs);
      rig.position = to;
      if (card) card.point = destination;
    } finally {
      animations.delete(gait); gait.cancel();
      if (token === generation) rig.atlas.style.transform = cell(card ? 7 : 1);
    }
  }
  async function deliver(app,rig,side,token) {
    if (token !== generation) return;
    const bounds = scene.getBoundingClientRect(),hubRect = hub.getBoundingClientRect();
    const tile = app.querySelector('.df-integrations__tile'),tileRect = tile.getBoundingClientRect();
    const origin = { x:hubRect.left - bounds.left + hubRect.width / 2,y:hubRect.top - bounds.top + hubRect.height / 2 };
    const rest = { x:tileRect.left - bounds.left + tileRect.width / 2,y:tileRect.top - bounds.top + tileRect.height / 2 };
    const pickup = { x:origin.x + side * (hubRect.width / 2 + 42),y:origin.y + 30 };
    const pickupDir = -side;
    const pickupRoot = {
      x:pickup.x - rig.home.x - rig.size * (pickupDir > 0 ? .78 : .22),
      y:pickup.y - rig.home.y - rig.size * .61
    };
    // On later rounds only recall the next app; the rest of the grid stays readable.
    if (app.classList.contains('is-placed')) {
      await tween(tile,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.94)'}],220,token);
      app.classList.remove('is-placed');
      tile.style.transform = ''; tile.style.opacity = '';
    }
    app.classList.add('is-being-carried');
    rig.porter.classList.add('is-working');
    await walk(rig,pickupRoot,null,token);
    await turn(rig,pickupDir,null,token);
    const card = { tile:tile,rest:rest,point:hand(rig,rig.position,rig.direction) };
    await Promise.all([
      pose(rig,[1,6,6,7],420,token),
      tween(tile,[cardFrame(card,origin,.5,0),cardFrame(card,origin,.5,0),cardFrame(card,card.point,.66,1)],420,token)
    ]);
    const carryingDir = rest.x >= card.point.x ? 1 : -1;
    await turn(rig,carryingDir,card,token);
    // Feet follow a straight ground path; no upward hop or floating arc.
    const placingRoot = {
      x:limit(rest.x - rig.size * (carryingDir > 0 ? .78 : .22),8,bounds.width - rig.size - 8) - rig.home.x,
      y:limit(rest.y - rig.size * .61,8,bounds.height - rig.size - 8) - rig.home.y
    };
    await walk(rig,placingRoot,card,token);
    const reached = rest.y < card.point.y ? {x:rest.x,y:Math.max(rest.y,card.point.y - rig.size * .26)} : card.point;
    await Promise.all([
      pose(rig,[7,12,12,13,1],440,token),
      tween(tile,[cardFrame(card,card.point,.66,1),cardFrame(card,reached,.8,1),cardFrame(card,rest,1,1),cardFrame(card,rest,1,1)],440,token)
    ]);
    app.classList.add('is-placed'); app.classList.remove('is-being-carried');
    tile.style.transform = ''; tile.style.opacity = '';
    await walk(rig,{x:0,y:0},null,token);
    await pose(rig,[1,0],180,token);
    rig.facing.style.transform = ''; rig.direction = 1;
    rig.porter.classList.remove('is-working');
  }
  async function assemble() {
    if (started || !eligible() || !startVisible || document.hidden || focusLocked) return;
    started = true;
    const token = generation;
    try {
      await Promise.all(Array.from(scene.querySelectorAll('img')).map(function (img) {
        img.loading = 'eager';
        return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      }));
      if (token !== generation || !eligible()) return;
      // The idle hold uses the same pauseable animation clock as walking.
      // No background timeout can launch another round while offscreen.
      if (complete) await tween(scene,[{},{}],3500,token);
      while (token === generation && eligible() && !focusLocked) {
        complete = false;
        section.classList.add('is-delivery-ready');
        porters.forEach(function (porter) {
          porter.classList.remove('is-resting','is-writing');
        });
        const bounds = scene.getBoundingClientRect();
        const jobs = [
          {side:-1,names:['garmin','oura','polar','withings'],porter:porters[0]},
          {side:1,names:['whoop','google-health','vesync','strava','apple-health'],porter:porters[1]}
        ];
        await Promise.all(jobs.map(async function (job) {
          const rect = job.porter.getBoundingClientRect();
          const rig = { porter:job.porter,atlas:job.porter.querySelector('.df-integrations__atlas'),facing:job.porter.querySelector('.df-integrations__facing'),home:{x:rect.left - bounds.left,y:rect.top - bounds.top},size:rect.width,position:{x:0,y:0},direction:1 };
          for (const name of job.names) {
            if (token !== generation) return;
            await deliver(scene.querySelector('.df-integrations__app--' + name),rig,job.side,token);
          }
          if (token === generation) {
            job.porter.classList.add('is-resting');
            job.porter.classList.toggle('is-writing',!!job.porter.querySelector('.df-integrations__notetaker'));
          }
        }));
        if (token !== generation) return;
        complete = true;
        section.classList.remove('is-delivery-ready');
        await tween(scene,[{},{}],3500,token);
      }
    } catch (_) { if (token === generation) settle(); }
    finally { if (token === generation) started = false; }
  }
  if (eligible()) section.classList.add('is-delivery-ready');
  else settle();
  new IntersectionObserver(function (entries) {
    const entry = entries[0]; visible = entry.isIntersecting;
    startVisible = visible && entry.intersectionRatio >= .5; sync();
    if (startVisible) assemble();
  },{threshold:[0,.25,.5,.75,1]}).observe(scene);
  scene.addEventListener('focusin',function (event) {
    if (event.target.closest('.df-integrations__tile')) { focusLocked = true; settle(); }
  });
  scene.addEventListener('focusout',function (event) {
    if (!scene.contains(event.relatedTarget)) { focusLocked = false; assemble(); }
  });
  window.addEventListener('resize',function () { settle(); sync(); assemble(); },{passive:true});
  reduced.addEventListener('change',function () { settle(); sync(); assemble(); });
  document.addEventListener('visibilitychange',function () { sync(); if (!document.hidden) assemble(); });
  window.addEventListener('pagehide',settle);
  window.addEventListener('pageshow',function () { sync(); assemble(); });
}());
