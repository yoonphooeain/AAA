document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const headerActions = document.querySelector(".header-actions");
  const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));

  const syncHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const syncDropdownButtons = () => {
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".nav-trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", String(dropdown.classList.contains("is-open")));
      }
    });
  };

  const closeDropdowns = () => {
    if (window.innerWidth > 980) return;
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("is-open");
    });
    syncDropdownButtons();
  };

  const closeMenu = () => {
    if (!header || !menuToggle) return;
    header.classList.remove("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    closeDropdowns();
  };

  if (menuToggle && headerActions && header) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) closeDropdowns();
    });

    headerActions.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 980) {
          closeMenu();
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        closeMenu();
        dropdowns.forEach((dropdown) => {
          if (!dropdown.querySelector(".nav-subitem.is-current")) {
            dropdown.classList.remove("is-open");
          }
        });
        syncDropdownButtons();
      }
    });
  }

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      if (window.innerWidth > 980) return;
      event.preventDefault();
      const shouldOpen = !dropdown.classList.contains("is-open");
      dropdowns.forEach((item) => {
        item.classList.remove("is-open");
      });
      if (shouldOpen) {
        dropdown.classList.add("is-open");
      }
      syncDropdownButtons();
    });
  });

  document.addEventListener("click", (event) => {
    if (!header) return;
    if (!header.contains(event.target)) {
      closeMenu();
      closeDropdowns();
    }
  });

  syncHeaderState();
  syncDropdownButtons();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
});
