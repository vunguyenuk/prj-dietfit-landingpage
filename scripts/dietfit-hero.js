(function () {
  "use strict";

  const hero = document.querySelector('[data-component-name="scrollable-rive-hero"]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!hero) return;
  function measureHeroInset() {
    if (!document.body.classList.contains('dietfit-home--en')) return;
    const wrap=hero.closest('.dietfit-hero-wrap');
    // The hero has a 20px frame on every side, independently of page type.
    const gutter=wrap?Math.min(20,Math.max(0,(document.documentElement.clientWidth-wrap.getBoundingClientRect().width)/2)):20;
    hero.style.setProperty('--df-hero-gutter',gutter.toFixed(2)+'px');
  }
  measureHeroInset();
  if (motionQuery.matches) {
    window.addEventListener('resize',measureHeroInset,{passive:true});
    return;
  }

  const stage = hero.querySelector('.dietfit-hero-stage');
  const header = document.getElementById('dietfit-header');
  const videoSection = document.querySelector('.dietfit-video-section');
  if (!stage) return;

  // File .riv nhúng sẵn toàn bộ ảnh và font nên không cần preload asset ngoài.
  // Ảnh trong .riv đã được nén lại (PNG -> WebP, giữ nguyên kích thước):
  // ~6.3MB -> ~1.25MB. Nếu export lại từ Rive, nhớ chạy lại bước nén này
  // hoặc bật nén ảnh trong Rive Editor, rồi đổi ?v= bên dưới và trong <head>.
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
  // EN uses a separate US food/UI image set; the original VI exports remain untouched.
  const langSuffix = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0 ? '-foreground-us-en' : '';
  const heroVersion = langSuffix ? '20261022-arm-continuation-1' : '20260918-1';
  const scan = langSuffix && window.createDietfitHeroScan ? window.createDietfitHeroScan(hero) : null;
  const finale = langSuffix && window.createDietfitHeroFinale ? window.createDietfitHeroFinale(hero,stage) : null;
  function currentHeroFile() {
    return compactQuery.matches
      ? 'dietfit-hero-responsive' + langSuffix + '.riv?v=' + heroVersion
      : 'dietfit-hero' + langSuffix + '.riv?v=' + heroVersion;
  }

  // Tải sẵn file .riv ngay lập tức, song song với rive.js và rive.wasm.
  // Trước đây ba thứ này nối đuôi nhau: phải chờ rive.js xong mới biết
  // đường dẫn wasm, chờ wasm compile xong runtime mới đi lấy .riv —
  // mà .riv nặng ~6MB nên nó khởi động rất trễ.
  const heroBuffers = Object.create(null);
  function prefetchHero(file) {
    if (heroBuffers[file]) return heroBuffers[file];
    heroBuffers[file] = fetch(assetRoot + file, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .catch(function () { return null; });  // hỏng thì rơi về src như cũ
    return heroBuffers[file];
  }
  prefetchHero(currentHeroFile());

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
    const startOffset = langSuffix ? parseFloat(hero.style.getPropertyValue('--df-hero-gutter')) || 0 : 188;
    const travel = Math.max(1,langSuffix ? rect.height-stage.clientHeight : rect.height-window.innerHeight+startOffset);
    const rawProgress = rect.top > startOffset
      ? 0
      : Math.min(1, Math.max(0, (startOffset - rect.top) / travel));
    // Mobile/iPad có quãng cuộn ngắn hơn desktop. Curve lũy thừa giữ animation
    // chậm ở đầu và giữa, nhưng vẫn về đúng frame cuối khi hết hero.
    const desiredProgress = compactQuery.matches && !langSuffix
      ? Math.pow(rawProgress, 1.35)
      : rawProgress;
    targetScroll = desiredProgress;
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

  function animateScroll(time) {
    if (scrollValue || scrollAnimation) {
      const distance = targetScroll - renderedScroll;
      const smoothing = compactQuery.matches ? 0.085 : 0.14;
      renderedScroll = langSuffix || Math.abs(distance) < 0.001
        ? targetScroll
        : renderedScroll + distance * smoothing;
      // Keep the scene pinned: capture + Deep Scan first, then a scroll-only finale.
      const beforeFinale = Math.min(1,renderedScroll/.62);
      const nativeProgress = scan ? scan.render(beforeFinale*scan.finaleEntry()) : renderedScroll;
      const chapter = Math.max(0,Math.min(1,(renderedScroll-.62)/.32));
      const riveProgress = finale ? finale.progress(nativeProgress,chapter) : nativeProgress;
      if (scrollAnimation) {
        player.scrub(scrollAnimation, riveProgress * scrollDuration);
      } else {
        scrollValue.value = riveProgress;
      }
    }
    frame = requestAnimationFrame(animateScroll);
  }

  function resize() {
    measureHeroInset();
    if (scan) scan.resize();
    if (finale) finale.resize();
    if (player && player.loaded && player.artboard) {
      player.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
      fitEnglishScene();
    }
    requestScrollUpdate();
  }

  function fitEnglishScene() {
    if (!langSuffix || !player) return;
    // Fit the artboard's height, rather than enlarging it to fill a wide stage.
    // Its original phone already has internal top/bottom space. Keep the hand
    // attached to the scene edge instead of adding a second inset to the canvas.
    // The 700px central safe frame includes the complete native phone. On a
    // narrow screen, constrain that frame too, without shrinking to all 1920px.
    const bounds=stage.getBoundingClientRect();
    const height=Math.max(1,Math.min(bounds.height,(bounds.width-32)*1258/700));
    const ratio=window.devicePixelRatio || 1;
    const inset=(bounds.height-height)/2*ratio;
    player.layout=new window.rive.Layout({
      fit:window.rive.Fit.FitHeight,
      alignment:window.rive.Alignment.Center,
      minX:0,maxX:canvas.width,
      minY:inset,maxY:canvas.height-inset
    });
  }

  // Kéo wasm về ngay khi rive.js sẵn sàng, không đợi file .riv.
  // setWasmUrl() chỉ ghi nhớ đường dẫn — phải gọi awaitInstance() mới
  // thực sự phát request, nếu không nó nằm chờ tới lúc new Rive().
  let wasmReady = null;
  function initWasm() {
    if (wasmReady) return wasmReady;
    const loader = window.rive.RuntimeLoader;
    loader.setWasmUrl('/vendor/rive/rive.wasm');
    wasmReady = typeof loader.awaitInstance === 'function'
      ? loader.awaitInstance().catch(function () { return null; })
      : Promise.resolve(null);
    return wasmReady;
  }

  async function start() {
    const file = currentHeroFile();
    // Chạy song song: compile wasm và tải file .riv.
    const buffer = (await Promise.all([initWasm(), prefetchHero(file)]))[1];
    try {
      player = new window.rive.Rive({
        canvas,
        // Dùng buffer đã tải sẵn; nếu fetch hỏng thì quay về src như cũ.
        buffer: buffer || undefined,
        src: buffer ? undefined : assetRoot + file,
        autoplay: false,
        autoBind: true,
        enableRiveAssetCDN: false,
        isTouchScrollEnabled: true,
        layout: new window.rive.Layout({
          fit: langSuffix ? window.rive.Fit.FitHeight : window.rive.Fit.Cover,
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
          fitEnglishScene();
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
    if (scan) scan.reset();
    if (finale) finale.reset();
    frame = 0;
    scrollValue = null;
    scrollAnimation = null;
    scrollDuration = 0;
    targetScroll = 0;
    renderedScroll = 0;
    hero.classList.remove('rive-ready');
    if (!player) { start(); return; }
    const file = currentHeroFile();
    prefetchHero(file).then(function (buffer) {
      player.load({
        buffer: buffer || undefined,
        src: buffer ? undefined : assetRoot + file,
        autoplay: false,
        autoBind: true,
        enableRiveAssetCDN: false
      });
    });
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
    if (scan) scan.reset();
    if (finale) finale.destroy();
  }, { once: true });

  requestScrollUpdate();
  // Tải rive.js ngay (script async, không chặn paint) để wasm được khởi
  // động sớm nhất có thể. Chỉ hoãn phần compile + parse file .riv sang
  // sau 2 frame, cho HTML/CSS kịp vẽ xong trước.
  const runtimeReady = loadRuntime().then(initWasm);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      runtimeReady.then(start).catch(function (error) {
        console.error('Offline Dietfit hero runtime failed to load', error);
      });
    });
  });
})();
