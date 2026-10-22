(function () {
  "use strict";

  const root = document.documentElement;
  const savedDarkMode = localStorage.getItem("kb_darkMode");
  if (savedDarkMode === "true" || savedDarkMode === "false") root.dataset.theme = savedDarkMode === "true" ? "dark" : "light";

  function updateThemeLabels() {
    const isDark = root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
      button.textContent = isDark ? "亮" : "暗";
    });
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      const currentDark = root.dataset.theme === "dark" ||
        (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      const next = currentDark ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("kb_darkMode", String(next === "dark"));
      updateThemeLabels();
    });
  });
  updateThemeLabels();

  const dialog = document.querySelector("[data-command-dialog]");
  const commandInput = dialog ? dialog.querySelector("[data-command-input]") : null;
  const commandItems = dialog ? Array.from(dialog.querySelectorAll("[data-command-item]")) : [];
  const commandEmpty = dialog ? dialog.querySelector("[data-command-empty]") : null;
  let activeIndex = 0;

  function visibleItems() {
    return commandItems.filter(function (item) { return !item.hidden; });
  }

  function selectItem(index) {
    const items = visibleItems();
    if (!items.length) return;
    activeIndex = (index + items.length) % items.length;
    commandItems.forEach(function (item) { item.setAttribute("aria-selected", "false"); });
    items[activeIndex].setAttribute("aria-selected", "true");
    items[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function openCommands() {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.querySelector(".site-shell").setAttribute("inert", "");
    commandInput.value = "";
    commandItems.forEach(function (item) { item.hidden = false; });
    commandEmpty.hidden = true;
    activeIndex = 0;
    selectItem(0);
    commandInput.focus();
  }

  function closeCommands() {
    if (!dialog || !dialog.open) return;
    dialog.close();
    document.querySelector(".site-shell").removeAttribute("inert");
  }

  document.querySelectorAll("[data-command-open]").forEach(function (button) {
    button.addEventListener("click", openCommands);
  });

  if (dialog) {
    dialog.querySelector("[data-command-close]").addEventListener("click", closeCommands);
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeCommands();
    });
    dialog.addEventListener("close", function () {
      document.querySelector(".site-shell").removeAttribute("inert");
    });
    commandInput.addEventListener("input", function () {
      const query = commandInput.value.trim().toLocaleLowerCase("zh-CN");
      commandItems.forEach(function (item) {
        item.hidden = !item.textContent.toLocaleLowerCase("zh-CN").includes(query);
      });
      commandEmpty.hidden = visibleItems().length !== 0;
      activeIndex = 0;
      selectItem(0);
    });
    commandInput.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectItem(activeIndex + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectItem(activeIndex - 1);
      } else if (event.key === "Enter") {
        const items = visibleItems();
        if (items[activeIndex]) items[activeIndex].click();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
      event.preventDefault();
      if (dialog && dialog.open) closeCommands(); else openCommands();
    }
  });

  const simButtons = Array.from(document.querySelectorAll("[data-sim-state]"));
  const beetles = Array.from(document.querySelectorAll("[data-beetle]"));
  const readout = document.querySelector("[data-sim-readout]");
  const states = {
    start: { dark: 4, text: "起点：深色与浅色各占一半。这里只展示一个假想种群。" },
    dark: { dark: 6, text: "深色岩面：更不显眼的深色个体留下更多后代，比例向深色偏移。" },
    light: { dark: 2, text: "浅色沙地：同一深色特征失去优势，比例可以向浅色偏移。" }
  };

  simButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const key = button.dataset.simState;
      const state = states[key];
      simButtons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      beetles.forEach(function (beetle, index) { beetle.classList.toggle("dark", index < state.dark); });
      if (readout) readout.textContent = state.text;
    });
  });
})();
