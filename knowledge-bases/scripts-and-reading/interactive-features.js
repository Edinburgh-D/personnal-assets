(function () {
  "use strict";

  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var chapterNav = document.querySelector("[data-chapter-nav]");
  var progress = document.querySelector(".reading-progress__fill");

  function storedTheme() {
    try { return localStorage.getItem("kb_darkMode"); } catch (error) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem("kb_darkMode", value); } catch (error) { /* storage may be unavailable */ }
  }

  function applyTheme(value) {
    root.dataset.theme = value;
    if (themeButton) {
      themeButton.textContent = value === "dark" ? "浅色" : "深色";
      themeButton.setAttribute("aria-label", value === "dark" ? "切换到浅色模式" : "切换到深色模式");
    }
  }

  var initialTheme = storedTheme();
  if (!initialTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) initialTheme = "dark";
  applyTheme(initialTheme || "light");

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  }

  if (menuButton && chapterNav) {
    menuButton.addEventListener("click", function () {
      var open = chapterNav.dataset.open !== "true";
      chapterNav.dataset.open = String(open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "收起" : "章节";
    });
    chapterNav.addEventListener("click", function (event) {
      if (event.target.closest("a") && window.matchMedia("(max-width: 40rem)").matches) {
        chapterNav.dataset.open = "false";
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "章节";
      }
    });
  }

  function updateProgress() {
    if (!progress) return;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    var amount = height > 0 ? window.scrollY / height : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, amount)) + ")";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}());
