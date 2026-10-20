(function () {
  "use strict";

  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var storedTheme = null;

  try {
    storedTheme = localStorage.getItem("kb_darkMode");
  } catch (error) {
    storedTheme = null;
  }

  if (storedTheme === "true" || storedTheme === "false") {
    root.dataset.theme = storedTheme === "true" ? "dark" : "light";
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.dataset.theme = "dark";
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var dark = root.dataset.theme === "dark";
    themeButton.textContent = dark ? "切换浅色" : "切换深色";
    themeButton.setAttribute("aria-pressed", String(dark));
  }

  updateThemeLabel();

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("kb_darkMode", String(root.dataset.theme === "dark"));
      } catch (error) {
        /* Theme still changes for this page when storage is unavailable. */
      }
      updateThemeLabel();
    });
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menu.hidden = expanded;
    });

    window.matchMedia("(min-width: 40rem)").addEventListener("change", function (event) {
      if (event.matches) {
        menu.hidden = false;
        menuButton.setAttribute("aria-expanded", "true");
      } else {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
