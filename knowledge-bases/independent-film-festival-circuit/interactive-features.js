(function () {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const progress = document.querySelector(".reading-marker");
  const themeStorageKey = "kb_darkMode";
  const storedThemeValue = localStorage.getItem(themeStorageKey);
  const storedTheme = storedThemeValue === "true" ? "dark" : storedThemeValue === "false" ? "light" : storedThemeValue;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      const isDark = theme === "dark";
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.textContent = isDark ? "亮色" : "暗色";
      themeButton.dataset.state = "success";
      window.setTimeout(function () {
        delete themeButton.dataset.state;
      }, 600);
    }
  }

  setTheme(storedTheme || (systemDark ? "dark" : "light"));

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
      localStorage.setItem(themeStorageKey, next);
    });
  }

  function updateProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    progress.style.setProperty("--reading-progress", value + "%");
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
