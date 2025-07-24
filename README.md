# 运维信息表 (OpsBoard)
> **请结合代码实际**

## 项目概述

运维信息表是一个基于 React 和 Material-UI 构建的运维管理平台。
该应用提供了直观的用户界面和丰富的功能模块，帮助运维人员高效管理和监控服务器资源。

### 核心特性

- **响应式设计**: 完美适配桌面端和移动端设备
- **模块化架构**: 清晰的页面结构和组件化设计
- **现代化UI**: 基于 Material-UI 和 Framer Motion 实现流畅的动画效果
- **统一主题**: 采用自定义主题系统，确保视觉一致性
- **交互优化**: 包含搜索面板、模态框、数据表格等丰富交互组件

## 功能模块

### 主要页面

1. **仪表盘 (Dashboard)**
  - 欢迎信息和快捷操作入口
  - 快速统计数据展示
  - 最近操作记录

2. **服务器信息 (Servers)**
  - 服务器列表展示
  - 支持分页和搜索
  - 详情查看功能

3. **更新日志 (Changelog)**
  - 更新记录管理
  - 时间筛选和搜索功能
  - 详情查看

4. **巡检备份 (Inspection Backup)**
  - 巡检和备份任务管理
  - 搜索筛选功能

5. **工单管理 (Tickets)**
  - 工单创建和管理
  - 与更新记录关联生成工单

6. **统计信息 (Stats)**
  - 服务器资源统计
  - 性能数据分析

7. **实验功能 (Labs)**
  - 实验性功能展示

8. **全局搜索 (Search)**
  - 跨模块搜索功能

9. **系统设置 (Settings)**
  - 系统配置管理

### 核心组件

- **布局组件**: 主布局、页面布局、侧边导航
- **表单组件**: 各类搜索表单实现
- **模态框**: 统一的弹窗组件
- **数据表格**: 带分页和固定表头的表格组件
- **工具组件**: Tooltip、动画等辅助组件

## 技术栈

- **核心框架**: React 18 + TypeScript
- **UI框架**: Material-UI (MUI)
- **状态管理**: React Context API
- **路由管理**: React Router v6
- **动画库**: Framer Motion
- **日期处理**: Day.js
- **构建工具**: Vite
- **样式方案**: CSS Modules + Styled Components

## 项目结构

```bash
src/ 
├── components/       # 可复用组件 
│ ├── forms/          # 表单组件 
│ ├── modals/         # 模态框内容组件 
│ ├── ui/             # 基础UI组件 
│ └── layout/         # 布局组件 
├── pages/            # 页面组件 
├── contexts/         # React Context 
├── layouts/          # 布局容器 
├── utils/            # 工具函数 
├── theme.ts          # MUI主题配置 
└── App.tsx           # 应用根组件
```

## 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm 或 yarn

### 安装步骤

```bash
# 克隆项目
git clone <项目地址>
# 进入项目目录
cd opsboard-web
# 安装依赖
npm install
# 启动开发服务器
npm run dev
```

### 构建部署

```bash
# 构建生产版本
npm run build
# 预览生产构建
npm run preview
```

## 开发规范

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 规范
- 组件采用函数式写法
- 使用 React Hooks 进行状态管理

### 命名约定

- 组件文件名采用 PascalCase
- 组件名称与文件名保持一致
- CSS 类名采用 kebab-case
- 变量和函数采用 camelCase

### 主题定制

项目采用 MUI 主题系统，所有颜色、字体、间距等设计变量统一在 `theme.ts` 中管理，确保视觉一致性。

## 特色功能

### 1. 响应式侧边栏

- 桌面端可折叠侧边栏
- 移动端抽屉式导航
- 动画过渡效果

### 2. 搜索面板

- 右侧抽屉式搜索面板
- 各页面独立的搜索表单
- 平滑的展开/收起动画

### 3. 模态框系统

- 全局统一的模态框组件
- 支持移动端全屏显示
- 平滑的进入/退出动画（天杀的`Gemini`和`GPT`还有`DeepSeek`全都没能实现，再议）

### 4. 数据表格

- 固定表头和列
- 分页功能
- 自适应布局
- 文本溢出提示

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

???还没加上

## 联系方式

项目维护者: chiangho

---

*该项目使用 React + TypeScript 构建，采用现代化的前端技术栈，具有良好的可维护性和扩展性。*
