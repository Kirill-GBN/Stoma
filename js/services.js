(function () {
  const section = document.querySelector(".services");

  if (!section) {
    return;
  }

  const list = section.querySelector(".services__list");
  const toggle = section.querySelector(".services__toggle");
  const toggleText = section.querySelector(".services__toggle-text");

  if (!list || !toggle || !toggleText) {
    return;
  }

  const textShow = toggleText.dataset.textShow || toggleText.textContent;
  const textHide = toggleText.dataset.textHide || "Свернуть";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  toggle.addEventListener("click", () => {
    const isExpanded = !list.classList.contains("is-expanded");

    list.classList.toggle("is-expanded", isExpanded);
    toggle.classList.toggle("is-expanded", isExpanded);
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggleText.textContent = isExpanded ? textHide : textShow;

    if (!isExpanded) {
      list.scrollIntoView({
        behavior: motionQuery.matches ? "auto" : "smooth",
        block: "start",
      });
    }
  });
})();
