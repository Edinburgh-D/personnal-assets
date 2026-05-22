---
name: knowledge-base-generator
description: 生成完整的知识库HTML网页系统，包含主页面、多个子页面、导航系统、数据扭曲分析、修改记录等。触发场景：用户要求生成关于某个主题（如"纳瓦尔宝典"、"康波周期"、"心理学"等）的HTML知识库网页。
---

# Knowledge Base Generator（知识库生成器）

## Overview

生成完整的知识库HTML网页系统，包含：
- 主页面（核心概念、历史背景、与现实关系）
- 多个子页面（详细分析页面）
- 导航系统（左上角tooltip菜单 + 子页面侧边栏导航）
- 数据扭曲分析（官方数据 vs 真实感受）
- 修改记录（MD文档）
- 特殊分析页面（如消费悖论分析）

**Announce at start:** "我正在使用 knowledge-base-generator skill 来生成知识库网页系统。"

## Trigger Scenarios（触发场景）

当用户说以下类似话语时，触发此skill：
- "请帮我生成一个关于讲解'纳瓦尔宝典'的HTML网页"
- "请帮我生成一个关于'康波周期'的知识库"
- "请帮我创建一个'心理学'主题的HTML知识库"
- "我想了解'xxx'，请生成HTML网页"
- "帮我完善这个知识库，添加更多内容"

## Knowledge Base Types（知识库类型）

### Type 1: Single Subject（单一主题型）

适用于单一概念或理论，如"康波周期"、"纳瓦尔宝典"。

**结构**：
```
[主题名称]/
├── main.html              # 主页面
├── [主题]-history.html    # 历史详解
├── [主题]-comparison.html # 对比分析
├── [主题]-application.html # 应用指南
├── [主题]-paradox.html    # 悖论分析（如涉及经济）
└── README.md              # 修改记录
```

### Type 2: Multi-Branch（多分支型）

适用于有多个子领域的主题，如"心理学"、"经济学"。

**结构**：
```
[主题名称]/
├── main.html                    # 总览主页面
├── [分支1]-school/              # 分支1目录
│   └── main.html                # 分支1主页面
│   └── [人物1].html             # 人物专题（可选）
│   └── [理论1].html             # 理论专题（可选）
├── [分支2]-school/              # 分支2目录
│   └── main.html                # 分支2主页面
├── [应用1]-applications/        # 应用1目录
│   └── main.html                # 应用1主页面
├── [应用2]-applications/        # 应用2目录
│   └── main.html                # 应用2主页面
└── README.md                    # 修改记录
```

**心理学知识库示例结构**：
```
心理学知识库/
├── main.html                          # 心理学总览
├── psychoanalysis-school/             # 精神分析流派
│   └── main.html                      # 流派主页面
│   └── freud.html（可选）             # 弗洛伊德专题
│   └── jung.html（可选）              # 荣格专题
├── behaviorism-school/                # 行为主义流派
│   └── main.html
├── cognitive-psychology-school/       # 认知心理学流派
│   └── main.html
├── humanistic-psychology-school/      # 人本主义流派
│   └── main.html
├── other-schools/                     # 其他流派
│   └── main.html                      # 进化心理学、积极心理学等
├── daily-life-applications/           # 日常应用
│   └── main.html                      # 情绪管理、人际交往等
├── clinical-psychology-applications/  # 临床应用
│   └── main.html                      # 心理评估、心理治疗等
├── educational-psychology-applications/ # 教育应用
│   └── main.html                      # 学习理论、教学设计等
└── README.md                          # 修改记录
```

## Generation Process（生成流程）

### Phase 1: 主题分析（理解用户需求）

**目标**：理解主题的核心概念、历史背景、与现实的关系。

**步骤**：
1. 分析主题的核心概念（是什么？）
2. 分析主题的历史背景（历史验证、关键事件）
3. 分析主题与现实的关系（对普通人、对国家、对社会的影响）
4. 分析主题的争议点（数据扭曲、不同观点）
5. 确定知识库类型（单一主题型 vs 多分支型）
6. 确定页面结构（主页面 + 子页面/分支目录）

**输出**：页面结构规划表

**单一主题型规划**：
```
| 页面 | 内容 | 章节 |
|------|------|------|
| 主页面 | 核心概念、历史验证、与现实关系 | 10-12个章节 |
| 子页面1 | 详细分析（如历史验证） | 5-7个章节 |
| 子页面2 | 详细分析（如对比分析） | 5-7个章节 |
| ... | ... | ... |
```

**多分支型规划**：
```
| 目录/页面 | 内容 | 类型 |
|-----------|------|------|
| main.html | 总览、历史、各分支简介 | 主页面 |
| [分支1]-school/main.html | 分支1核心理论、代表人物、影响 | 分支主页面 |
| [分支2]-school/main.html | 分支2核心理论、代表人物、影响 | 分支主页面 |
| [应用1]-applications/main.html | 应用1领域、方法、案例 | 应用主页面 |
| ... | ... | ... |
```

### Phase 2: 主页面创建

**目标**：创建主页面，包含核心概念、历史验证、与现实关系。

**主页面必须包含的章节**：

| 章节 | 内容 | 必要性 |
|------|------|--------|
| 核心概念 | 什么是xxx？定义、特征、原理 | 必须 |
| 历史背景 | 历史、关键事件、验证 | 必须 |
| 与普通人关系 | 对普通人有什么影响？应对策略 | 必须 |
| **现代人关联性分析** | **对现代不同人群的深层影响分析** | **强烈推荐** |
| 与国家/社会关系 | 对国家/社会有什么影响？ | 推荐 |
| 数据扭曲分析 | 官方数据 vs 真实感受（如涉及经济话题） | 推荐 |
| 专业名词解释 | 相关专业名词（10-20个） | 推荐 |
| 延伸阅读 | 子页面/分支页面链接 | 必须 |
| 导航菜单 | 左上角tooltip菜单 | 必须 |

### 现代人关联性分析章节（强烈推荐）

**重要性**：这是知识库最贴近用户的部分，让用户感受到知识与自己的真实关联，而非抽象的理论。

**目标人群分析模板**：

| 人群类型 | 分析维度 | 内容要点 |
|----------|----------|----------|
| **小镇青年** | 家庭期望、社会压力、个人困境 | 儒家"光宗耀祖"观念的压力、父母期望vs个人能力、阶层跃升的困境 |
| **普通院校毕业生** | 学历焦虑、就业困境、自我认同 | 儒家"科举"文化的延续、学历歧视、普通工作的价值认同 |
| **普通工作者** | 工作意义、职业发展、生活压力 | 儒家"修身齐家"vs现实困境、普通工作的价值、生活压力来源 |
| **中年人** | 家庭责任、事业瓶颈、代际冲突 | 儒家"孝道"的现代压力、事业天花板、与子女的观念冲突 |
| **老年人** | 代际关系、养老困境、价值传承 | 儒家"养老"观念的现代困境、代际沟通障碍、价值观传承问题 |

**章节内容结构**：

