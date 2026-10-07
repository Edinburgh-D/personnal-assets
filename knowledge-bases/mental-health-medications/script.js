(function () {
  "use strict";

  const root = document.documentElement;
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  const stored = localStorage.getItem("kb_darkMode");

  if (stored === "light" || stored === "dark") {
    root.dataset.theme = stored;
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateLabels() {
    const next = currentTheme() === "dark" ? "浅色" : "深色";
    toggles.forEach(function (toggle) {
      toggle.textContent = "切换至" + next;
      toggle.setAttribute("aria-pressed", String(currentTheme() === "dark"));
    });
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("kb_darkMode", next);
      updateLabels();
    });
  });

  document.querySelectorAll(".mobile-menu a").forEach(function (link) {
    link.addEventListener("click", function () {
      const menu = link.closest("details");
      if (menu) menu.open = false;
    });
  });

  updateLabels();
})();
