(function () {
  'use strict';

  var root = document.documentElement;
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-primary-nav]');
  var themeButton = document.querySelector('[data-theme-toggle]');
  var storageKey = 'kb_darkMode';

  function setMenu(open) {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    if (open) {
      var firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  }

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus({ preventScroll: true });
      }
    });
  }

  function applyTheme(mode) {
    root.dataset.theme = mode;
    if (themeButton) {
      var dark = mode === 'dark';
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.textContent = dark ? '浅色' : '深色';
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (error) { saved = null; }
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(storageKey, next); } catch (error) { /* storage is optional */ }
    });
  }
}());
