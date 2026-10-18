(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var storageKey = "stoic-kb-theme";

  function storedTheme() {
    try { return localStorage.getItem(storageKey); } catch (error) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem(storageKey, value); } catch (error) { /* storage may be unavailable */ }
  }

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateButton() {
    if (!button) return;
    var isDark = currentTheme() === "dark";
    button.textContent = isDark ? "浅色" : "深色";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
  }

  var saved = storedTheme();
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  updateButton();

  if (button) {
    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      saveTheme(next);
      updateButton();
    });
  }
})();
