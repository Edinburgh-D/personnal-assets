(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav-links]');

  const preferredTheme = () => {
    const saved = localStorage.getItem('inequality-gini-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
      themeButton.textContent = theme === 'dark' ? '浅色' : '深色';
    }
  };

  applyTheme(preferredTheme());
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('inequality-gini-theme', next);
  });

  const closeMenu = () => {
    if (!nav || !menuButton) return;
    nav.dataset.open = 'false';
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    if (!nav) return;
    const open = nav.dataset.open !== 'true';
    nav.dataset.open = String(open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!nav || !menuButton || nav.contains(event.target) || menuButton.contains(event.target)) return;
    closeMenu();
  });
})();
