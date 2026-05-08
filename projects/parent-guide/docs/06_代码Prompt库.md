# 「育儿预演所」Claw代码Prompt库 v1.0

> 技术栈：Taro + React + TypeScript + Tailwind CSS
> 用途：AI写代码的Prompt模板，复制到Claw/Claude Code直接跑
> 日期：2026-04-28

---

## Prompt 1：首页 LandingPage 组件

```
## 任务
用Taro+React+TypeScript写一个微信小程序首页组件，文件路径 src/pages/index/index.tsx

## 技术栈
- Taro v3.6+
- React 18
- TypeScript
- Tailwind CSS (via taro-plugin-tailwind)

## 设计规范
- 品牌主色：#FF8C42（暖橙色）
- 背景色：#FFF8F0（暖白）
- 文字主色：#333333
- 文字次要色：#666666
- 字体：系统默认（PingFang SC）
- 圆角：按钮16px，卡片12px
- 间距：8px基数（8/16/24/32）

## 组件要求
1. 页面结构（从上到下）：
   - 顶部：品牌名「育儿预演所」+ 副标题"parenting is a marathon, not a sprint."
   - 中部：动态数据条 — "已有 47,231 位家长完成预演"（静态数字，MVP阶段不动画）
   - 中央：大号CTA按钮「开始预演」，底部悬浮，暖橙色背景+白色文字
   - 信任标签横排："6道情境题 · 9种画像 · 心理学理论支撑"
   - 底部：小字"90秒找到你的育儿风格"

2. 按钮交互：
   - 点击跳转到年龄段选择页（navigateTo /pages/age-select/index）
   - 点击时有轻微缩放反馈（scale 0.98）

3. 样式要求：
   - 页面高度100vh，内容垂直居中
   - CTA按钮宽度80%，高度48px
   - 按钮有轻微阴影（shadow-md）

4. 异常处理：
   - 如果跳转失败，显示Toast提示"页面加载失败，请重试"

## 输出格式
直接输出完整tsx代码，包含import、组件定义、样式、export default。不要省略任何部分。
```

---

## Prompt 2：年龄段选择 AgeSelect 组件

```
## 任务
用Taro+React+TypeScript写年龄段选择页，文件路径 src/pages/age-select/index.tsx

## 技术栈
- Taro v3.6+
- React 18
- TypeScript
- Tailwind CSS

## 设计规范
- 品牌主色：#FF8C42
- 背景色：#FFF8F0
- 卡片默认：白色背景+灰色边框
- 卡片选中：暖橙色边框+暖橙色背景10%

## 组件要求
1. 页面标题："请选择孩子的年龄段"
2. 四个选项卡片纵向排列：
   - 0-3岁（婴幼儿期）
   - 4-6岁（幼儿园期）
   - 7-12岁（小学期）
   - 13-18岁（青春期）
3. 每个卡片包含：
   - 年龄段文字（大号）
   - 简短描述（如"0-3岁：睡眠、喂养、情绪安抚"）
   - 右侧箭头图标
4. 点击卡片后：
   - 选中状态变色
   - 0.3秒后自动跳转到答题页
   - 把选中的年龄段存入本地存储（Taro.setStorageSync）
5. 底部有「返回首页」按钮

## 异常处理
- 如果本地存储写入失败，继续跳转（不阻塞流程）

## 输出格式
完整tsx代码，包含类型定义、状态管理、事件处理。
```

---

## Prompt 3：答题页 QuestionCard 组件

