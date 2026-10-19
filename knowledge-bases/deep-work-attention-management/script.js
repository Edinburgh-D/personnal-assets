(function () {
  "use strict";

  var root = document.documentElement;
  var toggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));

  function isDark() {
    return root.dataset.theme === "dark";
  }

  function updateToggles() {
    var dark = isDark();
    toggles.forEach(function (button) {
      button.setAttribute("aria-pressed", String(dark));
      button.textContent = dark ? "浅色" : "深色";
    });
  }

  toggles.forEach(function (button) {
    button.addEventListener("click", function () {
      var nextDark = !isDark();
      root.dataset.theme = nextDark ? "dark" : "light";
      try {
        localStorage.setItem("kb_darkMode", String(nextDark));
      } catch (error) {
        button.dataset.state = "error";
        window.setTimeout(function () {
          delete button.dataset.state;
        }, 2500);
      }
      updateToggles();
    });
  });

  document.querySelectorAll(".mobile-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      var details = link.closest("details");
      if (details) details.open = false;
    });
  });

  updateToggles();
}());
