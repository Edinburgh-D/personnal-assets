(function () {
  "use strict";

  var root = document.documentElement;
  var dialog = document.querySelector("[data-chapter-dialog]");
  var openButton = document.querySelector("[data-open-chapters]");
  var closeButton = document.querySelector("[data-close-chapters]");
  var themeButton = document.querySelector("[data-theme-toggle]");
  var progress = document.querySelector("[data-reading-progress]");
  var storageKey = "kb_darkMode_vikings";

  function getStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {
      return;
    }
  }

  function applyTheme(value) {
    root.dataset.theme = value;
    if (!themeButton) return;
    var dark = value === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "切换为浅色模式" : "切换为深色模式");
    themeButton.textContent = dark ? "浅色" : "深色";
  }

  var savedTheme = getStoredTheme();
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }

  if (dialog && openButton && closeButton) {
    openButton.addEventListener("click", function () {
      dialog.showModal();
      var firstLink = dialog.querySelector("a");
      if (firstLink) firstLink.focus();
    });

    closeButton.addEventListener("click", function () {
      dialog.close();
      openButton.focus();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      if (document.activeElement && dialog.contains(document.activeElement)) openButton.focus();
    });
  }

  var progressScheduled = false;

  function updateProgress() {
    progressScheduled = false;
    if (!progress) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
    progress.parentElement.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }

  function requestProgressUpdate() {
    if (progressScheduled) return;
    progressScheduled = true;
    window.requestAnimationFrame(updateProgress);
  }

  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);
  updateProgress();
})();
