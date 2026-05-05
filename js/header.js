(function () {
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__menu");
  const closeButton = document.querySelector(".header__menu-close");
  const mobileServicesTrigger = document.querySelector("[data-mobile-services-trigger]");
  const mobileServicesSubmenu =
    mobileServicesTrigger?.getAttribute("aria-controls")
      ? document.getElementById(mobileServicesTrigger.getAttribute("aria-controls"))
      : null;
  const menuLinks = document.querySelectorAll(
    ".header__menu-link:not(.header__menu-link--toggle), .header__menu-accessibility, .header__submenu-link",
  );

  if (!burger || !menu || !closeButton) {
    return;
  }

  const collapseMobileServicesAccordion = () => {
    if (!mobileServicesTrigger || !mobileServicesSubmenu) {
      return;
    }

    mobileServicesTrigger.setAttribute("aria-expanded", "false");
    mobileServicesSubmenu.hidden = true;
  };

  const setMenuState = (isOpen) => {
    if (!isOpen) {
      collapseMobileServicesAccordion();
    }

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

  if (mobileServicesTrigger && mobileServicesSubmenu) {
    mobileServicesTrigger.addEventListener("click", (event) => {
      event.stopPropagation();

      const isExpanded = mobileServicesTrigger.getAttribute("aria-expanded") === "true";

      mobileServicesTrigger.setAttribute("aria-expanded", String(!isExpanded));
      mobileServicesSubmenu.hidden = isExpanded;
    });

    mobileServicesSubmenu.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");

      if (!link) {
        return;
      }

      collapseMobileServicesAccordion();
      setMenuState(false);
    });
  }
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

(function () {
  const mqDesktop = window.matchMedia("(min-width: 768px)");
  const mqHover = window.matchMedia("(hover: hover)");
  const trigger = document.querySelector("[data-mega-menu-trigger]");
  const panel = document.querySelector("[data-mega-menu-panel]");
  const anchor = document.querySelector("[data-mega-menu-anchor]");

  if (!trigger || !panel || !anchor) {
    return;
  }

  const wrapper = trigger.closest(".header__nav-item--has-mega");
  const tabs = panel.querySelectorAll(".mega-menu__category");
  const contents = panel.querySelectorAll(".mega-menu__category-content");

  let closeTimer = null;
  let openDelayTimer = null;
  let isOpen = false;
  let isPinned = false;
  let resizeFrame = null;

  const clearTimers = () => {
    window.clearTimeout(closeTimer);
    window.clearTimeout(openDelayTimer);
    closeTimer = null;
    openDelayTimer = null;
  };

  const positionPanel = () => {
    if (!mqDesktop.matches || panel.hidden) {
      return;
    }

    const rect = anchor.getBoundingClientRect();

    panel.style.left = `${Math.round(rect.left)}px`;
    panel.style.width = `${Math.round(rect.width)}px`;
    // Зазор между низом якоря и верхом панели; было +25px — лишний зазор (~23px). Мостик hover — ::before в mega-menu.css.
    panel.style.top = `${Math.round(rect.bottom + 2)}px`;
  };

  const schedulePosition = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;
      positionPanel();
    });
  };

  const onDocumentClick = (event) => {
    if (!wrapper.contains(event.target)) {
      close();
    }
  };

  const onDocumentKeyDown = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    close();
    trigger.focus();
    event.stopPropagation();
  };

  const onViewportChange = () => {
    if (!mqDesktop.matches) {
      close();
      return;
    }

    schedulePosition();
  };

  function open() {
    if (!mqDesktop.matches) {
      return;
    }

    if (isOpen) {
      schedulePosition();
      return;
    }

    clearTimers();
    wrapper.classList.add("is-mega-open");
    panel.hidden = false;
    panel.dataset.state = "open";
    trigger.setAttribute("aria-expanded", "true");
    isOpen = true;

    schedulePosition();

    window.requestAnimationFrame(() => {
      positionPanel();
    });

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onDocumentKeyDown, true);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
  }

  function close() {
    clearTimers();
    wrapper.classList.remove("is-mega-open");
    panel.hidden = true;
    panel.dataset.state = "closed";
    trigger.setAttribute("aria-expanded", "false");
    panel.style.left = "";
    panel.style.width = "";
    panel.style.top = "";
    isOpen = false;
    isPinned = false;

    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onDocumentKeyDown, true);
    window.removeEventListener("resize", onViewportChange);
    window.removeEventListener("scroll", onViewportChange, true);
  }

  panel.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");

    if (link) {
      close();
    }
  });

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!mqDesktop.matches) {
      return;
    }

    if (isOpen && isPinned) {
      close();
      return;
    }

    if (!isOpen) {
      open();
    }

    isPinned = true;
  });

  if (mqHover.matches) {
    wrapper.addEventListener("mouseenter", () => {
      if (!mqDesktop.matches) {
        return;
      }

      clearTimers();

      openDelayTimer = window.setTimeout(() => {
        openDelayTimer = null;

        if (!isOpen) {
          open();
        }
      }, 40);
    });

    wrapper.addEventListener("mouseleave", () => {
      clearTimers();

      if (!mqDesktop.matches) {
        return;
      }

      closeTimer = window.setTimeout(() => {
        closeTimer = null;

        if (!isPinned) {
          close();
        }
      }, 200);
    });
  }

  mqDesktop.addEventListener("change", () => {
    if (!mqDesktop.matches) {
      close();
    }
  });

  function activateTab(index) {
    tabs.forEach((tab, i) => {
      const active = i === index;

      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    contents.forEach((content, i) => {
      const active = i === index;

      content.hidden = !active;
      content.classList.toggle("is-active", active);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(index);
    });

    if (mqHover.matches) {
      tab.addEventListener("mouseenter", () => {
        activateTab(index);
      });
    }

    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      let next = index;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        next = index >= last ? 0 : index + 1;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        next = index <= 0 ? last : index - 1;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = last;
      } else {
        return;
      }

      event.preventDefault();
      tabs[next].focus();
      activateTab(next);
    });
  });
})();
