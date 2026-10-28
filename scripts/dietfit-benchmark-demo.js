/* Restore the original Benchmark recording in its centered phone stage. */
function initBenchmarkDemo() {
  'use strict';
  var stage = document.querySelector('[data-bm-scan-demo]');
  if (!stage) return;
  var video = stage.querySelector('video');
  var button = stage.querySelector('button');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var visible = false;
  var pausedByUser = false;
  var manualPlay = false;
  video.muted = true;
  function label() {
    var playing = !video.paused;
    button.dataset.playing = String(playing);
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
}
if (document.readyState === 'complete') requestAnimationFrame(initBenchmarkDemo);
else window.addEventListener('load', function () { requestAnimationFrame(initBenchmarkDemo); }, {once: true});
