(function () {
  'use strict';

  var header = document.getElementById('dietfit-header');
  if (!header) return;

  var importedHeader = header.querySelector('[data-header-shell]');
  var mobileQuery = window.matchMedia(importedHeader ? '(max-width: 767.98px)' : '(max-width: 600px)');
  var ticking = false;

  function updateHeader() {
    header.classList.toggle('is-split', !mobileQuery.matches && window.scrollY > 120);
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeader);
  }

  updateHeader();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  mobileQuery.addEventListener('change', updateHeader);
})();
