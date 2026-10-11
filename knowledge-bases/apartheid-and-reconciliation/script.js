(() => {
  const root = document.documentElement;
  const menu = document.querySelector("[data-mobile-menu]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const storedTheme = localStorage.getItem("apartheid-kb-theme");
  const legacyDarkMode = localStorage.getItem("kb_darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeButtons.forEach((button) => {
      const nextTheme = theme === "dark" ? "浅色" : "深色";
      button.setAttribute("aria-label", `切换到${nextTheme}模式`);
      button.textContent = theme === "dark" ? "浅色" : "深色";
    });
  };

  applyTheme(storedTheme || (legacyDarkMode === "true" ? "dark" : legacyDarkMode === "false" ? "light" : prefersDark ? "dark" : "light"));

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(theme);
      localStorage.setItem("apartheid-kb-theme", theme);
      localStorage.setItem("kb_darkMode", String(theme === "dark"));
    });
  });

  if (menu && menuButton) {
    const closeMenu = () => {
      menu.dataset.open = "false";
      menuButton.setAttribute("aria-expanded", "false");
    };

    menuButton.addEventListener("click", () => {
      const willOpen = menu.dataset.open !== "true";
      menu.dataset.open = String(willOpen);
      menuButton.setAttribute("aria-expanded", String(willOpen));
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });
  }
})();
