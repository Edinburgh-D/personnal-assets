(() => {
  const root = document.documentElement;
  const menu = document.querySelector('[data-site-menu]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const themeButton = document.querySelector('[data-theme-toggle]');

  const setMenu = (open) => {
    if (!menu || !menuButton) return;
    menu.dataset.open = String(open);
    menuButton.setAttribute('aria-expanded', String(open));
  };

  if (menuButton) {
    menuButton.addEventListener('click', () => setMenu(menu.dataset.open !== 'true'));
  }

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeButton) {
      const dark = theme === 'dark';
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.textContent = dark ? '切换浅色' : '切换深色';
    }
  };

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('kb_darkMode', String(next === 'dark')); } catch (_) { /* storage can be blocked */ }
      setTheme(next);
    });
  }

  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  setMenu(false);
})();
