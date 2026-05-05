(function () {
  const nav = document.querySelector(".section-nav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("[data-section-link]"));
  if (!links.length) return;

  const sectionMap = new Map();
  links.forEach((link) => {
    const id = link.getAttribute("data-section-link");
    const section = document.getElementById(id);
    if (section) {
      sectionMap.set(section, link);
    }
  });

  function setActive(activeLink) {
    links.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (sectionMap.size === 0) {
    setActive(links[0]);
    return;
  }

  setActive(links[0]);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.target.offsetTop - b.target.offsetTop);

      if (visible.length > 0) {
        const link = sectionMap.get(visible[0].target);
        if (link) setActive(link);
      }
    },
    {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    },
  );

  sectionMap.forEach((_, section) => observer.observe(section));

  links.forEach((link) => {
    link.addEventListener("click", () => setActive(link));
  });
})();
