/* Hallmark · Long Document · functional interactions only */
(function () {
  "use strict";

  var root = document.documentElement;
  var rail = document.querySelector("[data-rail]");
  var scrim = document.querySelector("[data-scrim]");
  var menuButtons = document.querySelectorAll("[data-menu-toggle]");
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");

  function storedTheme() {
    try {
      return localStorage.getItem("kb_darkMode") === "true" ? "dark" : "light";
    } catch (error) {
      return null;
    }
  }

  function saveTheme(value) {
    try {
      localStorage.setItem("kb_darkMode", String(value === "dark"));
    } catch (error) {
      return;
    }
  }

  function updateThemeLabels() {
    var isDark = root.dataset.theme === "dark";
    themeButtons.forEach(function (button) {
      button.textContent = isDark ? "浅色" : "深色";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
    });
  }

  function toggleTheme() {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    saveTheme(next);
    updateThemeLabels();
  }

  function setMenu(open) {
    if (!rail || !scrim) return;
    rail.classList.toggle("is-open", open);
    scrim.classList.toggle("is-open", open);
    rail.setAttribute("aria-hidden", String(!open && window.matchMedia("(max-width: 59.99rem)").matches));
    menuButtons.forEach(function (button) {
      button.setAttribute("aria-expanded", String(open));
    });
    if (open) {
      var firstLink = rail.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  }

  menuButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMenu(!rail.classList.contains("is-open"));
    });
  });

  themeButtons.forEach(function (button) {
    button.addEventListener("click", toggleTheme);
  });

  if (scrim) {
    scrim.addEventListener("click", function () {
      setMenu(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && rail && rail.classList.contains("is-open")) {
      setMenu(false);
      if (menuButtons[0]) menuButtons[0].focus({ preventScroll: true });
    }
  });

  var preferred = storedTheme();
  if (!preferred && window.matchMedia("(prefers-color-scheme: dark)").matches) preferred = "dark";
  root.dataset.theme = preferred === "dark" ? "dark" : "light";
  updateThemeLabels();
})();
