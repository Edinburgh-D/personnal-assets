(function () {
  "use strict";

  var root = document.documentElement;
  var drawer = document.querySelector(".site-drawer");
  var scrim = document.querySelector(".drawer-scrim");
  var menuButton = document.querySelector(".menu-toggle");
  var closeButton = document.querySelector(".drawer-close");
  var themeButton = document.querySelector(".theme-toggle");

  function storedTheme() {
    try { return localStorage.getItem("game-theory-theme"); } catch (error) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem("game-theory-theme", value); } catch (error) { /* storage may be unavailable */ }
  }

  function applyTheme(value) {
    root.dataset.theme = value;
    if (themeButton) {
      themeButton.textContent = value === "dark" ? "切换浅色" : "切换深色";
      themeButton.setAttribute("aria-pressed", String(value === "dark"));
    }
  }

  function openDrawer() {
    if (!drawer || !scrim || !menuButton) return;
    drawer.classList.add("is-open");
    scrim.classList.add("is-open");
    drawer.removeAttribute("inert");
    drawer.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeButton) closeButton.focus();
  }

  function closeDrawer() {
    if (!drawer || !scrim || !menuButton) return;
    drawer.classList.remove("is-open");
    scrim.classList.remove("is-open");
    drawer.setAttribute("inert", "");
    drawer.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    menuButton.focus();
  }

  var initialTheme = storedTheme();
  if (!initialTheme) {
    initialTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(initialTheme);

  if (menuButton) menuButton.addEventListener("click", openDrawer);
  if (closeButton) closeButton.addEventListener("click", closeDrawer);
  if (scrim) scrim.addEventListener("click", closeDrawer);
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && drawer && drawer.classList.contains("is-open")) closeDrawer();
  });

  document.querySelectorAll(".outcome-button").forEach(function (button) {
    button.addEventListener("click", function () {
      var group = button.closest(".matrix-wrap");
      if (!group) return;
      group.querySelectorAll(".outcome-button").forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      var note = group.querySelector(".matrix-note");
      if (note) note.textContent = button.getAttribute("data-explanation") || "";
    });
  });

})();
