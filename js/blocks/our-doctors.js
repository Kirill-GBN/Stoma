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

  const defaults = {
    mobile: { slidesPerView: 1, spaceBetween: 11, gridRows: 3 },
    tablet: { slidesPerView: 2, spaceBetween: 13, gridRows: 1 },
    desktop: { slidesPerView: 3, spaceBetween: 13, gridRows: 1 },
  };

  let config = {};
  const configAttr = root.getAttribute("data-our-doctors-config");
  if (configAttr) {
    try {
      config = JSON.parse(configAttr);
    } catch (e) {
      console.warn("[our-doctors] Invalid data-our-doctors-config", e);
      config = {};
    }
  }

  if (typeof config.slidesPerView === "number" && config.desktop == null) {
    config = {
      ...config,
      desktop: {
        slidesPerView: config.slidesPerView,
        ...(typeof config.spaceBetween === "number" ? { spaceBetween: config.spaceBetween } : {}),
      },
    };
  }

  const mobile = { ...defaults.mobile, ...(config.mobile || {}) };
  const tablet = { ...defaults.tablet, ...(config.tablet || {}) };
  const desktop = { ...defaults.desktop, ...(config.desktop || {}) };

  function slidesPerGroupFor(bp) {
    return bp.slidesPerView * bp.gridRows;
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
    slidesPerView: mobile.slidesPerView,
    slidesPerGroup: slidesPerGroupFor(mobile),
    spaceBetween: mobile.spaceBetween,
    speed: 320,
    watchOverflow: true,
    grid: {
      rows: mobile.gridRows,
      fill: "row",
    },
    breakpoints: {
      768: {
        slidesPerView: tablet.slidesPerView,
        slidesPerGroup: slidesPerGroupFor(tablet),
        spaceBetween: tablet.spaceBetween,
        grid: { rows: tablet.gridRows, fill: "row" },
      },
      1024: {
        slidesPerView: desktop.slidesPerView,
        slidesPerGroup: slidesPerGroupFor(desktop),
        spaceBetween: desktop.spaceBetween,
        grid: { rows: desktop.gridRows, fill: "row" },
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