```html
<!-- 现代人关联性分析章节模板 -->
<div class="content-card" id="现代人关联性分析">
    <h2>👥 现代人关联性分析</h2>
    
    <div class="highlight-box">
        <h4>为什么这个章节很重要？</h4>
        <p>传统文化不仅存在于历史书籍中，更深刻影响着现代人的思维方式、家庭关系、职业选择、人生规划。理解这些影响，可以帮助我们更好地认识自己，理解家庭，规划人生。</p>
    </div>
    
    <!-- 人群分析卡片 -->
    <h3>一、小镇青年的困境</h3>
    <div class="country-card">
        <h4>🏠 大城市打拼的小镇青年</h4>
        <p><strong>典型画像</strong>：</p>
        <ul>
            <li>来自三四线城市或县城，父母是普通工人或农民</li>
            <li>考上普通大学，毕业后在大城市从事普通工作</li>
            <li>月薪5000-10000元，租房生活，存款有限</li>
            <li>面临买房、结婚、养老等多重压力</li>
        </ul>
        
        <p><strong>儒家文化的影响</strong>：</p>
        <div class="key-concepts">
            <div class="concept-card">
                <h4>光宗耀祖的压力</h4>
                <p>儒家"光宗耀祖"观念让父母期望子女"出人头地"，但现实是大多数人是普通人，这种期望与现实的差距造成巨大心理压力。</p>
            </div>
            <div class="concept-card">
                <h4>孝道与自我实现的冲突</h4>
                <p>儒家强调"孝道"，要求子女回报父母，但小镇青年自身生活困难，如何在"孝顺"与"自我发展"之间平衡？</p>
            </div>
            <div class="concept-card">
                <h4>阶层跃升的困境</h4>
                <p>儒家科举文化鼓励"读书改变命运"，但现代社会的阶层固化让普通人很难通过努力改变命运。</p>
            </div>
            <div class="concept-card">
                <h4>面子文化的压力</h4>
                <p>儒家面子文化让父母不愿承认子女"普通"，造成"假装成功"的家庭氛围。</p>
            </div>
        </div>
        
        <p><strong>深层原因分析</strong>：</p>
        <div class="warning-box">
            <h5>⚠️ 核心矛盾</h5>
            <ul>
                <li><strong>儒家理想 vs 现实困境</strong>：儒家文化塑造了"成功=有出息"的价值观，但现代社会大多数人是普通人</li>
                <li><strong>父母期望 vs 个人能力</strong>：父母受儒家影响期望子女"光宗耀祖"，但子女能力有限</li>
                <li><strong>集体荣誉 vs 个人幸福</strong>：儒家强调家族荣誉，但个人追求幸福与家族期望冲突</li>
                <li><strong>传统孝道 vs 现代压力</strong>：儒家孝道要求子女回报父母，但现代生活成本高、压力大</li>
            </ul>
        </div>
        
        <p><strong>应对建议</strong>：</p>
        <div class="tip-box">
            <h5>💡 如何应对？</h5>
            <ul>
                <li><strong>接纳普通</strong>：认识到"普通人"是大多数人的常态，不必为此焦虑</li>
                <li><strong>沟通期望</strong>：与父母坦诚沟通，让他们理解你的真实处境</li>
                <li><strong>重新定义成功</strong>：不按儒家标准定义成功，找到自己的价值</li>
                <li><strong>平衡孝道与自我</strong>：在孝顺父母的同时，也要照顾自己的需求</li>
            </ul>
        </div>
    </div>
    
    <!-- 更多人群分析 -->
    <h3>二、求学十几年最终考上普通院校的年轻人</h3>
    <div class="country-card">
        <h4>📚 普通院校毕业生的困境</h4>
        <p><strong>典型画像</strong>：</p>
        <ul>
            <li>从小学到高中努力学习，最终考上普通本科或专科</li>
            <li>毕业后从事普通工作，月薪5000-8000元</li>
            <li>面临学历歧视、就业竞争、职业发展瓶颈</li>
            <li>自我认同困惑："努力了十几年，结果只是普通人"</li>
        </ul>
        
        <p><strong>儒家文化的影响</strong>：</p>
        <div class="key-concepts">
            <div class="concept-card">
                <h4>科举文化的延续</h4>
                <p>儒家科举文化让"考试=命运"的观念深入人心，但现代社会学历不再是改变命运的唯一途径。</p>
            </div>
            <div class="concept-card">
                <h4>学历焦虑的根源</h4>
                <p>儒家"学而优则仕"观念让学历成为社会评价标准，造成普通院校毕业生的自卑感。</p>
            </div>
            <div class="concept-card">
                <h4>努力与回报的落差</h4>
                <p>儒家强调"天道酬勤"，但现实是努力不一定有回报，这种落差造成心理困惑。</p>
            </div>
            <div class="concept-card">
                <h4>自我价值的困惑</h4>
                <p>儒家价值观让"普通"被视为失败，但普通人如何找到自己的价值？</p>
            </div>
        </div>
        
        <p><strong>深层原因分析</strong>：</p>
        <div class="warning-box">
            <h5>⚠️ 核心矛盾</h5>
            <ul>
                <li><strong>科举思维 vs 现代就业</strong>：儒家科举思维让"学历=成功"，但现代就业看重能力而非学历</li>
                <li><strong>努力神话 vs 现实竞争</strong>：儒家"天道酬勤"神话与现实竞争的残酷形成落差</li>
                <li><strong>精英导向 vs 普通人现实</strong>：儒家精英导向价值观忽视普通人的价值</li>
                <li><strong>单一评价 vs 多元价值</strong>：儒家单一评价体系（学历、官职）vs现代社会多元价值</li>
            </ul>
        </div>
        
        <p><strong>应对建议</strong>：</p>
        <div class="tip-box">
            <h5>💡 如何应对？</h5>
            <ul>
                <li><strong>突破学历思维</strong>：认识到学历只是起点，不是终点</li>
                <li><strong>发展实际能力</strong>：在工作中发展实际能力，而非纠结学历</li>
                <li><strong>找到自己的赛道</strong>：不与他人比较，找到适合自己的发展路径</li>
                <li><strong>重新定义价值</strong>：不按儒家标准定义价值，找到自己的价值体系</li>
            </ul>
        </div>
    </div>
    
    <!-- 更多人群分析（可扩展） -->
    <h3>三、普通工作者的职业困境</h3>
    <h3>四、中年人的家庭责任与事业瓶颈</h3>
    <h3>五、老年人的代际关系与价值传承</h3>
    
    <!-- 总结 -->
    <div class="highlight-box">
        <h4>核心启示</h4>
        <p>儒家文化塑造了中国人的价值观和思维方式，但这些传统观念在现代社会的应用面临挑战。理解这些影响，可以帮助我们：</p>
        <ul>
            <li><strong>认识自己</strong>：理解自己的价值观来源，认识自己的困境</li>
            <li><strong>理解家庭</strong>：理解父母的期望来源，改善家庭沟通</li>
            <li><strong>规划人生</strong>：不按传统标准定义成功，找到适合自己的路径</li>
            <li><strong>平衡传统与现代</strong>：保留传统价值，同时适应现代社会</li>
        </ul>
    </div>
</div>
```

**内容生成要点**：

1. **人群画像要真实**：描述真实的生活状态，不美化也不贬低
2. **影响分析要深入**：不只是表面现象，要分析深层的文化根源
3. **矛盾分析要清晰**：明确指出传统观念与现代现实的冲突
4. **应对建议要实用**：提供可操作的建议，而非空泛的理论
5. **语气要共情**：理解普通人的困境，而非居高临下的评判

**适用主题**：

- 历史/文化类知识库（儒家文化、传统文化、历史思想）
- 心理学类知识库（家庭心理、社会心理）
- 教育类知识库（教育压力、学历焦虑）
- 社会类知识库（阶层问题、社会压力）

**扩展人群**：

根据主题需要，可以扩展更多人群分析：
- 女性群体（儒家性别观念的影响）
- 创业者（儒家"安分"观念vs创业风险）
- 艺术工作者（儒家"实用"观念vs艺术追求）
- 单身人群（儒家"成家"观念vs单身选择）
- 离婚人群（儒家"从一而终"观念vs现代婚姻）

**多分支型主页面额外章节**：

| 章节 | 内容 | 必要性 |
|------|------|--------|
| 主要分支概述 | 各分支简介、对比表 | 必须 |
| 分支链接卡片 | 各分支详细链接 | 必须 |
| 应用领域概述 | 各应用领域简介 | 推荐 |

**主页面HTML结构**：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>[主题名称] - 知识库</title>
    <style>
        /* 基础样式 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
            line-height: 1.8;
        }
        
        /* 导航菜单样式（左上角tooltip） */
        .nav-menu-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
        }
        
        .nav-menu-tooltip {
            display: none;
            position: fixed;
            top: 70px;
            left: 20px;
            width: 320px;
            max-height: 80vh;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 999;
        }
        
        .nav-menu-tooltip.show {
            display: block;
        }
        
        /* 内容卡片样式 */
        .content-card {
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        /* 表格样式 */
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .comparison-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
        }
        
        /* 响应式样式 */
        @media (max-width: 768px) {
            .nav-menu-tooltip {
                width: calc(100vw - 40px);
                left: 10px;
            }
        }
    </style>
</head>
<body>
    <!-- 导航菜单（左上角tooltip） -->
    <div class="nav-menu-btn">
        <button onclick="toggleNavMenu()">📖 目录</button>
        <div class="nav-menu-tooltip" id="navMenuTooltip">
            <h3>📚 [主题名称]知识库导航</h3>
            
            <!-- 主页面章节 -->
            <div class="nav-section">
                <div class="nav-section-title">主页面章节</div>
                <a href="#核心概念" class="nav-item">
                    <div class="nav-item-title">🎯 什么是[主题]</div>
                    <div class="nav-item-desc">定义、特征、原理</div>
                </a>
                <!-- 更多章节 -->
            </div>
            
            <!-- 子页面/分支链接 -->
            <div class="nav-section">
                <div class="nav-section-title">详细内容</div>
                <a href="[子页面/分支].html" class="nav-item">
                    <div class="nav-item-title">[图标] [子页面/分支名称]</div>
                    <div class="nav-item-desc">[简介]</div>
                </a>
                <!-- 更多链接 -->
            </div>
        </div>
    </div>
    
    <!-- 主内容 -->
    <div class="container">
        <header>
            <h1>[主题图标] [主题名称]</h1>
            <p>[主题简介]</p>
        </header>
        
        <!-- 各章节内容卡片 -->
        <div class="content-card" id="核心概念">
            <h2>[章节标题]</h2>
            <!-- 内容 -->
        </div>
        
        <!-- 延伸阅读（子页面/分支链接表格） -->
        <div class="content-card">
            <h2>📚 延伸阅读</h2>
            <div class="table-container">
                <table>
                    <tr>
                        <th>知识库</th>
                        <th>内容</th>
                    </tr>
                    <tr>
                        <td><a href="[子页面/分支].html">[图标] [名称]</a></td>
                        <td>[简介]</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    
    <script>
        function toggleNavMenu() {
            var tooltip = document.getElementById('navMenuTooltip');
            tooltip.classList.toggle('show');
        }
        
        document.addEventListener('click', function(event) {
            var tooltip = document.getElementById('navMenuTooltip');
            var button = document.querySelector('.nav-menu-btn button');
            
            if (!tooltip.contains(event.target) && !button.contains(event.target)) {
                tooltip.classList.remove('show');
            }
        });
    </script>
