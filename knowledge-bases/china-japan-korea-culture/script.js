(function () {
  const root = document.documentElement;
  const button = document.querySelector("[data-theme-toggle]");
  const saved = localStorage.getItem("kb_darkMode");

  if (saved === "true" || saved === "false") {
    root.dataset.theme = saved === "true" ? "dark" : "light";
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateLabel() {
    if (!button) return;
    const dark = currentTheme() === "dark";
    button.textContent = dark ? "切换浅色" : "切换深色";
    button.setAttribute("aria-pressed", String(dark));
  }

  if (button) {
    button.addEventListener("click", function () {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("kb_darkMode", String(next === "dark"));
      updateLabel();
    });
  }

  updateLabel();
})();
