(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  var themeButton = document.querySelector("[data-theme-toggle]");

  function getStoredTheme() {
    try {
      var value = localStorage.getItem("kb_darkMode");
      if (value === "true") return "dark";
      if (value === "false") return "light";
      return null;
    } catch (error) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem("kb_darkMode", String(value === "dark"));
    } catch (error) {
      return;
    }
  }

  function resolvedTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var isDark = resolvedTheme() === "dark";
    themeButton.textContent = isDark ? "浅色" : "深色";
    themeButton.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
  }

  var savedTheme = getStoredTheme();
  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  }
  updateThemeLabel();

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = resolvedTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      storeTheme(next);
      themeButton.dataset.state = "success";
      updateThemeLabel();
      window.setTimeout(function () {
        delete themeButton.dataset.state;
      }, 150);
    });
  }

  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    mobileNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });
  }
})();
