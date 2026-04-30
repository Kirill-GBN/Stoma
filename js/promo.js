(function () {
  const root = document.querySelector(".promo");
  if (!root) return;

  const list = root.querySelector(".promo__list");
  const prevBtn = root.querySelector(".promo__arrow--prev");
  const nextBtn = root.querySelector(".promo__arrow--next");
  const currentEl = root.querySelector(".promo__counter-current");
  const totalEl = root.querySelector(".promo__counter-total");

  if (!list || !prevBtn || !nextBtn || !currentEl || !totalEl) return;

  let frameRequested = false;

  function getPageSize() {
    const card = list.querySelector(".promo-card");
    if (!card) return 1;

    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(list).columnGap) || 0;

    return Math.max(1, Math.round(list.clientWidth / (cardWidth + gap)));
  }

  function getScrollStep() {
    const card = list.querySelector(".promo-card");
    if (!card) return list.clientWidth;

    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(list).columnGap) || 0;

    return getPageSize() * (cardWidth + gap);
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(list.children.length / getPageSize()));
  }

  function getCurrentPage() {
    return Math.min(getTotalPages(), Math.round(list.scrollLeft / getScrollStep()) + 1);
  }

  function updateCounter() {
    frameRequested = false;

    currentEl.textContent = String(getCurrentPage());
    totalEl.textContent = String(getTotalPages());

    prevBtn.disabled = getCurrentPage() <= 1;
    nextBtn.disabled = getCurrentPage() >= getTotalPages();
  }

  function requestCounterUpdate() {
    if (frameRequested) return;

    frameRequested = true;
    window.requestAnimationFrame(updateCounter);
  }

  prevBtn.addEventListener("click", () => {
    list.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    list.scrollBy({ left: getScrollStep(), behavior: "smooth" });
  });

  list.addEventListener("scroll", requestCounterUpdate, { passive: true });
  window.addEventListener("resize", requestCounterUpdate);

  updateCounter();
})();
