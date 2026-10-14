(function () {
  "use strict";

  var root = document.documentElement;
  var menuButton = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  var themeButton = document.querySelector("[data-theme-toggle]");

  function setMenu(open) {
    if (!menuButton || !menu) return;
    menu.dataset.open = String(open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "收起导航" : "展开导航";
    document.body.classList.toggle("menu-open", open && window.matchMedia("(max-width: 39.999rem)").matches);
  }

  function storageKey() {
    return themeButton ? themeButton.dataset.storageKey : "kb_darkMode";
  }

  function storedTheme() {
    try { return localStorage.getItem(storageKey()); } catch (error) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem(storageKey(), value); } catch (error) { /* storage is optional */ }
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    themeButton.textContent = currentTheme() === "dark" ? "切换浅色" : "切换深色";
  }

  var saved = storedTheme();
  if (saved === "dark" || saved === "light") root.dataset.theme = saved;
  updateThemeLabel();

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      saveTheme(next);
      updateThemeLabel();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", function (event) {
    if (!menu || !menuButton || menu.dataset.open !== "true") return;
    if (menu.contains(event.target) || menuButton.contains(event.target)) return;
    setMenu(false);
  });

  window.matchMedia("(min-width: 40rem)").addEventListener("change", function (event) {
    if (event.matches) setMenu(false);
  });
}());
