(function () {
  "use strict";

  const root = document.documentElement;
  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");
  const themeButton = document.querySelector("[data-theme-button]");
  const storageKey = "military-logistics-theme";

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      const isDark = theme === "dark";
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.textContent = isDark ? "日间" : "夜间";
      themeButton.setAttribute("aria-label", isDark ? "切换到日间模式" : "切换到夜间模式");
    }
  }

  function preferredTheme() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
      if (localStorage.getItem("kb_darkMode") === "true") return "dark";
    } catch (error) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!menu || !menuButton) return;
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
    if (opening) {
      const firstLink = menu.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  }

  setTheme(preferredTheme());

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
      try {
        localStorage.setItem(storageKey, next);
        localStorage.setItem("kb_darkMode", String(next === "dark"));
      } catch (error) {
        themeButton.dataset.state = "error";
      }
    });
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", toggleMenu);
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("click", function (event) {
      if (!menu.hidden && !menu.contains(event.target) && event.target !== menuButton) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !menu.hidden) {
        closeMenu();
        menuButton.focus({ preventScroll: true });
      }
    });
  }
})();
