(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var storageKey = "kb_darkMode";

  function preferredTheme() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved === "true") return "dark";
      if (saved === "false") return "light";
    } catch (error) {
      // Storage can be unavailable in privacy modes; system preference remains usable.
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (!button) return;
    var dark = theme === "dark";
    button.setAttribute("aria-pressed", String(dark));
    button.textContent = dark ? "切换浅色" : "切换深色";
  }

  applyTheme(preferredTheme());

  if (button) {
    button.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(storageKey, String(next === "dark"));
      } catch (error) {
        // The visual state still changes when storage is blocked.
      }
    });
  }
})();
