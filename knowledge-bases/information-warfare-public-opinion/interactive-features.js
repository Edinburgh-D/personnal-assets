(function () {
  "use strict";

  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-primary-nav]");

  function preferredTheme() {
    try {
      var saved = localStorage.getItem("kb_darkMode");
      if (saved === "light" || saved === "dark") return saved;
    } catch (error) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (!themeButton) return;
    var isDark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.textContent = isDark ? "浅色" : "深色";
  }

  applyTheme(preferredTheme());

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try { localStorage.setItem("kb_darkMode", nextTheme); } catch (error) {}
    });
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menu.dataset.open = String(open);
      menuButton.textContent = open ? "收起" : "目录";
    });
  }
})();
