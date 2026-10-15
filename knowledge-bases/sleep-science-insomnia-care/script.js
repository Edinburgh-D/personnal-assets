(function () {
  "use strict";

  var root = document.documentElement;
  var toggles = document.querySelectorAll("[data-theme-toggle]");
  var stored = null;

  try {
    stored = localStorage.getItem("kb_darkMode");
  } catch (error) {
    stored = null;
  }

  if (stored === "light" || stored === "dark") {
    root.dataset.theme = stored;
  }

  function currentTheme() {
    if (root.dataset.theme === "light" || root.dataset.theme === "dark") {
      return root.dataset.theme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateToggleLabels() {
    var isDark = currentTheme() === "dark";
    toggles.forEach(function (toggle) {
      toggle.textContent = isDark ? "切换浅色" : "切换深色";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.dataset.state = isDark ? "success" : "default";
    });
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("kb_darkMode", next);
      } catch (error) {
        toggle.dataset.state = "error";
      }
      updateToggleLabels();
    });
  });

  document.querySelectorAll(".mobile-menu a").forEach(function (link) {
    link.addEventListener("click", function () {
      var menu = link.closest("details");
      if (menu) menu.open = false;
    });
  });

  updateToggleLabels();
})();
