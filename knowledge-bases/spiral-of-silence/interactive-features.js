(function () {
  "use strict";

  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var progress = document.querySelector("[data-progress-fill]");
  var menu = document.querySelector(".chapter-menu");

  function storedTheme() {
    try {
      var value = localStorage.getItem("kb_darkMode");
      if (value === null) return null;
      return value === "true" ? "dark" : "light";
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem("kb_darkMode", String(value === "dark"));
    } catch (error) {
      return;
    }
  }

  function resolvedTheme() {
    var saved = storedTheme();
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  function applyTheme(value) {
    root.dataset.theme = value;
    if (themeButton) {
      var isDark = value === "dark";
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.textContent = isDark ? "切换浅色" : "切换深色";
    }
  }

  applyTheme(resolvedTheme());

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  function updateProgress() {
    if (!progress) return;
    var available = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = available > 0 ? window.scrollY / available : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (menu && menu.open && !menu.contains(event.target)) menu.open = false;
  });
}());
