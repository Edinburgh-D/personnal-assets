(function () {
  "use strict";

  var root = document.documentElement;
  var buttons = document.querySelectorAll("[data-theme-toggle]");

  function storedTheme() {
    try {
      return localStorage.getItem("vector-db-theme");
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem("vector-db-theme", value);
    } catch (error) {
      return;
    }
  }

  function effectiveTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function refreshLabels() {
    var isDark = effectiveTheme() === "dark";
    buttons.forEach(function (button) {
      button.textContent = isDark ? "浅色" : "深色";
      button.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
      button.setAttribute("aria-pressed", String(isDark));
    });
  }

  var saved = storedTheme();
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  refreshLabels();

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      setStoredTheme(next);
      refreshLabels();
    });
  });

  document.querySelectorAll("[data-page-select]").forEach(function (select) {
    select.addEventListener("change", function () {
      if (select.value) window.location.href = select.value;
    });
  });
})();
