(function () {
  "use strict";

  const viewport = document.querySelector(".dietfit-tiktok-viewport");
  if (!viewport || viewport.dataset.enhanced === "true") return;
  viewport.dataset.enhanced = "true";

  const columns = viewport.querySelectorAll(".dietfit-tiktok-column");
  columns.forEach(function (column) {
    Array.from(column.children).forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.dataset.loopClone = "true";
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("iframe, a").forEach(function (item) { item.tabIndex = -1; });
      column.appendChild(clone);
    });
  });

  const playerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const frame = entry.target.querySelector("iframe");
      if (!frame) return;
      if (entry.isIntersecting) {
        if (!frame.src || frame.src === "about:blank") frame.src = frame.dataset.src;
      } else if (frame.src && frame.src !== "about:blank") {
        frame.src = "about:blank";
      }
    });
  }, { root: viewport, rootMargin: "120px 0px", threshold: 0.01 });

  viewport.querySelectorAll(".dietfit-tiktok-card").forEach(function (card) {
    playerObserver.observe(card);
  });

})();
