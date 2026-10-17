(function () {
  "use strict";

  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const stored = localStorage.getItem("kb_darkMode");

  if (stored === "true" || stored === "false") {
    root.dataset.theme = stored === "true" ? "dark" : "light";
  }

  function activeTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateLabel() {
    if (!toggle) return;
    const dark = activeTheme() === "dark";
    toggle.textContent = dark ? "浅色" : "深色";
    toggle.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
  }

  if (toggle) {
    updateLabel();
    toggle.addEventListener("click", function () {
      const next = activeTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("kb_darkMode", String(next === "dark"));
      updateLabel();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    document.querySelectorAll("details[open]").forEach(function (details) {
      details.removeAttribute("open");
      const summary = details.querySelector("summary");
      if (summary) summary.focus({ preventScroll: true });
    });
  });
})();
