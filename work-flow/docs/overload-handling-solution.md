# 服务过载处理方案
# 解决Kimi API服务过载导致智能体停止工作的问题

## 问题分析

### 当前问题

| 问题 | 影响 | 严重程度 |
|------|------|---------|
| Kimi API服务过载 | 智能体停止响应 | 高 |
| 过载期间任务中断 | 任务状态丢失 | 高 |
| 需要手动艾特重启 | 无法解放双手 | 高 |
| 无法预测过载时间 | 任务执行不可控 | 中 |

### 根本原因

1. **会话依赖**：任务状态存储在Kimi会话中，会话中断则状态丢失
2. **无恢复机制**：智能体没有自动恢复能力
3. **无备用方案**：某个智能体过载时没有替代方案

---

## 解决方案设计

### 核心思路

```
┌─────────────────────────────────────────────────────────────┐
│                    任务状态持久化                            │
│  任务状态存储在GitHub仓库，不依赖Kimi会话                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    过载检测与处理                            │
│  智能体检测过载 → 保存状态 → 等待恢复 → 自动重启             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    备用智能体机制                            │
│  某智能体过载 → 管理员AI分配给其他智能体 → 任务继续           │
└─────────────────────────────────────────────────────────────┘
```

---

### 方案一：任务状态持久化（核心）

**设计思路**：任务状态存储在GitHub仓库，智能体每次操作后更新状态，过载恢复后读取状态继续执行。

**实现方式**：

```yaml
# 任务状态持久化配置
task_persistence:
  
  # 存储位置
  storage:
    location: "github_repo"
    path: "queue/active_tasks.yaml"
    
    # 状态文件结构
    files:
      - "active_tasks.yaml"      # 当前执行中的任务
      - "paused_tasks.yaml"      # 因过载暂停的任务
      - "pending_tasks.yaml"     # 待执行的任务
  
  # 状态更新频率
  update_frequency:
    normal: "每步骤完成后"
    overload: "立即保存"
  
  # 状态保存内容
  save_content:
    - task_id
    - current_step
    - step_progress
    - intermediate_outputs  # 中间产物
    - agent_status
    - timestamp
  
  # 恢复机制
  recovery:
    trigger: "智能体重启后"
    process:
      - "读取GitHub任务状态文件"
      - "识别中断的任务"
      - "从断点继续执行"
      - "通知用户恢复状态"
```

**任务状态文件示例**：

```yaml
# queue/active_tasks.yaml
active_tasks:
  
  - task_id: "task_20250115_001"
    type: "xiaohongshu_post"
    status: "running"
    
    # 进度保存
    current_step: 2
    step_name: "生成图片"
    step_status: "in_progress"
    
    # 中间产物保存
    intermediate_outputs:
      step_1:
        name: "生成内容提示词"
        output: "推荐5个实用AI工具..."
        saved_at: "2025-01-15 09:10:00"
    
    # 执行智能体
    assigned_agent: "mobile_claw"
    agent_status: "online"
    
    # 时间记录
    created_at: "2025-01-15 09:00:00"
    last_update: "2025-01-15 09:15:00"
    
    # 过载标记
    overload_flag: false
    overload_detected_at: null
```

---

### 方案二：过载检测与自动处理

**设计思路**：智能体主动检测过载状态，保存任务状态，等待恢复后自动重启。

**过载检测机制**：

```yaml
# 过载检测配置
overload_detection:
  
  # 检测方式
  detection_methods:
    
    # 方式1：响应时间检测
    response_time:
      normal_threshold: "5秒"
      overload_threshold: "30秒"
      detection_logic: "如果响应时间超过30秒，标记为过载"
    
    # 方式2：错误响应检测
    error_response:
      overload_keywords:
        - "服务过载"
        - "系统繁忙"
        - "请稍后再试"
        - "请求超时"
      detection_logic: "如果响应包含过载关键词，标记为过载"
    
    # 方式3：心跳检测（管理员AI）
    heartbeat:
      interval: "30秒"
      timeout: "60秒"
      detection_logic: "如果智能体60秒无响应，标记为过载"
  
  # 过载处理流程
  overload_handling:
    
    step_1_detect:
      name: "检测过载"
      action: "智能体检测到过载信号"
      
    step_2_save:
      name: "保存状态"
      action: "立即保存任务状态到GitHub"
      content:
        - "当前任务进度"
        - "中间产物"
        - "过载时间"
      save_to: "queue/paused_tasks.yaml"
      
    step_3_notify:
      name: "通知管理员"
      action: "发送过载通知到管理员AI"
      message: "⚠️ {agent_id} 服务过载，任务已暂停保存"
      
    step_4_wait:
      name: "等待恢复"
      action: "等待Kimi API恢复"
      max_wait: "30分钟"
      
    step_5_recovery:
      name: "自动恢复"
      trigger: "智能体重启后"
      action:
        - "读取GitHub任务状态"
        - "识别暂停的任务"
        - "从断点继续执行"
        - "通知用户恢复"
```

