(function () {
  "use strict";

  const viewport = document.querySelector(".dietfit-tiktok-viewport");
  if (!viewport || viewport.dataset.enhanced === "true") return;
  viewport.dataset.enhanced = "true";

  const columns = Array.from(viewport.querySelectorAll(".dietfit-tiktok-column"));
  const originalGroups = columns.map(function (column) { return Array.from(column.children); });
  const cards = originalGroups.flat();
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const timers = new Map();
  const transitionHandlers = new WeakMap();
  let isSectionVisible = false;

  function clearTimers() {
    timers.forEach(function (timer) { window.clearTimeout(timer); });
    timers.clear();
    columns.forEach(resetColumn);
  }

  function resetColumn(column) {
    const handler = transitionHandlers.get(column);
    if (handler) {
      column.removeEventListener("transitionend", handler);
      transitionHandlers.delete(column);
    }
    column.classList.remove("is-advancing");
    column.style.removeProperty("--dietfit-tiktok-step");
  }

  function distributeCards() {
    clearTimers();
    columns.forEach(function (column) {
      resetColumn(column);
      column.replaceChildren();
    });

    if (mobileQuery.matches) {
      cards.forEach(function (card, index) {
        columns[index % 2].appendChild(card);
      });
    } else {
      originalGroups.forEach(function (group, index) {
        group.forEach(function (card) { columns[index].appendChild(card); });
      });
    }

    if (isSectionVisible) startCarousel();
  }

  function advanceColumn(column) {
    if (document.hidden || reducedMotionQuery.matches || column.children.length < 2) return;
    const first = column.firstElementChild;
    const second = first && first.nextElementSibling;
    if (!first || !second) return;

    const step = second.offsetTop - first.offsetTop;
    column.style.setProperty("--dietfit-tiktok-step", step + "px");
    void column.offsetHeight;
    column.classList.add("is-advancing");

    const finish = function (event) {
      if (event && event.target !== column) return;
      column.appendChild(first);
      resetColumn(column);
      if (isSectionVisible && !document.hidden && !reducedMotionQuery.matches) {
        timers.set(column, window.setTimeout(function () {
          timers.delete(column);
          advanceColumn(column);
        }, 32));
      }
    };
    transitionHandlers.set(column, finish);
    column.addEventListener("transitionend", finish, { once: true });
  }

  function scheduleColumn(column, delay) {
    timers.set(column, window.setTimeout(function () {
      timers.delete(column);
      if (!isSectionVisible) return;
      advanceColumn(column);
    }, delay));
  }

  function startCarousel() {
    clearTimers();
    if (reducedMotionQuery.matches || !isSectionVisible) return;
    columns.filter(function (column) {
      return window.getComputedStyle(column).display !== "none";
    }).forEach(function (column, index) {
      scheduleColumn(column, 120 + index * 360);
    });
  }

  const playerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const frame = entry.target.querySelector("iframe");
      const video = entry.target.querySelector("video");
      if (frame) {
        if (entry.isIntersecting) {
          if (!frame.src || frame.src === "about:blank") frame.src = frame.dataset.src;
        } else if (frame.src && frame.src !== "about:blank") {
          frame.src = "about:blank";
        }
      }
      if (video) {
        if (entry.isIntersecting) {
          const source = video.querySelector("source[data-src]");
          if (video.dataset.poster && !video.poster) video.poster = video.dataset.poster;
          if (source && !source.src) {
            source.src = source.dataset.src;
            video.load();
          }
          video.play().catch(function () { /* autoplay có thể bị trình duyệt trì hoãn */ });
        } else {
          video.pause();
        }
      }
    });
  }, { root: viewport, rootMargin: "120px 0px", threshold: 0.01 });

  function setPlayersActive(active) {
    playerObserver.disconnect();
    cards.forEach(function (card) {
      if (active) {
        playerObserver.observe(card);
        return;
      }
      const frame = card.querySelector("iframe");
      const video = card.querySelector("video");
      if (frame && frame.src && frame.src !== "about:blank") frame.src = "about:blank";
      if (video) video.pause();
    });
  }

  const sectionObserver = new IntersectionObserver(function (entries) {
    isSectionVisible = entries[0].isIntersecting;
    setPlayersActive(isSectionVisible);
    if (isSectionVisible) startCarousel();
    else clearTimers();
  }, { threshold: 0.08 });

  sectionObserver.observe(viewport);
  mobileQuery.addEventListener("change", distributeCards);
  reducedMotionQuery.addEventListener("change", startCarousel);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearTimers();
    else if (isSectionVisible) startCarousel();
  });

  distributeCards();

})();
