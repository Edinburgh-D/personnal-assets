(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var stored = localStorage.getItem("kb_darkMode");

  function darkIsActive() {
    if (root.classList.contains("kb-dark")) return true;
    if (root.classList.contains("kb-light")) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function updateLabel() {
    if (!button) return;
    var next = darkIsActive() ? "浅色" : "深色";
    button.textContent = "切换为" + next;
    button.setAttribute("aria-label", "切换为" + next + "模式");
  }

  if (stored === "dark") root.classList.add("kb-dark");
  if (stored === "light") root.classList.add("kb-light");
  updateLabel();

  if (button) {
    button.addEventListener("click", function () {
      var useDark = !darkIsActive();
      root.classList.toggle("kb-dark", useDark);
      root.classList.toggle("kb-light", !useDark);
      localStorage.setItem("kb_darkMode", useDark ? "dark" : "light");
      button.dataset.state = "success";
      updateLabel();
      window.setTimeout(function () { delete button.dataset.state; }, 600);
    });
  }
})();
