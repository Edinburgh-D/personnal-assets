(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const navButton = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const progress = document.querySelector("[data-reading-progress]");
  const progressWrap = progress?.closest("[role='progressbar']");

  const readTheme = () => {
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
      // The theme still applies for this page when storage is unavailable.
    }
  };

  const setTheme = (dark) => {
    root.dataset.theme = dark ? "dark" : "light";
    if (!themeButton) return;
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "切换为浅色模式" : "切换为深色模式");
    const label = themeButton.querySelector("[data-theme-label]");
    if (label) label.textContent = dark ? "浅色" : "深色";
  };

  const storedTheme = readTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(storedTheme === null ? prefersDark : storedTheme === "true");

  themeButton?.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    setTheme(dark);
    storeTheme(dark);
  });

  const closeNav = () => {
    if (!navButton || !nav) return;
    if (window.matchMedia("(min-width: 40rem)").matches) return;
    nav.hidden = true;
    nav.classList.remove("is-open");
    navButton.setAttribute("aria-expanded", "false");
  };

  navButton?.addEventListener("click", () => {
    if (!nav) return;
    const open = nav.hidden;
    nav.hidden = !open;
    nav.classList.toggle("is-open", open);
    navButton.setAttribute("aria-expanded", String(open));
    if (open) nav.querySelector("a")?.focus({ preventScroll: true });
  });

  nav?.addEventListener("click", (event) => {
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

  const lab = document.querySelector("[data-route-lab]");
  if (!lab) return;

  const profiles = {
    training: {
      result: "先看成熟GPU或云TPU系统",
      reason: "大批量训练需要高吞吐、较大设备内存和高速芯片互连。GPU通常提供更宽的软件兼容面；TPU在适配的框架、张量形状和云环境中可把矩阵阵列与集群互连结合起来。"
    },
    serving: {
      result: "先测云端GPU与专用加速器的端到端延迟",
      reason: "在线服务同时受批量、首个结果时间、模型驻留和调度影响。小批量可能受内存带宽限制，大批量又可能提高吞吐但拉长等待，因此类别名称不能替代真实流量回放。"
    },
    device: {
      result: "先验证本机NPU的算子覆盖与能耗",
      reason: "端侧任务强调续航、隐私和离线响应。若某些操作无法落到NPU而频繁回退到CPU或GPU，数据搬运会吃掉优势；完整模型映射和真机测量比峰值TOPS更重要。"
    }
  };

  const result = lab.querySelector("[data-route-result]");
  const reason = lab.querySelector("[data-route-reason]");
  const buttons = Array.from(lab.querySelectorAll("[data-profile]"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const profile = profiles[button.dataset.profile];
      if (!profile) return;
      buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      if (result) result.textContent = profile.result;
      if (reason) reason.textContent = profile.reason;
    });
  });
})();
