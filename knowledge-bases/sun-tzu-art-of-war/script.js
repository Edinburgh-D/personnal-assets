(function () {
  "use strict";

  const root = document.documentElement;
  const nav = document.querySelector("[data-primary-nav]");
  const menuButton = document.querySelector("[data-nav-toggle]");
  const themeButton = document.querySelector("[data-theme-toggle]");
  const storageKey = "sun-tzu-art-of-war-theme";

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && window.matchMedia("(max-width: 59.99rem)").matches) {
        menuButton.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    const isDark = currentTheme() === "dark";
    themeButton.textContent = isDark ? "浅色" : "深色";
    themeButton.setAttribute("aria-label", isDark ? "切换浅色模式" : "切换深色模式");
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem(storageKey, next);
      } catch (error) {
        root.dataset.theme = next;
      }
      updateThemeLabel();
    });
    updateThemeLabel();
  }
})();