**过载处理流程图**：

```
正常执行 → 检测到过载 → 立即保存状态到GitHub → 通知管理员AI → 等待恢复
                                    ↓
                              智能体重启后
                                    ↓
                         读取GitHub任务状态 → 从断点继续 → 通知用户恢复
```

---

### 方案三：备用智能体机制

**设计思路**：某个智能体过载时，管理员AI将任务分配给其他可用智能体。

**备用智能体配置**：

```yaml
# 备用智能体配置
backup_agents:
  
  # 备用规则
  backup_rules:
    
    # Mobile Claw过载时的备用方案
    mobile_claw_overload:
      affected_capabilities:
        - "social_media_posting"
        - "ai_app_integration"
        - "web_browsing"
      
      backup_options:
        - capability: "social_media_posting"
          backup: null  # 无备用，任务暂停
          action: "保存任务，等待恢复"
        
        - capability: "ai_app_integration"
          backup: "online_claw"  # Online Claw可以通过API调用ChatGPT
          action: "切换到Online Claw执行"
        
        - capability: "web_browsing"
          backup: "online_claw"  # Online Claw可以通过API获取网页内容
          action: "切换到Online Claw执行"
    
    # Online Claw过载时的备用方案
    online_claw_overload:
      affected_capabilities:
        - "github_operations"
        - "code_analysis"
        - "prompt_generation"
      
      backup_options:
        - capability: "github_operations"
          backup: null  # 无备用，任务暂停
          action: "保存任务，等待恢复"
        
        - capability: "prompt_generation"
          backup: "mobile_claw"  # Mobile Claw可以用ChatGPT生成
          action: "切换到Mobile Claw执行"
    
    # PC Claw过载时的备用方案
    pc_claw_overload:
      affected_capabilities:
        - "local_code_writing"
        - "command_line_execution"
      
      backup_options:
        - capability: "local_code_writing"
          backup: null  # 无备用，任务暂停
          action: "保存任务，等待恢复"
    
    # 管理员AI过载时的备用方案
    admin_ai_overload:
      affected_capabilities:
        - "task_orchestration"
        - "decision_proxy"
      
      backup_options:
        - capability: "task_orchestration"
          backup: "online_claw"  # Online Claw可以临时接管协调
          action: "切换到Online Claw协调"
        
        - capability: "decision_proxy"
          backup: "default_rules"  # 使用默认规则
          action: "应用默认决策规则"
```

---

### 方案四：批量任务调度（减少过载风险）

**设计思路**：将任务分散到不同时间段执行，避免高峰期集中调用Kimi API。

**调度配置**：

```yaml
# 批量任务调度配置
task_scheduling:
  
  # 避开高峰时段
  peak_hours:
    detect: "自动检测Kimi API响应时间"
    avoid_threshold: "响应时间 > 20秒"
    
    # 已知高峰时段（根据经验）
    known_peak:
      - "09:00-10:00"   # 早高峰
      - "14:00-15:00"   # 下午高峰
      - "20:00-21:00"   # 晚高峰
    
    # 低峰时段（推荐执行时间）
    recommended_hours:
      - "10:00-12:00"
      - "15:00-17:00"
      - "22:00-24:00"
  
  # 任务调度策略
  scheduling_strategy:
    
    # 紧急任务：立即执行
    urgent:
      priority: "highest"
      execute: "立即执行，不避开高峰"
      retry_on_overload: "3次"
    
    # 高优先级：优先时段执行
    high:
      priority: "high"
      execute: "优先时段执行"
      avoid_peak: true
    
    # 普通：低峰时段执行
    normal:
      priority: "normal"
      execute: "低峰时段执行"
      avoid_peak: true
    
    # 低优先级：空闲时执行
    low:
      priority: "low"
      execute: "空闲时执行"
      avoid_peak: true
  
  # 批量执行
  batch_execution:
    enabled: true
    batch_size: 3  # 每批最多3个任务
    batch_interval: "10分钟"  # 批次间隔
    
    # 批量执行时段
    batch_hours:
      - "10:00-12:00"
      - "15:00-17:00"
      - "22:00-24:00"
```

---

### 方案五：自动重启机制

**设计思路**：智能体过载恢复后，自动读取任务状态并重启任务，无需用户手动艾特。

**自动重启配置**：

