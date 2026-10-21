(function () {
  "use strict";

  if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const english = document.body.classList.contains('dietfit-home--en');
  window.dietfitLenis = new window.Lenis({
    autoRaf: true,
    smoothWheel: true,
    lerp: 0.13,
    wheelMultiplier: 1.05,
    anchors: !english,
    allowNestedScroll: true
  });
  // Fragment navigation moves the native viewport immediately. Cancel the
  // previous wheel target so the next gesture starts at that new position.
  if (english) {
    window.addEventListener('hashchange',function () { window.dietfitLenis.reset(); });
    window.addEventListener('pageshow',function () { window.dietfitLenis.resize(); window.dietfitLenis.reset(); });
  }
})();
