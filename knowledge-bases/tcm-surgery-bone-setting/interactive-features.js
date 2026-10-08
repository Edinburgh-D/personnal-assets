(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const progress = document.querySelector('[data-reading-progress]');
  const storedTheme = localStorage.getItem('kb_darkMode');

  if (storedTheme === 'true' || storedTheme === 'false') {
    root.dataset.theme = storedTheme === 'true' ? 'dark' : 'light';
  }

  const labelThemeButton = () => {
    if (!toggle) return;
    const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    toggle.textContent = dark ? '浅色阅读' : '深色阅读';
    toggle.setAttribute('aria-pressed', String(dark));
  };

  if (toggle) {
    labelThemeButton();
    toggle.addEventListener('click', () => {
      const currentlyDark = root.dataset.theme === 'dark' || (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.dataset.theme = currentlyDark ? 'light' : 'dark';
      localStorage.setItem('kb_darkMode', String(root.dataset.theme === 'dark'));
      labelThemeButton();
    });
  }

  if (progress) {
    let ticking = false;
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 1;
      progress.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }
})();
