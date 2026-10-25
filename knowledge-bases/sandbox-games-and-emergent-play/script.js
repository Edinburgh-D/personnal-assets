(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var menus = document.querySelectorAll("details.menu-wrap");

  function storedTheme() {
    try {
      return localStorage.getItem("kb_darkMode");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("kb_darkMode", theme);
    } catch (error) {
      return;
    }
  }

  function updateButton() {
    if (!button) return;
    var dark = root.getAttribute("data-theme") === "dark";
    button.textContent = dark ? "浅色" : "深色";
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
  }

  if (!root.getAttribute("data-theme")) {
    var saved = storedTheme();
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
  }

  updateButton();

  if (button) {
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      saveTheme(next);
      updateButton();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    menus.forEach(function (menu) {
      if (menu.open) {
        menu.open = false;
        menu.querySelector("summary").focus();
      }
    });
  });

  document.addEventListener("click", function (event) {
    menus.forEach(function (menu) {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
  });
})();
