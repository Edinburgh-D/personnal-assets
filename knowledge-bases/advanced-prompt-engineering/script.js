(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");
  var progress = document.querySelector("[data-progress]");

  function storedTheme() {
    try {
      return window.localStorage.getItem("kb_darkMode") === "true" ? "dark" : window.localStorage.getItem("advanced-prompt-theme");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(value) {
    try {
      window.localStorage.setItem("advanced-prompt-theme", value);
      window.localStorage.setItem("kb_darkMode", String(value === "dark"));
    } catch (error) {
      return;
    }
  }

  function updateThemeLabels() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeButtons.forEach(function (button) {
      button.textContent = dark ? "日" : "夜";
      button.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
      button.setAttribute("title", dark ? "浅色模式" : "深色模式");
    });
  }

  var initialTheme = storedTheme();
  if (initialTheme === "dark" || initialTheme === "light") {
    root.setAttribute("data-theme", initialTheme);
  }
  updateThemeLabels();

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var next;
      if (current) {
        next = current === "dark" ? "light" : "dark";
      } else {
        next = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
      }
      root.setAttribute("data-theme", next);
      saveTheme(next);
      updateThemeLabels();
    });
  });

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!open));
      menuButton.setAttribute("aria-expanded", String(!open));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.getAttribute("data-open") === "true") {
        menu.setAttribute("data-open", "false");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
  }

  function updateProgress() {
    if (!progress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
    progress.style.transformOrigin = "left center";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
