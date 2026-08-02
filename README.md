# Personal Assets

本仓库通过 GitHub 提交触发 Cloudflare Pages 部署，用于发布个人知识库。

## 知识库发布规则（必须遵守）

线上知识库目录为：<https://personnal-assets.pages.dev/knowledge-bases/>

该地址对应仓库中的 `knowledge-bases/index.html`。仓库根目录的 `index.html` 对应网站根地址 `/`；两个页面的知识库列表均由脚本自动同步，不再手工分别维护。

每次新建或重命名 `knowledge-bases/<slug>/` 下的知识库时，以下事项必须在同一次改动中完成，否则知识库不视为发布完成：

1. 新知识库必须放在 `knowledge-bases/<slug>/`，并提供 `main.html`；为兼容旧知识库，脚本会在没有 `main.html` 时回退到 `index.html`。
2. 运行 `scripts/update-knowledge-index.ps1`。脚本会扫描知识库目录、读取 `content-manifest.json` 和入口 HTML，并自动更新根目录 `index.html` 与 `knowledge-bases/index.html` 的列表、链接、标签和总数。
3. 没有 `main.html` 或 `index.html` 的空目录不会发布，脚本会输出警告。
4. 提交前检查目录条目没有遗漏或重复，并逐一确认链接目标文件存在。
5. Cloudflare Pages 部署完成后，必须从线上目录点击新条目，确认最终 URL 可以正常打开且页面内的 CSS、JavaScript 和子页面链接可用。

### 自动更新索引

手动同步并检查：

```powershell
.\scripts\update-knowledge-index.ps1
.\scripts\update-knowledge-index.ps1 -Check
```

仓库提供 `.githooks/pre-commit`。启用后，每次提交前会自动同步两个索引，并把更新后的索引加入本次提交：

```powershell
git config core.hooksPath .githooks
```

提交新知识库前应先暂存知识库文件；钩子发现入口文件尚未被 Git 跟踪或暂存时会阻止提交，避免发布出无法访问的目录链接。

### 发布完成条件

- 新知识库目录及全部资源已纳入 Git；
- 根目录 `index.html` 与 `knowledge-bases/index.html` 已由脚本加入对应目录条目；
- 页面显示的知识库总数与实际发布数量一致；
- 目录链接指向有效入口文件；
- 线上目录可以点击进入新知识库。
