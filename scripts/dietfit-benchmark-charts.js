/* Tooltips use only the recorded scores in the server-rendered chart. */
(function () {
  'use strict';
  var active = null;
  var keyboardMode = false;
  function close() {
    if (!active) return;
    active.removeAttribute('data-active');
    active.closest('.bm-dot-chart').querySelector('.bm-chart-tooltip').hidden = true;
    active = null;
  }
  function show(dot) {
    if (!dot) return;
    close();
    active = dot;
    dot.setAttribute('data-active', '');
    var chart = dot.closest('.bm-dot-chart');
    var tip = chart.querySelector('.bm-chart-tooltip');
    var name = document.createElement('strong');
    name.textContent = dot.dataset.app;
    var detail = document.createElement('span');
    detail.textContent = dot.dataset.detail;
    var score = document.createElement('b');
    score.textContent = dot.dataset.score + '%';
    tip.replaceChildren(name, detail, score);
    tip.hidden = false;
    var point = dot.getBoundingClientRect();
    var bounds = chart.getBoundingClientRect();
    var scroll = chart.closest('.bm-chart-scroll');
    // Clamp to the visible plot area, including when horizontally scrolled.
    var min = scroll.scrollLeft + 4;
    var max = scroll.scrollLeft + scroll.clientWidth - tip.offsetWidth - 4;
    tip.style.left = Math.max(min, Math.min(max, point.left - bounds.left + point.width / 2 - tip.offsetWidth / 2)) + 'px';
    var top = point.top - bounds.top + point.height + 10;
    if (top + tip.offsetHeight > chart.clientHeight) top = point.top - bounds.top - tip.offsetHeight - 10;
    tip.style.top = Math.max(0, top) + 'px';
  }
  document.addEventListener('pointerover', function (event) {
    if (keyboardMode) return;
    var dot = event.target.closest('.bm-chart-dot');
    if (dot && active !== dot) show(dot);
  });
  document.addEventListener('pointerout', function (event) {
    var dot = event.target.closest('.bm-chart-dot');
    if (!keyboardMode && dot && !dot.contains(event.relatedTarget) && event.pointerType !== 'touch' && document.activeElement !== dot) close();
  });
  document.addEventListener('pointerdown', function () { keyboardMode = false; });
  document.addEventListener('pointermove', function (event) {
    if (!keyboardMode || !(event.movementX || event.movementY)) return;
    keyboardMode = false;
    var dot = event.target.closest('.bm-chart-dot');
    if (dot) show(dot); else close();
  });
  document.addEventListener('focusin', function (event) { show(event.target.closest('.bm-chart-dot')); });
  document.addEventListener('focusout', function (event) { if (event.target.closest('.bm-chart-dot')) close(); });
  document.addEventListener('click', function (event) {
    var dot = event.target.closest('.bm-chart-dot');
    if (dot) show(dot); else close();
  });
  document.addEventListener('keydown', function (event) {
    keyboardMode = true;
    if (event.key === 'Escape') close();
    var dot = event.target.closest('.bm-chart-dot');
    if (!dot || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    var dots = Array.from(dot.closest('.bm-dot-chart').querySelectorAll('.bm-chart-dot'));
    var direction = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1;
    dots[(dots.indexOf(dot) + direction + dots.length) % dots.length].focus();
  });
  window.addEventListener('resize', close);
  document.addEventListener('scroll', function (event) {
    if (active && event.target.classList && event.target.classList.contains('bm-chart-scroll')) show(active);
  }, true);
})();
