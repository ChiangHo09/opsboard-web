> **请结合代码实际**

<div align="center">
  <h3>你知道的，懒才是第一生产力</h3>
</div>

# 运维信息表 (OpsBoard) - Design Prototype
这个项目的本意是为了能帮我在工作中偷懒`(jie sheng shi jian)`。   
前端核心框架已搭建完成，后端开发正在推进中。后续将优先上线一个可用版本，待基础功能跑通后，再进一步完善前端交互与视觉表现。  
后端最终选定 Go 语言开发，Go 的语法简洁、结构清晰，非常适合通过 AI 高效生成代码。  
感谢 [`Google AI Studio`](https://aistudio.google.com/) 和 [`Gemini 2.5 Pro 模型`](https://deepmind.google/models/gemini/) 模型帮助我完成这个项目。


<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2018-blue?style=flat-square" alt="React 18">
  <img src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/UI-Material%20Design-blue?style=flat-square" alt="Material Design">
  <img src="https://img.shields.io/badge/Backend-Go-green?style=flat-square" alt="Go">
  <img src="https://img.shields.io/badge/Database-MySQL-orange?style=flat-square" alt="MySQL">
</p>

## 项目简介

OpsBoard 是一个功能完备的运维信息管理平台，采用现代化的前后端分离架构设计。它为运维团队提供了一个直观、高效的工具来管理和监控服务器信息、更新日志、任务状态和工单流程。

本项目致力于通过自动化和可视化手段，提升运维工作的效率和准确性，帮助团队更好地掌控系统状态。

## 核心特性

### 前端特性
- **现代化UI设计**: 基于 Material Design 3，提供优雅的视觉体验
- **极致响应式**: 完美适配桌面端、平板和移动端设备
- **TypeScript支持**: 完整的类型定义，提升开发效率和代码质量
- **URL驱动状态管理**: 支持浏览器历史记录和链接分享
- **流畅动画体验**: 基于 Framer Motion 的页面过渡和组件动画
- **全局错误处理**: 集成错误边界，确保应用稳定性
- **自动化测试**: 集成 Jest 和 React Testing Library

### 后端特性
- **高性能API**: 基于 Gin 框架的 RESTful API
- **数据库ORM**: 使用 GORM 简化数据库操作
- **认证授权**: JWT-based 身份验证系统
- **跨域支持**: 内置 CORS 中间件
- **分页查询**: 支持大数据集的分页和筛选
- **操作审计**: 自动记录关键操作日志

## 功能模块

### 主要页面
1. **仪表盘 (Dashboard)**: 应用的欢迎页，提供快捷操作入口和关键数据概览。
2. **服务器信息 (Servers)**: 展示服务器列表，支持**分页**、**搜索**和点击查看详情。
3. **更新日志 (Changelog)**: 管理所有更新记录，支持按时间等多维度筛选。
4. **任务管理 (Maintenance)**: 巡检和备份任务的管理模块。
5. **工单管理 (Tickets)**: 创建、跟踪和管理运维工单。
6. **统计信息 (Stats)**: (规划中) 用于展示服务器资源和性能数据的分析图表。
7. **实验功能 (Labs)**: (规划中) 用于测试和展示不稳定的新功能。
8. **全局搜索 (Search)**: (规划中) 提供跨所有模块的统一搜索入口。
9. **系统设置 (Settings)**: (规划中) 用于管理应用级别的配置。

## 技术栈

### 前端技术栈
```
├── React 18.3.1          # UI框架
├── TypeScript 5.8.3      # 类型系统
├── Material-UI 7.2.0     # UI组件库
├── React Router 6.30.1   # 路由管理
├── Framer Motion 12.23.3 # 动画库
├── React Query 5.83.0    # 数据获取
├── Jest 30.0.5           # 测试框架
└── Vite 6.3.6            # 构建工具
```

### 后端技术栈
```
├── Go 1.25              # 编程语言
├── Gin 1.9.1            # Web框架
├── GORM 1.31.0          # ORM框架
├── MySQL Driver 1.9.3   # 数据库驱动
├── JWT 5.2.2            # 认证库
├── UUID 1.6.0           # UUID生成
└── CORS 1.5.0           # 跨域中间件
```

## 项目结构

```
opsboard-web/
├── opsboard-frontend/         # 前端项目
│   ├── src/
│   │   ├── api/               # API接口定义
│   │   ├── assets/            # 静态资源
│   │   ├── components/        # 可复用组件
│   │   ├── contexts/          # React上下文
│   │   ├── hooks/             # 自定义Hook
│   │   ├── layouts/           # 布局组件
│   │   ├── pages/             # 页面组件
│   │   ├── types/             # TypeScript类型定义
│   │   ├── utils/             # 工具函数
│   │   └── workers/           # Web Workers
│   ├── package.json           # 前端依赖配置
│   ├── vite.config.ts         # Vite构建配置
│   └── tsconfig.json          # TypeScript配置
│
├── opsboard-backend/          # 后端项目
│   ├── handlers/              # HTTP处理器
│   ├── middleware/            # 中间件
│   ├── models/                # 数据模型
│   ├── services/              # 业务逻辑
│   ├── utils/                 # 工具函数
│   ├── config/                # 配置文件
│   ├── database/              # 数据库相关
│   ├── main.go                # 入口文件
│   └── go.mod                 # Go模块定义
│
├── .gitea/                    # Gitea工作流配置
├── .idea/                     # IDE配置
└── README.md                  # 项目文档
```

## 快速开始

### 环境要求
- **Node.js**: 18.0.0 或更高版本
- **Go**: 1.25 或更高版本
- **MySQL**: 8.0 或更高版本
- **Git**: 用于版本控制

### 前端安装
```bash
# 克隆项目
git clone http://chiangho.top:3389/chiangho/opsboard-web.git
cd opsboard-web

# 安装前端依赖
cd opsboard-frontend
npm install

# 启动开发服务器
npm run dev
```

### 后端安装
```bash
# 进入后端目录
cd opsboard-backend

# 安装Go依赖
go mod download

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息

# 启动后端服务
go run main.go
```

### 生产部署
```bash
# 构建前端生产版本
cd opsboard-frontend
npm run build

# 构建后端可执行文件
cd opsboard-backend
go build -o opsboard-backend main.go
```

## 设计特色

### Material Design 3 设计原则
- **光影层次**: 通过阴影变化区分UI元素层级
- **动态高程**: 交互元素的状态反馈
- **有意义动画**: 引导用户注意力的过渡效果
- **语义化色彩**: 一致的视觉语言系统

### 用户体验优化
- **响应式布局**: 适配各种设备屏幕
- **加载状态**: 优雅的加载动画和骨架屏
- **错误处理**: 友好的错误提示和恢复机制
- **无障碍访问**: 支持键盘导航和屏幕阅读器

## 开发规范

### 代码规范
- **TypeScript**: 严格类型检查，禁止使用 `any`
- **组件设计**: 遵循单一职责原则
- **命名约定**: 使用语义化的变量和函数名
- **代码格式**: 使用 ESLint 和 Prettier 统一代码风格

### Git提交规范
- **feat**: 新功能
- **fix**: 修复Bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

## 贡献指南

我们欢迎任何形式的贡献！在提交 Pull Request 之前，请确保：

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 联系方式

项目维护者: chiangho

如有任何问题或建议，请通过以下方式联系我们：
- 提交 Issue
- 发送邮件至项目维护者邮箱


