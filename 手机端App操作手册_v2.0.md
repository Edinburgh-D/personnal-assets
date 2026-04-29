# 手机端 App 操作手册 v2.0

> 记录手机端黄油小熊能操作哪些 App、能做什么、不能做什么
> 累计测试：33个App（第一批17个 + 第二批16个）
> 更新日期：2025-04-29

---

## 一、完全可操作（15个）

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
| **Google Earth** | 地图 | 搜索地点、浏览地图、切换模式、查看项目 | 无限制 |
| **Clash** | 网络工具 | 查看状态、切换代理、查看日志、设置 | 无限制 |
| **Quora** | 问答社区 | 浏览首页、搜索、提问、底部导航 | 无限制 |
| **wallflow** | 壁纸 | 浏览壁纸、切换分类、收藏、设置 | 无限制 |
| **Phone** | 系统电话 | 查看通话记录、搜索联系人、拨打、过滤 | 无限制 |
| **Messages** | 系统短信 | 查看短信列表、搜索、开始对话 | 无限制 |
| **Camera** | 系统相机 | 拍照、切换模式、变焦、切换摄像头 | 无限制 |

**通用策略**：打开 App → 观察界面 → 输入/滑动/点击 → 记录结果

---

## 二、受限可操作（10个）

| App | 限制类型 | 能做什么 | 不能做什么 | 应对策略 |
|-----|---------|---------|-----------|---------|
| **GitHub App** | WebView | 打开、截图查看 | UI tree为空，点不动内部元素 | 截图模式，无法自动化 |
| **Notion** | WebView | 首页文档列表可操作 | 进入文档后是WebView，无法编辑 | 只能浏览首页 |
| **TikTok** | 网络 | 结构可读（导航、标签） | 网络不稳，内容加载失败 | 需稳定网络环境 |
| **Reddit** | 弹窗 | 结构可读（底部导航、搜索框） | 弹窗遮挡，内容加载中 | 需先处理弹窗 |
| **Spotify** | WebView | 能打开 | 内部是WebView，内容不可操作 | 截图模式 |
| **Coinbase** | 金融防护 | 能打开App | Accessibility被金融安全限制 | 不可操作 |
| **Binance** | 金融防护 | 能打开App | Accessibility被金融安全限制 | 不可操作 |
| **Microsoft Copilot** | 系统限制 | 能打开App | Accessibility被系统限制 | 不可操作 |
| **Leonardo.Ai** | 系统限制 | 能打开App | Accessibility被系统限制 | 不可操作 |
| **Notion Calendar** | 系统限制 | 能打开App | Accessibility被系统限制 | 不可操作 |

**通用策略**：打开 App → 截图查看 → 判断是否能点击 → 如不能则记录限制原因

---

## 三、黑名单（3个）

| App | 原因 | 说明 |
|-----|------|------|
| **微信** | 黑名单 | 涉及金融安全，完全禁止自动化操作 |
| **PayPal** | 金融安全 | 金融App安全防护，Accessibility被限制 |
| **文件管理器** | 未安装 | 包名找不到（com.android.documentsui） |

**通用策略**：记录失败原因 → 不再重试同类黑名单App

---

## 四、特殊/其他（3个）

| App | 状态 | 原因 |
|-----|------|------|
| **Gemini** | ❌ | 包名错误/已合并到Google Search |
| **iKuuu** | ❌ | 包名不存在（可能是Clash别名） |
| **A Little to the Left** | ❌ | Unity游戏，只有SurfaceView，无可操作元素 |

---

## 五、分类速查

### 按类型

| 类型 | 完全可操作 | 受限/打不开 | 黑名单 |
|------|-----------|------------|--------|
| AI聊天 | Claude、ChatGPT、Perplexity、Grok | Microsoft Copilot、Leonardo.Ai | — |
| 社交 | Instagram、Facebook | TikTok、Reddit | — |
| 浏览器 | Chrome | — | — |
| 办公 | — | Notion、Notion Calendar | — |
| 开发 | — | GitHub App | — |
| 系统 | 设置、Phone、Messages、Camera | — | — |
| 音乐 | — | Spotify | — |
| 地图 | Google Earth | — | — |
| 网络工具 | Clash | — | — |
| 问答社区 | Quora | — | — |
| 壁纸 | wallflow | — | — |
| 金融 | — | Coinbase、Binance | 微信、PayPal |
| 游戏 | — | A Little to the Left | — |

### 按策略

| 策略 | 适用App |
|------|--------|
| 完整交互（输入+点击+滑动） | Claude、ChatGPT、Perplexity、Grok、Instagram、Facebook、Chrome、设置、Google Earth、Clash、Quora、wallflow、Phone、Messages、Camera |
| 截图查看（无法点击） | GitHub App、Notion（文档内）、Spotify |
| 网络依赖（需稳定网络） | TikTok |
| 弹窗干扰（需先处理弹窗） | Reddit |
| 完全禁止（不碰） | 微信、PayPal、Coinbase、Binance |
| 系统限制 | Microsoft Copilot、Leonardo.Ai、Notion Calendar |

---

## 六、桌面App列表（当前已知全部）

**第一屏**：
Coinbase ❌、Binance ❌、Claude ✅、Google Earth ✅、Perplexity ✅、ChatGPT ✅、Grok ✅、Gemini ❌、Clash ✅、Reddit ⚠️、Quora ✅、GitHub ⚠️、PayPal ❌、iKuuu ❌、Microsoft Copilot ❌、Spotify ⚠️、Leonardo.Ai ❌、Facebook ✅、Instagram ✅、wallflow ✅、A Little to the Left ❌、Notion ⚠️、Notion Calendar ❌、TikTok ⚠️

**底部 Dock**：
Phone ✅、Messages ✅、Chrome ✅、Camera ✅

---

## 七、快速决策流程

```
接到操作App的任务
  ↓
查本手册：该App属于哪一类？
  ↓
【完全可操作】→ 正常执行（输入+点击+滑动）
【受限可操作】→ 截图模式，记录限制
【黑名单】→ 记录失败原因，不再重试
  ↓
汇报结果
```

---

## 八、关键规则总结

1. **金融类App全部受限**：Coinbase、Binance、PayPal 都有安全防护
2. **AI类App部分受限**：Microsoft Copilot、Leonardo.Ai  Accessibility被限制
3. **系统App全部可操作**：Phone、Messages、Camera、Settings 都能正常操作
4. **工具类App可操作**：Clash、wallflow、Quora 都能正常使用
5. **Unity游戏不可操作**：只有SurfaceView，没有UI元素
6. **提示词长度敏感**：Perplexity对长提示词（800字+）处理不了，需缩短到500字以内

---

*手册版本：v2.0*  
*测试日期：2025-04-29*  
*测试者：手机端黄油小熊*  
*累计测试App：33个*
