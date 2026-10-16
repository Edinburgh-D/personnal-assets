(function () {
  'use strict';

  var root = document.documentElement;
  var themeButton = document.querySelector('[data-theme-toggle]');
  var storageKey = 'kb_darkMode';

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      themeButton.textContent = theme === 'dark' ? '浅色' : '深色';
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
      try { localStorage.setItem(storageKey, next); } catch (error) { /* storage is optional */ }
    });
  }

  var progress = document.querySelector('.reading-progress span');
  function updateProgress() {
    if (!progress) return;
    var available = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = available > 0 ? window.scrollY / available : 0;
    progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
  }
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  setTheme(root.dataset.theme || 'light');
}());
