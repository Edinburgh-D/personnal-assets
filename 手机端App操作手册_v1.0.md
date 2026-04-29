# 手机端 App 操作手册

> 记录手机端黄油小熊能操作哪些 App、能做什么、不能做什么
> 更新日期：2025-04-29

---

## 一、完全可操作（8个）

| App | 类型 | 能做什么 | 测试备注 |
|-----|------|---------|---------|
| **Chrome** | 浏览器 | 导航、输入URL、跳转 | 内容读取需截图辅助 |
| **系统设置** | 系统 | 所有设置项可点击浏览 | 无限制 |
| **Claude** | AI聊天 | 打开→输入文字→发送→接收回复 | 支持完整对话流 |
| **ChatGPT** | AI聊天 | 打开→输入→发送→收回复 | 支持完整对话流 |
| **Perplexity** | AI搜索 | 搜索输入、建议、发送 | 支持完整搜索流 |
| **Grok** | AI聊天 | 聊天输入、发送、模式切换 | 支持完整对话流 |
| **Instagram** | 社交 | 浏览feed、滑动、点击帖子/按钮 | Stories、Reels正常 |
| **Facebook** | 社交 | 浏览动态流、发布、互动 | 帖子、照片、按钮正常 |

**通用策略**：打开 App → 观察界面 → 输入/滑动/点击 → 记录结果

---

## 二、受限可操作（5个）

| App | 限制类型 | 能做什么 | 不能做什么 | 应对策略 |
|-----|---------|---------|-----------|---------|
| **GitHub App** | WebView | 打开、截图查看 | UI tree为空，点不动内部元素 | 截图模式，无法自动化 |
| **Notion** | WebView | 首页文档列表可操作 | 进入文档后是WebView，无法编辑 | 只能浏览首页 |
| **TikTok** | 网络 | 结构可读（导航、标签） | 网络不稳，内容加载失败 | 需稳定网络环境 |
| **Reddit** | 弹窗 | 结构可读（底部导航、搜索框） | 弹窗遮挡，内容加载中 | 需先处理弹窗 |
| **Spotify** | WebView | 能打开 | 内部是WebView，内容不可操作 | 截图模式 |

**通用策略**：打开 App → 截图查看 → 判断是否能点击 → 如不能则记录限制原因

---

## 三、不可操作（4个）

| App | 原因 | 说明 |
|-----|------|------|
| **微信** | 黑名单 | 涉及金融安全，完全禁止自动化操作 |
| **文件管理器** | 未安装 | 包名找不到（com.android.documentsui） |
| **Gemini** | 超时/包名变更 | 包名com.google.android.apps.bard可能已合并到Google Search |
| **Gmail** | 未安装 | 未测试，可能未安装或包名不对 |

**通用策略**：记录失败原因 → 不再重试同类黑名单App

---

## 四、分类速查

### 按类型

| 类型 | 完全可操作 | 受限 | 不可操作 |
|------|-----------|------|---------|
| AI聊天 | Claude、ChatGPT、Perplexity、Grok | — | Gemini |
| 社交 | Instagram、Facebook | TikTok、Reddit | 微信 |
| 浏览器 | Chrome | — | — |
| 办公 | — | Notion | — |
| 开发 | — | GitHub App | — |
| 系统 | 设置 | — | 文件管理器 |
| 音乐 | — | Spotify | — |

### 按策略

| 策略 | 适用App |
|------|--------|
| 完整交互（输入+点击+滑动） | Claude、ChatGPT、Perplexity、Grok、Instagram、Facebook、Chrome、设置 |
| 截图查看（无法点击） | GitHub App、Notion（文档内）、Spotify |
| 网络依赖（需稳定网络） | TikTok |
| 弹窗干扰（需先处理弹窗） | Reddit |
| 完全禁止（不碰） | 微信 |

---

## 五、执行规则

### AI类App测试规则
- 输入内容：**"这是一条来自手机端OpenClaw的测试消息"**
- 记录：能否发送、收到什么回复、回复内容
- 适用：Claude、ChatGPT、Perplexity、Grok等AI聊天类

### 非AI类App测试规则
- 输入内容：无意义测试内容（如"Test"、"Hello"）或无输入
- 记录：能否打开、能做什么操作、卡在哪
- 适用：社交、浏览器、工具类

---

## 六、桌面App列表（当前已知）

**第一屏**：
Coinbase、Binance、Claude、Google Earth、Perplexity、ChatGPT、Grok、Gemini、Clash、Reddit、Quora、GitHub、PayPal、iKuuu、Copilot、Spotify、Leonardo.Ai、Facebook、Instagram、wallflow、A Little to the Left、Notion、Notion Calendar、TikTok

**底部 Dock**：
Phone、Messages、Chrome、Camera

**未测试（待补）**：
Coinbase、Binance、Google Earth、Clash、Quora、PayPal、iKuuu、Copilot、Leonardo.Ai、wallflow、A Little to the Left、Notion Calendar、Phone、Messages、Camera

---

## 七、快速决策流程

```
接到操作App的任务
  ↓
查本手册：该App属于哪一类？
  ↓
【完全可操作】→ 正常执行（输入+点击+滑动）
【受限可操作】→ 截图模式，记录限制
【不可操作】→ 记录失败原因，不再重试
  ↓
汇报结果
```

---

*手册版本：v1.0*  
*测试日期：2025-04-29*  
*测试者：手机端黄油小熊*
