(function () {
  'use strict';
  const section = document.querySelector('.df-integrations');
  if (!section) return;
  const setup = section.querySelector('#dietfit-sync-setup');
  const setupLink = section.querySelector('a[href="#dietfit-sync-setup"]');
  if (setup && setupLink) setupLink.addEventListener('click', function () { setup.open = true; });
  const scene = section.querySelector('.df-integrations__scene');
  const hub = section.querySelector('.df-integrations__hub');
  if (!scene || !hub || !('IntersectionObserver' in window) || !scene.animate) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const apps = Array.from(scene.querySelectorAll('.df-integrations__app'));
  const animations = new Set();
  let visible = false;
  let started = false;
  let complete = false;
  let generation = 0;
  const limit = function (n, low, high) { return Math.max(low, Math.min(high,n)); };
  const point = function (rect) { return { x:rect.left + rect.width / 2, y:rect.top + rect.height / 2 }; };
  const shift = function (x,y,scale) { return 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) scale(' + scale + ')'; };
  const eligible = function () { return !reduced.matches && window.innerWidth > 700 && window.innerHeight >= 480; };

  function settle() {
    generation++;
    complete = true;
    animations.forEach(function (animation) { animation.cancel(); });
    animations.clear();
    section.classList.remove('is-delivery-ready');
    apps.forEach(function (app) { app.classList.add('is-placed'); app.classList.remove('is-being-carried'); });
  }
  function sync() {
    const active = visible && !document.hidden && !reduced.matches;
    section.classList.toggle('is-active',active);
    animations.forEach(function (animation) { if (active) animation.play(); else animation.pause(); });
  }
  function animate(element, frames, delay) {
    const animation = element.animate(frames, {
      duration:2250, delay:delay || 0, fill:'both', easing:'linear'
    });
    animations.add(animation);
    if (!visible || document.hidden) animation.pause();
    return animation;
  }
  async function deliver(app, porter, side, token, delay) {
    if (token !== generation) return;
    const tile = app.querySelector('.df-integrations__tile');
    const origin = point(hub.getBoundingClientRect());
    const rest = point(tile.getBoundingClientRect());
    const actor = porter.getBoundingClientRect();
    const bounds = scene.getBoundingClientRect();
    const hubRect = hub.getBoundingClientRect();
    // The hand anchors use the original writing/waving poses, without redrawing them.
    const handX = actor.width * (side < 0 ? .60 : .23);
    const handY = actor.height * (side < 0 ? .63 : .48);
    const home = { x:actor.left + handX, y:actor.top + handY };
    const pickup = { x:origin.x + side * (hubRect.width / 2 + 34), y:origin.y + 18 };
    // Keep feet inside the scene; the final short lift places high cards above the hands.
    const placing = {
      x:limit(rest.x,bounds.left + handX + 8,bounds.right - actor.width + handX - 8),
      y:limit(rest.y,bounds.top + handY + 8,bounds.bottom - actor.height + handY - 8)
    };
    const middle = { x:(pickup.x + placing.x) / 2, y:(pickup.y + placing.y) / 2 - 18 };
    const ease = 'cubic-bezier(.45,0,.2,1)';
    const actorAt = function (p,offset,easing) {
      return { transform:shift(p.x - home.x,p.y - home.y,1), offset:offset, easing:easing || ease };
    };
    const cardAt = function (p,offset,scale,opacity,easing) {
      return { transform:shift(p.x - rest.x,p.y - rest.y,scale), opacity:opacity, offset:offset, easing:easing || ease };
    };
    app.classList.add('is-being-carried');
    const movement = animate(porter,[
      actorAt(home,0), actorAt(pickup,.24), actorAt(pickup,.34,'cubic-bezier(.4,0,.7,.7)'),
      actorAt(middle,.50,'cubic-bezier(.3,.3,.6,1)'), actorAt(placing,.66), actorAt(placing,.78), actorAt(home,1)
    ],delay);
    const carrying = animate(tile,[
      cardAt(origin,0,.62,0), cardAt(origin,.18,.62,0),
      cardAt(pickup,.24,1,1), cardAt(pickup,.34,1,1,'cubic-bezier(.4,0,.7,.7)'),
      cardAt(middle,.50,1,1,'cubic-bezier(.3,.3,.6,1)'), cardAt(placing,.66,1,1),
      cardAt(rest,.78,1,1), cardAt(rest,1,1,1)
    ],delay);
    try {
      await Promise.all([movement.finished,carrying.finished]);
      if (token !== generation) return;
      app.classList.add('is-placed');
      app.classList.remove('is-being-carried');
      // Releasing fill restores native links and the independent hover animation.
      movement.cancel(); carrying.cancel();
      animations.delete(movement); animations.delete(carrying);
    } catch (_) { /* Resize, focus or a motion preference change reveals the final layout. */ }
  }
  async function assemble() {
    if (started || complete || !eligible()) return;
    started = true;
    const token = generation;
    // Ensure the actual mascot and official icon artwork are ready before the pickup.
    await Promise.all(Array.from(scene.querySelectorAll('img')).map(function (img) {
      img.loading = 'eager';
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    }));
    if (token !== generation || !eligible()) return;
    const jobs = [
      { side:-1, names:['garmin','oura','polar','withings'], porter:scene.querySelector('.df-integrations__porter--left') },
      { side:1, names:['whoop','google-health','vesync','strava'], porter:scene.querySelector('.df-integrations__porter--right') }
    ];
    try {
      await Promise.all(jobs.map(async function (job) {
        if (!job.porter) return;
        for (let i = 0; i < job.names.length; i++) {
          if (token !== generation) return;
          const app = scene.querySelector('.df-integrations__app--' + job.names[i]);
          if (app) await deliver(app,job.porter,job.side,token,i === 0 && job.side > 0 ? 140 : 0);
        }
      }));
      if (token === generation) settle();
    } catch (_) { if (token === generation) settle(); }
  }
  if (eligible()) section.classList.add('is-delivery-ready');
  else complete = true;
  new IntersectionObserver(function (entries) {
    const entry = entries[0];
    visible = entry.isIntersecting;
    sync();
    if (visible && entry.intersectionRatio >= .5) assemble();
  }, { threshold:[0,.25,.5,.75,1] }).observe(scene);
  // Keyboard navigation never waits for the decorative scene to finish.
  scene.addEventListener('focusin',function (event) {
    if (event.target.closest('.df-integrations__tile')) settle();
  });
  window.addEventListener('resize',function () { settle(); },{ passive:true });
  reduced.addEventListener('change',function () { settle(); sync(); });
  document.addEventListener('visibilitychange',sync);
}());