```
## 任务
用Taro+React+TypeScript写答题页组件，文件路径 src/pages/question/index.tsx

## 技术栈
- Taro v3.6+
- React 18
- TypeScript
- Tailwind CSS

## 设计规范
- 品牌主色：#FF8C42
- 背景色：#FFF8F0
- 选项默认：白色背景+1px灰色边框
- 选项选中：1px暖橙色边框+背景rgba(255,140,66,0.1)
- 选项未选中（其他3个）：透明度0.5

## 组件要求
1. 页面结构：
   - 顶部：进度条（细条，6格填充，每题16%）+ 题号"第1题/共6题"
   - 中部：场景描述卡片（背景轻微模糊的日常场景图，20字内口语化描述）
   - 下部：4个选项纵向卡片排列
   - 底部：「下一题」按钮（选中后才浮现）

2. 选项交互：
   - 点击选项 → 该选项高亮+其他变灰 → 浮现「下一题」按钮
   - 「下一题」点击 → 保存答案 → 切换到下一题（水平滑动动效）

3. 数据管理：
   - 从本地存储读取年龄段
   - 根据年龄段加载对应题库（JSON导入）
   - 答案数组存入本地存储

4. 特殊处理：
   - 第6题「下一题」按钮改为「查看结果」
   - 所有题答完后跳转到结果页

## 异常处理
- 题库加载失败：显示"题目加载失败，请返回重试"+返回按钮
- 用户中途退出：下次进入提示"上次做到第3题，继续？"

## 输出格式
完整tsx代码，包含useState/useEffect、题目切换逻辑、本地存储读写。
```

---

## Prompt 4：结果页 ResultPage 组件

```
## 任务
用Taro+React+TypeScript写结果页组件，文件路径 src/pages/result/index.tsx

## 技术栈
- Taro v3.6+
- React 18
- TypeScript
- Tailwind CSS

## 设计规范
- 品牌主色：#FF8C42
- 背景色：#FFF8F0
- 画像名称：大号字体72px，暖橙色
- 金句：32px，灰色，居中

## 组件要求
1. 页面分三屏（用户自然滑动）：

   **第一屏：画像揭晓**
   - 加载动画："正在分析你的育儿DNA..." + 3个呼吸圆点（3秒后自动进入结果）
   - 大标题：「你是 🟢 温室园丁」
   - 金句居中："你治愈的不是一个问题，是一个人。"
   - 4维度菱形风筝图（Canvas绘制，见Prompt 5）
   - 底部：「查看完整解读 ↓」引导滑动

   **第二屏：深度解读**
   - 3段卡片纵向排列：
     1. 「你的育儿超能力」—— 正向肯定（基于画像）
     2. 「你的隐藏挑战」—— 不是批评，是"下一步可以试试…"
     3. 「我的第一个行动」—— 具体微行动（如"明天孩子崩溃时，试着先说'我看到了'"）

   **第三屏：社交出口**
   - 「生成我的育儿画像海报」按钮
   - 3条可选分享文案（自嘲型/共鸣型/好奇型）
   - 付费转化浮条："解锁9种画像完整对比 + 专属成长路径，¥9.9"

2. 数据计算：
   - 从本地存储读取答案数组
   - 调用画像计算引擎（见Prompt 6）
   - 传入画像ID，展示对应文案

3. 动效：
   - 画像卡片从下方滑入
   - 金句打字机效果逐字呈现

## 异常处理
- 如果没有答案数据（用户直接访问结果页）， redirect 到首页
- 画像数据加载失败，显示默认文案

## 输出格式
完整tsx代码，包含三屏布局、滑动监听、Canvas调用、分享逻辑。
```

---

## Prompt 5：海报Canvas绘制组件

