document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector(".certificates-slider");
  if (!root) return;

  const sliderEl = root.querySelector("[data-certificates-slider]");
  const prevBtn = root.querySelector(".certificates-slider__nav-btn--prev");
  const nextBtn = root.querySelector(".certificates-slider__nav-btn--next");
  const paginationEl = root.querySelector(".certificates-slider__pagination");
  const counterCurrent = root.querySelector(".certificates-slider__counter-current");
  const counterTotal = root.querySelector(".certificates-slider__counter-total");

  if (!sliderEl || !paginationEl) return;

  if (typeof Swiper === "undefined") {
    console.error("[certificates-slider] Swiper is not loaded");
    return;
  }

  function updateCounter(s) {
    if (!s || !s.params) return;
    const perView =
      typeof s.params.slidesPerView === "number" ? s.params.slidesPerView : 1;
    const totalGroups = Math.max(1, Math.ceil(s.slides.length / perView));
    const currentGroup = Math.floor(s.activeIndex / perView) + 1;
    if (counterCurrent) counterCurrent.textContent = String(Math.min(currentGroup, totalGroups));
    if (counterTotal) counterTotal.textContent = String(totalGroups);
  }

  new Swiper(sliderEl, {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 12,
    speed: 320,
    watchOverflow: true,
    breakpoints: {
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 14,
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 16,
      },
    },
    navigation: { prevEl: prevBtn, nextEl: nextBtn },
    pagination: { el: paginationEl, type: "bullets", clickable: true },
    on: {
      init: function (s) {
        updateCounter(s);
      },
      slideChange: function (s) {
        updateCounter(s);
      },
      breakpoint: function (s) {
        updateCounter(s);
      },
    },
  });
});
