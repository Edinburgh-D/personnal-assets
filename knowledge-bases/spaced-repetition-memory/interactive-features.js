(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const storageKey = "kb_darkMode";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const readStoredTheme = () => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "true") return "dark";
      if (stored === "false") return "light";
      return stored;
    } catch {
      return null;
    }
  };

  const applyTheme = (theme) => {
    const dark = theme === "dark";
    root.dataset.theme = dark ? "dark" : "light";
    if (themeButton) themeButton.setAttribute("aria-pressed", String(dark));
    if (themeLabel) themeLabel.textContent = dark ? "浅色" : "深色";
  };

  const storedTheme = readStoredTheme();
  applyTheme(storedTheme || (prefersDark.matches ? "dark" : "light"));

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(storageKey, String(nextTheme === "dark"));
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }
  });

  const progressBar = document.querySelector(".reading-progress");
  const progressFill = document.querySelector("[data-reading-progress]");
  const updateProgress = () => {
    if (!progressBar || !progressFill) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 100;
    progressFill.style.transform = `scaleX(${value / 100})`;
    progressBar.setAttribute("aria-valuenow", String(Math.round(value)));
  };

  let progressFrame = 0;
  window.addEventListener("scroll", () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      updateProgress();
      progressFrame = 0;
    });
  }, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const lab = document.querySelector("[data-practice-lab]");
  if (lab) {
    const answer = lab.querySelector("[data-answer]");
    const reveal = lab.querySelector("[data-reveal-answer]");
    const ratings = [...lab.querySelectorAll("[data-rating]")];
    const status = lab.querySelector("[data-lab-status]");
    const messages = {
      again: "先修正理解，再安排一次较近的无提示作答。",
      hint: "提示帮你找回了路径；撤掉提示，并保守增加间隔。",
      hard: "成功但费力；核对条件后，可以适度增加间隔。",
      easy: "独立且轻松；拉长间隔，并在下次更换问题线索。"
    };

    reveal?.addEventListener("click", () => {
      if (answer) answer.hidden = false;
      ratings.forEach((button) => { button.disabled = false; });
      reveal.disabled = true;
      if (status) status.textContent = "现在比较你的答案，并选择最接近的回忆质量。";
    });

    ratings.forEach((button) => {
      button.addEventListener("click", () => {
        ratings.forEach((item) => item.removeAttribute("aria-pressed"));
        button.setAttribute("aria-pressed", "true");
        if (status) status.textContent = messages[button.dataset.rating] || "记录完成。";
      });
    });
  }
})();
