(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "ai-work-theme";

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function currentTheme() {
    return root.dataset.theme || systemTheme();
  }

  function updateButton() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    var theme = currentTheme();
    button.textContent = theme === "dark" ? "切换浅色" : "切换深色";
    button.setAttribute("aria-label", theme === "dark" ? "切换为浅色模式" : "切换为深色模式");
  }

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  } catch (error) {
    root.removeAttribute("data-theme");
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateButton();
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) return;

    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem(storageKey, next);
        button.dataset.state = "success";
        window.setTimeout(function () {
          delete button.dataset.state;
        }, 1200);
      } catch (error) {
        button.dataset.state = "error";
      }
      updateButton();
    });
  });
})();
