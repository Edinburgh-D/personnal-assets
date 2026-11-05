(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");

  function currentTheme() {
    return root.getAttribute("data-theme") || "auto";
  }

  function updateThemeLabel() {
    if (!toggle) return;
    var theme = currentTheme();
    toggle.textContent = theme === "dark" ? "浅色" : "深色";
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("kb_darkModeTheme", next); } catch (error) { /* storage is optional */ }
      updateThemeLabel();
    });
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", expanded ? "false" : "true");
      menu.hidden = expanded;
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      }
    });
  }

  try {
    var saved = localStorage.getItem("kb_darkModeTheme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (error) { /* use system preference */ }
  updateThemeLabel();
})();
