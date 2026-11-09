# Personal Assets

本仓库通过 GitHub 提交触发 Cloudflare Pages 部署，用于发布个人知识库。

## 专业全貌图谱

`data/disciplines/<id>.json` 是专业图谱的唯一数据源；`scripts/build_disciplines.ps1` 将已核实节点生成到 `disciplines/<id>/`。`draft` 与 `unverified` 节点不会进入发布页面，现有 `knowledge-bases/` 页面只作为深入阅读链接，不复制、不改写。

```powershell
# 校验全部专业数据
.\scripts\validate_discipline.ps1

# 生成全部专业页面并检查产物是否最新
.\scripts\build_disciplines.ps1
.\scripts\build_disciplines.ps1 -Check

# 随机抽取 10 条来源供人工复核
.\scripts\sample_sources.ps1 -DisciplineId semiconductor

# 生成/刷新可认领的原子任务账本与完成度报告
.\scripts\plan_discipline_tasks.ps1 -DisciplineId semiconductor
.\scripts\evaluate_discipline.ps1 -DisciplineId semiconductor -WriteReport

# 人工核对抽样后批准；以及把用户指定的新专业加入自动建设队列
.\scripts\approve_discipline_review.ps1 -DisciplineId semiconductor
.\scripts\queue_discipline.ps1 -Id <kebab-case-id> -Name <专业名称>
```

新增专业及每日维护规则见 `docs/README-disciplines.md`。自动任务已经停止生成新的独立主题知识库，改为由五类 worker 从任务账本认领工作；每天只完成一个原子任务、最多维护三个节点。

## 知识库发布规则（必须遵守）

线上知识库目录为：<https://personnal-assets.pages.dev/knowledge-bases/>

该地址对应仓库中的 `knowledge-bases/index.html`。仓库根目录的 `index.html` 对应网站根地址 `/`；两个页面的知识库列表均由脚本自动同步，不再手工分别维护。

每次新建或重命名 `knowledge-bases/<slug>/` 下的知识库时，以下事项必须在同一次改动中完成，否则知识库不视为发布完成：

1. 新知识库必须放在 `knowledge-bases/<slug>/`，并提供 `main.html`；为兼容旧知识库，脚本会在没有 `main.html` 时回退到 `index.html`。
2. 每个知识库的每一个 HTML 页面都必须提供“返回 Personal Assets 主页”的可见导航入口，统一使用 `<a href="../../index.html" data-site-home>…</a>`。入口应放在顶部导航内，不能只依赖 JavaScript 动态生成。
3. 运行 `scripts/update-knowledge-home-links.ps1`。脚本会为当前支持的知识库导航结构补齐主页入口；`-Check` 模式发现任何遗漏时会阻止提交。
4. 从本规则生效后新增的知识库，必须在 `content-manifest.json` 中同时写入当天的 `"createdAt": "YYYY-MM-DD"` 与布尔值 `"showCreatedAt": true`。索引卡片只在该标记明确为 `true` 时显示“生成于”日期；既有知识库不回填、不显示。
5. 运行 `scripts/update-knowledge-index.ps1`。脚本会扫描知识库目录、读取 `content-manifest.json` 和入口 HTML，并自动更新根目录 `index.html` 与 `knowledge-bases/index.html` 的列表、链接、标签、生成时间和总数。
6. 没有 `main.html` 或 `index.html` 的空目录不会发布，脚本会输出警告。
7. 提交前检查目录条目没有遗漏或重复，并逐一确认链接目标文件存在。
8. Cloudflare Pages 部署完成后，必须从线上目录点击新条目，并在知识库内点击“Personal Assets”，确认入口页、CSS、JavaScript、子页面链接和返回主页链接均可用。

### 自动更新索引

手动同步并检查：

```powershell
.\scripts\update-knowledge-home-links.ps1
.\scripts\update-knowledge-home-links.ps1 -Check
.\scripts\update-knowledge-index.ps1
.\scripts\update-knowledge-index.ps1 -Check
```

仓库提供 `.githooks/pre-commit`。启用后，每次提交前会自动同步两个索引、检查所有知识库页面的主页入口，并把更新后的索引加入本次提交：

```powershell
git config core.hooksPath .githooks
```

提交新知识库前应先暂存知识库文件；钩子发现入口文件尚未被 Git 跟踪或暂存时会阻止提交，避免发布出无法访问的目录链接。

### 发布完成条件

- 新知识库目录及全部资源已纳入 Git；
- 根目录 `index.html` 与 `knowledge-bases/index.html` 已由脚本加入对应目录条目；
- 页面显示的知识库总数与实际发布数量一致；
- 目录链接指向有效入口文件；
- 每个知识库 HTML 页面都包含指向 `../../index.html` 的 `data-site-home` 导航入口；
- 线上目录可以点击进入新知识库。
