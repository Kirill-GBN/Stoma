(function () {
  const triggers = document.querySelectorAll("[data-aside-toggle]");
  triggers.forEach((trigger) => {
    const targetId = trigger.getAttribute("aria-controls");
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) return;

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isExpanded));
      target.hidden = isExpanded;
      const item = trigger.closest(".services-aside__item");
      if (item) item.classList.toggle("is-expanded", !isExpanded);
    });
  });
})();
