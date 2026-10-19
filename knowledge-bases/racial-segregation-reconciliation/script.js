(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateToggle() {
    if (!toggle) return;
    var isDark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.textContent = isDark ? "切换浅色" : "切换深色";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("kb_darkMode", next);
      } catch (error) {
        /* The selected theme still applies for the current page. */
      }
      updateToggle();
    });
  }

  updateToggle();
}());
