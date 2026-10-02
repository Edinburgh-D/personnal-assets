(function () {
  "use strict";

  var root = document.documentElement;
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-chapter-menu]");

  function readTheme() {
    try {
      var stored = localStorage.getItem("kb_darkMode");
      if (stored === "true") return "dark";
      if (stored === "false") return "light";
      return null;
    } catch (error) { return null; }
  }

  function writeTheme(value) {
    try { localStorage.setItem("kb_darkMode", String(value === "dark")); } catch (error) { /* Storage can be unavailable. */ }
  }

  function updateThemeLabels() {
    var dark = root.dataset.theme === "dark";
    themeButtons.forEach(function (button) {
      button.textContent = dark ? "浅色" : "深色";
      button.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
    });
  }

  function applyInitialTheme() {
    var saved = readTheme();
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = saved || (prefersDark ? "dark" : "light");
    updateThemeLabels();
  }

  function toggleTheme() {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    writeTheme(next);
    updateThemeLabels();
  }

  themeButtons.forEach(function (button) {
    button.addEventListener("click", toggleTheme);
  });

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var isOpen = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!isOpen));
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.textContent = isOpen ? "目录" : "关闭";
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.getAttribute("data-open") === "true") {
        menu.setAttribute("data-open", "false");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "目录";
        menuButton.focus();
      }
    });
  }

  applyInitialTheme();
})();
