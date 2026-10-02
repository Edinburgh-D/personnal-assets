(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");

  function storedTheme() {
    try {
      return localStorage.getItem("kb_darkMode");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("kb_darkMode", String(theme === "dark"));
    } catch (error) {
      return;
    }
  }

  function syncToggle() {
    if (!toggle) return;
    var dark = root.dataset.theme === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.textContent = dark ? "浅色" : "深色";
  }

  if (!root.dataset.theme) {
    var saved = storedTheme();
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = saved === "true" ? "dark" : saved === "false" ? "light" : (prefersDark ? "dark" : "light");
  }

  syncToggle();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      saveTheme(next);
      syncToggle();
    });
  }
})();
