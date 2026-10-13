(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var progress = document.querySelector("[data-progress]");
  var menuButton = document.querySelector(".nav-menu-btn");
  var menu = document.getElementById("kb-nav");
  var storageKey = toggle ? toggle.getAttribute("data-storage-key") : "kb_darkMode_the_crowd";
  var storedTheme = null;

  try {
    storedTheme = window.localStorage.getItem(storageKey);
  } catch (error) {
    storedTheme = null;
  }

  if (storedTheme === "dark" || storedTheme === "light") {
    root.setAttribute("data-theme", storedTheme);
  }

  function themeName() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateToggle() {
    if (!toggle) return;
    var isDark = themeName() === "dark";
    toggle.textContent = isDark ? "浅色" : "深色";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
  }

  if (toggle) {
    updateToggle();
    toggle.addEventListener("click", function () {
      var next = themeName() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch (error) {
        /* Storage can be unavailable in strict privacy modes. */
      }
      updateToggle();
    });
  }

  window.toggleNavMenu = function () {
    if (!menuButton || !menu) return;
    var willOpen = menu.hasAttribute("hidden");
    menu.toggleAttribute("hidden", !willOpen);
    menuButton.setAttribute("aria-expanded", String(willOpen));
  };

  if (menuButton && menu) {
    menuButton.addEventListener("click", window.toggleNavMenu);
    window.matchMedia("(min-width: 60rem)").addEventListener("change", function (event) {
      if (event.matches) {
        menu.removeAttribute("hidden");
        menuButton.setAttribute("aria-expanded", "true");
      }
    });
  }

  function updateProgress() {
    if (!progress) return;
    var distance = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = distance > 0 ? window.scrollY / distance : 0;
    progress.style.setProperty("--progress", Math.min(100, Math.max(0, ratio * 100)) + "%");
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
