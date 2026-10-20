(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");

  if (!button) return;

  function labelFor(theme) {
    return theme === "dark" ? "浅色" : "深色";
  }

  function updateButton(theme) {
    button.textContent = labelFor(theme);
    button.setAttribute("aria-label", "切换为" + labelFor(theme) + "模式");
    button.setAttribute("aria-pressed", String(theme === "dark"));
  }

  updateButton(root.dataset.theme || "light");

  button.addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("quantum-mechanics-theme", next);
      localStorage.setItem("kb_darkMode", String(next === "dark"));
    } catch (error) {
      button.dataset.state = "error";
    }
    updateButton(next);
  });
})();
