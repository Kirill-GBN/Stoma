(function () {
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__menu");
  const closeButton = document.querySelector(".header__menu-close");
  const menuLinks = document.querySelectorAll(".header__menu-link, .header__menu-accessibility");

  if (!burger || !menu || !closeButton) {
    return;
  }

  const setMenuState = (isOpen) => {
    burger.classList.toggle("is-active", isOpen);
    menu.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    menu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("is-menu-open", isOpen);

    if (isOpen) {
      closeButton.focus();
    }
  };

  burger.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("is-open"));
  });

  closeButton.addEventListener("click", () => {
    setMenuState(false);
    burger.focus();
  });

  menu.addEventListener("click", (event) => {
    if (event.target === menu) {
      setMenuState(false);
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenuState(false);
      burger.focus();
    }
  });
})();

(function () {
  const yearNodes = document.querySelectorAll("[data-current-year]");

  if (!yearNodes.length) {
    return;
  }

  const currentYear = String(new Date().getFullYear());

  yearNodes.forEach((node) => {
    node.textContent = currentYear;
  });
})();
