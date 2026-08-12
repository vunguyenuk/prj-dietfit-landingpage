(function () {
  'use strict';

  var header = document.getElementById('dietfit-header');
  if (!header) return;

  var toggle = header.querySelector('[data-dietfit-menu-toggle]');
  var menu = header.querySelector('[data-dietfit-mobile-menu]');
  if (!toggle || !menu) return;

  var mobileQuery = window.matchMedia('(max-width: 767px)');
  var scrollPosition = 0;

  function isOpen() {
    return header.classList.contains('is-menu-open');
  }

  function openMenu() {
    if (!mobileQuery.matches || isOpen()) return;
    scrollPosition = window.scrollY;
    document.body.style.setProperty('--dietfit-menu-scroll-offset', -scrollPosition + 'px');
    document.documentElement.classList.add('dietfit-menu-open');
    header.classList.add('is-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Đóng menu');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu(restoreFocus) {
    if (!isOpen()) return;
    header.classList.remove('is-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Mở menu');
    menu.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('dietfit-menu-open');
    document.body.style.removeProperty('--dietfit-menu-scroll-offset');
    window.scrollTo(0, scrollPosition);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) closeMenu(false);
    else openMenu();
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu(false);
  });

  document.addEventListener('pointerdown', function (event) {
    if (isOpen() && !header.contains(event.target)) closeMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) closeMenu(true);
  });

  mobileQuery.addEventListener('change', function () {
    if (!mobileQuery.matches) closeMenu(false);
  });
})();
