/* Reuse Home's real product recording; respect visibility and reduced motion. */
(function () {
  'use strict';
  var stage = document.querySelector('[data-dietfit-about-deepscan]');
  if (!stage) return;
  var video = stage.querySelector('video');
  var button = stage.querySelector('button');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var visible = false;
  var pausedByUser = false;
  var manualPlay = false;
  var vi = document.documentElement.lang.toLowerCase().startsWith('vi');
  video.muted = true;
  function label() {
    var playing = !video.paused;
    button.textContent = playing ? (vi ? 'Tạm dừng' : 'Pause demo') : (vi ? 'Xem demo' : 'Play demo');
    button.setAttribute('aria-label', playing ? 'Pause Deep Scan demo' : 'Play Deep Scan demo');
    button.setAttribute('aria-pressed', String(playing));
  }
  function update() {
    if (visible && !document.hidden && !pausedByUser && (!reduce.matches || manualPlay)) {
      video.play().catch(label);
    } else video.pause();
    label();
  }
  button.addEventListener('click', function () {
    if (video.paused) { pausedByUser = false; manualPlay = true; }
    else { pausedByUser = true; manualPlay = false; }
    update();
  });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  document.addEventListener('visibilitychange', update);
  reduce.addEventListener('change', update);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    update();
  }, {threshold: .2}).observe(stage);
  else { visible = true; update(); }
  label();
})();
