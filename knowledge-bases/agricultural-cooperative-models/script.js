(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var stored = null;

  try {
    stored = localStorage.getItem("kb_darkMode");
  } catch (error) {
    stored = null;
  }

  if (stored === "true" || stored === "false") {
    root.dataset.theme = stored === "true" ? "dark" : "light";
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.dataset.theme = "dark";
  }

  function updateLabel() {
    if (!button) return;
    var dark = root.dataset.theme === "dark";
    button.textContent = dark ? "浅色" : "深色";
    button.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  if (button) {
    updateLabel();
    button.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("kb_darkMode", next === "dark" ? "true" : "false");
      } catch (error) {
        /* Theme still changes for this page view when storage is unavailable. */
      }
      updateLabel();
    });
  }
})();
