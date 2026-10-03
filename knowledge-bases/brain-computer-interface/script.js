(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.querySelector(".nav-menu-btn");
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");
  var storageKey = "kb_darkMode";

  function storedTheme() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(isDark) {
    try {
      window.localStorage.setItem(storageKey, isDark ? "true" : "false");
    } catch (error) {
      return;
    }
  }

  function applyTheme(isDark) {
    root.dataset.theme = isDark ? "dark" : "light";
    themeButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(isDark));
      button.textContent = isDark ? "浅色" : "深色";
      button.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
    });
  }

  function closeMenu() {
    document.body.classList.remove("nav-open");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
  }

  window.toggleNavMenu = function () {
    var willOpen = !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", willOpen);
    if (menuButton) menuButton.setAttribute("aria-expanded", String(willOpen));
  };

  var stored = storedTheme();
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored === null ? prefersDark : stored === "true");

  if (menuButton) {
    menuButton.addEventListener("click", window.toggleNavMenu);
  }

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var nextDark = root.dataset.theme !== "dark";
      applyTheme(nextDark);
      saveTheme(nextDark);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
})();
