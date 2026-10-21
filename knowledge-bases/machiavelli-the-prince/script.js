(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menuPanel = document.querySelector('[data-menu-panel]');
  const themeButton = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('kb_darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeButton) {
      themeButton.textContent = theme === 'dark' ? '切换浅色' : '切换深色';
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  };

  applyTheme(savedTheme === null ? (prefersDark ? 'dark' : 'light') : (savedTheme === 'true' ? 'dark' : 'light'));

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('kb_darkMode', String(nextTheme === 'dark'));
      applyTheme(nextTheme);
    });
  }

  if (menuButton && menuPanel) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuPanel.hidden;
      menuPanel.hidden = !willOpen;
      menuButton.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) menuPanel.querySelector('a')?.focus();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menuPanel.hidden) {
        menuPanel.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.focus();
      }
    });
  }
})();
