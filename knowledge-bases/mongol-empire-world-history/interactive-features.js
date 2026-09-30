(function () {
  "use strict";

  var body = document.body;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var nav = document.querySelector("[data-main-nav]");
  var navButton = document.querySelector("[data-nav-toggle]");
  var progress = document.querySelector("[data-reading-progress]");

  function storedTheme() {
    try {
      return window.localStorage.getItem("mongol-kb-theme");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(value) {
    try {
      window.localStorage.setItem("mongol-kb-theme", value);
    } catch (error) {
      return;
    }
  }

  function applyTheme(value) {
    body.dataset.theme = value;
    if (themeButton) {
      var isDark = value === "dark";
      themeButton.textContent = isDark ? "浅色" : "深色";
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.setAttribute("aria-label", isDark ? "切换为浅色模式" : "切换为深色模式");
    }
  }

  var initialTheme = storedTheme();
  if (!initialTheme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    initialTheme = "dark";
  }
  applyTheme(initialTheme || "light");

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = body.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
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
      var open = nav.classList.toggle("is-open");
      navButton.setAttribute("aria-expanded", String(open));
      navButton.textContent = open ? "收起" : "目录";
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
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    progress.parentElement.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}());
