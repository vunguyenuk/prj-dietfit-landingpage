(function () {
  "use strict";

  const hero = document.querySelector('[data-component-name="scrollable-rive-hero"]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!hero || motionQuery.matches) return;

  const stage = hero.querySelector('.dietfit-hero-stage');
  const header = document.getElementById('dietfit-header');
  const videoSection = document.querySelector('.dietfit-video-section');
  if (!stage) return;

  // File .riv nhúng sẵn toàn bộ ảnh và font nên không cần preload asset ngoài.
  const assetRoot = '/assets/hero/';
  let runtimePromise = null;

  function loadRuntime() {
    if (window.rive) return Promise.resolve();
    if (runtimePromise) return runtimePromise;
    runtimePromise = new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = '/vendor/rive/rive.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Không tải được Rive runtime')); };
      document.head.appendChild(script);
    });
    return runtimePromise;
  }

  // iPad + mobile (<= 1024px) dùng bản dựng riêng; desktop giữ bản gốc.
  // Chỉ nạp đúng một file để không tải thừa ~5.8MB.
  const compactQuery = window.matchMedia('(max-width: 1024px)');
  function currentHeroFile() {
    return compactQuery.matches
      ? 'dietfit-hero-responsive.riv?v=20260812-1'
      : 'dietfit-hero.riv?v=20260811-1';
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'dietfit-rive-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);

  let scrollValue = null;
  let frame = 0;
  let player = null;
  let scrollAnimation = null;
  let scrollDuration = 0;
  let targetScroll = 0;
  let renderedScroll = 0;

  function updateScroll() {
    if (!player || (!scrollValue && !scrollAnimation)) return;

    const rect = hero.getBoundingClientRect();
    const startOffset = 188;
    const travel = Math.max(1, rect.height - window.innerHeight + startOffset);
    const rawProgress = rect.top > startOffset
      ? 0
      : Math.min(1, Math.max(0, (startOffset - rect.top) / travel));
    // Mobile/iPad có quãng cuộn ngắn hơn desktop. Curve lũy thừa giữ animation
    // chậm ở đầu và giữa, nhưng vẫn về đúng frame cuối khi hết hero.
    targetScroll = compactQuery.matches
      ? Math.pow(rawProgress, 1.35)
      : rawProgress;
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
      const smoothing = compactQuery.matches ? 0.085 : 0.14;
      renderedScroll = Math.abs(distance) < 0.001
        ? targetScroll
        : renderedScroll + distance * smoothing;
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
    window.rive.RuntimeLoader.setWasmUrl('/vendor/rive/rive.wasm');
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
          const animations = player.animator.animations || [];
          const timeline = animations.find(function (animation) {
            return animation.name === 'Timeline 1';
          }) || animations[0];
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
          if (scrollValue && stateMachine) {
            player.play(stateMachine);
          }
          player.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
          if (compactQuery.matches && vm) {
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
    if (!window.rive) return;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    scrollValue = null;
    scrollAnimation = null;
    scrollDuration = 0;
    targetScroll = 0;
    renderedScroll = 0;
    hero.classList.remove('rive-ready');
    if (player) {
      player.load({
        src: assetRoot + currentHeroFile(),
        autoplay: false,
        autoBind: true,
        enableRiveAssetCDN: false
      });
    } else {
      start();
    }
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
  // Paint HTML/CSS trước khi compile WASM và parse file Rive lớn.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      loadRuntime().then(start).catch(function (error) {
        console.error('Offline Dietfit hero runtime failed to load', error);
      });
    });
  });
})();
