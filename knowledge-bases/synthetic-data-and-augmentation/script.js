(() => {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const storedDark = localStorage.getItem("kb_darkMode");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (toggle) {
      toggle.textContent = theme === "dark" ? "浅色" : "深色";
      toggle.setAttribute("aria-label", theme === "dark" ? "切换到浅色模式" : "切换到深色模式");
    }
  }

  applyTheme(storedDark === null ? (systemDark ? "dark" : "light") : (storedDark === "true" ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("kb_darkMode", String(next === "dark"));
      applyTheme(next);
    });
  }
})();
