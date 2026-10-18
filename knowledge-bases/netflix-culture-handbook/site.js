(function () {
  const root = document.documentElement;
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;

  const storageKey = button.dataset.storageKey || 'kb_darkMode';
  const stored = localStorage.getItem(storageKey);
  if (stored === 'true') root.dataset.theme = 'dark';
  if (stored === 'false') root.dataset.theme = 'light';

  const currentTheme = () => {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const render = () => {
    const dark = currentTheme() === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.textContent = dark ? '切换浅色' : '切换深色';
  };

  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem(storageKey, String(next === 'dark'));
    render();
  });

  render();
}());
