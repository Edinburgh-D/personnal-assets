(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-page-nav]");
  var themeButton = document.querySelector("[data-theme-toggle]");

  function storedTheme() {
    try {
      return localStorage.getItem("cults-kb-theme");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(value) {
    try {
      localStorage.setItem("cults-kb-theme", value);
    } catch (error) {
      return;
    }
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var isDark = root.getAttribute("data-theme") === "dark" ||
      (!root.hasAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    themeButton.textContent = isDark ? "浅色" : "深色";
    themeButton.setAttribute("aria-label", isDark ? "切换为浅色模式" : "切换为深色模式");
  }

  var saved = storedTheme();
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  updateThemeLabel();

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }
    });
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      saveTheme(next);
      updateThemeLabel();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuButton && menu) {
      menuButton.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      menuButton.focus();
    }
  });
}());
