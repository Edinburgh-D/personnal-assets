(() => {
  const root = document.documentElement;
  const menu = document.querySelector(".rail-links");
  const menuButton = document.querySelector(".menu-toggle");
  const themeButton = document.querySelector(".theme-toggle");
  const storageKey = "kb_darkMode";

  const storedTheme = localStorage.getItem(storageKey);
  if (storedTheme === "dark" || storedTheme === "true") {
    root.dataset.theme = "dark";
  } else if (storedTheme === "light" || storedTheme === "false") {
    root.dataset.theme = "light";
  } else {
    root.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  const syncThemeLabel = () => {
    if (!themeButton) return;
    const dark = root.dataset.theme === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.textContent = dark ? "浅色" : "深色";
  };

  syncThemeLabel();

  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, root.dataset.theme);
    syncThemeLabel();
  });

  menuButton?.addEventListener("click", () => {
    if (!menu) return;
    const open = menu.dataset.open !== "true";
    menu.dataset.open = String(open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu || !menuButton) return;
    menu.dataset.open = "false";
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.focus();
  });

  menu?.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLAnchorElement) || !menuButton) return;
    menu.dataset.open = "false";
    menuButton.setAttribute("aria-expanded", "false");
  });
})();
