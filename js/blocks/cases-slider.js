document.addEventListener("DOMContentLoaded", function () {
  const sliderEl = document.querySelector("[data-cases-slider]");
  if (!sliderEl) return;

  const root = sliderEl.closest(".cases-slider");
  const prevBtn = root ? root.querySelector(".cases-slider__nav-btn--prev") : null;
  const nextBtn = root ? root.querySelector(".cases-slider__nav-btn--next") : null;
  const counterCurrent = root ? root.querySelector(".cases-slider__counter-current") : null;
  const counterTotal = root ? root.querySelector(".cases-slider__counter-total") : null;

  if (!prevBtn || !nextBtn) return;

  if (typeof Swiper === "undefined") {
    console.error("[cases-slider] Swiper is not loaded");
    return;
  }

  function updateCounter(s) {
    if (!s || !counterCurrent || !counterTotal) return;
    const total = s.slides.length;
    const current = s.activeIndex + 1;
    counterCurrent.textContent = String(current);
    counterTotal.textContent = String(total);
  }

  new Swiper(sliderEl, {
    slidesPerView: 1,
    spaceBetween: 24,
    speed: 320,
    watchOverflow: true,
    navigation: { prevEl: prevBtn, nextEl: nextBtn },
    on: {
      init: function (s) {
        updateCounter(s);
      },
      slideChange: function (s) {
        updateCounter(s);
      },
    },
  });
});