</body>
</html>
```

### Phase 3: 子页面/分支页面创建

**目标**：创建子页面或分支页面，详细分析特定主题。

**子页面类型**：

| 子页面类型 | 内容 | 示例 |
|------------|------|------|
| 历史验证页面 | 历史、关键事件、验证 | kangbo-cycle-history.html |
| 对比分析页面 | 不同国家/时期对比 | kangbo-cycle-comparison.html |
| 国家干预页面 | 政策干预、效果分析 | kangbo-cycle-government-intervention.html |
| 投资实操页面 | 实际应用、投资策略 | kangbo-cycle-investment.html |
| 技术详解页面 | 技术细节、未来预测 | kangbo-cycle-technology.html |
| 全球视角页面 | 全球分析、不同国家 | kangbo-cycle-global.html |
| 职业策略页面 | 对不同职业的影响 | kangbo-cycle-for-people.html |
| 预测方法页面 | 如何判断、应对策略 | kangbo-cycle-prediction.html |
| 消费悖论页面 | 矛盾现象分析 | kangbo-cycle-consumption-paradox.html |

**分支页面类型**：

| 分支页面类型 | 内容 | 示例 |
|--------------|------|------|
| 理论流派页面 | 核心理论、代表人物、影响 | psychoanalysis-school/main.html |
| 人物专题页面 | 生平、理论、贡献（可选） | freud.html |
| 理论专题页面 | 特定理论详解（可选） | unconscious-theory.html |
| 应用领域页面 | 应用方法、案例、技巧 | daily-life-applications/main.html |
| 实践指南页面 | 具体实践步骤、技巧 | clinical-psychology-applications/main.html |

**子页面/分支页面HTML结构**：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>[页面标题] - [主题名称]知识库</title>
    <style>
        /* 基础样式 */
        /* 侧边栏导航样式（右侧固定） */
        .sidebar-nav {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.95);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.2);
            z-index: 100;
        }
        
        /* 响应式样式 */
        @media (max-width: 768px) {
            .sidebar-nav {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- 导航菜单（左上角tooltip） -->
    <div class="nav-menu">
        <button onclick="toggleNav()">☰ 导航菜单</button>
        <div class="nav-links" id="navLinks">
            <a href="../main.html">← 返回[主题名称]总览</a>
            <a href="../[其他分支1]/main.html">[其他分支1]</a>
            <a href="../[其他分支2]/main.html">[其他分支2]</a>
            <a href="main.html" class="active">[当前分支]</a>
        </div>
    </div>
    
    <!-- 侧边栏导航（右侧固定） -->
    <div class="sidebar-nav">
        <h4>本页目录</h4>
        <a href="#章节1">[章节1标题]</a>
        <a href="#章节2">[章节2标题]</a>
        <!-- 更多章节 -->
    </div>
    
    <!-- 主内容 -->
    <div class="container">
        <header>
            <a href="../main.html" class="back-link">← 返回[主题名称]总览</a>
            <h1>[页面图标] [页面标题]</h1>
            <p class="subtitle">[页面简介]</p>
        </header>
        
        <!-- 各章节内容卡片 -->
        <div class="content-card" id="章节1">
            <h2>[章节标题]</h2>
            <!-- 内容 -->
        </div>
    </div>
    
    <script>
        function toggleNav() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('show');
        }
        
        document.addEventListener('click', function(event) {
            const navMenu = document.querySelector('.nav-menu');
            const navLinks = document.getElementById('navLinks');
            
            if (!navMenu.contains(event.target)) {
                navLinks.classList.remove('show');
            }
        });
    </script>
</body>
</html>
```

### Phase 4: 导航系统

**目标**：创建完整的导航系统，方便用户跳转。

**导航系统类型**：

| 导航类型 | 位置 | 特点 | 适用页面 |
|----------|------|------|----------|
| Tooltip菜单 | 左上角 | 点击按钮展示，包含所有章节和链接 | 所有页面 |
| 侧边栏导航 | 右侧固定 | 直接展示，包含页面章节链接 | 子页面/分支页面 |
| 锚点返回 | 页面顶部 | 返回主页面链接 | 子页面/分支页面 |
| 延伸阅读表格 | 页面底部 | 所有相关页面链接表格 | 主页面 |

**导航菜单内容**：

```html
<!-- 主页面导航菜单 -->
<div class="nav-menu-tooltip" id="navMenuTooltip">
    <h3>📚 [主题名称]知识库导航</h3>
    
    <div class="nav-section">
        <div class="nav-section-title">主页面章节</div>
        <a href="#核心概念" class="nav-item">
            <div class="nav-item-title">📖 什么是[主题]</div>
            <div class="nav-item-desc">定义、特征、原理</div>
        </a>
        <!-- 更多主页面章节 -->
    </div>
    
    <div class="nav-section">
        <div class="nav-section-title">详细内容</div>
        <a href="[子页面/分支].html" class="nav-item">
            <div class="nav-item-title">[图标] [名称]</div>
            <div class="nav-item-desc">[简介]</div>
        </a>
        <!-- 更多链接 -->
    </div>
</div>

<!-- 子页面/分支页面导航菜单 -->
<div class="nav-links" id="navLinks">
    <a href="../main.html">← 返回[主题名称]总览</a>
    <a href="../[其他分支1]/main.html">[其他分支1]</a>
    <a href="../[其他分支2]/main.html">[其他分支2]</a>
    <a href="main.html" class="active">[当前分支]</a>
</div>
```

**子页面/分支页面侧边栏导航**：

```html
<div class="sidebar-nav">
    <h4>本页目录</h4>
    <a href="#章节1">[章节1标题]</a>
    <a href="#章节2">[章节2标题]</a>
    <!-- 更多章节 -->
</div>
```

### Phase 5: 内容组件

**目标**：提供丰富的内容组件，增强页面表现力。

**内容组件类型**：

| 组件 | 用途 | 样式 |
|------|------|------|
| highlight-box | 核心要点强调 | 渐变背景、左边框 |
| quote-box | 名言引用 | 灰色背景、左边框、斜体 |
| comparison-table | 对比分析 | 渐变标题、边框 |
| key-concepts | 关键概念网格 | 多列网格布局 |
| concept-card | 单个概念卡片 | 渐变背景、左边框 |
| timeline | 时间线 | 左侧线条、圆点标记 |
| timeline-item | 时间线项目 | 圆点、年份、内容 |
| tip-box | 实用技巧 | 浅色背景、虚线边框 |
| warning-box | 重要提示/警告 | 黄色/红色背景 |
| application-card | 应用领域卡片 | 渐变背景、边框 |
| school-card | 流派/分支卡片 | 渐变背景、边框 |
| model-diagram | 模型图示 | 居中、流程图样式 |
| pyramid-diagram | 层次金字塔 | 渐进宽度、层次展示 |

**内容组件HTML示例**：

```html
<!-- highlight-box（核心要点） -->
<div class="highlight-box">
    <h4>核心要点</h4>
    <ul>
        <li><strong>要点1</strong>：说明</li>
        <li><strong>要点2</strong>：说明</li>
    </ul>
</div>

<!-- quote-box（名言引用） -->
<div class="quote-box">
    <p>引用内容...</p>
    <div class="author">—— 作者名</div>
</div>

<!-- comparison-table（对比表格） -->
<table class="comparison-table">
    <tr>
        <th>维度</th>
        <th>选项1</th>
        <th>选项2</th>
    </tr>
    <tr>
        <td>特点</td>
        <td>说明1</td>
        <td>说明2</td>
    </tr>
</table>

<!-- key-concepts（关键概念网格） -->
<div class="key-concepts">
    <div class="concept-card">
        <h4>概念1</h4>
        <p>说明...</p>
    </div>
    <div class="concept-card">
        <h4>概念2</h4>
        <p>说明...</p>
    </div>
</div>

<!-- timeline（时间线） -->
<div class="timeline">
    <div class="timeline-item">
        <div class="timeline-year">年份</div>
        <p>事件描述...</p>
    </div>
</div>

<!-- tip-box（实用技巧） -->
<div class="tip-box">
    <h5>实用技巧</h5>
    <ul>
        <li>技巧1...</li>
        <li>技巧2...</li>
    </ul>
</div>

<!-- warning-box（重要提示） -->
<div class="warning-box">
    <h5>重要提示</h5>
    <p>提示内容...</p>
</div>
```

### Phase 6: 数据扭曲分析（如涉及经济话题）

**目标**：分析官方数据与真实感受的差异，标注数据来源。

**数据扭曲分析章节**：

| 内容 | 说明 |
|------|------|
| 数据对比表 | 官方数据 vs 猜测/亲身感受 |
| 数据扭曲证据 | 具体证据（如裁员、降薪、房价） |
| 数据扭曲原因 | 统计方法、政策干预等 |
| 普通人判断方法 | 如何判断真实情况 |

**数据标注方式**：

