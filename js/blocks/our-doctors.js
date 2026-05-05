document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector(".our-doctors");
  if (!root) return;

  const sliderEl = root.querySelector(".our-doctors__slider");
  const prevBtn = root.querySelector(".our-doctors__nav-btn--prev");
  const nextBtn = root.querySelector(".our-doctors__nav-btn--next");
  const paginationEl = root.querySelector(".our-doctors__pagination");
  const counterCurrent = root.querySelector(".our-doctors__counter-current");
  const counterTotal = root.querySelector(".our-doctors__counter-total");

  if (!sliderEl || !paginationEl) return;

  if (typeof Swiper === "undefined") {
    console.error("[our-doctors] Swiper is not loaded");
    return;
  }

  function updateCounter(s) {
    if (!s || !s.params) return;
    const perView = typeof s.params.slidesPerView === "number" ? s.params.slidesPerView : 1;
    const rows = s.params.grid && typeof s.params.grid.rows === "number" ? s.params.grid.rows : 1;
    const perPage = perView * rows;
    const total = Math.max(1, Math.ceil(s.slides.length / perPage));
    const current = Math.floor(s.activeIndex / perPage) + 1;
    if (counterCurrent) counterCurrent.textContent = String(current);
    if (counterTotal) counterTotal.textContent = String(total);
  }

  new Swiper(sliderEl, {
    slidesPerView: 1,
    slidesPerGroup: 3,
    spaceBetween: 11,
    speed: 320,
    watchOverflow: true,
    grid: {
      rows: 3,
      fill: "row",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 13,
        grid: { rows: 1, fill: "row" },
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 13,
        grid: { rows: 1, fill: "row" },
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
