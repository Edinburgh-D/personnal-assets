(function () {
  "use strict";

  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-primary-nav]");

  function readTheme() {
    try {
      if (localStorage.getItem("kb_darkMode") === "true") return "dark";
      return localStorage.getItem("roman-empire-theme");
    } catch (error) {
      return null;
    }
  }

  function resolvedTheme() {
    var explicitTheme = root.getAttribute("data-theme");
    if (explicitTheme) return explicitTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeButton() {
    if (!themeButton) return;
    var isDark = resolvedTheme() === "dark";
    themeButton.textContent = isDark ? "浅色" : "深色";
    themeButton.setAttribute("aria-pressed", String(isDark));
  }

  var storedTheme = readTheme();
  if (storedTheme === "light" || storedTheme === "dark") root.setAttribute("data-theme", storedTheme);
  updateThemeButton();

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var nextTheme = resolvedTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      try {
        localStorage.setItem("roman-empire-theme", nextTheme);
        localStorage.setItem("kb_darkMode", String(nextTheme === "dark"));
      } catch (error) {
        return;
      }
      updateThemeButton();
    });
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
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
