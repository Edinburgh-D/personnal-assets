(function () {
  'use strict';

  var root = document.documentElement;
  var menuButton = document.querySelector('.nav-menu-btn');
  var navigation = document.querySelector('.mast-nav');
  var themeButton = document.querySelector('.theme-btn');

  function storedTheme() {
    try { return localStorage.getItem('kb_darkMode'); } catch (error) { return null; }
  }

  function saveTheme(isDark) {
    try { localStorage.setItem('kb_darkMode', isDark ? 'true' : 'false'); } catch (error) { /* storage is optional */ }
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    var dark = root.dataset.theme === 'dark';
    themeButton.textContent = dark ? '浅色' : '深色';
    themeButton.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  if (storedTheme() === 'true') root.dataset.theme = 'dark';
  updateThemeLabel();

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var dark = root.dataset.theme !== 'dark';
      root.dataset.theme = dark ? 'dark' : 'light';
      saveTheme(dark);
      updateThemeLabel();
    });
  }

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var open = navigation.getAttribute('aria-expanded') === 'true';
      navigation.setAttribute('aria-expanded', open ? 'false' : 'true');
      menuButton.setAttribute('aria-expanded', open ? 'false' : 'true');
      menuButton.textContent = open ? '目录' : '收起';
    });

    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a') && window.matchMedia('(max-width: 39.99rem)').matches) {
        navigation.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '目录';
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        navigation.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '目录';
        menuButton.focus({ preventScroll: true });
      }
    });
  }
})();