```yaml
# 自动重启配置
auto_recovery:
  
  # 重启触发
  triggers:
    
    # 触发1：智能体重启后主动检查
    agent_startup:
      trigger: "智能体被艾特后响应"
      action:
        - "读取GitHub任务状态文件"
        - "检查是否有暂停的任务"
        - "如果有，自动恢复执行"
    
    # 触发2：管理员AI定时检查
    admin_timer:
      trigger: "每30分钟检查一次"
      action:
        - "检查所有智能体状态"
        - "检查暂停的任务"
        - "如果智能体恢复，分配任务重启"
    
    # 触发3：用户发送恢复指令
    user_command:
      trigger: "用户发送 /recover"
      action:
        - "读取所有暂停任务"
        - "分配给可用智能体"
        - "从断点继续执行"
  
  # 重启流程
  recovery_process:
    
    step_1:
      name: "读取任务状态"
      action: "从GitHub读取 paused_tasks.yaml"
    
    step_2:
      name: "识别中断任务"
      action: "识别因过载暂停的任务"
    
    step_3:
      name: "检查智能体状态"
      action: "检查智能体是否恢复"
    
    step_4:
      name: "分配任务"
      action: "将任务分配给恢复的智能体"
    
    step_5:
      name: "从断点继续"
      action: "从保存的步骤继续执行"
    
    step_6:
      name: "通知用户"
      action: "发送恢复通知到群聊"
      message: "✅ 任务 {task_id} 已自动恢复，从步骤 {step} 继续"
  
  # 重启指令
  commands:
    
    # 手动触发恢复
    "/recover":
      description: "恢复所有暂停任务"
      action: "读取暂停任务，分配给可用智能体"
    
    "/recover {task_id}":
      description: "恢复特定任务"
      action: "恢复指定任务"
    
    "/recover_status":
      description: "查看暂停任务状态"
      action: "显示所有暂停任务"
```

---

## 实施方案

### 实施优先级

| 方案 | 优先级 | 实施难度 | 效果 |
|------|--------|---------|------|
| **方案一：任务状态持久化** | 最高 | 中 | 核心保障 |
| **方案五：自动重启机制** | 高 | 低 | 解放双手 |
| **方案二：过载检测** | 高 | 中 | 主动应对 |
| **方案三：备用智能体** | 中 | 高 | 增强可靠性 |
| **方案四：批量调度** | 低 | 低 | 预防过载 |

### 实施步骤

**阶段一：核心保障（立即实施）**

1. 创建任务状态持久化配置
2. 智能体每次操作后保存状态到GitHub
3. 智能体重启后读取状态继续执行

**阶段二：自动恢复（短期实施）**

1. 实现自动重启机制
2. 添加 `/recover` 指令
3. 管理员AI定时检查暂停任务

**阶段三：过载应对（中期实施）**

1. 实现过载检测机制
2. 实现备用智能体机制
3. 实现批量调度策略

---

## 管理员AI过载处理提示词

将以下提示词添加到管理员AI初始化指令中：

```
### 过载处理机制

请建立以下过载处理逻辑：

**过载检测**：
1. 每次智能体响应时，检测响应时间
2. 如果响应时间超过30秒或包含"服务过载"关键词，标记为过载
3. 如果智能体60秒无响应，标记为过载

**过载处理**：
1. 立即将当前任务状态保存到GitHub仓库（queue/paused_tasks.yaml）
2. 保存内容：任务ID、当前步骤、中间产物、过载时间
3. 发送通知：⚠️ {agent_id} 服务过载，任务已暂停保存

**自动恢复**：
1. 智能体重启后，读取GitHub任务状态文件
2. 识别因过载暂停的任务
3. 从断点继续执行
4. 发送通知：✅ 任务 {task_id} 已自动恢复

**备用智能体**：
1. 如果mobile_claw过载，web_browsing任务切换到online_claw
2. 如果online_claw过载，prompt_generation切换到mobile_claw
3. 如果管理员AI过载，online_claw临时接管协调

**恢复指令**：
- /recover：恢复所有暂停任务
- /recover {task_id}：恢复特定任务
- /recover_status：查看暂停任务状态
```

---

## 使用示例

**正常流程**：

```
用户：/xhs 主题：AI工具推荐

管理员AI：
✅ 任务已创建：task_001
⚡ 决策：自动批准
🤖 分配：online_claw → mobile_claw

正在执行...
- Step 1: online_claw 生成内容 ✓
- Step 2: mobile_claw 生成图片...（执行中）
```

**过载发生**：

```
mobile_claw：（响应超时30秒）

管理员AI：
⚠️ mobile_claw 服务过载
📋 任务 task_001 已暂停保存
💾 状态已保存到GitHub
⏳ 等待恢复后自动继续

用户无需操作，等待即可
```

**自动恢复**：

```
（30分钟后，mobile_claw恢复）

mobile_claw：（被艾特后自动检查）
检测到暂停任务 task_001
从步骤2继续执行...

管理员AI：
✅ 任务 task_001 已自动恢复
🔄 从步骤2继续：生成图片
📝 无需手动操作
```

**手动恢复**：

```
用户：/recover

管理员AI：
📊 暂停任务状态
- task_001: 暂停于步骤2（过载）
- task_002: 暂停于步骤1（过载）

正在恢复...
✅ task_001 已分配给 mobile_claw
✅ task_002 已分配给 online_claw
```

---

## 关键要点总结

1. **任务状态必须持久化到GitHub**：这是解决过载问题的核心
2. **智能体重启后自动读取状态**：无需用户手动艾特
3. **管理员AI定时检查暂停任务**：主动恢复
4. **备用智能体机制**：某些任务可以切换执行
5. **避开高峰时段**：预防过载发生