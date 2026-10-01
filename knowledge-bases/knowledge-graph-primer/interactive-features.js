/* Hallmark · interaction: functional navigation, theme, reading progress · motion-cut */
(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.getElementById("menuButton");
  var menuPanel = document.getElementById("menuPanel");
  var menuScrim = document.getElementById("menuScrim");
  var themeButton = document.getElementById("themeButton");
  var progress = document.getElementById("readingProgress");

  function setMenu(open) {
    if (!menuButton || !menuPanel || !menuScrim) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuPanel.hidden = !open;
    menuScrim.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) {
      var firstLink = menuPanel.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else {
      menuButton.focus({ preventScroll: true });
    }
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var dark = root.getAttribute("data-theme") === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.querySelector(".theme-label").textContent = dark ? "亮色" : "深色";
  }

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("kb_darkMode", String(next === "dark"));
    } catch (error) {
      /* Storage can be unavailable in private or restricted contexts. */
    }
    updateThemeLabel();
  }

  function updateProgress() {
    if (!progress) return;
    var top = window.scrollY || root.scrollTop;
    var range = root.scrollHeight - window.innerHeight;
    var ratio = range > 0 ? Math.min(1, Math.max(0, top / range)) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
    progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
  }

  if (menuScrim) menuScrim.addEventListener("click", function () { setMenu(false); });
  if (themeButton) themeButton.addEventListener("click", toggleTheme);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuButton && menuButton.getAttribute("aria-expanded") === "true") {
      setMenu(false);
    }
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateThemeLabel();
  updateProgress();
})();
