(function () {
  "use strict";

  var body = document.body;
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("kb_darkMode"); } catch (error) {}
  if (savedTheme === "true" || (!savedTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    body.setAttribute("data-theme", "dark");
  }

  var themeButton = document.querySelector("[data-theme-toggle]");
  function updateThemeLabel() {
    if (!themeButton) return;
    var isDark = body.getAttribute("data-theme") === "dark";
    themeButton.textContent = isDark ? "浅色" : "深色";
    themeButton.setAttribute("aria-pressed", isDark ? "true" : "false");
  }
  if (themeButton) {
    updateThemeLabel();
    themeButton.addEventListener("click", function () {
      var isDark = body.getAttribute("data-theme") === "dark";
      body.setAttribute("data-theme", isDark ? "light" : "dark");
      try { localStorage.setItem("kb_darkMode", isDark ? "false" : "true"); } catch (error) {}
      updateThemeLabel();
    });
  }

  var menuButton = document.querySelector("[data-menu-toggle]");
  var mastNav = document.querySelector(".mast-nav");
  if (menuButton && mastNav) {
    menuButton.addEventListener("click", function () {
      var open = mastNav.getAttribute("data-open") === "true";
      mastNav.setAttribute("data-open", open ? "false" : "true");
      menuButton.setAttribute("aria-expanded", open ? "false" : "true");
    });
  }
})();
