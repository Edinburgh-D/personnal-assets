(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const storedTheme = localStorage.getItem('kb_darkMode');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButtons.forEach((button) => {
      const pressed = theme === 'dark';
      button.setAttribute('aria-pressed', String(pressed));
      button.textContent = pressed ? '日' : '夜';
      button.setAttribute('aria-label', pressed ? '切换到浅色模式' : '切换到深色模式');
    });
  }

  setTheme(storedTheme === null ? (preferredDark ? 'dark' : 'light') : (storedTheme === 'true' ? 'dark' : 'light'));

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('kb_darkMode', String(next === 'dark'));
      setTheme(next);
    });
  });

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
      if (!open) menu.querySelector('a')?.focus({ preventScroll: true });
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        menu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) {
        menu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.focus();
      }
    });
  }
})();
