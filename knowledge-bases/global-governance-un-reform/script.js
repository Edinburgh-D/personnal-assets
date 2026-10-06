(function () {
  "use strict";

  var root = document.documentElement;
  var stored = null;
  try {
    stored = localStorage.getItem("kb_darkMode");
  } catch (error) {
    stored = null;
  }

  if (stored === "true" || stored === "false") {
    root.dataset.theme = stored === "true" ? "dark" : "light";
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateButtons() {
    var nextLabel = currentTheme() === "dark" ? "切换浅色" : "切换深色";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.textContent = nextLabel;
      button.setAttribute("aria-label", nextLabel);
    });
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      root.dataset.theme = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("kb_darkMode", String(root.dataset.theme === "dark"));
      } catch (error) {
        /* The chosen theme still applies for the current page. */
      }
      updateButtons();
    });
  });

  document.querySelectorAll(".mobile-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      var menu = link.closest("details");
      if (menu) menu.removeAttribute("open");
    });
  });

  updateButtons();
})();
