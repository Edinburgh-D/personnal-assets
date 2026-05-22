# 多智能体协作工作流实施手册

> 本手册包含所有你需要执行的操作步骤和配置内容
> 创建日期：2025-01-15
> 版本：v1.0

---

## 目录

1. [第一步：推送配置到GitHub](#第一步推送配置到github)
2. [第二步：初始化智能体](#第二步初始化智能体)
3. [第三步：日常使用流程](#第三步日常使用流程)
4. [第四步：过载处理](#第四步过载处理)
5. [第五步：添加新指令](#第五步添加新指令)
6. [附录A：所有快捷指令列表](#附录a所有快捷指令列表)
7. [附录B：Mobile Claw可操作App清单](#附录bmobile-claw可操作app清单)
8. [附录C：所有配置文件说明](#附录c所有配置文件说明)

---

## 第一步：推送配置到GitHub

### 1.1 复制配置文件

将以下目录复制到你的GitHub仓库：

```
work-flow/
├── config/          → 复制到 workflow-config/config/
├── templates/       → 复制到 workflow-config/templates/
├── registry/        → 复制到 workflow-config/registry/
├── queue/           → 复制到 workflow-config/queue/
├── memory/          → 复制到 workflow-config/memory/
├── records/         → 复制到 workflow-config/records/
└── docs/            → 复制到 workflow-config/docs/
```

### 1.2 推送命令

```bash
# 进入你的GitHub仓库目录
cd your-github-repo

# 创建工作流配置目录
mkdir -p workflow-config/config
mkdir -p workflow-config/templates
mkdir -p workflow-config/registry
mkdir -p workflow-config/queue
mkdir -p workflow-config/memory
mkdir -p workflow-config/records
mkdir -p workflow-config/docs

# 复制配置文件（假设work-flow目录在D:\personal-code\work-flow）
# Windows PowerShell:
Copy-Item -Path "D:\personal-code\work-flow\config\*" -Destination "workflow-config\config\" -Recurse
Copy-Item -Path "D:\personal-code\work-flow\templates\*" -Destination "workflow-config\templates\" -Recurse
Copy-Item -Path "D:\personal-code\work-flow\registry\*" -Destination "workflow-config\registry\" -Recurse
Copy-Item -Path "D:\personal-code\work-flow\queue\*" -Destination "workflow-config\queue\" -Recurse
Copy-Item -Path "D:\personal-code\work-flow\memory\*" -Destination "workflow-config\memory\" -Recurse
Copy-Item -Path "D:\personal-code\work-flow\records\*" -Destination "workflow-config\records\" -Recurse
Copy-Item -Path "D:\personal-code\work-flow\docs\*" -Destination "workflow-config\docs\" -Recurse

# 推送到GitHub
git add workflow-config/
git commit -m "Add multi-claw workflow configuration"
git push
```

### 1.3 验证推送成功

在GitHub网页上确认以下文件已存在：

```
workflow-config/config/decision_rules.yaml
workflow-config/config/user_preferences.yaml
workflow-config/config/quick_commands.yaml
workflow-config/config/overload_handling.yaml
workflow-config/config/command_management.yaml
workflow-config/config/supplementary_commands.yaml
workflow-config/templates/task_templates.yaml
workflow-config/templates/research_templates.yaml
workflow-config/registry/agents.yaml
workflow-config/registry/mobile_claw_apps.yaml
workflow-config/queue/tasks.yaml
workflow-config/queue/paused_tasks.yaml
workflow-config/memory/memory.yaml
workflow-config/records/work_records.yaml
workflow-config/docs/admin-ai-init-prompt.md
workflow-config/docs/init-command-guide.md
workflow-config/docs/overload-handling-solution.md
workflow-config/docs/agent-role-setup.md
```

---

## 第二步：初始化智能体

### 2.1 初始化管理员AI

**在Kimi群聊中发送以下完整初始化指令**：

---

```
请作为多智能体协作系统的管理员AI，执行以下初始化操作：

### 第一步：读取配置文件

请使用GitHub REST API读取以下配置文件：

- 仓库：{替换为你的GitHub用户名/仓库名}
- 分支：main
- 配置路径：
  - workflow-config/config/decision_rules.yaml
  - workflow-config/config/user_preferences.yaml
  - workflow-config/config/quick_commands.yaml
  - workflow-config/config/overload_handling.yaml
  - workflow-config/config/command_management.yaml
  - workflow-config/config/supplementary_commands.yaml
  - workflow-config/templates/task_templates.yaml
  - workflow-config/templates/research_templates.yaml
  - workflow-config/registry/agents.yaml
  - workflow-config/registry/mobile_claw_apps.yaml
  - workflow-config/queue/tasks.yaml
  - workflow-config/queue/paused_tasks.yaml
  - workflow-config/memory/memory.yaml
  - workflow-config/records/work_records.yaml

### 第二步：解析配置内容

读取成功后，请解析并记住以下内容：

**决策规则（decision_rules.yaml）**：
- auto_approve（低风险）：社交媒体发布、信息收集、图片生成 → 自动执行
- batch_confirm（中风险）：代码推送到feature分支 → 每日18:00汇总确认
- manual_confirm（高风险）：代码推送到main分支、系统配置修改 → 即时通知确认

**用户偏好（user_preferences.yaml）**：
- 小红书：轻松活泼风格，20:00-22:00发布，hashtags: #AI #科技
- Instagram：国际化专业风格，21:00-23:00发布
- 代码开发：TypeScript + Vue3，必须包含单元测试
- 通知：每日18:00汇总，仅推送紧急通知

**任务模板（task_templates.yaml + research_templates.yaml）**：
- xiaohongshu_post：online_claw生成内容 → mobile_claw生成图片 → mobile_claw发布
- instagram_post：online_claw生成内容 → mobile_claw生成图片 → mobile_claw发布
- code_development：online_claw分析 → mobile_claw设计 → pc_claw写代码 → online_claw推送
- information_collection：mobile_claw浏览 → online_claw整理
- deep_research：确定方向 → 收集信息 → 深度探索 → 整理知识 → 生成报告

**智能体能力（agents.yaml）**：
- online_claw：GitHub操作、代码分析、提示词生成（24/7可用）
- mobile_claw：社媒发布、AI应用调用、信息浏览（24/7可用）
- pc_claw：本地代码编写、命令行执行（仅下班时间可用）

**快捷指令（quick_commands.yaml + supplementary_commands.yaml）**：
- /xhs：发布小红书
- /ins：发布Instagram
- /dev：代码开发
- /research：深度预研
- /knowledge：知识搜集
- /status：查询状态
- /today：今日汇总
- /confirm：确认任务
- /add_command：添加新指令
- /list_commands：查看所有指令

**过载处理（overload_handling.yaml）**：
- 检测过载后立即保存任务状态到GitHub（queue/paused_tasks.yaml）
- 智能体恢复后自动读取状态继续执行
- /recover：恢复暂停任务
- /recover_status：查看暂停任务

**Mobile Claw App能力（mobile_claw_apps.yaml）**：
- 可操作：ChatGPT、Claude、Instagram、Threads、小红书、AP News、Hacker News、Medium
- 受限：Bloomberg、Reuters、CNN（使用Chrome网页版替代）
- 禁止：微信、PayPal、金融类App

### 第三步：建立决策系统

请建立以下决策逻辑：

**任务接收时**：
1. 解析用户指令，匹配任务模板
2. 根据任务类型判断风险等级
3. 应用决策规则：
   - 低风险 → 自动批准，直接执行
   - 中风险 → 批量确认，18:00汇总
   - 高风险 → 即时通知，等待确认
4. 分配任务给合适的智能体
5. 返回任务状态给用户

**任务执行时**：
1. 监控任务进度
2. 处理智能体协作
3. 每步骤完成后保存状态到GitHub（queue/tasks.yaml）
4. 处理异常情况（包括服务过载）

**任务完成时**：
1. 验证产出结果
2. 更新任务状态到GitHub
3. 沉淀到知识库（memory/memory.yaml）
4. 在汇报时间发送汇总

**过载处理**：
1. 检测到过载（响应时间>30秒或包含"服务过载"关键词）
2. 立即保存任务状态到GitHub（queue/paused_tasks.yaml）
3. 发送通知：⚠️ {agent_id} 服务过载，任务已暂停保存
4. 智能体恢复后自动读取状态继续执行
5. 发送通知：✅ 任务已自动恢复

### 第四步：初始化完成

初始化完成后，请返回：

✅ 初始化成功
📋 已加载配置：
  - 决策规则：15条
  - 任务模板：16个
  - 智能体注册：4个
  - 快捷指令：50+个

🤖 智能体状态：
  - online_claw: 检测中
  - mobile_claw: 检测中
  - pc_claw: 检测中

⚡ 可用快捷指令：
  - /xhs: 发布小红书
  - /ins: 发布Instagram
  - /dev: 代码开发
  - /research: 深度预研
  - /knowledge: 知识搜集
  - /status: 查询状态
  - /today: 今日汇总
  - /list_commands: 查看所有指令

📝 请发送任务指令开始使用
```

---

### 2.2 初始化Online Claw

**艾特 @online_claw，发送以下内容**：

---

```
你是 Online Claw，部署在云服务器上的智能体。

### 你的核心能力

1. **GitHub操作**：代码推送、仓库管理、PR创建、分支管理
2. **代码分析**：代码审查、静态分析、依赖检查、代码质量评估
3. **提示词生成**：生成图片提示词、内容提示词、设计提示词
4. **外部API调用**：调用外部API、获取数据、网络请求
5. **内容生成**：生成文案、文章、报告
6. **设计方案分析**：分析设计图、生成实现方案
7. **信息整理**：整理信息、生成报告、结构化输出

### 你的约束

1. 不直接操作手机应用（那是 Mobile Claw 的职责）
2. 需要网络连接才能工作
3. 不操作本地文件系统（那是 PC Claw 的职责）
4. 24/7 可用

### 你的工作方式

1. **接收任务**：从管理员AI接收任务指令
2. **执行任务**：根据任务模板执行对应步骤
3. **保存状态**：每完成一个步骤，将状态保存到GitHub仓库（workflow-config/queue/tasks.yaml）
4. **汇报进度**：向管理员AI汇报执行进度
5. **协作**：与其他智能体协作，按工作流顺序交接任务

### 过载处理

如果检测到 Kimi API 服务过载（响应时间超过30秒或收到"服务过载"提示）：
1. 立即将当前任务状态保存到GitHub仓库（workflow-config/queue/paused_tasks.yaml）
2. 保存内容：任务ID、当前步骤、中间产物、过载时间
3. 发送通知到群聊：⚠️ online_claw 服务过载，任务已暂停保存
4. 等待恢复后，读取GitHub任务状态，从断点继续执行

### 状态保存格式

每次完成步骤后，请将以下信息保存到GitHub：
- task_id: 任务ID
- current_step: 当前步骤编号
- step_status: 步骤状态
- intermediate_outputs: 中间产物（关键）
- timestamp: 时间戳
```

---

### 2.3 初始化Mobile Claw

**艾特 @mobile_claw，发送以下内容**：

---

```
你是 Mobile Claw，部署在安卓手机上的智能体。

### 你的核心能力

1. **社交媒体发布**：发布到小红书、Instagram、Facebook、Threads、Medium
2. **AI应用调用**：调用ChatGPT、Claude、Grok、Perplexity等AI应用
3. **网页浏览**：浏览AP News、Hacker News、Ground News、Medium等网站
4. **图片生成**：使用ChatGPT等AI应用生成图片
5. **信息收集**：收集新闻、文章、资料

### 你可操作的App（完全可操作）

**AI聊天类**：
- ChatGPT：完整对话流、图片生成
- Claude：完整对话流、代码生成
- Grok：完整对话流
- Perplexity：AI搜索、总结
- Kimi：完整UI对话

**社交媒体类**：
- Instagram：浏览、发帖、互动
- Facebook：浏览、互动
- Threads：浏览、发帖、互动
- X (Twitter)：浏览、互动（有广告弹窗）
- rednote (小红书)：浏览、发帖、互动
- LinkedIn：浏览、互动、求职
- Discord：聊天、社区

**新闻/内容类**：
- AP News：浏览、新闻收集
- Hacker News：浏览、技术新闻
- Ground News：新闻聚合
- Medium：浏览、阅读、深度文章

**浏览器**：
- Chrome：导航、搜索、网页浏览

### 你受限的App（使用替代方案）

**新闻类（Accessibility限制）**：
- Bloomberg：使用Chrome访问网页版
- Reuters：使用Chrome访问网页版
- CNN：使用Chrome访问网页版

**金融类（完全禁止）**：
- 微信：禁止操作
- PayPal：禁止操作
- Coinbase/Binance：禁止操作

### 你的约束

1. 不操作本地文件系统
2. 需要手机在线
3. 需要外网访问权限
4. 24/7 可用

### 你的工作方式

1. **接收任务**：从管理员AI或online_claw接收任务指令
2. **执行任务**：根据任务模板执行对应步骤
3. **保存状态**：每完成一个步骤，将状态保存到GitHub（通过管理员AI）
4. **汇报进度**：向管理员AI汇报执行进度
5. **协作**：与其他智能体协作，按工作流顺序交接任务

### 过载处理

如果检测到 Kimi API 服务过载：
1. 立即将当前任务状态保存到GitHub（通过管理员AI）
2. 发送通知：⚠️ mobile_claw 服务过载，任务已暂停保存
3. 等待恢复后，读取GitHub任务状态，从断点继续执行
```

---

### 2.4 初始化PC Claw

**艾特 @pc_claw，发送以下内容（下班时间）**：

---

```
你是 PC Claw，部署在家里电脑上的智能体。

### 你的核心能力

1. **本地代码编写**：编写、修改、重构本地代码
2. **命令行执行**：执行PowerShell、脚本、构建命令
3. **Playwright自动化**：网页自动化操作、测试
4. **测试执行**：运行单元测试、集成测试
5. **本地文件操作**：文件读写、目录管理
6. **构建执行**：执行构建命令、打包

### 你的约束

1. 不进行网络API调用
2. 仅下班时间可用：
   - 工作日：18:00-24:00
   - 周末：全天
3. 工作时间（09:00-18:00）不可用

### 你的工作方式

1. **接收任务**：从管理员AI接收任务指令（仅下班时间）
2. **执行任务**：根据任务模板执行对应步骤
3. **保存状态**：每完成一个步骤，将状态保存到本地文件（并同步到GitHub）
4. **汇报进度**：向管理员AI汇报执行进度
5. **协作**：与其他智能体协作，按工作流顺序交接任务

### 过载处理

如果检测到 Kimi API 服务过载：
1. 立即将当前任务状态保存到本地文件
2. 同步保存到GitHub（通过管理员AI）
3. 发送通知：⚠️ pc_claw 服务过载，任务已暂停保存
4. 等待恢复后，读取任务状态，从断点继续执行
```

---

### 2.5 初始化顺序

建议按以下顺序初始化：

1. **管理员AI**：发送完整初始化指令（读取所有配置）
2. **Online Claw**：艾特并发送角色设定
3. **Mobile Claw**：艾特并发送角色设定
4. **PC Claw**：艾特并发送角色设定（下班时间）

---

### 2.6 简化初始化（日常使用）

每次新会话时，可以发送简化版：

**管理员AI**：
```
/init 仓库：{你的用户名/仓库名} 分支：main
```

**其他Claw**：
```
@online_claw 请查看GitHub仓库 workflow-config/registry/agents.yaml 了解你的能力

@mobile_claw 请查看GitHub仓库 workflow-config/registry/agents.yaml 和 workflow-config/registry/mobile_claw_apps.yaml 了解你的能力

@pc_claw 请查看GitHub仓库 workflow-config/registry/agents.yaml 了解你的能力
```

---

## 第三步：日常使用流程

### 3.1 派发任务

**内容创作类**：

```
# 小红书发布（自动批准，无需确认）
/xhs 主题：AI工具推荐

# Instagram发布（自动批准）
/ins topic: AI trends

# Facebook发布
/fb 主题：科技动态

# Threads发布
/threads 主题：今日思考

# Medium文章
/medium 主题：AI发展趋势

# 图片生成
/img 描述：科技感未来城市，风格：简约

# 内容生成（不发布）
/content 平台：小红书，主题：AI工具推荐
```

**代码开发类**：

```
# 代码开发（需求确认后自动执行）
/dev 需求：用户认证模块，分支：feature/user-auth

# Bug修复
/bugfix Bug：登录超时，日志：timeout error
```

**信息收集类**：

```
# 信息收集（自动批准）
/collect 主题：AI行业动态，来源：彭博社、路透社

# 每日新闻（自动批准）
/news 类别：科技、AI
```

**预研类**：

```
# 深度预研（需要确认预研方向）
/research 主题：AI Agent发展趋势，深度：深度预研

# 知识搜集（自动批准）
/knowledge 主题：量子计算，来源：Hacker News, Medium

# 技术预研（自动批准）
/tech 技术：Rust语言，场景：后端开发

# 行业趋势（自动批准）
/trend 行业：AI，时间：2025年

# 竞品分析（自动批准）
/competitor 产品：AI写作工具

# 学习路径（自动批准）
/learning 领域：AI Agent开发，当前：初级，目标：高级
```

**定时任务**：

```
# 创建定时任务
/schedule /xhs 时间：20:30（今晚）
/schedule /news 时间：09:00（每天）

# 查看定时任务
/schedule_list

# 取消定时任务
/schedule_cancel {task_id}
```

**批量任务**：

```
# 批量执行多个任务
/batch /xhs 主题：AI, /ins topic: Tech, /fb 主题：新闻

# 批量确认所有待确认任务
/batch_confirm
```

---

### 3.2 查看状态

```
# 查询所有任务状态
/status

# 查询特定任务详情
/task task_20250115_001

# 查看今日工作汇总
/today

# 查看本周工作汇总
/week

# 查看任务工作流图
/workflow task_001

# 查看历史任务
/history task_20250110_003

# 统计分析
/stats 本周

# 生成自定义报告
/report 类型：工作总结 时间：本周
```

---

### 3.3 任务操作

```
# 确认任务
/confirm task_001

# 拒绝任务
/reject task_001 原因：需要修改

# 确认所有待确认任务
/confirm_all

# 拒绝所有待确认任务
/reject_all 原因：需要重新规划

# 标记任务为紧急
/urgent task_001

# 调整任务优先级
/priority task_001 high

# 设置任务依赖
/depend task_002 依赖：task_001

# 暂停任务
/pause task_001

# 恢复暂停任务
/resume task_001

# 取消任务
/cancel task_001

# 克隆历史任务
/clone task_20250110_003
```

---

### 3.4 查看配置

```
# 查看所有可用指令
/list_commands

# 查看所有任务模板
/list_templates

# 查看特定模板详情
/template xiaohongshu_post

# 查看用户偏好
/pref xiaohongshu

# 查看所有智能体状态
/agents

# 查看特定智能体详情
/agent mobile_claw

# 检查智能体状态
/check_agent mobile_claw

# 查看智能体任务历史
/agent_history mobile_claw
```

---

### 3.5 知识库操作

```
# 查看知识库内容
/kb templates

# 搜索知识库
/search 小红书

# 添加知识
/kb_add 类别：lessons 内容：小红书发布时间应避开14:00

# 搜索知识
/kb_search 小红书

# 更新知识
/kb_update lesson_001 内容：小红书最佳发布时间为20:30-21:30

# 删除知识
/kb_delete lesson_001
```

---

### 3.6 提醒设置

```
# 设置提醒
/remind 时间：18:00 内容：查看今日汇总

# 查看所有提醒
/remind_list

# 取消提醒
/remind_cancel {remind_id}
```

---

### 3.7 更新配置

```
# 更新偏好配置
/config xiaohongshu.style=专业简洁
/config notification.summary_time=17:00

# 更新配置文件（重新读取GitHub）
/update_config
```

---

## 第四步：过载处理

### 4.1 过载发生时

当Kimi API服务过载时，系统会自动处理：

```
# 智能体检测到过载（响应时间超过30秒）

⚠️ mobile_claw 服务过载
📋 任务 task_001 已暂停保存
💾 状态已保存到GitHub
⏳ 等待恢复后自动继续

用户无需操作，等待即可
```

---

### 4.2 自动恢复

智能体恢复后会自动继续：

```
# 智能体恢复后自动检查暂停任务

✅ 任务 task_001 已自动恢复
🔄 从步骤2继续：生成图片
🤖 执行智能体：mobile_claw
📝 无需手动操作
```

---

### 4.3 手动恢复

如果需要手动触发恢复：

```
# 查看暂停任务状态
/recover_status

# 恢复所有暂停任务
/recover

# 恢复特定任务
/recover task_001
```

---

### 4.4 重启智能体

如果智能体长时间无响应：

```
# 重启智能体（发送艾特通知）
/restart_agent mobile_claw

# 然后艾特智能体确认
@mobile_claw 请重新启动并检查暂停任务
```

---

### 4.5 过载预防

```
# 避开高峰时段执行任务
/schedule /xhs 时间：10:00（低峰时段）

# 批量任务分散执行
/batch /xhs, /ins, /fb（会在低峰时段批量执行）

# 查看推荐执行时段
/stats 今日（会显示高峰/低峰时段）
```

---

## 第五步：添加新指令

### 5.1 通过指令添加

```
# 添加新指令
/add_command /video video_creation 视频内容创作

# 管理员AI响应：
✅ 新指令已添加
📝 指令名：/video
📋 模板：video_creation
💬 描述：视频内容创作
💾 已保存到GitHub仓库

使用方式：/video 主题：{topic}
示例：/video 主题：AI教程
```

---

### 5.2 通过自然语言添加

```
# 自然语言描述需求
我想添加一个新指令，叫/video，用于视频创作

# 管理员AI响应：
✅ 已理解您的需求，新指令已添加
📝 指令名：/video
📋 模板：video_creation
💬 描述：视频内容创作
💾 已保存到GitHub仓库
```

---

### 5.3 修改现有指令

```
# 修改指令
/modify_command /xhs priority=high

# 管理员AI响应：
✅ 指令已修改
📝 指令名：/xhs
🔧 修改内容：priority=high
💾 已保存到GitHub仓库
```

---

### 5.4 删除指令

```
# 删除指令
/delete_command /video

# 管理员AI响应：
✅ 指令已删除
📝 指令名：/video
💾 已保存到GitHub仓库
```

---

### 5.5 创建新任务模板

```
# 创建新模板
/create_template video_creation 视频内容创作模板

# 管理员AI响应：
✅ 任务模板已创建
📝 模板名：video_creation
💬 描述：视频内容创作模板
📋 工作流：{生成的模板内容}
💾 已保存到 templates/task_templates.yaml

请确认模板内容是否正确
```

---

### 5.6 手动编辑配置文件

如果需要手动编辑：

1. 编辑GitHub仓库中的配置文件：
   - `workflow-config/config/quick_commands.yaml`（快捷指令）
   - `workflow-config/templates/task_templates.yaml`（任务模板）

2. 推送修改到GitHub

3. 发送 `/update_config` 让管理员AI重新读取

---

---

## 附录A：所有快捷指令列表

### 内容创作类

| 指令 | 功能 | 示例 |
|------|------|------|
| `/xhs` | 发布小红书 | `/xhs 主题：AI工具推荐` |
| `/ins` | 发布Instagram | `/ins topic: AI trends` |
| `/fb` | 发布Facebook | `/fb 主题：科技动态` |
| `/threads` | 发布Threads | `/threads 主题：今日思考` |
| `/medium` | 发布Medium文章 | `/medium 主题：AI发展趋势` |
| `/img` | 生成图片 | `/img 描述：科技感城市` |
| `/content` | 生成内容（不发布） | `/content 平台：小红书` |

### 代码开发类

| 指令 | 功能 | 示例 |
|------|------|------|
| `/dev` | 代码开发任务 | `/dev 需求：用户认证` |
| `/bugfix` | Bug修复 | `/bugfix Bug：登录超时` |

### 信息收集类

| 指令 | 功能 | 示例 |
|------|------|------|
| `/collect` | 收集信息 | `/collect 主题：AI动态` |
| `/news` | 每日新闻 | `/news 类别：科技` |

### 预研类

| 指令 | 功能 | 示例 |
|------|------|------|
| `/research` | 深度预研 | `/research 主题：AI Agent` |
| `/knowledge` | 知识搜集 | `/knowledge 主题：量子计算` |
| `/tech` | 技术预研 | `/tech 技术：Rust` |
| `/trend` | 行业趋势预研 | `/trend 行业：AI` |
| `/competitor` | 竞品分析 | `/competitor 产品：AI写作` |
| `/learning` | 学习路径规划 | `/learning 领域：AI Agent` |

### 定时任务

| 指令 | 功能 | 示例 |
|------|------|------|
| `/schedule` | 创建定时任务 | `/schedule /xhs 时间：20:30` |
| `/schedule_list` | 查看定时任务 | `/schedule_list` |
| `/schedule_cancel` | 取消定时任务 | `/schedule_cancel {id}` |

### 批量任务

| 指令 | 功能 | 示例 |
|------|------|------|
| `/batch` | 批量执行任务 | `/batch /xhs, /ins, /fb` |
| `/batch_confirm` | 批量确认任务 | `/batch_confirm` |

### 任务管理

| 指令 | 功能 | 示例 |
|------|------|------|
| `/status` | 查询任务状态 | `/status` |
| `/task` | 查询任务详情 | `/task task_001` |
| `/today` | 今日汇总 | `/today` |
| `/week` | 本周汇总 | `/week` |
| `/confirm` | 确认任务 | `/confirm task_001` |
| `/reject` | 拒绝任务 | `/reject task_001` |
| `/confirm_all` | 确认所有任务 | `/confirm_all` |
| `/reject_all` | 拒绝所有任务 | `/reject_all` |
| `/urgent` | 标记紧急 | `/urgent task_001` |
| `/priority` | 调整优先级 | `/priority task_001 high` |
| `/depend` | 设置依赖 | `/depend task_002 依赖：task_001` |
| `/pause` | 暂停任务 | `/pause task_001` |
| `/resume` | 恢复任务 | `/resume task_001` |
| `/cancel` | 取消任务 | `/cancel task_001` |
| `/clone` | 克隆任务 | `/clone task_history_001` |
| `/history` | 查看历史 | `/history task_001` |
| `/workflow` | 查看工作流 | `/workflow task_001` |

### 任务模板

| 指令 | 功能 | 示例 |
|------|------|------|
| `/create_template` | 创建模板 | `/create_template video_creation` |
| `/template` | 查看模板 | `/template xiaohongshu_post` |
| `/list_templates` | 查看所有模板 | `/list_templates` |
| `/test_template` | 测试模板 | `/test_template xiaohongshu_post` |

### 指令管理

| 指令 | 功能 | 示例 |
|------|------|------|
| `/add_command` | 添加指令 | `/add_command /video video_creation` |
| `/modify_command` | 修改指令 | `/modify_command /xhs priority=high` |
| `/delete_command` | 删除指令 | `/delete_command /video` |
| `/list_commands` | 查看所有指令 | `/list_commands` |

### 智能体管理

| 指令 | 功能 | 示例 |
|------|------|------|
| `/agents` | 查看所有智能体 | `/agents` |
| `/agent` | 查看智能体详情 | `/agent mobile_claw` |
| `/check_agent` | 检查智能体状态 | `/check_agent mobile_claw` |
| `/restart_agent` | 重启智能体 | `/restart_agent mobile_claw` |
| `/agent_history` | 查看任务历史 | `/agent_history mobile_claw` |

### 知识库

| 指令 | 功能 | 示例 |
|------|------|------|
| `/kb` | 查看知识库 | `/kb templates` |
| `/kb_add` | 添加知识 | `/kb_add 类别：lessons 内容：...` |
| `/kb_search` | 搜索知识 | `/kb_search 小红书` |
| `/kb_update` | 更新知识 | `/kb_update lesson_001 内容：...` |
| `/kb_delete` | 删除知识 | `/kb_delete lesson_001` |
| `/search` | 搜索知识库 | `/search 小红书` |

### 配置管理

| 指令 | 功能 | 示例 |
|------|------|------|
| `/config` | 更新偏好配置 | `/config xiaohongshu.style=专业` |
| `/pref` | 查看偏好配置 | `/pref xiaohongshu` |
| `/update_config` | 更新配置文件 | `/update_config` |

### 恢复管理

| 指令 | 功能 | 示例 |
|------|------|------|
| `/recover` | 恢复暂停任务 | `/recover` |
| `/recover_status` | 查看暂停任务 | `/recover_status` |

### 统计分析

| 指令 | 功能 | 示例 |
|------|------|------|
| `/stats` | 统计分析 | `/stats 本周` |
| `/report` | 生成报告 | `/report 类型：工作总结` |

### 提醒

| 指令 | 功能 | 示例 |
|------|------|------|
| `/remind` | 设置提醒 | `/remind 时间：18:00 内容：...` |
| `/remind_list` | 查看提醒 | `/remind_list` |
| `/remind_cancel` | 取消提醒 | `/remind_cancel {id}` |

### 帮助

| 指令 | 功能 | 示例 |
|------|------|------|
| `/help` | 查看帮助 | `/help` |
| `/init` | 初始化系统 | `/init 仓库：user/repo` |

---

## 附录B：Mobile Claw可操作App清单

### 完全可操作的App（32个）

**AI聊天类**：
- ChatGPT：完整对话流、图片生成
- Claude：完整对话流、代码生成
- Grok：完整对话流
- Perplexity：AI搜索、总结
- Kimi：完整UI对话
- Local Dream：本地AI图像生成

**社交媒体类**：
- Instagram：浏览、发帖、互动
- Facebook：浏览、互动
- Threads：浏览、发帖、互动
- X (Twitter)：浏览、互动（有广告弹窗）
- rednote (小红书)：浏览、发帖、互动
- LinkedIn：浏览、互动、求职
- Discord：聊天、社区
- Quora：浏览、搜索、提问

**新闻/内容类**：
- AP News：浏览、新闻收集
- Hacker News：浏览、技术新闻
- Ground News：新闻聚合
- Medium：浏览、阅读、深度文章
- Read Chan：社区浏览

**浏览器**：
- Chrome：导航、搜索、网页浏览

**系统类**：
- Phone：通话记录、拨打
- Messages：短信列表、对话
- Camera：拍照、变焦
- Settings：所有设置项

**工具类**：
- Xed-Editor：代码编辑
- Clash：代理切换
- MacroDroid：自动化编排
- Google Earth：搜索、浏览
- Proton Mail：邮件收发
- V2er：V2EX客户端

### 受限App（使用替代方案）

**新闻类**（Accessibility限制）：
- Bloomberg → 使用Chrome访问网页版
- Reuters → 使用Chrome访问网页版
- CNN → 使用Chrome访问网页版
- BBC → 使用Chrome访问网页版
- Guardian → 使用Chrome访问网页版

**WebView问题**：
- GitHub App → 使用Chrome访问GitHub网页版
- Notion → 使用Chrome访问Notion网页版

### 完全禁止的App

**金融类**：
- 微信：禁止操作
- PayPal：禁止操作
- Coinbase：禁止操作
- Binance：禁止操作

---

## 附录C：所有配置文件说明

### 配置文件清单

| 文件 | 位置 | 功能 |
|------|------|------|
| `decision_rules.yaml` | config/ | 决策规则（自动/批量/人工确认） |
| `user_preferences.yaml` | config/ | 用户偏好（风格、时间、通知） |
| `quick_commands.yaml` | config/ | 快捷指令定义 |
| `overload_handling.yaml` | config/ | 过载处理配置 |
| `command_management.yaml` | config/ | 指令管理配置 |
| `supplementary_commands.yaml` | config/ | 补充指令配置 |
| `task_templates.yaml` | templates/ | 任务模板定义 |
| `research_templates.yaml` | templates/ | 预研模板定义 |
| `agents.yaml` | registry/ | 智能体注册和能力定义 |
| `mobile_claw_apps.yaml` | registry/ | Mobile Claw App能力清单 |
| `tasks.yaml` | queue/ | 任务队列配置 |
| `paused_tasks.yaml` | queue/ | 暂停任务状态存储 |
| `memory.yaml` | memory/ | 长期记忆配置 |
| `work_records.yaml` | records/ | 工作记录配置 |

### 文档清单

| 文件 | 位置 | 功能 |
|------|------|------|
| `2025-01-15-*.md` | docs/plans/ | 完整设计文档 |
| `admin-ai-init-prompt.md` | docs/ | 管理员AI初始化提示词 |
| `init-command-guide.md` | docs/ | 初始化指令指南 |
| `overload-handling-solution.md` | docs/ | 过载处理完整方案 |
| `agent-role-setup.md` | docs/ | 各智能体角色设定 |

---

## 注意事项

### 1. 每次新会话需要初始化

Kimi API不能持久登录，每次新会话需要：
- 发送 `/init 仓库：{user/repo} 分支：main`
- 或发送完整初始化指令

### 2. 任务状态自动保存

- 智能体每完成一个步骤，状态自动保存到GitHub
- 过载时状态自动保存，恢复后自动继续
- 无需手动保存

### 3. 过载自动处理

- 检测到过载 → 自动保存状态 → 等待恢复 → 自动继续
- 用户无需手动操作
- 可使用 `/recover` 手动触发恢复

### 4. 配置更新方式

- 使用 `/config` 更新偏好配置
- 使用 `/add_command` 添加新指令
- 使用 `/update_config` 重新读取GitHub配置

### 5. 避开高峰时段

- 高峰时段：09:00-10:00, 14:00-15:00, 20:00-21:00
- 推荐时段：10:00-12:00, 15:00-17:00, 22:00-24:00
- 使用 `/schedule` 定时执行

---

## 版本信息

- 文档版本：v1.0
- 创建日期：2025-01-15
- 适用场景：多智能体协作工作流系统
- 智能体：管理员AI、Online Claw、Mobile Claw、PC Claw