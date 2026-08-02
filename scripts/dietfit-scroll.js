(function () {
  "use strict";

  if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.dietfitLenis = new window.Lenis({
    autoRaf: true,
    smoothWheel: true,
    lerp: 0.13,
    wheelMultiplier: 1.05,
    anchors: true,
    allowNestedScroll: true
  });
})();