| 标注 | 说明 |
|------|------|
| （官方） | 官方公布的数据 |
| （猜测） | 基于亲身感受推测的数据 |
| （亲身感受） | 用户实际观察到的现象 |
| ⚠️ 政策泡沫 | 政策刺激导致的虚假上涨 |

### Phase 7: 修改记录（MD文档）

**目标**：记录所有修改历史、对话记录、思考过程。

**修改记录MD结构**：

```markdown
# [主题名称]HTML文档修改记录与思考过程

## 文档概述
- **文件名**: `[主题名称].html`
- **创建时间`: YYYY-MM-DD
- **主题`: [主题简介]

---

## 第一次创建（YYYY-MM-DD）

### 用户需求
[用户需求描述]

### 创建内容
[创建内容描述]

### 思考过程
[思考过程描述]

---

## 第二次修改（YYYY-MM-DD）

### 用户需求
[用户需求描述]

### 修改内容
[修改内容描述]

### 思考过程
[思考过程描述]

---

**文档创建时间**: YYYY-MM-DD  
**最后更新时间`: YYYY-MM-DD（第N次修改）  
**创建者`: CodeAgent  
```

### Phase 8: 样式统一

**目标**：所有页面使用统一的样式。

**统一样式**：

| 样式 | 说明 |
|------|------|
| 渐变背景 | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` 或其他渐变 |
| 内容卡片 | 白色背景、圆角15px、阴影 |
| 表格样式 | 渐变标题、边框 |
| 导航样式 | Tooltip菜单 + 侧边栏导航 |
| 响应式 | `@media (max-width: 768px)` 隐藏侧边栏 |
| 数据标注 | 红色（真实萧条）、黄色（虚假繁荣）、绿色（正面） |

**不同主题的渐变背景建议**：

| 主题类型 | 渐变背景 |
|----------|----------|
| 经济/金融 | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` |
| 心理学/人文 | `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` |
| 科学/技术 | `linear-gradient(135deg, #11998e 0%, #38ef7d 100%)` |
| 教育/学习 | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |
| 历史/文化 | `linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)` |
| 健康/医疗 | `linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)` |

## Extended Features（扩展功能）

### Feature 1: 人物专题页面

**用途**：详细介绍重要人物生平、理论、贡献。

**内容结构**：
- 生平简介（出生、教育、职业）
- 核心理论（主要观点、贡献）
- 重要著作（代表作）
- 影响与评价（对领域的影响、批评）
- 名言引用（经典语录）

### Feature 2: 重要实验/案例页面

**用途**：详细介绍经典实验或案例。

**内容结构**：
- 实验背景（目的、时间）
- 实验方法（步骤、设计）
- 实验结果（发现、数据）
- 实验影响（对理论的影响）
- 伦理讨论（如涉及伦理问题）

### Feature 3: 经典著作推荐

**用途**：推荐相关经典著作。

**内容结构**：
- 著作列表表格（书名、作者、简介、推荐理由）
- 分类推荐（入门、进阶、专业）
- 阅读顺序建议

### Feature 4: 学习路径指南

**用途**：指导用户如何学习该主题。

**内容结构**：
- 学习阶段（入门、进阶、专业）
- 学习顺序（推荐阅读顺序）
- 学习方法（如何有效学习）
- 学习资源（书籍、课程、网站）

### Feature 5: 自测小工具（可选）

**用途**：提供简单的自测功能。

**示例**：
- 人格类型测试（简单版）
- 压力水平评估
- 学习风格测试

**实现方式**：使用JavaScript简单交互。

### Feature 6: 实际案例分析

**用途**：通过实际案例加深理解。

**内容结构**：
- 案例背景（情境描述）
- 理论应用（如何应用理论）
- 分析过程（分析步骤）
- 结论启示（学到的教训）

## Quality Check（质量检查）

生成完成后，进行以下检查：

### Check 1: 关联性检查

- [ ] 主页面所有链接是否正确
- [ ] 子页面返回链接是否正确
- [ ] 各页面间相互链接是否完整
- [ ] 导航菜单链接是否有效

### Check 2: 内容可靠性检查

- [ ] 核心概念是否准确
- [ ] 历史事件是否正确
- [ ] 人物信息是否准确
- [ ] 理论描述是否准确
- [ ] 数据来源是否标注

### Check 3: 样式一致性检查

- [ ] 所有页面使用统一渐变背景
- [ ] 所有页面使用统一样式组件
- [ ] 导航系统样式一致
- [ ] 响应式设计有效

### Check 4: 功能完整性检查

- [ ] 导航菜单功能正常
- [ ] 侧边栏导航功能正常
- [ ] 锚点跳转功能正常
- [ ] 响应式布局正常

## Example Usage（使用示例）

### Example 1: 心理学知识库（多分支型）

当用户说："请帮我生成一个完整的心理学知识库"

**执行流程**：

#### Phase 1: 主题分析

**心理学核心概念**：
- 研究心理现象、意识、行为的科学
- 多个流派：精神分析、行为主义、认知心理学、人本主义
- 多个应用：日常应用、临床应用、教育应用

**知识库类型**：多分支型

**页面结构规划**：

| 目录/页面 | 内容 | 类型 |
|-----------|------|------|
| main.html | 心理学总览、历史、流派概述 | 主页面 |
| psychoanalysis-school/main.html | 精神分析流派（弗洛伊德、荣格、阿德勒） | 分支页面 |
| behaviorism-school/main.html | 行为主义流派（华生、斯金纳、巴甫洛夫） | 分支页面 |
| cognitive-psychology-school/main.html | 认知心理学流派（记忆、思维、语言） | 分支页面 |
| humanistic-psychology-school/main.html | 人本主义流派（马斯洛、罗杰斯） | 分支页面 |
| other-schools/main.html | 其他流派（进化心理学、积极心理学等） | 分支页面 |
| daily-life-applications/main.html | 日常应用（情绪管理、人际交往等） | 应用页面 |
| clinical-psychology-applications/main.html | 临床应用（心理评估、心理治疗等） | 应用页面 |
| educational-psychology-applications/main.html | 教育应用（学习理论、教学设计等） | 应用页面 |

#### Phase 2-8: 按流程执行

1. 创建主页面（心理学总览）
2. 创建各分支目录和页面
3. 创建各应用目录和页面
4. 建立完整导航系统
5. 检查关联性和内容可靠性

### Example 2: 康波周期知识库（单一主题型）

当用户说："请帮我生成一个关于康波周期的知识库"

**执行流程**：

#### Phase 1: 主题分析

**康波周期核心概念**：
- 50-60年的经济长周期
- 四个阶段：回升、繁荣、衰退、萧条
- 与技术创新、资产价格相关

**知识库类型**：单一主题型

**页面结构规划**：

| 页面 | 内容 | 章节 |
|------|------|------|
| main.html | 核心概念、历史验证、与现实关系 | 10个章节 |
| kangbo-cycle-history.html | 历史详解（五次康波） | 5个章节 |
| kangbo-cycle-comparison.html | 不同国家对比 | 5个章节 |
| kangbo-cycle-prediction.html | 预测方法、应对策略 | 5个章节 |
| kangbo-cycle-consumption-paradox.html | 消费悖论分析 | 5个章节 |

#### Phase 2-8: 按流程执行

## Best Practices（最佳实践）

### Practice 1: 内容组织

1. **层次清晰**：从总览到分支，从概念到应用
2. **逻辑连贯**：各页面内容有逻辑联系
3. **避免重复**：不同页面避免重复内容
4. **深度适中**：主页面概述，子页面深入

### Practice 2: 导航设计

1. **多入口**：提供多种导航方式（菜单、侧边栏、表格）
2. **返回方便**：每个子页面都有返回主页链接
3. **位置固定**：导航位置固定，方便使用
4. **响应式**：小屏幕时简化导航

### Practice 3: 样式设计

1. **统一风格**：所有页面使用统一风格
2. **主题配色**：根据主题选择合适的渐变背景
3. **阅读友好**：字体、间距适合阅读
4. **视觉层次**：使用卡片、标题、颜色区分层次

### Practice 4: 内容质量

1. **准确可靠**：内容基于权威来源
2. **标注来源**：数据标注来源
3. **避免偏见**：客观呈现不同观点
4. **实用导向**：提供实用建议和方法

## Notes（注意事项）

1. **数据标注**：所有数据必须标注来源（官方、猜测、亲身感受）
2. **导航系统**：所有页面使用Tooltip菜单，子页面/分支页面额外使用侧边栏导航
3. **锚点返回**：子页面返回主页面时添加锚点，返回后自动跳转到对应章节
4. **修改记录**：每次修改都要更新MD文档
5. **样式统一**：所有页面使用统一的渐变背景、内容卡片样式
6. **响应式设计**：侧边栏导航在屏幕宽度<768px时隐藏
7. **特殊分析**：如涉及经济话题，添加数据扭曲分析和消费悖论分析
8. **质量检查**：生成完成后进行关联性、可靠性、样式、功能检查
9. **扩展功能**：根据主题需要添加人物专题、实验案例、著作推荐、学习路径等

## File Structure（文件结构）

### Single Subject（单一主题型）

