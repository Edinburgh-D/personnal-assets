(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-nav-links]");
  var themeButton = document.querySelector("[data-theme-toggle]");

  function readTheme() {
    try { return localStorage.getItem("authoritarian-resilience-theme"); }
    catch (error) { return null; }
  }

  function writeTheme(value) {
    try { localStorage.setItem("authoritarian-resilience-theme", value); }
    catch (error) { return; }
  }

  function applyTheme(value) {
    root.dataset.theme = value;
    if (themeButton) {
      var dark = value === "dark";
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.textContent = dark ? "浅色" : "深色";
    }
  }

  var stored = readTheme();
  var preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored || (preferredDark ? "dark" : "light"));

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      writeTheme(next);
    });
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var open = nav.dataset.open === "true";
      nav.dataset.open = String(!open);
      menuButton.setAttribute("aria-expanded", String(!open));
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        nav.dataset.open = "false";
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
  }
})();
