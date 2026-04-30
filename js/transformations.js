(function () {
  const root = document.querySelector(".transformations");

  if (!root) {
    return;
  }

  const cases = Array.from(root.querySelectorAll(".transformation-case"));
  const tabs = Array.from(root.querySelectorAll(".patient-tab"));
  const prevBtn = root.querySelector(".transformations__arrow--prev");
  const nextBtn = root.querySelector(".transformations__arrow--next");
  const currentEl = root.querySelector(".transformations__counter-current");
  const totalEl = root.querySelector(".transformations__counter-total");

  let activeIndex = 0;

  if (totalEl) {
    totalEl.textContent = String(cases.length);
  }

  function activate(index) {
    if (!cases.length) {
      return;
    }

    activeIndex = Math.max(0, Math.min(cases.length - 1, index));

    cases.forEach((caseItem, itemIndex) => {
      const isActive = itemIndex === activeIndex;

      caseItem.classList.toggle("is-active", isActive);
      caseItem.hidden = !isActive;
    });

    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === activeIndex;

      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    if (currentEl) {
      currentEl.textContent = String(activeIndex + 1);
    }

    if (prevBtn) {
      prevBtn.disabled = activeIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = activeIndex === cases.length - 1;
    }
  }

  prevBtn?.addEventListener("click", () => activate(activeIndex - 1));
  nextBtn?.addEventListener("click", () => activate(activeIndex + 1));

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(index));
    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        activate(index - 1);
        tabs[Math.max(0, index - 1)]?.focus();
        event.preventDefault();
      }

      if (event.key === "ArrowRight") {
        activate(index + 1);
        tabs[Math.min(tabs.length - 1, index + 1)]?.focus();
        event.preventDefault();
      }
    });
  });

  function getValueText(percent) {
    const rounded = Math.round(percent);

    if (rounded === 50) {
      return "50% — равное соотношение до и после";
    }

    if (rounded < 50) {
      return `${rounded}% — больше видно фото до лечения`;
    }

    return `${rounded}% — больше видно фото после лечения`;
  }

  function initBaSlider(slider) {
    const handle = slider.querySelector(".ba-slider__handle");

    if (!handle) {
      return;
    }

    let isDragging = false;

    function setPosition(percent) {
      const normalized = Math.max(0, Math.min(100, percent));

      slider.style.setProperty("--ba-position", `${normalized}%`);
      handle.setAttribute("aria-valuenow", String(Math.round(normalized)));
      handle.setAttribute("aria-valuetext", getValueText(normalized));
      slider.classList.add("is-touched");
    }

    function pointerToPercent(clientX) {
      const rect = slider.getBoundingClientRect();

      return ((clientX - rect.left) / rect.width) * 100;
    }

    handle.addEventListener("pointerdown", (event) => {
      isDragging = true;
      handle.setPointerCapture(event.pointerId);
      setPosition(pointerToPercent(event.clientX));
    });

    handle.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }

      setPosition(pointerToPercent(event.clientX));
    });

    handle.addEventListener("pointerup", (event) => {
      isDragging = false;

      if (handle.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }
    });

    handle.addEventListener("pointercancel", () => {
      isDragging = false;
    });

    handle.addEventListener("keydown", (event) => {
      const current = Number.parseFloat(handle.getAttribute("aria-valuenow")) || 50;
      const step = event.shiftKey ? 10 : 2;
      const keyMap = {
        ArrowLeft: current - step,
        ArrowDown: current - step,
        ArrowRight: current + step,
        ArrowUp: current + step,
        Home: 0,
        End: 100,
      };

      if (Object.prototype.hasOwnProperty.call(keyMap, event.key)) {
        setPosition(keyMap[event.key]);
        event.preventDefault();
      }
    });

    slider.addEventListener("click", (event) => {
      if (event.target === handle || handle.contains(event.target)) {
        return;
      }

      setPosition(pointerToPercent(event.clientX));
    });
  }

  root.querySelectorAll("[data-ba-slider]").forEach(initBaSlider);
  activate(0);
})();
