(function () {
  "use strict";

  const hero = document.querySelector('[data-component-name="scrollable-rive-hero"]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!hero || !window.rive || motionQuery.matches) return;

  const stage = hero.querySelector('.dietfit-hero-stage');
  const header = document.getElementById('dietfit-header');
  const videoSection = document.querySelector('.dietfit-video-section');
  if (!stage) return;

  // File .riv nhúng sẵn toàn bộ ảnh và font nên không cần preload asset ngoài.
  const assetRoot = '/assets/hero/';

  // iPad + mobile (<= 1024px) dùng bản dựng riêng; desktop giữ bản gốc.
  // Chỉ nạp đúng một file để không tải thừa ~5.8MB.
  const compactQuery = window.matchMedia('(max-width: 1024px)');
  function currentHeroFile() {
    return compactQuery.matches
      ? 'dietfit-hero-responsive.riv?v=20260808-2'
      : 'dietfit-hero.riv?v=20260808-3';
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'dietfit-rive-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);

  window.rive.RuntimeLoader.setWasmUrl('/vendor/rive/rive.wasm');

  let scrollValue = null;
  let frame = 0;
  let player = null;
  let scrollAnimation = null;
  let scrollDuration = 0;
  let targetScroll = 0;
  let renderedScroll = 0;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  function updateScroll() {
    if (!player || (!scrollValue && !scrollAnimation)) return;

    const rect = hero.getBoundingClientRect();
    const startOffset = 188;
    const travel = Math.max(1, rect.height - window.innerHeight + startOffset);
    targetScroll = rect.top > startOffset
      ? 0
      : Math.min(1, Math.max(0, (startOffset - rect.top) / travel));
  }

  function updateHeroExpansion() {
    const rect = hero.getBoundingClientRect();
    const pageTop = rect.top + window.scrollY;
    const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, pageTop)));
    const remaining = 1 - progress;
    hero.style.setProperty('--hero-edge-inset', (32 * remaining).toFixed(2) + 'px');
    hero.style.setProperty('--hero-corner-radius', (48 * remaining).toFixed(2) + 'px');
  }

  function requestScrollUpdate() {
    if (header) {
      const isBeforeVideo = !videoSection || videoSection.getBoundingClientRect().top > 120;
      header.classList.toggle('is-split', window.scrollY > 120 && isBeforeVideo);
    }
    updateHeroExpansion();
    updateScroll();
  }

  function animateScroll() {
    if (scrollValue || scrollAnimation) {
      const distance = targetScroll - renderedScroll;
      renderedScroll = Math.abs(distance) < 0.001
        ? targetScroll
        : renderedScroll + distance * 0.14;
      if (scrollAnimation) {
        player.scrub(scrollAnimation, renderedScroll * scrollDuration);
      } else {
        scrollValue.value = renderedScroll;
      }
    }
    frame = requestAnimationFrame(animateScroll);
  }

  function resize() {
    if (player && player.loaded && player.artboard) {
      player.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
    }
    requestScrollUpdate();
  }

  async function start() {
    try {
      player = new window.rive.Rive({
        canvas,
        src: assetRoot + currentHeroFile(),
        autoplay: false,
        autoBind: true,
        enableRiveAssetCDN: false,
        isTouchScrollEnabled: true,
        layout: new window.rive.Layout({
          fit: window.rive.Fit.Cover,
          alignment: window.rive.Alignment.Center
        }),
        onLoad: function () {
          const stateMachine = player.stateMachineNames[0];
          const timeline = player.animator.animations.find(function (animation) {
            return animation.name === 'Timeline 1';
          });
          const vm = player.viewModelInstance;
          scrollValue = vm ? vm.number('scrollPercentage') : null;
          if (!scrollValue && stateMachine) {
            const inputs = player.stateMachineInputs(stateMachine) || [];
            scrollValue = inputs.find(function (input) {
              return /scroll/i.test(input.name) && 'value' in input;
            }) || null;
          }
          if (!scrollValue && timeline) {
            scrollAnimation = timeline.name;
            const animation = timeline.animation;
            const endFrame = animation.enableWorkArea ? animation.workEnd : animation.duration;
            scrollDuration = endFrame / animation.fps;
            player.pause(scrollAnimation);
            player.scrub(scrollAnimation, 0);
          }
          player.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
          if (isMobile && vm) {
            const mobileTrigger = vm.trigger('startMobile');
            if (mobileTrigger) mobileTrigger.trigger();
          }
          hero.classList.add('rive-ready');
          updateScroll();
          frame = requestAnimationFrame(animateScroll);
        },
        onLoadError: function (event) {
          console.error('Offline Dietfit hero failed to load', event);
          hero.classList.remove('rive-ready');
        }
      });
    } catch (error) {
      console.error('Offline Dietfit hero assets failed to load', error);
      hero.classList.remove('rive-ready');
    }
  }

  // Đổi qua/lại ngưỡng 1024px (xoay iPad, kéo cửa sổ) thì nạp lại đúng bản.
  function swapHeroFile() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (player) player.cleanup();
    player = null;
    scrollValue = null;
    scrollAnimation = null;
    scrollDuration = 0;
    renderedScroll = 0;
    hero.classList.remove('rive-ready');
    start();
  }
  if (typeof compactQuery.addEventListener === 'function') {
    compactQuery.addEventListener('change', swapHeroFile);
  } else if (typeof compactQuery.addListener === 'function') {
    compactQuery.addListener(swapHeroFile);
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pagehide', function () {
    if (frame) cancelAnimationFrame(frame);
    if (player) player.cleanup();
  }, { once: true });

  requestScrollUpdate();
  start();
})();
