# 专业全貌图谱维护说明

“专业全貌”是独立知识库之上的导航层：它用一个可核查的数据文件描述专业的根本问题、问题演进主干、理论与方法、工具与标准、工艺与产品、边界与未解问题。图谱只链接既有知识库，不复制或改写知识库内容。

## 目录约定

- 数据：`data/disciplines/<专业id>.json`
- 生成页面：`disciplines/<专业id>/`
- 首页入口：根 `index.html` 中的 `AUTO:DISCIPLINE_LIST` 区块，由同一生成脚本同步
- 共享样式：`disciplines/tokens.css` 与 `disciplines/styles.css`
- 人工抽样：`docs/review/<专业id>-sample.md`
- 待核实清单：`docs/review/<专业id>-todo.md`
- 每日记录：`docs/daily-log.md`

## 本地命令

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate_discipline.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\build_disciplines.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\build_disciplines.ps1 -Check
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\sample_sources.ps1 -DisciplineId semiconductor
```

校验器把结构或来源契约错误视为失败并返回非零退出码。每个状态的节点都必须至少有一个格式完整的来源；`unverified` 还会单独报告为研究队列警告并从发布页排除。`draft` 同样不发布。

## 新增专业的顺序

1. 新专业名称必须由用户明确指定，定时任务不得自行选择。
2. 一次只推进一个专业。当前专业的四个可扩展维度都已有节点，且不存在 `unverified`，才允许开始下一个专业。
3. 先写顶层字段和 6–10 个 `trunk` 节点。主干必须是一条单链，首节点 `parent=null`，其余节点依次指向前一节点。
4. 主干通过校验后，才能补充理论与方法、工具与标准、工艺与产品、边界与未解问题。
5. 无法核实的内容必须使用 `status=unverified`；不得用记忆补造来源，也不得让该节点进入发布页。
6. `detail_page` 只能指向仓库中真实存在的页面。找不到合适知识库时保留 `null`。
7. 生成页面、校验、抽样核对全部通过后，才可提交。

## 每日任务的优先级

每日最多新增或改动 3 个节点，并只执行第一项可做的工作：

1. 修复校验失败。
2. 核实 `last_checked` 最早的 1–3 个 `unverified` 节点。
3. 从 `blank_dimensions` 选择一个维度，补 1–2 个节点。
4. 向节点最少的已覆盖维度补 1 个节点。
5. 重新核查最早检查的 `verified` 节点及来源可访问性。

规划器先把完成目标拆成带依赖、验收条件和节点上限的原子任务，写入 `data/discipline-tasks/<id>.json`。五个职责独立的计划任务分别以 gatekeeper、researcher、architect、auditor、transition 身份认领已经解锁的任务；完成后在账本中打勾并记录证据。任一任务成功推送后会写入当天的本地 claim，后续 worker 全部跳过，因此一天仍只产生一个提交、最多改动 3 个节点。任务在隔离 Git worktree 中执行；失败则不提交、不推送，并在运行日志中记录原因。

“专业完成”不是凭节点总数主观判断：`data/discipline-roadmap.json` 定义每个维度的最低已核实覆盖、来源核查有效期和人工抽样批准门禁。`scripts/evaluate_discipline.ps1` 只有在全部门禁与任务依赖都通过时才输出 `ready_for_next=true`。下一专业必须先用 `scripts/queue_discipline.ps1` 加入用户批准队列，transition worker 才能认领其建设任务。