```
D:\[项目目录]\[主题名称]\
├── main.html                      # 主页面
├── [主题]-history.html            # 历史详解
├── [主题]-comparison.html         # 对比分析
├── [主题]-application.html        # 应用指南
├── [主题]-paradox.html            # 悖论分析（如涉及经济）
├── README.md                      # 修改记录
```

### Multi-Branch（多分支型）

```
D:\[项目目录]\[主题名称]\
├── main.html                          # 总览主页面
├── [分支1]-school/                    # 分支1目录
│   └── main.html                      # 分支1主页面
│   └── [人物1].html（可选）           # 人物专题
│   └── [实验1].html（可选）           # 实验专题
├── [分支2]-school/                    # 分支2目录
│   └── main.html                      # 分支2主页面
├── [应用1]-applications/              # 应用1目录
│   └── main.html                      # 应用1主页面
├── [应用2]-applications/              # 应用2目录
│   └── main.html                      # 应用2主页面
├── classics-recommendation.html（可选） # 经典著作推荐
├── learning-path.html（可选）         # 学习路径指南
└── README.md                          # 修改记录
```

## Success Criteria（成功标准）

1. 主页面包含核心概念、历史背景、与现实关系
2. 子页面/分支页面包含详细分析
3. 导航系统完整（Tooltip菜单 + 侧边栏导航）
4. 数据标注清晰（官方数据 vs 真实感受）
5. 修改记录完整（每次修改都有记录）
6. 样式统一（所有页面使用相同样式）
7. 响应式设计（小屏幕时隐藏侧边栏）
8. 关联性检查完成（所有链接正确）
9. 内容可靠性检查完成（内容准确）
10. 扩展功能根据需要添加（人物专题、实验案例等）

---

## Template Library（模板文件库）

### 概述

模板文件库提供可复用的HTML/CSS模板，提高生成效率，确保样式统一。

### 模板文件结构

```
skills/knowledge-base-generator/templates/
├── main-page-template.html          # 主页面完整模板
├── branch-page-template.html        # 分支页面完整模板
├── single-subject-page-template.html # 单一主题子页面模板
├── css-styles.css                   # 统一CSS样式文件
├── navigation-component.html        # 导航组件模板
├── content-components.html          # 内容组件模板
└── theme-colors.css                 # 主题配色文件
```

### 使用方法

**方法1：直接复制模板**
1. 复制对应的模板文件
2. 替换 `[主题名称]`、`[章节标题]` 等占位符
3. 根据需要调整内容

**方法2：提取关键代码块**
1. 从模板中提取需要的CSS样式
2. 从模板中提取需要的HTML结构
3. 组合使用

### CSS样式模板（css-styles.css）

```css
/* ===== 基础样式 ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    min-height: 100vh;
    color: #333;
    line-height: 1.8;
}

/* ===== 渐变背景 ===== */
/* 经济/金融主题 */
.bg-economy {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 心理学/人文主题 */
.bg-psychology {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* 科学/技术主题 */
.bg-technology {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

/* 教育/学习主题 */
.bg-education {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* 历史/文化主题 */
.bg-history {
    background: linear-gradient(135deg, #2c3e50 0%, #4a5568 100%);
}

/* 健康/医疗主题 */
.bg-health {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

/* 哲学/思想主题 */
.bg-philosophy {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

/* ===== 导航菜单样式 ===== */
.nav-menu-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1000;
}

.nav-menu-btn button {
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.nav-menu-tooltip {
    display: none;
    position: fixed;
    top: 70px;
    left: 20px;
    width: 320px;
    max-height: 80vh;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 999;
}

.nav-menu-tooltip.show {
    display: block;
}

/* ===== 侧边栏导航 ===== */
.sidebar-nav {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.95);
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.2);
    z-index: 100;
    max-width: 200px;
}

/* ===== 内容卡片 ===== */
.content-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 30px;
    margin-bottom: 25px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

/* ===== 表格样式 ===== */
.comparison-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.comparison-table th {
    color: white;
    padding: 15px;
    text-align: left;
}

.comparison-table td {
    padding: 15px;
    border-bottom: 1px solid #ddd;
}

/* ===== 内容组件 ===== */
.highlight-box {
    border-left: 5px solid;
    padding: 20px;
    margin: 20px 0;
    border-radius: 0 10px 10px 0;
}

.quote-box {
    background: #f8f9fa;
    border-left: 5px solid;
    padding: 20px;
    margin: 20px 0;
    border-radius: 0 10px 10px 0;
    font-style: italic;
}

.key-concepts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.concept-card {
    border-left: 4px solid;
    padding: 20px;
    border-radius: 10px;
}

.timeline {
    position: relative;
    padding-left: 30px;
    margin: 20px 0;
}

.timeline-item {
    position: relative;
    margin-bottom: 25px;
    padding-left: 20px;
}

.tip-box {
    background: rgba(39, 174, 96, 0.1);
    border: 2px dashed #27ae60;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}

.warning-box {
    background: rgba(243, 156, 18, 0.1);
    border: 2px solid #f39c12;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
    .nav-menu-tooltip {
        width: calc(100vw - 40px);
        left: 10px;
    }
    
    .sidebar-nav {
        display: none;
    }
    
    .key-concepts {
        grid-template-columns: 1fr;
    }
}
```

---

## Content Generation Methodology（内容生成方法论）

### 概述

内容生成方法论提供系统化的内容生成指导，确保内容准确、可靠、有价值。

### Phase 0: 内容规划（生成前准备）

**目标**：在生成内容前，系统化规划内容结构和来源。

**步骤**：

1. **主题分解**
   - 将主题分解为核心概念、历史背景、现实应用等维度
   - 确定每个维度的关键问题
   - 列出需要回答的核心问题列表

2. **知识来源识别**
   - 学术来源：学术论文、专业书籍、权威机构报告
   - 官方来源：政府数据、官方统计、政策文件
   - 媒体来源：新闻报道、深度报道、专题文章
   - 实践来源：行业实践、案例分析、经验分享

3. **内容框架设计**
   - 设计章节结构
   - 确定每个章节的核心内容
   - 规划内容深度（概述 vs 详细）

**输出**：内容规划表

```
| 章节 | 核心问题 | 知识来源 | 内容深度 | 优先级 |
|------|----------|----------|----------|--------|
| 核心概念 | 什么是xxx？ | 学术来源 | 详细 | 高 |
| 历史背景 | 如何演变？ | 学术+媒体 | 详细 | 高 |
| 现实应用 | 如何应用？ | 实践来源 | 详细 | 中 |
```

### 内容生成原则

**原则1：准确性优先**
- 核心概念必须准确，不能有错误
- 历史事件必须准确，年份、人物、事件不能错
- 数据必须标注来源，不能随意编造

**原则2：来源标注**
- 所有数据必须标注来源（官方、猜测、亲身感受）
- 重要论点必须标注来源
- 引用必须标注出处

**原则3：客观中立**
- 避免偏见，客观呈现不同观点
- 承认争议，不回避争议点
- 承认局限，说明理论的局限性

**原则4：实用导向**
- 提供实用建议和方法
- 提供具体案例和应用
- 提供可操作的行动指南

### AI生成内容校验标准

**校验维度**：

| 维度 | 校验内容 | 校验方法 |
|------|----------|----------|
| 准确性 | 核心概念是否准确 | 与权威来源对比 |
| 完整性 | 是否遗漏重要内容 | 与知识框架对比 |
| 逻辑性 | 内容逻辑是否连贯 | 检查因果关系 |
| 来源性 | 数据来源是否标注 | 检查标注情况 |
| 实用性 | 是否提供实用建议 | 检查实用内容 |

**校验流程**：

1. **生成后立即校验**
   - 检查核心概念准确性
   - 检查历史事件准确性
   - 检查数据标注情况

2. **逻辑校验**
   - 检查内容逻辑是否连贯
   - 检查因果关系是否合理
   - 检查论证是否充分

3. **实用校验**
   - 检查是否提供实用建议
   - 检查建议是否可操作
   - 检查案例是否具体

### 内容生成模板

**概念解释模板**：

```
## [概念名称]

### 定义
[权威定义，标注来源]

### 核心特征
1. [特征1]：[解释]
2. [特征2]：[解释]
3. [特征3]：[解释]

### 与相关概念的区别
| 概念 | 区别点 |
|------|--------|
| [相关概念1] | [区别说明] |
| [相关概念2] | [区别说明] |

### 应用场景
- [场景1]：[说明]
- [场景2]：[说明]
```

**历史事件模板**：

```
## [事件名称]

### 背景
[事件发生的历史背景]

### 时间线
| 时间 | 事件 | 影响 |
|------|------|------|
| [年份1] | [事件1] | [影响1] |
| [年份2] | [事件2] | [影响2] |

### 关键人物
- [人物1]：[贡献]
- [人物2]：[贡献]

### 影响
[对后世的影响]
```

---

## Interactive Features（交互功能组件）

### 概述

交互功能组件提供JavaScript交互功能，增强用户体验。

### Feature 1: 页内搜索功能

**用途**：在当前页面内搜索关键词。

**实现代码**：

