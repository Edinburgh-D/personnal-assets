(function () {
  "use strict";

  var root = document.documentElement;
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-theme-toggle]"));

  function storedTheme() {
    try {
      var value = localStorage.getItem("kb_darkMode");
      if (value === "true") return "dark";
      if (value === "false") return "light";
      return null;
    } catch (error) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem("kb_darkMode", String(value === "dark")); } catch (error) { /* storage can be unavailable */ }
  }

  function resolvedTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncButton() {
    var dark = resolvedTheme() === "dark";
    root.classList.toggle("dark-mode", dark);
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(dark));
      button.textContent = dark ? "切到浅色" : "切到深色";
    });
  }

  var initial = storedTheme();
  if (initial === "light" || initial === "dark") root.setAttribute("data-theme", initial);
  syncButton();

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var next = resolvedTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      saveTheme(next);
      syncButton();
    });
  });

  document.querySelectorAll(".mobile-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      var disclosure = link.closest("details");
      if (disclosure) disclosure.removeAttribute("open");
    });
  });
})();
