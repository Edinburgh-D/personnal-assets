(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('.nav-menu-btn');
  const menu = document.querySelector('.mast-links');
  const themeButton = document.querySelector('.theme-btn');

  const storedTheme = localStorage.getItem('kb_darkMode');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    root.dataset.theme = storedTheme;
  }

  const syncThemeButton = () => {
    if (!themeButton) return;
    const isDark = root.dataset.theme === 'dark' ||
      (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.textContent = isDark ? '浅色' : '深色';
  };

  menuButton?.addEventListener('click', () => {
    const open = menu?.dataset.open !== 'true';
    if (menu) menu.dataset.open = String(open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  themeButton?.addEventListener('click', () => {
    const currentDark = root.dataset.theme === 'dark' ||
      (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme = currentDark ? 'light' : 'dark';
    localStorage.setItem('kb_darkMode', root.dataset.theme);
    syncThemeButton();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.dataset.open === 'true') {
      menu.dataset.open = 'false';
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.focus();
    }
  });

  syncThemeButton();
})();
