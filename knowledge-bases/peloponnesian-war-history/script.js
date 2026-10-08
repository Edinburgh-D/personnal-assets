(function () {
  "use strict";

  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-primary-nav]");

  function readStoredTheme() {
    try {
      return localStorage.getItem("kb_darkMode") === "true" ? "dark" : localStorage.getItem("peloponnesian-theme");
    } catch (error) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem("peloponnesian-theme", value);
      localStorage.setItem("kb_darkMode", String(value === "dark"));
    } catch (error) {
      return;
    }
  }

  function resolvedTheme() {
    var explicitTheme = root.getAttribute("data-theme");
    if (explicitTheme) return explicitTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    themeButton.textContent = resolvedTheme() === "dark" ? "浅色" : "深色";
    themeButton.setAttribute("aria-pressed", String(resolvedTheme() === "dark"));
  }

  var storedTheme = readStoredTheme();
  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }
  updateThemeLabel();

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var nextTheme = resolvedTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      storeTheme(nextTheme);
      updateThemeLabel();
    });
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menu.hidden = isOpen;
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !menu.hidden) {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
  }
})();
