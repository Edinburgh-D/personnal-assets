(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem("kb_darkMode");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  const labelFor = () => {
    const isDark = root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    return isDark ? "切换到浅色" : "切换到深色";
  };

  const sync = () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", labelFor());
      button.textContent = labelFor();
      if (button.classList.contains("rail__theme")) button.textContent = "◐";
    });
  };

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const darkNow = root.dataset.theme === "dark" ||
        (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.dataset.theme = darkNow ? "light" : "dark";
      localStorage.setItem("kb_darkMode", root.dataset.theme);
      sync();
    });
  });

  document.querySelectorAll(".mobile-menu__panel a").forEach((link) => {
    link.addEventListener("click", () => link.closest("details")?.removeAttribute("open"));
  });

  sync();
})();
