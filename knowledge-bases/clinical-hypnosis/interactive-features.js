(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var stored = localStorage.getItem("kb_darkMode");

  if (stored === "dark" || stored === "light") {
    root.dataset.theme = stored;
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateLabel() {
    if (!button) return;
    var dark = currentTheme() === "dark";
    button.textContent = dark ? "切换浅色" : "切换深色";
    button.setAttribute("aria-pressed", String(dark));
  }

  if (button) {
    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("kb_darkMode", next);
      updateLabel();
    });
  }

  updateLabel();
}());