```javascript
/* 搜索功能 */
function addSearchFeature() {
    // 添加搜索框
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.innerHTML = `
        <input type="text" id="searchInput" placeholder="搜索关键词...">
        <button onclick="searchContent()">搜索</button>
        <button onclick="clearSearch()">清除</button>
    `;
    document.body.appendChild(searchBox);
    
    // 搜索样式
    const style = document.createElement('style');
    style.textContent = `
        .search-box {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            gap: 10px;
        }
        .search-box input {
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .search-highlight {
            background: yellow;
            padding: 2px;
        }
    `;
    document.head.appendChild(style);
}

function searchContent() {
    const keyword = document.getElementById('searchInput').value;
    if (!keyword) return;
    
    // 清除之前的高亮
    clearSearch();
    
    // 搜索并高亮
    const content = document.querySelectorAll('.content-card p, .content-card li');
    content.forEach(element => {
        if (element.textContent.includes(keyword)) {
            element.innerHTML = element.innerHTML.replace(
                new RegExp(keyword, 'gi'),
                `<span class="search-highlight">${keyword}</span>`
            );
        }
    });
}

function clearSearch() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(h => {
        h.outerHTML = h.textContent;
    });
}
```

### Feature 2: 阅读进度追踪

**用途**：追踪用户阅读进度，显示进度条。

**实现代码**：

```javascript
/* 阅读进度追踪 */
function addProgressTracker() {
    // 添加进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `<div class="progress-fill"></div>`;
    document.body.appendChild(progressBar);
    
    // 进度条样式
    const style = document.createElement('style');
    style.textContent = `
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // 监听滚动
    window.addEventListener('scroll', updateProgress);
}

function updateProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    document.querySelector('.progress-fill').style.width = progress + '%';
}
```

### Feature 3: 书签/收藏功能

**用途**：允许用户收藏感兴趣的章节。

**实现代码**：

```javascript
/* 书签功能 */
function addBookmarkFeature() {
    // 为每个章节添加收藏按钮
    const sections = document.querySelectorAll('.content-card');
    sections.forEach(section => {
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.textContent = '📌 收藏';
        bookmarkBtn.onclick = () => toggleBookmark(section.id);
        section.querySelector('h2').appendChild(bookmarkBtn);
    });
    
    // 书签按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .bookmark-btn {
            float: right;
            padding: 5px 10px;
            background: rgba(192, 57, 43, 0.1);
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .bookmark-btn.active {
            background: rgba(192, 57, 43, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    // 显示已收藏的书签
    showBookmarks();
}

function toggleBookmark(sectionId) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (bookmarks.includes(sectionId)) {
        bookmarks = bookmarks.filter(id => id !== sectionId);
    } else {
        bookmarks.push(sectionId);
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    showBookmarks();
}

function showBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // 更新按钮状态
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const sectionId = btn.closest('.content-card').id;
        btn.classList.toggle('active', bookmarks.includes(sectionId));
    });
}
```

### Feature 4: 打印/导出功能

**用途**：允许用户打印或导出页面内容。

**实现代码**：

```javascript
/* 打印功能 */
function addPrintFeature() {
    // 添加打印按钮
    const printBtn = document.createElement('button');
    printBtn.className = 'print-btn';
    printBtn.textContent = '🖨️ 打印';
    printBtn.onclick = printPage;
    document.querySelector('.nav-menu-btn').appendChild(printBtn);
    
    // 打印样式
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .nav-menu-btn, .sidebar-nav, .print-btn {
                display: none !important;
            }
            body {
                background: white !important;
            }
            .content-card {
                box-shadow: none !important;
                border: 1px solid #ddd;
            }
        }
        .print-btn {
            margin-left: 10px;
            padding: 8px 15px;
            background: rgba(192, 57, 43, 0.1);
            border: none;
            border-radius: 15px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

function printPage() {
    window.print();
}
```

### Feature 5: 深色模式切换（完整版）

**用途**：允许用户切换深色/浅色模式，确保所有页面同步、所有元素字体可读。

**重要原则**：
- 使用 `localStorage` 保存用户偏好，确保所有页面同步
- 使用 `!important` 强制覆盖所有样式
- 处理所有元素的颜色：背景、文字、表格、链接、组件、边框等
- 确保对比度足够，文字清晰可读
- 在页面加载时立即应用用户偏好（避免闪烁）

**完整CSS样式（深色模式）**：

```css
/* ===== 深色模式完整样式 ===== */
/* 必须在所有页面HTML的<style>中添加这些样式 */

/* 深色模式 - 基础元素 */
body.dark-mode {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
    color: #e8e8e8 !important;
}

/* 深色模式 - 内容卡片 */
body.dark-mode .content-card {
    background: rgba(25, 25, 45, 0.95) !important;
    color: #e8e8e8 !important;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3) !important;
}

body.dark-mode .content-card h2 {
    color: #ff6b6b !important;
    border-bottom-color: #ff6b6b !important;
}

body.dark-mode .content-card h3 {
    color: #4ecdc4 !important;
}

body.dark-mode .content-card h4 {
    color: #95e1d3 !important;
}

body.dark-mode .content-card p,
body.dark-mode .content-card li {
    color: #e8e8e8 !important;
}

/* 深色模式 - 导航菜单 */
body.dark-mode .nav-menu-tooltip {
    background: rgba(25, 25, 45, 0.98) !important;
    color: #e8e8e8 !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .nav-menu-tooltip h3 {
    color: #ff6b6b !important;
    border-bottom-color: #ff6b6b !important;
}

body.dark-mode .nav-section-title {
    color: #4ecdc4 !important;
    background: rgba(255, 107, 107, 0.1) !important;
}

body.dark-mode .nav-item {
    color: #e8e8e8 !important;
}

body.dark-mode .nav-item:hover {
    background: rgba(255, 107, 107, 0.1) !important;
}

body.dark-mode .nav-item-title {
    color: #ff6b6b !important;
}

body.dark-mode .nav-item-desc {
    color: #a0a0a0 !important;
}

/* 深色模式 - 侧边栏导航 */
body.dark-mode .sidebar-nav {
    background: rgba(25, 25, 45, 0.95) !important;
    color: #e8e8e8 !important;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4) !important;
}

body.dark-mode .sidebar-nav h4 {
    color: #ff6b6b !important;
}

body.dark-mode .sidebar-nav a {
    color: #4ecdc4 !important;
}

/* 深色模式 - 表格 */
body.dark-mode .comparison-table,
body.dark-mode .table-container table {
    border-color: #3a3a5a !important;
}

body.dark-mode .comparison-table th,
body.dark-mode .table-container th {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%) !important;
    color: #ffffff !important;
}

body.dark-mode .comparison-table td,
body.dark-mode .table-container td {
    background: rgba(35, 35, 55, 0.8) !important;
    color: #e8e8e8 !important;
    border-bottom-color: #3a3a5a !important;
}

body.dark-mode .comparison-table tr:hover td,
body.dark-mode .table-container tr:hover td {
    background: rgba(255, 107, 107, 0.1) !important;
}

body.dark-mode .table-container a {
    color: #4ecdc4 !important;
}

/* 深色模式 - 内容组件 */
body.dark-mode .highlight-box {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(238, 90, 90, 0.15) 100%) !important;
    border-left-color: #ff6b6b !important;
    color: #e8e8e8 !important;
}

body.dark-mode .highlight-box h4 {
    color: #ff6b6b !important;
}

body.dark-mode .quote-box {
    background: rgba(35, 35, 55, 0.8) !important;
    border-left-color: #ff6b6b !important;
    color: #d0d0d0 !important;
}

body.dark-mode .quote-box .author {
    color: #a0a0a0 !important;
}

body.dark-mode .key-concepts {
    border-color: transparent !important;
}

body.dark-mode .concept-card {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(238, 90, 90, 0.08) 100%) !important;
    border-left-color: #ff6b6b !important;
    color: #e8e8e8 !important;
}

body.dark-mode .concept-card h4 {
    color: #ff6b6b !important;
}

body.dark-mode .country-card {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(238, 90, 90, 0.08) 100%) !important;
    border-color: #ff6b6b !important;
    color: #e8e8e8 !important;
}

body.dark-mode .country-card h3 {
    color: #ff6b6b !important;
}

body.dark-mode .country-card a {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%) !important;
    color: #ffffff !important;
}

body.dark-mode .tip-box {
    background: rgba(78, 205, 196, 0.1) !important;
    border-color: #4ecdc4 !important;
    color: #e8e8e8 !important;
}

body.dark-mode .tip-box h5 {
    color: #4ecdc4 !important;
}

body.dark-mode .warning-box {
    background: rgba(243, 156, 18, 0.1) !important;
    border-color: #f39c12 !important;
    color: #e8e8e8 !important;
}

body.dark-mode .warning-box h5 {
    color: #f39c12 !important;
}

/* 深色模式 - 时间线 */
body.dark-mode .timeline::before {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%) !important;
}

body.dark-mode .timeline-item::before {
    background: #ff6b6b !important;
    border-color: #1a1a2e !important;
    box-shadow: 0 0 0 3px #ff6b6b !important;
}

body.dark-mode .timeline-year {
    color: #ff6b6b !important;
}

/* 深色模式 - Header */
body.dark-mode header {
    background: rgba(25, 25, 45, 0.95) !important;
    color: #e8e8e8 !important;
}

