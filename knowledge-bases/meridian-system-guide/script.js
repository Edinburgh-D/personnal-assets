(() => {
  const root = document.documentElement;
  const menu = document.querySelector('#site-menu');
  const openButton = document.querySelector('[data-menu-open]');
  const closeButton = document.querySelector('[data-menu-close]');
  const themeButton = document.querySelector('[data-theme-toggle]');

  const storedTheme = localStorage.getItem('kb_darkMode');
  if (storedTheme === 'true' || storedTheme === 'false') {
    root.dataset.theme = storedTheme === 'true' ? 'dark' : 'light';
  }

  const themeName = () => {
    if (root.dataset.theme) return root.dataset.theme;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const updateThemeLabel = () => {
    if (themeButton) themeButton.textContent = themeName() === 'dark' ? '切换浅色' : '切换深色';
  };

  openButton?.addEventListener('click', () => menu?.showModal());
  closeButton?.addEventListener('click', () => menu?.close());
  menu?.addEventListener('click', (event) => {
    if (event.target === menu) menu.close();
  });

  themeButton?.addEventListener('click', () => {
    const next = themeName() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('kb_darkMode', next === 'dark' ? 'true' : 'false');
    updateThemeLabel();
  });

  const current = location.pathname.split('/').pop() || 'main.html';
  document.querySelectorAll('.menu-links a').forEach((link) => {
    if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'page');
  });

  updateThemeLabel();
})();