```
## 任务
用Taro+Canvas API写分享海报生成组件，文件路径 src/components/PosterCanvas/index.tsx

## 技术栈
- Taro v3.6+
- React 18
- TypeScript
- Taro Canvas API

## 设计规范
- 画布尺寸：750×1334px（朋友圈9:16比例）
- 背景色：#FFF8F0
- 品牌色：#FF8C42

## 组件要求
1. 接收props：
   ```typescript
   interface PosterProps {
     portraitName: string;      // 如"温室园丁"
     portraitEmoji: string;     // 如"🟢"
     quote: string;             // 金句
     dimensionA: number;        // 情绪回应 0-100
     dimensionB: number;        // 规则锚定 0-100
     dimensionC: number;        // 探索追问 0-100
     dimensionD: number;        // 行动果断 0-100
     userNickname?: string;     // 用户昵称（可选）
   }
   ```

2. 海报布局（从上到下）：
   - 顶部15%：品牌名「育儿预演所」+ 副标题
   - 中部50%：
     - 画像emoji+画像名（大号）
     - 金句（中号，居中）
     - 菱形风筝图（Canvas绘制，4维度可视化）
   - 下部25%：
     - 人话版解释（一行小字）
     - "你的育儿风格是什么？扫码揭晓 ↓"
   - 底部10%：小程序二维码区域（占位，后续填真实二维码）

3. 菱形风筝图绘制逻辑：
   - 中心点：(375, 500)
   - 4个顶点坐标根据dimension值计算：
     - 上顶点（情绪回应）：y = 500 - 200*(A/100)
     - 右顶点（规则锚定）：x = 375 + 200*(B/100)
     - 下顶点（探索追问）：y = 500 + 200*(C/100)
     - 左顶点（行动果断）：x = 375 - 200*(D/100)
   - 连线4个顶点成封闭四边形
   - 主维度顶点画暖橙色圆点，其他画灰色圆点
   - 每个顶点旁标注维度名+百分比

4. 导出功能：
   - canvas.toDataURL()生成base64图片
   - Taro.saveImageToPhotosAlbum保存到相册
   - 显示Toast"海报已保存"

## 异常处理
- Canvas绘制失败：显示"海报生成失败，请重试"+重试按钮
- 保存相册失败（用户未授权）：引导用户开启相册权限

## 输出格式
完整tsx代码，包含Canvas绘制逻辑、顶点计算、导出函数。
```

---

## Prompt 6：画像计算引擎

```
## 任务
用TypeScript写一个纯前端的画像计算引擎，文件路径 src/utils/calculator.ts

## 技术栈
- TypeScript
- 纯前端（无依赖）

## 类型定义
```typescript
interface AssessmentResult {
  primaryPortrait: string;      // 主画像ID，如"greenhouse-gardener"
  mixPortrait?: string;         // 混合型ID（如有）
  dimensions: {
    A: number;                  // 情绪回应 0-100
    B: number;                  // 规则锚定 0-100
    C: number;                  // 探索追问 0-100
    D: number;                  // 行动果断 0-100
  };
  answers: string[];            // 用户答案数组，如['A','B','C','A','D','B']
}
```

## 计算逻辑
1. 统计A/B/C/D出现次数
2. 计算百分比：次数 / 总题数 × 100
3. 找最大值作为主画像维度
4. 判断混合型：前两名差距 < 15% 则为混合型
5. 映射到具体画像名称：
   - A最多 → 温室园丁 (greenhouse-gardener)
   - B最多 → 目标教练 (goal-coach)
   - C最多 → 侦探型父母 (detective-parent)
   - D最多 → 行动派指挥官 (action-commander)
   - A+B混合 → 灯塔型 (lighthouse)
   - A+C混合 → 治愈型 (healer)
   - A+D混合 → 矛盾型 (contradictory)
   - B+C混合 → 策略型 (strategist)
   - B+D混合 → 工程师 (engineer)
   - C+D混合 → 摇摆型 (swinger)

## 函数签名
```typescript
export function calculatePortrait(answers: string[]): AssessmentResult
```

## 单元测试用例
1. ['A','A','A','A','A','A'] → 温室园丁，dimensions: {A:100, B:0, C:0, D:0}
2. ['A','A','A','B','B','B'] → 温室园丁（A=50, B=50，差距0<15%，应为灯塔型）
3. ['B','B','B','B','B','B'] → 目标教练
4. ['A','B','C','D','A','B'] → 需要计算具体哪个最多
5. 空数组 → 抛出错误"答案不能为空"

## 异常处理
- answers为空：throw new Error('答案不能为空')
- answers包含非法值（非A/B/C/D）：过滤或抛出错误
- 总题数不为6：正常计算（兼容未来扩展）

## 输出格式
完整TypeScript代码，包含类型定义、计算函数、映射常量、单元测试用例。
```

