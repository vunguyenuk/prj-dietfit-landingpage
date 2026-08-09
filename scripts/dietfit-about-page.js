/* ============================================================
   Dietfit — About
   Các hiệu ứng scroll dành riêng cho trang giới thiệu.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Lenis smooth scroll ---------- */
  var lenis = null;
  function initLenis() {
    if (reduceMotion || typeof window.Lenis !== 'function') return;
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ---------- 2. Parallax cụm ảnh món ăn ----------
     rate    = px dịch chuyển / px cuộn
     anchorRel = vị trí cuộn (so với top của container) mà offset = 0
     Cả hai đo trực tiếp từ scroll-states.json của bản gốc.              */
  var PARALLAX_CONTAINER = '.framer-140uym6';
  var PARALLAX = [
    { sel: '.framer-z069z4', rate: -0.016987, anchorRel: -1268.6, baseX: '-50%' }, // Image 2
    { sel: '.framer-1lii50d', rate: 0.027600, anchorRel: -1706.2, baseX: '0px' },  // Image big
    { sel: '.framer-kh1yq3', rate: -0.076662, anchorRel: -1777.6, baseX: '-50%' }, // Image 1
    { sel: '.framer-18fr05x', rate: -0.133333, anchorRel: -1291.2, baseX: '0px' }, // Image 4
    { sel: '.framer-1wlxabj', rate: -0.266667, anchorRel: -1291.2, baseX: '0px' }  // Image 3
  ];

  // toạ độ document theo layout (miễn nhiễm với transform)
  function layoutTop(el) {
    var y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }

  var parallaxItems = [];
  function measureParallax() {
    parallaxItems = [];
    if (reduceMotion) return;
    var container = document.querySelector(PARALLAX_CONTAINER);
    if (!container) return;
    var top = layoutTop(container);
    PARALLAX.forEach(function (p) {
      var el = document.querySelector(p.sel);
      if (!el) return;
      parallaxItems.push({
        el: el, rate: p.rate, baseX: p.baseX, anchor: top + p.anchorRel
      });
    });
  }
  function renderParallax(y) {
    for (var i = 0; i < parallaxItems.length; i++) {
      var it = parallaxItems[i];
      var ty = it.rate * (y - it.anchor);
      it.el.style.transform = 'translate(' + it.baseX + ', ' + ty.toFixed(2) + 'px)';
    }
  }

  /* ---------- 4. Footer reveal: đẩy footer lên -200px rồi về 0 ---------- */
  var footer = null, footerStart = 0, footerEnd = 0;
  function measureFooter() {
    footer = document.querySelector('.framer-hyu1hp');
    if (!footer || reduceMotion) { footer = null; return; }
    var vh = window.innerHeight;
    footerStart = layoutTop(footer) - vh + 30;              // footer vừa lộ ở đáy viewport
    footerEnd = document.documentElement.scrollHeight - vh; // cuộn hết trang
    if (footerEnd <= footerStart) footerEnd = footerStart + 1;
  }
  function renderFooter(y) {
    if (!footer) return;
    var p = Math.min(1, Math.max(0, (y - footerStart) / (footerEnd - footerStart)));
    footer.style.transform = 'translateY(' + (-200 * (1 - p)).toFixed(2) + 'px)';
  }

  /* ---------- 5. Scroll reveal ---------- */
  function initReveal() {
    var targets = [];
    // các block Framer vốn có appear animation
    document.querySelectorAll('[data-framer-appear-id]').forEach(function (el) {
      if (!el.closest('nav')) targets.push(el);
    });
    // tiêu đề + ảnh của từng section
    document.querySelectorAll('main section').forEach(function (s) {
      targets.push(s);
    });
    var seen = new Set();
    targets = targets.filter(function (el) {
      if (seen.has(el)) return false;
      // bỏ qua nếu đã nằm trong một target khác
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] !== el && targets[i].contains(el)) return false;
      }
      seen.add(el);
      return true;
    });

    if (reduceMotion) return;
    targets.forEach(function (el) {
      el.style.opacity = '';
      el.style.transform = '';
      el.setAttribute('data-dietfit-reveal', '');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    targets.forEach(function (el) { io.observe(el); });

    // an toàn: nếu JS reveal lỗi thì vẫn hiện sau 3s
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
    }, 3000);
  }

  /* ---------- 6. Card CTA cuối trang: scale 0.8 -> 1 ---------- */
  function initCtaCard() {
    if (reduceMotion) return;
    ['.framer-1l6r6sf', '.framer-1ymuarc'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      el.style.transition = 'opacity .7s cubic-bezier(.44,0,.56,1), transform .7s cubic-bezier(.44,0,.56,1)';
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (e.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });
      io.observe(el);
    });
  }

  /* ---------- 7. Line draw: các nét SVG trang trí vẽ dần theo scroll ----------
     Bản capture đóng băng stroke-dashoffset nên 2 nét bị "chưa vẽ" => vô hình. */
  var lines = [];
  function initLines() {
    var paths = document.querySelectorAll('path[stroke-dasharray]');
    for (var i = 0; i < paths.length; i++) {
      var el = paths[i];
      var len = parseFloat(el.getAttribute('stroke-dasharray'));
      if (!len || len < 50) continue;              // bỏ qua icon nhỏ
      var svg = el.closest('svg');
      if (!svg) continue;
      try { len = el.getTotalLength() || len; } catch (e) { /* giữ giá trị attr */ }
      el.setAttribute('stroke-dasharray', len);
      if (reduceMotion) { el.setAttribute('stroke-dashoffset', 0); continue; }
      el.setAttribute('stroke-dashoffset', len);
      lines.push({ path: el, svg: svg, len: len });
    }
  }
  function renderLines() {
    if (!lines.length) return;
    var vh = window.innerHeight;
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];
      var r = L.svg.getBoundingClientRect();
      if (!r.height) continue;
      // bắt đầu vẽ khi phần tử vào 1/10 dưới màn, xong khi lên tới 1/4 trên
      var span = vh * 0.75 + r.height;
      var p = (vh * 0.9 - r.top) / span;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      L.path.setAttribute('stroke-dashoffset', (L.len * (1 - p)).toFixed(2));
    }
  }

  /* ---------- 8. Rive ở section "Dinh dưỡng, nói cho dễ hiểu" ----------
     Scrub Timeline 1 theo scroll, cùng cách làm với hero trang chủ:
     tính progress 0..1 rồi lerp cho mượt thay vì nhảy cóc.          */
  var missionRive = null;
  var missionAnim = null;
  var missionDuration = 0;
  var missionTarget = 0;
  var missionRendered = 0;
  var missionWrap = null;

  function initMissionRive() {
    missionWrap = document.querySelector('[data-dietfit-mission-rive]');
    if (!missionWrap || !window.rive) return;
    var canvas = missionWrap.querySelector('.dietfit-mission-canvas');
    if (!canvas) return;

    window.rive.RuntimeLoader.setWasmUrl('/vendor/rive/rive.wasm');

    missionRive = new window.rive.Rive({
      canvas: canvas,
      src: '/assets/hero/dietfit-about-mobile.riv?v=20260809-1',
      autoplay: false,
      autoBind: true,
      enableRiveAssetCDN: false,
      // Contain: hiện trọn artboard, không cắt cạnh, không bóp méo.
      // Khung đã ép đúng tỉ lệ 1397:2096 nên thực tế không có viền thừa.
      layout: new window.rive.Layout({
        fit: window.rive.Fit.Contain,
        alignment: window.rive.Alignment.Center
      }),
      onLoad: function () {
        var timeline = missionRive.animator.animations.find(function (a) {
          return a.name === 'Timeline 1';
        }) || missionRive.animator.animations[0];
        if (timeline) {
          missionAnim = timeline.name;
          var an = timeline.animation;
          var endFrame = an.enableWorkArea ? an.workEnd : an.duration;
          missionDuration = endFrame / an.fps;
          missionRive.pause(missionAnim);
          missionRive.scrub(missionAnim, 0);
        }
        missionRive.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
        missionWrap.setAttribute('data-rive-ready', '');
        updateMissionTarget();
        missionRendered = missionTarget;
        if (missionAnim) missionRive.scrub(missionAnim, missionRendered * missionDuration);
      },
      onLoadError: function (e) {
        console.error('Rive mission failed to load', e);
      }
    });
  }

  function updateMissionTarget() {
    if (!missionWrap) return;
    var r = missionWrap.getBoundingClientRect();
    var vh = window.innerHeight;
    // Chỉ bắt đầu khi khối đã cuộn tới ngang tầm mắt, không chạy từ lúc
    // vừa ló ở đáy màn. 0 = đỉnh khối ở 55% màn, 1 = đáy khối lên tới 25% màn.
    var startTop = vh * 0.55;
    var endTop = vh * 0.25 - r.height;
    var span = startTop - endTop;
    var p = span > 0 ? (startTop - r.top) / span : 0;
    missionTarget = p < 0 ? 0 : (p > 1 ? 1 : p);
  }

  function renderMission() {
    if (!missionRive || !missionAnim) return;
    var d = missionTarget - missionRendered;
    missionRendered = Math.abs(d) < 0.001 ? missionTarget : missionRendered + d * 0.14;
    missionRive.scrub(missionAnim, missionRendered * missionDuration);
  }

  /* ---------- loop ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      renderParallax(y);
      renderFooter(y);
      renderLines();
      updateMissionTarget();
      ticking = false;
    });
  }

  // rAF chạy liên tục để phần lerp của Rive kịp đuổi tới đích
  function missionLoop() {
    renderMission();
    requestAnimationFrame(missionLoop);
  }

  function boot() {
    initLenis();
    initReveal();
    initCtaCard();
    initLines();
    initMissionRive();
    measureParallax();
    measureFooter();
    onScroll();
    if (!reduceMotion) requestAnimationFrame(missionLoop);
    window.addEventListener('scroll', onScroll, { passive: true });
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        measureParallax();
        measureFooter();
        if (missionRive && missionRive.loaded) {
          missionRive.resizeDrawingSurfaceToCanvas(window.devicePixelRatio || 1);
        }
        onScroll();
      }, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
