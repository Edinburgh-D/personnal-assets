/* Hallmark · restrained interactions: theme state + native disclosure support */
(function () {
  "use strict";

  var root = document.body;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var menu = document.querySelector(".nav-menu");

  function getStoredTheme() {
    try {
      var stored = window.localStorage.getItem("kb_darkMode");
      return stored === "true" ? "dark" : stored === "false" ? "light" : null;
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      window.localStorage.setItem("kb_darkMode", String(value === "dark"));
    } catch (error) {
      return;
    }
  }

  function preferredTheme() {
    var stored = getStoredTheme();
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function renderTheme(theme) {
    root.dataset.theme = theme;
    if (!themeButton) return;
    var isDark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.textContent = isDark ? "切换浅色" : "切换深色";
  }

  renderTheme(preferredTheme());

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      renderTheme(nextTheme);
      setStoredTheme(nextTheme);
    });
  }

  document.addEventListener("click", function (event) {
    if (!menu || !menu.open || menu.contains(event.target)) return;
    menu.open = false;
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu && menu.open) {
      menu.open = false;
      var summary = menu.querySelector("summary");
      if (summary) summary.focus({ preventScroll: true });
    }
  });
})();
