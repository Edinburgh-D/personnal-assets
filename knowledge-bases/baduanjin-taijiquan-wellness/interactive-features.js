(function () {
  "use strict";

  var root = document.documentElement;
  var buttons = document.querySelectorAll("[data-theme-toggle]");
  var storedTheme = localStorage.getItem("baduanjin-tai-theme");

  function prefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function isDark() {
    return root.dataset.theme === "dark" || (!root.dataset.theme && prefersDark());
  }

  function refreshButtons() {
    var dark = isDark();
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", dark ? "true" : "false");
      button.textContent = dark ? "切换浅色" : "切换深色";
    });
  }

  if (storedTheme === "dark" || storedTheme === "light") {
    root.dataset.theme = storedTheme;
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var nextTheme = isDark() ? "light" : "dark";
      root.dataset.theme = nextTheme;
      localStorage.setItem("baduanjin-tai-theme", nextTheme);
      localStorage.setItem("kb_darkMode", nextTheme === "dark" ? "true" : "false");
      refreshButtons();
    });
  });

  refreshButtons();
})();
