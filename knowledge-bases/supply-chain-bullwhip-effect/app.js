(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function effectiveTheme() {
    var explicitTheme = root.getAttribute("data-theme");
    if (explicitTheme === "light" || explicitTheme === "dark") return explicitTheme;
    return systemPrefersDark() ? "dark" : "light";
  }

  function renderButton() {
    var isDark = effectiveTheme() === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.textContent = isDark ? "切换浅色" : "切换深色";
  }

  try {
    var stored = localStorage.getItem("kb_darkMode");
    if (stored === "true" || stored === "false") root.setAttribute("data-theme", stored === "true" ? "dark" : "light");
  } catch (error) {
    button.dataset.state = "error";
  }

  button.addEventListener("click", function () {
    var nextTheme = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    button.dataset.state = "success";
    try {
      localStorage.setItem("kb_darkMode", String(nextTheme === "dark"));
    } catch (error) {
      button.dataset.state = "error";
    }
    renderButton();
  });

  renderButton();
})();
