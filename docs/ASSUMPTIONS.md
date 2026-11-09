# 专业全貌图谱：现状与实施假设

最后更新：2026-11-05

## 现状摘要

- 本仓库是无需构建步骤的纯静态站点。根目录文件由 Cloudflare Pages 直接发布，GitHub `main` 分支的提交触发线上更新。
- 根 `index.html` 是网站首页，`knowledge-bases/index.html` 是独立知识库目录。`scripts/update-knowledge-index.ps1` 扫描 `knowledge-bases/*/content-manifest.json` 与入口 HTML，只重写两个索引中的自动管理列表和总数。
- 当前工作区的 `knowledge-bases/` 有 37 个可发布入口、439 个文件；开工前内容哈希为 `EB6797FA3D8FBFFDEEFAD2A05229380BA3A56A2F3BE6CBD0E16A7C2BB995A0FB`。
- 当前本地 `main` 落后 `origin/main` 51 个提交。当前远端引用中有 88 个知识库入口；用户描述的 86 应视为需求提出时的近似数量，而不是本次实现要修正的计数。
- 本地已存在可用于半导体图谱深入阅读的 `ai-chip-architecture-guide` 与 `quantum-computing-primer`。`quantum-mechanics-foundations` 只存在于当前远端引用，不存在于本地工作区。
- 站点已有 `tokens.css`，采用 OKLCH 色彩、Georgia/系统中文字体、4pt 间距、深浅色模式、键盘焦点和移动端断点。新增图谱沿用这些视觉约定，不改写知识库自己的样式。
- 自动发布由 Windows 计划任务 `Codex Knowledge Base Publisher` 触发。它调用 `automation/run-knowledge-task.ps1`，从 `origin/main` 创建隔离 worktree，运行 Codex，校验后单次提交并推送，再轮询 Cloudflare Pages。安装脚本声明 5 个每日触发时间，但当前已注册任务只有 02:00、07:00、22:00 三个触发器。
- 现有自动任务每次随机选择一个主题并新建一个独立知识库；这正是本次要停止的行为。

## 保守实施假设

1. 不拉取、检出、覆盖或补齐 `knowledge-bases/`。验收以开工前后该目录的文件数与聚合哈希完全一致为准。
2. 图谱生成器只把本地真实存在的文件写入 `detail_page`。因此半导体样板暂不链接本地缺失的 `quantum-mechanics-foundations`，并把它记录为同步后可接入项。
3. `status=unverified` 是允许存在的研究队列状态，不令结构校验失败；校验器会明确报告它，生成器会完全排除它。否则“先校验、再逐日核实 unverified”的定时流程无法成立。
4. 按硬性校验项，“每个节点至少一个来源”适用于全部状态。`unverified` 会收到警告且不发布；若因无法联网而来源留空，校验将按设计失败，后续任务先补齐该失败项。
5. `blank_dimensions` 只允许四个可扩展维度：`theory_method`、`tools_standards`、`process_product`、`boundary_open`；主干不能用空白声明替代。
6. 每个节点只有一个直接父节点。图谱表现的是一棵有主干的树，而不是任意多重边网络；跨专业关系只放在 `neighbors`，不创建节点或边。
7. “一屏内能看完”按常见桌面视口设计为紧凑全貌（目标 1440×900 无需滚动即可掌握主干和四类摘要）；窄屏优先可读性，允许纵向滚动，不缩小到不可读字号。
8. 首页“专业全貌”区块放在知识库目录之前，并位于现有自动管理标记之外，避免 `update-knowledge-index.ps1` 后续覆盖。
9. 定时维护采用“任务账本 + 角色 worker”模型。规划器预先拆分带依赖与验收条件的原子任务，五个错峰 worker 主动认领；共享互斥锁与按日期的 claim 文件保证一天最多一个提交、最多改动 3 个节点。
10. “完善”采用可执行门槛：主干至少 6 个已核实节点，四个分支维度各至少 4 个，零 `draft/unverified`，核查日期不超过 180 天，并由用户批准随机来源抽样。门槛存放在 `data/discipline-roadmap.json`，以后可以显式调整而不改 worker 代码。
11. 自动任务不会自行发明新专业，只能从用户批准的 `data/discipline-roadmap.json` 队列认领下一项。队列为空时 transition 任务保持 blocked。
12. 当自动任务失败时，隔离 worktree 本身就是回滚边界：失败不提交、不推送并删除临时 worktree；运行记录与失败原因保存在 `test-results/knowledge-automation/`。成功时才生成一次原子提交。
13. 来源抽样脚本从当前 JSON 的“节点—来源”组合中随机抽取最多 10 条；无来源节点会先被校验器阻止。

## 页面与数据边界

- 事实来源只保存在 `data/disciplines/*.json`，HTML 全部由脚本生成。
- 只有 `verified` 节点进入发布页；`draft` 和 `unverified` 都不渲染。
- 页面不实现记忆、练习、复习、进度、登录或个性化功能。
- 图谱节点页只摘要并链接既有知识库，不复制既有知识库正文。