---

## Prompt 7：后端API路由（Next.js API Routes）

```
## 任务
用Next.js 14 + TypeScript写后端API，文件路径 app/api/assessment/submit/route.ts

## 技术栈
- Next.js 14 (App Router)
- TypeScript
- MySQL (via mysql2/promise)

## API功能
接收测评结果，保存到数据库，返回付费层/免费层数据

## 请求格式
```json
POST /api/assessment/submit
{
  "userId": "wx_abc123",
  "ageRange": "0-3",
  "answers": ["A", "B", "C", "A", "D", "B"],
  "openid": "o123456789"
}
```

## 处理逻辑
1. 验证参数：userId, ageRange, answers必填
2. 调用前端相同的calculatePortrait算法（复用Prompt 6的代码）
3. 保存到数据库assessments表：
   - id: UUID
   - user_id: userId
   - age_range: ageRange
   - answers: JSON字符串
   - primary_portrait: 计算结果
   - mix_portrait: 计算结果（如有）
   - dimension_a/b/c/d: 百分比
   - created_at: 当前时间
4. 返回响应：
```json
{
  "success": true,
  "data": {
    "assessmentId": "uuid",
    "result": { /* AssessmentResult对象 */ },
    "freeLayer": {
      "portraitName": "温室园丁",
      "description": "你特别会照顾孩子的情绪...",
      "quote": "你治愈的不是一个问题，是一个人。"
    },
    "paidLayer": {
      "preview": "完整报告包含：9画像对比 + 逐题解析 + 成长路径",
      "price": 990
    }
  }
}
```

## 异常处理
- 参数缺失：返回400 + {error: '缺少必要参数'}
- 数据库连接失败：返回500 + {error: '服务暂时不可用'}
- 计算失败：返回500 + {error: '结果计算失败'}

## 数据库表结构（参考）
```sql
CREATE TABLE assessments (
  id VARCHAR(32) PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  age_range ENUM('0-3','4-6','7-12','13-18') NOT NULL,
  answers JSON NOT NULL,
  primary_portrait VARCHAR(32) NOT NULL,
  mix_portrait VARCHAR(32),
  dimension_a TINYINT UNSIGNED,
  dimension_b TINYINT UNSIGNED,
  dimension_c TINYINT UNSIGNED,
  dimension_d TINYINT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
);
```

## 输出格式
完整route.ts代码，包含请求处理、参数验证、数据库操作、错误处理。
```

---

## 使用说明

### 使用方式
1. 复制上述任意一个Prompt
2. 粘贴到Claw/Claude Code/ChatGPT
3. AI会直接输出完整可运行的代码
4. 复制代码到对应文件路径
5. 根据项目实际情况微调（如修改API地址、添加真实图片资源）

### 依赖安装（项目初始化时一次性）
```bash
# Taro项目
npm install @tarojs/cli
npx @tarojs/cli init taro-client
# 选择：React + TypeScript + 微信小程序 + Less + 云开发（可选）

# Tailwind CSS
npm install taro-plugin-tailwind
# 在config/index.js中配置plugins: ['taro-plugin-tailwind']

# Next.js后端
npx create-next-app@latest next-server --typescript --tailwind

# MySQL连接
npm install mysql2
```

### 调试建议
1. 每个Prompt输出的代码先在微信开发者工具中运行
2. 用Console.log排查数据流
3. 组件级测试通过后再联调

---

*本Prompt库用于「育儿预演所」MVP阶段快速开发，复制即用。*
