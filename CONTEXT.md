# CONTEXT

## 仓库概述
- 仓库名称：personnal-assets
- 用途：个人知识库 + 项目管理 + 记忆备份
- 创建日期：2026-04-08
- 最后重组：2026-05-08

## 目录结构
```
/
├── MEMORY.md              # 全局长期记忆（待从根目录精选）
├── CONTEXT.md             # 本文件：仓库架构说明
├── README.md              # 仓库说明
├── .gitignore             # Git忽略配置
├── memory/                # 日常日志（原日记/）
│   └── daily_log_YYYY-MM-DD.md
├── projects/              # 各项目独立目录
│   ├── parent-guide/      # 父母指南（原育儿预演所）
│   ├── cert-handbook/     # 冷门考证手册
│   ├── jiaqi-zhongji/     # 佳琦财务成长
│   ├── daily-30-questions/ # 每日30问
│   ├── xhs-operation/     # 小红书运营
│   └── billiard-circle/   # 台球圈子
├── tools/                 # 通用工具/技能文档
├── code/                  # 代码项目
│   └── xhs-poster-system/ # 小红书海报系统
└── archive/               # 归档
    ├── 历史版本/
    ├── 旧分析文件/
    └── 压缩包/
```

## 使用规则
1. 每个项目必须有 docs/CONTEXT.md + docs/project_status.md
2. memory/ 只放纯日志，项目文件归 projects/
3. 代码项目放 code/，不混入记忆文档
4. archive/ 放旧版本、压缩包、过时文件
5. 每次操作后更新 PROJECT_INDEX.md 和 project_status.md

## 同步机制
- 对话结束：git add + commit + push
- 对话开始：git pull
- Token：存储在 .github_token 文件（已gitignore）
