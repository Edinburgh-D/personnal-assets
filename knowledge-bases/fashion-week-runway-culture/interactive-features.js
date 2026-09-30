(function () {
  "use strict";

  var body = document.body;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var nav = document.querySelector("[data-main-nav]");
  var navButton = document.querySelector("[data-nav-toggle]");
  var progress = document.querySelector("[data-reading-progress]");

  function getStoredTheme() {
    try {
      return window.localStorage.getItem("fashion-week-kb-theme");
    } catch (error) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      window.localStorage.setItem("fashion-week-kb-theme", value);
    } catch (error) {
      return;
    }
  }

  function applyTheme(value) {
    var isDark = value === "dark";
    body.dataset.theme = isDark ? "dark" : "light";
    if (themeButton) {
      themeButton.textContent = isDark ? "浅色" : "深色";
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.setAttribute("aria-label", isDark ? "切换为浅色模式" : "切换为深色模式");
    }
  }

  var savedTheme = getStoredTheme();
  if (!savedTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    savedTheme = "dark";
  }
  applyTheme(savedTheme || "light");

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = body.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }

  function closeNav() {
    if (!nav || !navButton) return;
    nav.classList.remove("is-open");
    navButton.setAttribute("aria-expanded", "false");
    navButton.textContent = "目录";
  }

  if (nav && navButton) {
    navButton.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navButton.setAttribute("aria-expanded", String(isOpen));
      navButton.textContent = isOpen ? "收起" : "目录";
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
        navButton.focus();
      }
    });
  }

  function updateProgress() {
    if (!progress) return;
    var maximum = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0;
    progress.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    progress.parentElement.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}());
