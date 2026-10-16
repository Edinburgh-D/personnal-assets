(function () {
  "use strict";

  const root = document.documentElement;
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-primary-nav]");
  const themeButton = document.querySelector("[data-theme-toggle]");

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme, persist) {
    root.dataset.theme = theme;
    if (persist) localStorage.setItem("kb_darkMode", String(theme === "dark"));
    if (themeButton) {
      const next = theme === "dark" ? "浅色" : "深色";
      themeButton.textContent = next;
      themeButton.setAttribute("aria-label", `切换到${next}模式`);
      themeButton.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  const savedDarkMode = localStorage.getItem("kb_darkMode");
  setTheme(savedDarkMode === null ? systemTheme() : savedDarkMode === "true" ? "dark" : "light", false);

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const willOpen = nav.hasAttribute("hidden");
      nav.toggleAttribute("hidden", !willOpen);
      menuButton.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !nav.hasAttribute("hidden") && window.innerWidth < 960) {
        nav.setAttribute("hidden", "");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (localStorage.getItem("kb_darkMode") === null) setTheme(systemTheme(), false);
  });
})();