body.dark-mode header h1 {
    color: #ff6b6b !important;
}

body.dark-mode header p {
    color: #a0a0a0 !important;
}

/* 深色模式 - Footer */
body.dark-mode footer {
    color: #a0a0a0 !important;
}

/* 深色模式 - 链接 */
body.dark-mode a {
    color: #4ecdc4 !important;
}

body.dark-mode a:hover {
    color: #95e1d3 !important;
}

/* 深色模式 - 返回链接 */
body.dark-mode .back-link {
    color: #4ecdc4 !important;
}

/* 深色模式切换按钮样式 */
.dark-mode-btn {
    margin-left: 10px;
    padding: 10px 20px;
    background: linear-gradient(135deg, rgba(100, 100, 120, 0.3) 0%, rgba(80, 80, 100, 0.3) 100%);
    border: 2px solid rgba(100, 100, 120, 0.5);
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: white;
    transition: all 0.3s ease;
}

.dark-mode-btn:hover {
    background: linear-gradient(135deg, rgba(100, 100, 120, 0.5) 0%, rgba(80, 80, 100, 0.5) 100%);
    transform: translateY(-2px);
}

/* 深色模式下的按钮 */
body.dark-mode .dark-mode-btn {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(238, 90, 90, 0.3) 100%);
    border-color: rgba(255, 107, 107, 0.5);
}

body.dark-mode .dark-mode-btn:hover {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.5) 0%, rgba(238, 90, 90, 0.5) 100%);
}

/* 导航菜单按钮 */
body.dark-mode .nav-menu-btn button {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%) !important;
}
```

**完整JavaScript实现**：

```javascript
/* ===== 深色模式切换功能 ===== */
/* 必须在所有页面HTML的<script>中添加这些代码 */

// 页面加载时立即应用用户偏好（避免闪烁）
(function() {
    // 在DOM加载前就检查并应用深色模式
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark-mode-preload');
    }
})();

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

function initDarkMode() {
    // 添加切换按钮
    const navMenuBtn = document.querySelector('.nav-menu-btn');
    if (navMenuBtn) {
        const darkBtn = document.createElement('button');
        darkBtn.className = 'dark-mode-btn';
        darkBtn.id = 'darkModeBtn';
        darkBtn.onclick = toggleDarkMode;
        navMenuBtn.appendChild(darkBtn);
    }
    
    // 应用保存的偏好
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // 更新按钮文字
    updateDarkModeButtonText();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // 保存到localStorage（所有页面共享）
    localStorage.setItem('darkMode', isDark);
    
    // 更新按钮文字
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    const btn = document.getElementById('darkModeBtn');
    if (btn) {
        const isDark = document.body.classList.contains('dark-mode');
        btn.textContent = isDark ? '☀️ 浅色模式' : '🌙 深色模式';
    }
}
```

**HTML模板（必须包含的内容）**：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>[主题名称] - 知识库</title>
    
    <!-- 深色模式预加载样式（避免闪烁） -->
    <style>
        html.dark-mode-preload body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
        }
    </style>
    
    <style>
        /* 这里包含所有常规样式 */
        /* ... */
        
        /* ===== 深色模式完整样式（必须添加） ===== */
        /* 复制上面的完整CSS样式 */
    </style>
</head>
<body>
    <!-- 导航菜单 -->
    <div class="nav-menu-btn">
        <button onclick="toggleNavMenu()">📚 目录导航</button>
        <!-- 深色模式按钮会通过JavaScript自动添加 -->
        <div class="nav-menu-tooltip" id="navMenuTooltip">
            <!-- 导航内容 -->
        </div>
    </div>
    
    <!-- 主内容 -->
    <div class="container">
        <!-- 内容 -->
    </div>
    
    <script>
        // 导航菜单切换
        function toggleNavMenu() {
            var tooltip = document.getElementById('navMenuTooltip');
            tooltip.classList.toggle('show');
        }
        
        document.addEventListener('click', function(event) {
            var tooltip = document.getElementById('navMenuTooltip');
            var button = document.querySelector('.nav-menu-btn button');
            
            if (!tooltip.contains(event.target) && !button.contains(event.target)) {
                tooltip.classList.remove('show');
            }
        });
        
        // ===== 深色模式切换功能（必须添加） =====
        // 复制上面的完整JavaScript代码
    </script>
</body>
</html>
```

**注意事项**：
1. **所有页面必须包含相同的深色模式CSS和JavaScript代码**
2. **使用localStorage确保所有页面同步**
3. **页面加载时立即应用用户偏好（避免闪烁）**
4. **使用!important强制覆盖所有样式**
5. **确保对比度足够（文字颜色#e8e8e8，背景#1a1a2e）**
6. **处理所有元素：表格、链接、组件、时间线等**

---

## SEO Optimization（SEO优化指南）

### 概述

SEO优化指南帮助知识库在搜索引擎中获得更好的排名。

### Meta标签优化

**必须包含的Meta标签**：

```html
<head>
    <!-- 基础Meta标签 -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    
    <!-- SEO Meta标签 -->
    <title>[主题名称] - 知识库 | [核心关键词]</title>
    <meta name="description" content="[主题简介，150-160字符，包含核心关键词]">
    <meta name="keywords" content="[关键词1], [关键词2], [关键词3], [关键词4]">
    
    <!-- Open Graph标签（社交媒体分享） -->
    <meta property="og:title" content="[主题名称] - 知识库">
    <meta property="og:description" content="[主题简介]">
    <meta property="og:type" content="website">
    <meta property="og:url" content="[页面URL]">
    <meta property="og:image" content="[封面图片URL]">
    
    <!-- Twitter Card标签 -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="[主题名称] - 知识库">
    <meta name="twitter:description" content="[主题简介]">
</head>
```

### 内容结构优化

**语义化HTML标签**：

```html
<!-- 使用语义化标签 -->
<header>
    <h1>[主标题]</h1>
    <p>[简介]</p>
</header>

<nav>
    <!-- 导航内容 -->
</nav>

<main>
    <article>
        <section id="核心概念">
            <h2>[章节标题]</h2>
            <!-- 内容 -->
        </section>
    </article>
</main>

<aside>
    <!-- 侧边栏内容 -->
</aside>

<footer>
    <!-- 页脚内容 -->
</footer>
```

### 标题层级优化

**标题层级规则**：

- 每个页面只有一个 `<h1>` 标题
- `<h2>` 用于主要章节
- `<h3>` 用于子章节
- `<h4>` 用于更细分的章节
- 标题层级不要跳跃（如从h1直接到h3）

### 内部链接优化

**内部链接规则**：

- 所有链接使用描述性文本（避免"点击这里"）
- 重要页面在多个地方有链接入口
- 使用面包屑导航

**面包屑导航示例**：

```html
<nav class="breadcrumb">
    <a href="../main.html">知识库首页</a> &gt;
    <a href="main.html">[分支名称]</a> &gt;
    <span>[当前页面]</span>
</nav>
```

### 图片优化

**图片优化规则**：

- 所有图片添加 `alt` 属性
- 图片文件名使用描述性命名
- 使用合适的图片格式（WebP优先）
- 图片添加 `loading="lazy"` 懒加载

```html
<img src="image.webp" alt="[图片描述]" loading="lazy" width="800" height="600">
```

### 结构化数据（Schema.org）

**知识库文章结构化数据**：

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[文章标题]",
    "description": "[文章描述]",
    "author": {
        "@type": "Person",
        "name": "[作者名]"
    },
    "datePublished": "[发布日期]",
    "dateModified": "[修改日期]",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "[页面URL]"
    }
}
</script>
```

---

## Performance Optimization（性能优化）

### 概述

性能优化提升页面加载速度和用户体验。

### CSS优化

**优化方法**：

- 将CSS放在 `<head>` 中（避免阻塞渲染）
- 使用CSS压缩
- 避免使用 `@import`（使用 `<link>`）
- 合理使用CSS选择器（避免过深嵌套）

### JavaScript优化

**优化方法**：

- 将JavaScript放在 `<body>` 末尾
- 使用 `defer` 或 `async` 属性
- 避免阻塞渲染的JavaScript

```html
<!-- 非关键JS使用defer -->
<script src="script.js" defer></script>

<!-- 独立JS使用async -->
<script src="analytics.js" async></script>
```

### 图片优化

**优化方法**：

- 使用现代图片格式（WebP）
- 图片懒加载
- 使用响应式图片

```html
<!-- 懒加载 -->
<img src="image.webp" loading="lazy" alt="描述">

<!-- 响应式图片 -->
<img 
    srcset="image-small.webp 400w, image-medium.webp 800w, image-large.webp 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
    src="image-medium.webp"
    alt="描述"
>
```

### 资源压缩

**HTML压缩示例**：

- 移除不必要的空格和注释
- 移除不必要的属性

**CSS压缩示例**：

```css
/* 压缩前 */
.content-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    padding: 30px;
    margin-bottom: 25px;
}

/* 压缩后 */
.content-card{background:rgba(255,255,255,0.95);border-radius:15px;padding:30px;margin-bottom:25px;}
```

### 缓存策略

**浏览器缓存设置**：

```html
<!-- 通过服务器设置，这里是示意 -->
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

