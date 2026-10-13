(function () {
  "use strict";

  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const menu = document.querySelector(".nav-menu");

  function resolvedTheme() {
    if (root.dataset.theme === "dark" || root.dataset.theme === "light") {
      return root.dataset.theme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncThemeButton() {
    if (!toggle) return;
    const dark = resolvedTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.textContent = dark ? "浅色" : "深色";
    toggle.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
  }

  if (toggle) {
    syncThemeButton();
    toggle.addEventListener("click", function () {
      const next = resolvedTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("plato-kb-theme", next);
      } catch (error) {
        toggle.classList.add("is-error");
        window.setTimeout(function () { toggle.classList.remove("is-error"); }, 1200);
      }
      syncThemeButton();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu && menu.open) {
      menu.open = false;
      const summary = menu.querySelector("summary");
      if (summary) summary.focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (menu && menu.open && !menu.contains(event.target)) menu.open = false;
  });
})();
