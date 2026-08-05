(function () {
  "use strict";

  const hero = document.querySelector('[data-component-name="scrollable-rive-hero"]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!hero || !window.rive || motionQuery.matches) return;

  const stage = hero.querySelector('.dietfit-hero-stage');
  const header = document.getElementById('dietfit-header');
  const videoSection = document.querySelector('.dietfit-video-section');
  if (!stage) return;

  const assetRoot = '/assets/hero/';
  const assetSources = {
    inter: assetRoot + 'bff0f6e3b9e2259a28313168a907054f.txt',
    heroasset_1: assetRoot + 'ad9536303478b7126f20e371cd998445.jpg',
    heroasset_2: assetRoot + '4927bd057535a60b87de1efcac95c895.jpg',
    heroasset_3: assetRoot + '24a38289c26e19de9c0fdf67116f1a01.jpg',
    heroasset_4: assetRoot + '975e350b591dc9c9156c447e12f4671b.png',
    heroasset_5: assetRoot + 'c3a9024966e70e49910bd3f7604ce975.jpg',
    heroasset_6: assetRoot + '010a0ce0f4505d9d1a19b35d6bf192c5.jpg',
    heroasset_7: assetRoot + 'db45fc5a0a9d802bd62fd87a330f3e15.jpg',
    heroasset_8: assetRoot + '0f80ed7aa9841e08ee7045629b02e248.png',
    heroasset_9: assetRoot + '01fbb81ae805fb4f9790fd60ccb964a1.png',
    heroasset_10: assetRoot + '21669082f92e15c501928e936f288cd7.png',
    heroasset_11: assetRoot + 'ad8ed71c34acc0dd1f81513c73562975.png',
    heroasset_12: assetRoot + 'cd66a5cbfa92a14075b616037ce09eaa.png',
    heroasset_13: assetRoot + '6c21ab6ab49e64c9a6d28663af3e048b.png',
    heroasset_14: assetRoot + 'de1470288624f6ac0b71218dffc5fc97.png',
    heroasset_15: assetRoot + 'd66fc5c4ecf11fd3e2510041fe1f5f16.png',
    heroasset_16: assetRoot + 'd4b03feafc4a13423e2af19a36694410.png',
    heroasset_17: assetRoot + '5f21f75660c5a859f03b6612b0ef49db.png',
    heroasset_18: assetRoot + 'f79ca275076eb7b61801da2f36aead47.jpg',
    heroasset_19: assetRoot + '12c776d1314d7e8f7209d51ae57b9a9a.png',
    heroasset_20: assetRoot + '9fc178d3cbed859e122673022f465807.png',
    heroasset_21: assetRoot + '8471263fc4638cd724e2017b7cfc3f91.png',
    heroasset_22: assetRoot + '1ce1d8a84fcee2ed5ca5efcc30dc644a.png',
    heroasset_23: assetRoot + '56a41fbfce1c4799cf7b0e860965fa14.png',
    heroasset_24: assetRoot + '7748b1ae6c67a78964463c156464cae6.png',
    heroasset_25: assetRoot + 'bfe53a8cf51140b08e43a237de713e18.png',
    heroasset_26: assetRoot + '4fb53c4ffb9a878458f682ec50ae3f5b.jpg'
  };

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
  const decodedAssets = new Map();

  function normalizeAssetName(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/\.(svg|json|png|psd|jpe?g|ttf|otf|txt)$/i, '')
      .replace(/[\s._-]+/g, '-');
  }

  async function preloadAssets() {
    await Promise.all(Object.entries(assetSources).map(async function ([name, url]) {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Unable to load hero asset: ' + url);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const decoded = name === 'inter'
        ? await window.rive.decodeFont(bytes)
        : await window.rive.decodeImage(bytes);
      const item = { decoded, isFont: name === 'inter' };
      const filename = url.split('/').pop();
      decodedAssets.set(normalizeAssetName(name), item);
      decodedAssets.set(normalizeAssetName(filename), item);
    }));
  }

  function loadRiveAsset(asset) {
    if (!asset) return false;
    const candidates = [asset.name, asset.uniqueFilename, asset.cdnUuid]
      .map(normalizeAssetName)
      .filter(Boolean);
    const item = candidates.map(function (key) {
      return decodedAssets.get(key);
    }).find(Boolean);
    if (!item) {
      console.warn('Missing local Rive asset:', asset.name);
      return false;
    }

    if (item.isFont) asset.setFont(item.decoded);
    else asset.setRenderImage(item.decoded);
    return true;
  }

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
        src: assetRoot + 'dietfit-hero.riv?v=20260805-4',
        autoplay: false,
        autoBind: true,
        enableRiveAssetCDN: false,
        assetLoader: loadRiveAsset,
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

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pagehide', function () {
    if (frame) cancelAnimationFrame(frame);
    if (player) player.cleanup();
    decodedAssets.forEach(function (item) { item.decoded.unref(); });
    decodedAssets.clear();
  }, { once: true });

  requestScrollUpdate();
  preloadAssets().then(start).catch(function (error) {
    console.error('Local Dietfit hero assets failed to preload', error);
    hero.classList.remove('rive-ready');
  });
})();
