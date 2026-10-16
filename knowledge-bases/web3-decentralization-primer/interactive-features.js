(() => {
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.textContent = isDark ? "浅色" : "深色";
    });
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem("web3-kb-theme", nextTheme);
        localStorage.setItem("kb_darkMode", String(nextTheme === "dark"));
      } catch (_) {
        // The theme still changes when storage is unavailable.
      }
    });
  });

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = expanded;
    });

    mobileMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileMenu.hidden) {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        menuButton.focus();
      }
    });
  }

  applyTheme(root.dataset.theme || "light");
})();
