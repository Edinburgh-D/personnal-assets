(function () {
  "use strict";

  var root = document.documentElement;
  var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-theme-toggle]"));

  function preferredTheme() {
    try {
      var saved = localStorage.getItem("kb_darkMode");
      if (saved === "true") return "dark";
      if (saved === "false") return "light";
    } catch (error) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function render(theme) {
    root.setAttribute("data-theme", theme);
    toggles.forEach(function (button) {
      var dark = theme === "dark";
      button.setAttribute("aria-pressed", String(dark));
      button.textContent = dark ? "切到浅色" : "切到深色";
    });
  }

  render(root.getAttribute("data-theme") || preferredTheme());

  toggles.forEach(function (button) {
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      render(next);
      try {
        localStorage.setItem("kb_darkMode", String(next === "dark"));
      } catch (error) {
        button.dataset.state = "error";
        button.setAttribute("aria-label", "显示模式已切换，但浏览器未保存偏好");
      }
    });
  });

  document.querySelectorAll(".mobile-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      var details = link.closest("details");
      if (details) details.open = false;
    });
  });
})();
