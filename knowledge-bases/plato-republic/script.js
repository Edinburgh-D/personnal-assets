(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.querySelector('.rail-links');
  var menuButton = document.querySelector('.rail-toggle');
  var themeButton = document.querySelector('.theme-toggle');

  function storedTheme() {
    try { return localStorage.getItem('kb_darkMode'); } catch (error) { return null; }
  }

  function saveTheme(value) {
    try { localStorage.setItem('kb_darkMode', value); } catch (error) {}
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var dark = root.dataset.theme === 'dark';
    themeButton.textContent = dark ? '浅色' : '深色';
    themeButton.setAttribute('aria-pressed', String(dark));
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (next === 'dark') root.dataset.theme = 'dark';
      else delete root.dataset.theme;
      saveTheme(next === 'dark' ? 'true' : 'false');
      updateThemeLabel();
    });
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var open = nav.dataset.open !== 'true';
      nav.dataset.open = String(open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav && menuButton) {
      nav.dataset.open = 'false';
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  if (storedTheme() === 'true') root.dataset.theme = 'dark';
  updateThemeLabel();
}());
