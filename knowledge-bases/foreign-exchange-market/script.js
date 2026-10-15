(() => {
  const storageKey = "kb_darkMode";
  const root = document.documentElement;
  const button = document.querySelector(".theme-toggle");

  const stored = localStorage.getItem(storageKey);
  if (stored === "true") root.dataset.theme = "dark";
  if (stored === "false") root.dataset.theme = "light";

  const isDark = () => root.dataset.theme === "dark" ||
    (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const updateLabel = () => {
    if (!button) return;
    const dark = isDark();
    button.textContent = dark ? "浅色阅读" : "深色阅读";
    button.setAttribute("aria-pressed", String(dark));
  };

  if (button) {
    updateLabel();
    button.addEventListener("click", () => {
      const nextDark = !isDark();
      root.dataset.theme = nextDark ? "dark" : "light";
      localStorage.setItem(storageKey, String(nextDark));
      updateLabel();
    });
  }
})();
