(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var key = "kb_darkMode";

  function preferredTheme() {
    try {
      return localStorage.getItem(key) || "auto";
    } catch (error) {
      return "auto";
    }
  }

  function applyTheme(theme) {
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    if (!toggle) return;
    var next = theme === "auto" ? "深色" : theme === "dark" ? "浅色" : "自动";
    toggle.textContent = next;
    toggle.setAttribute("aria-label", "切换到" + next + "模式");
  }

  applyTheme(preferredTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = preferredTheme();
      var next = current === "auto" ? "dark" : current === "dark" ? "light" : "auto";
      try { localStorage.setItem(key, next); } catch (error) { toggle.dataset.state = "error"; }
      applyTheme(next);
    });
  }
}());
