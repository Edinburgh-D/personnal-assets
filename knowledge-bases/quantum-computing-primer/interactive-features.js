(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const navButton = document.querySelector("[data-nav-toggle]");
  const navDrawer = document.querySelector("[data-nav-drawer]");
  const progress = document.querySelector("[data-reading-progress]");
  const progressWrap = progress?.closest("[role='progressbar']");

  const readStoredTheme = () => {
    try {
      return localStorage.getItem("kb_darkMode");
    } catch {
      return null;
    }
  };
  const storeTheme = (dark) => {
    try {
      localStorage.setItem("kb_darkMode", String(dark));
    } catch {
      // The chosen theme still applies for this page when storage is unavailable.
    }
  };

  const storedTheme = readStoredTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const setTheme = (dark) => {
    root.dataset.theme = dark ? "dark" : "light";
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.setAttribute("aria-label", dark ? "切换为浅色模式" : "切换为深色模式");
      const label = themeButton.querySelector("[data-theme-label]");
      if (label) label.textContent = dark ? "浅色" : "深色";
    }
  };

  setTheme(storedTheme === null ? prefersDark : storedTheme === "true");

  themeButton?.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    setTheme(dark);
    storeTheme(dark);
  });

  const closeNav = () => {
    if (!navButton || !navDrawer) return;
    navDrawer.hidden = true;
    navButton.setAttribute("aria-expanded", "false");
  };

  navButton?.addEventListener("click", () => {
    if (!navDrawer) return;
    const open = navDrawer.hidden;
    navDrawer.hidden = !open;
    navButton.setAttribute("aria-expanded", String(open));
    if (open) navDrawer.querySelector("a")?.focus();
  });

  navDrawer?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  let progressQueued = false;
  const updateProgress = () => {
    progressQueued = false;
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1;
    progress.style.transform = `scaleX(${ratio})`;
    progressWrap?.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  };

  window.addEventListener("scroll", () => {
    if (progressQueued) return;
    progressQueued = true;
    requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  const simulator = document.querySelector("[data-phase-simulator]");
  if (!simulator) return;

  let phase = "plus";
  const phaseButtons = Array.from(simulator.querySelectorAll("[data-phase]"));
  const zeroFill = simulator.querySelector("[data-result-fill='0']");
  const oneFill = simulator.querySelector("[data-result-fill='1']");
  const zeroText = simulator.querySelector("[data-result-text='0']");
  const oneText = simulator.querySelector("[data-result-text='1']");
  const status = simulator.querySelector("[data-sim-status]");

  const renderCounts = (zeros, ones, label) => {
    const total = Math.max(1, zeros + ones);
    const p0 = zeros / total;
    const p1 = ones / total;
    if (zeroFill) zeroFill.style.transform = `scaleX(${p0})`;
    if (oneFill) oneFill.style.transform = `scaleX(${p1})`;
    if (zeroText) zeroText.textContent = `${zeros} 次`;
    if (oneText) oneText.textContent = `${ones} 次`;
    if (status) status.textContent = label;
  };

  phaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      phase = button.dataset.phase || "plus";
      phaseButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      renderCounts(0, 0, phase === "plus" ? "已选择同相状态。" : "已选择反相状态。");
    });
  });

  simulator.querySelector("[data-measure='direct']")?.addEventListener("click", () => {
    let zeros = 0;
    for (let index = 0; index < 20; index += 1) {
      if (Math.random() < 0.5) zeros += 1;
    }
    renderCounts(zeros, 20 - zeros, "直接测量时，两种状态都表现为接近各半的随机结果。");
  });

  simulator.querySelector("[data-measure='interfere']")?.addEventListener("click", () => {
    const zeros = phase === "plus" ? 20 : 0;
    renderCounts(zeros, 20 - zeros, "先让两条振幅重新相遇，相位差就变成可见的0或1。");
  });

  simulator.querySelector("[data-measure='reset']")?.addEventListener("click", () => {
    renderCounts(0, 0, "选择状态，再比较两种测量方式。");
  });
})();
