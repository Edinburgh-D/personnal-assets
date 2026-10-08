(function () {
  const root = document.documentElement;
  const menuButton = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-rail-nav]');
  const themeButton = document.querySelector('[data-theme-toggle]');
  const storedTheme = localStorage.getItem('korean-war-theme');

  if (storedTheme === 'light' || storedTheme === 'dark') {
    root.dataset.theme = storedTheme;
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    const dark = root.dataset.theme === 'dark' ||
      (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    themeButton.textContent = dark ? '浅色' : '深色';
    themeButton.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const open = nav.dataset.open !== 'true';
      nav.dataset.open = String(open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '收起' : '目录';
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.dataset.open === 'true') {
        nav.dataset.open = 'false';
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '目录';
        menuButton.focus();
      }
    });
  }

  if (themeButton) {
    updateThemeLabel();
    themeButton.addEventListener('click', function () {
      const currentlyDark = root.dataset.theme === 'dark' ||
        (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.dataset.theme = currentlyDark ? 'light' : 'dark';
      localStorage.setItem('korean-war-theme', root.dataset.theme);
      localStorage.setItem('kb_darkMode', String(root.dataset.theme === 'dark'));
      updateThemeLabel();
    });
  }
}());
