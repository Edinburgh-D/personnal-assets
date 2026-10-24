(function () {
  "use strict";

  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const progress = document.querySelector("[data-reading-progress]");
  const menu = document.querySelector(".path-menu");

  function storedTheme() {
    try {
      return localStorage.getItem("kb_darkMode");
    } catch (error) {
      return null;
    }
  }

  function updateThemeLabel() {
    if (!toggle) return;
    const dark = root.dataset.theme === "dark" || (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    toggle.textContent = dark ? "浅色" : "深色";
    toggle.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const dark = root.dataset.theme === "dark" || (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.dataset.theme = dark ? "light" : "dark";
      try {
        localStorage.setItem("kb_darkMode", String(!dark));
      } catch (error) {
        // Theme persistence is optional when storage is unavailable.
      }
      updateThemeLabel();
    });
  }

  if (storedTheme() === "true") root.dataset.theme = "dark";
  if (storedTheme() === "false") root.dataset.theme = "light";
  updateThemeLabel();

  function updateProgress() {
    if (!progress) return;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu && menu.open) {
      menu.open = false;
      const summary = menu.querySelector("summary");
      if (summary) summary.focus();
    }
  });
})();