---

## Accessibility Guide（无障碍访问指南）

### 概述

无障碍访问指南确保知识库对所有用户友好，包括视力障碍、听力障碍等用户。

### ARIA标签

**ARIA标签使用**：

```html
<!-- 导航菜单 -->
<nav aria-label="主导航">
    <button aria-expanded="false" aria-controls="navMenuTooltip">
        目录
    </button>
    <div id="navMenuTooltip" aria-hidden="true">
        <!-- 导航内容 -->
    </div>
</nav>

<!-- 内容卡片 -->
<article aria-labelledby="章节标题">
    <h2 id="章节标题">章节标题</h2>
    <!-- 内容 -->
</article>
```

### 键盘导航

**键盘导航支持**：

- 所有交互元素可通过Tab键访问
- 使用 `tabindex` 控制焦点顺序
- 添加键盘事件处理

```javascript
// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC关闭导航菜单
    if (e.key === 'Escape') {
        document.getElementById('navMenuTooltip').classList.remove('show');
    }
    
    // 快捷键搜索（Ctrl+F）
    if (e.ctrlKey && e.key === 'f') {
        document.getElementById('searchInput').focus();
    }
});
```

### 颜色对比度

**颜色对比度要求**：

- 文本与背景对比度至少4.5:1
- 大文本对比度至少3:1
- 使用对比度检查工具验证

### 屏幕阅读器支持

**屏幕阅读器友好设计**：

- 使用语义化HTML标签
- 为图片添加alt文本
- 为链接添加描述性文本
- 为表单添加label

```html
<!-- 表单无障碍 -->
<label for="searchInput">搜索关键词：</label>
<input type="text" id="searchInput" aria-describedby="searchHelp">
<span id="searchHelp">输入关键词搜索页面内容</span>
```

---

## Maintenance & Deployment（维护与部署指南）

### 版本控制

**Git版本控制建议**：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "初始化知识库"

# 后续修改提交
git add .
git commit -m "添加新章节：[章节名称]"
```

**分支管理建议**：

- `main` 分支：稳定版本
- `develop` 分支：开发版本
- `feature` 分支：新功能开发

### 内容更新机制

**更新流程**：

1. **规划更新**
   - 确定需要更新的内容
   - 确定更新原因（新信息、错误修正、补充内容）

2. **执行更新**
   - 修改HTML文件
   - 更新README.md修改记录
   - 测试修改效果

3. **发布更新**
   - Git提交修改
   - 更新版本号
   - 发布到部署平台

**修改记录格式**：

```markdown
## 第N次修改（YYYY-MM-DD）

### 修改原因
[修改原因描述]

### 修改内容
- [修改项1]
- [修改项2]

### 影响范围
[影响哪些页面/章节]

### 测试结果
[测试修改效果]
```

### 部署指南

**GitHub Pages部署**：

```bash
# 1. 创建GitHub仓库
# 2. 推送代码
git remote add origin https://github.com/[用户名]/[仓库名].git
git push -u origin main

# 3. 在GitHub仓库设置中启用GitHub Pages
# Settings > Pages > Source: main branch
```

**其他部署平台**：

| 平台 | 特点 | 适用场景 |
|------|------|----------|
| GitHub Pages | 免费、简单 | 个人知识库 |
| Netlify | 免费、功能丰富 | 需要更多功能 |
| Vercel | 免费、速度快 | 现代Web应用 |
| 自建服务器 | 完全控制 | 企业知识库 |

### 自动化测试

**链接测试脚本**：

```javascript
// 验证所有链接是否有效
function testLinks() {
    const links = document.querySelectorAll('a[href]');
    const brokenLinks = [];
    
    links.forEach(link => {
        // 测试内部链接
        if (link.href.startsWith(window.location.origin)) {
            fetch(link.href)
                .then(response => {
                    if (!response.ok) {
                        brokenLinks.push(link.href);
                    }
                });
        }
    });
    
    console.log('断链列表:', brokenLinks);
}
```

**HTML验证**：

- 使用W3C HTML验证器
- 检查HTML语法错误
- 检查语义化标签使用

---

## Theme Templates（主题模板库）

### 概述

主题模板库为不同类型的知识库提供预设的样式配色和章节结构。

### 经济/金融主题模板

**渐变背景**：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

**推荐章节**：
- 核心概念
- 历史验证
- 数据扭曲分析
- 与普通人关系
- 投资应用
- 风险提示

**特殊组件**：
- 数据对比表（官方 vs 真实）
- 消费悖论分析
- 政策泡沫标注

### 心理学/人文主题模板

**渐变背景**：`linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`

**推荐章节**：
- 核心概念
- 主要流派
- 代表人物
- 经典实验
- 日常应用
- 临床应用
- 学习路径

**特殊组件**：
- 人物专题卡片
- 实验案例分析
- 自测小工具

### 科学/技术主题模板

**渐变背景**：`linear-gradient(135deg, #11998e 0%, #38ef7d 100%)`

**推荐章节**：
- 核心原理
- 技术发展史
- 关键技术
- 应用领域
- 未来趋势
- 学习资源

**特殊组件**：
- 技术架构图
- 发展时间线
- 技术对比表

### 历史/文化主题模板

**渐变背景**：`linear-gradient(135deg, #2c3e50 0%, #4a5568 100%)`

**推荐章节**：
- 核心概念
- 历史演变
- 代表人物
- 核心思想
- 历史影响
- 现代意义
- 与其他流派对比

**特殊组件**：
- 历史时间线
- 人物生平卡片
- 思想对比表

### 哲学/思想主题模板

**渐变背景**：`linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)`

**推荐章节**：
- 核心概念
- 历史背景
- 主要流派
- 代表人物
- 核心思想
- 与其他学派对比
- 现代启示

**特殊组件**：
- 思想对比表
- 名言引用卡片
- 著作推荐

### 教育/学习主题模板

**渐变背景**：`linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`

**推荐章节**：
- 核心概念
- 学习方法
- 学习路径
- 学习资源
- 实践案例
- 常见问题

**特殊组件**：
- 学习路径图
- 资源推荐表
- 自测工具

---

## Quick Reference（快速参考）

### 生成流程快速参考

```
Phase 0: 内容规划 → 内容规划表
Phase 1: 主题分析 → 页面结构规划表
Phase 2: 主页面创建 → main.html
Phase 3: 子页面创建 → 子页面/分支页面
Phase 4: 导航系统 → Tooltip + 侧边栏
Phase 5: 内容组件 → 各类组件
Phase 6: 数据扭曲 → 数据标注
Phase 7: 修改记录 → README.md
Phase 8: 样式统一 → 统一渐变背景
Phase 9: SEO优化 → Meta标签
Phase 10: 质量检查 → 四项检查
```

### 常用CSS类名快速参考

| 类名 | 用途 |
|------|------|
| `.nav-menu-btn` | 导航菜单按钮 |
| `.nav-menu-tooltip` | 导航菜单面板 |
| `.sidebar-nav` | 侧边栏导航 |
| `.content-card` | 内容卡片 |
| `.comparison-table` | 对比表格 |
| `.highlight-box` | 核心要点框 |
| `.quote-box` | 名言引用框 |
| `.key-concepts` | 关键概念网格 |
| `.concept-card` | 概念卡片 |
| `.timeline` | 时间线 |
| `.tip-box` | 实用技巧框 |
| `.warning-box` | 警告提示框 |

### 常用交互功能快速参考

| 功能 | 函数名 |
|------|--------|
| 导航菜单切换 | `toggleNavMenu()` |
| 页内搜索 | `searchContent()` |
| 阅读进度 | `updateProgress()` |
| 书签收藏 | `toggleBookmark()` |
| 打印页面 | `printPage()` |
| 深色模式 | `toggleDarkMode()` |

---

## Final Checklist（最终检查清单）

生成完成后，使用以下清单进行全面检查：

### 内容检查
- [ ] 核心概念准确无误
- [ ] 历史事件年份正确
- [ ] 人物信息准确
- [ ] 数据标注来源
- [ ] 引用标注出处

### 结构检查
- [ ] 页面结构完整
- [ ] 章节层级合理
- [ ] 内容逻辑连贯
- [ ] 避免内容重复

### 导航检查
- [ ] 主页面链接正确
- [ ] 子页面返回链接正确
- [ ] 导航菜单功能正常
- [ ] 侧边栏导航正常

### 样式检查
- [ ] 渐变背景统一
- [ ] 内容卡片样式统一
- [ ] 表格样式统一
- [ ] 响应式设计有效

### SEO检查
- [ ] Meta标签完整
- [ ] 标题层级正确
- [ ] 图片有alt属性
- [ ] 结构化数据正确

### 无障碍检查
- [ ] ARIA标签正确
- [ ] 键盘导航支持
- [ ] 颜色对比度足够
- [ ] 屏幕阅读器友好

### 性能检查
- [ ] CSS在head中
- [ ] JS在body末尾
- [ ] 图片懒加载
- [ ] 资源压缩

### 文档检查
- [ ] README.md完整
- [ ] 修改记录更新
- [ ] 版本号正确
