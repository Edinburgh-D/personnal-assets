# Design — 中国上下五千年历史档案

本文件锁定此知识库的统一视觉系统。后续新增页面优先复用这些规则；需要变化时，应修改系统，而不是在单页内增加临时颜色或字体。

## System

- Genre · editorial / historical archive
- Macrostructure · Long Document
- Theme · custom（“暖纸、墨字、朱砂批注”）
- Axes · warm-paper / Song-style serif display / cinnabar accent
- Navigation · N6 Newspaper masthead，移动端折叠为单行刊头
- Footer · Ft4 Dense typographic colophon

## Tokens

`tokens.css` 是唯一设计令牌来源。所有颜色使用 OKLCH；页面只使用一处朱砂色强调，不使用渐变、纯黑、纯白或大面积彩色背景。

```css
:root {
  --color-paper: oklch(96% 0.014 78);
  --color-paper-2: oklch(92% 0.018 76);
  --color-ink: oklch(23% 0.022 48);
  --color-ink-2: oklch(38% 0.022 50);
  --color-rule: oklch(76% 0.024 68);
  --color-accent: oklch(43% 0.125 34);
  --color-focus: oklch(55% 0.15 34);

  --font-display: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", serif;
  --font-body: "Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif;
  --font-mono: "IBM Plex Mono", "Cascadia Code", ui-monospace, monospace;
}
```

## Layout

- 正文以 `68ch` 为阅读宽度，整体页面上限 `76rem`。
- 章节以留白和细线分隔，不用悬浮卡片堆叠。
- 标题左对齐；正文不强制两端对齐。
- 4pt 间距系统；圆角最大 6px；阴影只允许 1px whisper。
- 表格可横向滚动，移动端触控目标不小于 44px。

## CTA voice

- Primary · 透明纸面、朱砂文字、细线边框、2–4px 圆角。
- Secondary · 无填充文字链接，悬停只改变文字或下划线。
- 所有导航与按钮标签保持单行。

## Motion stance

- motion-cut：不做滚动揭示、卡片上浮、弹跳或渐变动画。
- 仅菜单开合和颜色状态使用 120–220ms 过渡。
- `prefers-reduced-motion` 下压缩至 150ms 以内。

## Copy and imagery

- 保留史料正文，不制造数据、引文或年代。
- 结构标题和导航不使用装饰性 emoji。
- 不使用 AI 插画、装饰性 3D、光斑或无意义图标。

## Exports

`tokens.css` 是本项目的源文件。未来页面必须直接复用它与 `css-styles.css`。
