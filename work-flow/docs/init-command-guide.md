# 管理员AI初始化指令
# 直接复制以下内容发送到Kimi群聊

---

## 完整版初始化指令（首次使用）

请作为多智能体协作系统的管理员AI，执行以下初始化操作：

### 第一步：读取配置文件

请使用GitHub REST API读取以下配置文件：

- 仓库：{替换为你的GitHub用户名/仓库名}
- 分支：main
- 配置路径：
  - workflow-config/config/decision_rules.yaml
  - workflow-config/config/user_preferences.yaml
  - workflow-config/config/quick_commands.yaml
  - workflow-config/templates/task_templates.yaml
  - workflow-config/registry/agents.yaml
  - workflow-config/queue/tasks.yaml
  - workflow-config/memory/memory.yaml
  - workflow-config/records/work_records.yaml

### 第二步：解析配置内容

读取成功后，请解析并记住以下内容：

**决策规则**：
- auto_approve（低风险）：社交媒体发布、信息收集、图片生成 → 自动执行
- batch_confirm（中风险）：代码推送到feature分支 → 每日18:00汇总确认
- manual_confirm（高风险）：代码推送到main分支、系统配置修改 → 即时通知确认

**用户偏好**：
- 小红书：轻松活泼风格，20:00-22:00发布，hashtags: #AI #科技
- Instagram：国际化专业风格，21:00-23:00发布
- 代码开发：TypeScript + Vue3，必须包含单元测试

**任务模板**：
- xiaohongshu_post：online_claw生成内容 → mobile_claw生成图片 → mobile_claw发布
- code_development：online_claw分析 → mobile_claw设计 → pc_claw写代码 → online_claw推送

**智能体能力**：
- online_claw：GitHub操作、代码分析、提示词生成（24/7可用）
- mobile_claw：社媒发布、AI应用调用、信息浏览（24/7可用）
- pc_claw：本地代码编写、命令行执行（仅下班时间可用）

**快捷指令**：
- /xhs：发布小红书
- /ins：发布Instagram
- /dev：代码开发
- /collect：信息收集
- /status：查询状态
- /today：今日汇总
- /confirm：确认任务

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
3. 记录执行日志
4. 处理异常情况（包括服务过载）

**任务完成时**：
1. 验证产出结果
2. 更新任务状态到GitHub
3. 沉淀到知识库
4. 在汇报时间发送汇总

### 第四步：初始化完成

初始化完成后，请返回：

✅ 初始化成功
📋 已加载配置：
  - 决策规则：15条
  - 任务模板：10个
  - 智能体注册：4个
  - 快捷指令：20个

🤖 智能体状态：
  - online_claw: 检测中
  - mobile_claw: 检测中
  - pc_claw: 检测中

⚡ 可用快捷指令：
  - /xhs: 发布小红书
  - /ins: 发布Instagram
  - /dev: 代码开发
  - /collect: 信息收集
  - /status: 查询状态
  - /today: 今日汇总

📝 请发送任务指令开始使用

---

## 简化版初始化指令（日常使用）

每次新会话时发送：

```
/init 仓库：{你的用户名/仓库名} 分支：main
```

管理员AI会自动读取配置并初始化。

---

## 示例：发送初始化指令

假设你的GitHub仓库是 `myuser/my-workflow`，发送：

```
/init 仓库：myuser/my-workflow 分支：main
```

管理员AI会返回：

```
正在读取配置...
✅ 初始化成功
📋 已加载配置：
  - 决策规则：15条
  - 任务模板：10个
  - 智能体注册：4个
  - 快捷指令：20个

🤖 智能体状态：
  - online_claw: online
  - mobile_claw: online
  - pc_claw: offline（工作时间）

⚡ 可用快捷指令：
  - /xhs: 发布小红书
  - /ins: 发布Instagram
  - /dev: 代码开发
  - /collect: 信息收集
  - /status: 查询状态
  - /today: 今日汇总

📝 请发送任务指令开始使用
```

---

## 注意事项

1. **每次新会话需要重新初始化**：Kimi API不能持久登录，每次新会话需要发送 `/init`

2. **提供GitHub Token更稳定**：如果仓库是私有的，需要提供Token：
   ```
   /init 仓库：myuser/my-workflow 分支：main token：ghp_xxxxx
   ```

3. **配置文件修改后需要更新**：
   ```
   /update_config
   ```