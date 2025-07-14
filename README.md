# OpsBoard 运维信息表


> **请结合代码实际**

这是一个现代、响应式的 React 前端应用模板，集成了 Material-UI (MUI) 组件库、React Router 进行页面路由以及 Framer Motion 实现流畅的动画效果。它提供了一个通用的管理后台布局，包括一个可折叠的侧边栏、一个带动画的主内容区，以及一个通过 Context API 实现的动态右侧搜索面板。

## 目录

* [项目特性](#项目特性)
* [技术栈](#技术栈)
* [快速开始](#快速开始)
    * [前提条件](#前提条件)
    * [安装](#安装)
    * [运行项目](#运行项目)
* [项目结构](#项目结构)
* [关键设计与实现](#关键设计与实现)
    * [主布局 (`MainLayout`)](#主布局-mainlayout)
    * [侧边栏 (`SideNav`)](#侧边栏-sidenav)
    * [页面内容动画](#页面内容动画)
    * [动态右侧搜索面板](#动态右侧搜索面板)
* [使用动态搜索面板](#使用动态搜索面板)
* [许可证](#许可证)

---

## 项目特性

* **响应式布局骨架**：自动适应桌面和移动端，提供统一的页面结构，包括侧边栏和主内容区。
* **智能侧边栏**：实现可折叠的侧边导航菜单，拥有顺滑的展开/收起动画，收起状态自动展示 Tooltip。
* **平滑的页面切换动画**：内容区域淡入淡出、缩放过渡，视觉体验流畅自然。
* **全局动态右侧面板**：借助 React Context，不同页面可按需注入自定义搜索表单或详情内容。
* **智能面板管理**：页面可声明 `isPanelRelevant`，在路由切换时自动关闭不相关面板，减少手动操作。
* **组件级精细动效**：Framer Motion 加持，可为任意 UI 元素添加显隐、位移、旋转等动画。
* **完全类型安全**：全项目 TypeScript 编写，IDE 友好，类型检查到位。
* **模块化与解耦**：页面、布局、通用组件与全局状态分离，代码结构清晰。
* **日期本地化**：全局配置 Day.js 为中文，日期选择器等组件即开即用。

## 技术栈

* [React](https://react.dev/) (v18+)
* [TypeScript](https://www.typescriptlang.org/)
* [Material-UI (MUI)](https://mui.com/) (v5+)
* [React Router DOM](https://reactrouter.com/en/main) (v6+)
* [Framer Motion](https://www.framer.com/motion/)
* [Day.js](https://day.js.org/) （日期处理与本地化）
* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/)

## 快速开始

### 前提条件

确保本地已安装：

* Node.js（推荐 LTS 版本）
* npm 或 Yarn

### 安装

```bash
git clone <your-repo-url>
cd <your-project-directory>
npm install        # 或 yarn install
```

### 运行项目

```bash
npm run dev        # 或 yarn dev
```

启动后浏览器通常会自动打开 <http://localhost:5173> （或其他可用端口）。

## 项目结构

```text
src/
├── components/            # 可复用 UI 组件
│   ├── forms/             # 各种搜索表单 (e.g. ServerSearchForm.tsx)
│   ├── RightSearchPanel.tsx # 通用右侧面板
│   └── SideNav.tsx        # 侧边导航栏
│
├── contexts/              # React Context 全局状态
│   └── LayoutContext.tsx  # 控制右侧面板等布局状态
│
├── layouts/               # 布局容器
│   ├── AppLayout.tsx      # 全局路由守卫（登录判断）
│   └── MainLayout.tsx     # 主布局（侧边栏 + 内容区 + 右侧面板）
│
├── pages/                 # 路由页面
│   ├── Dashboard.tsx
│   ├── Servers.tsx
│   ├── Login.tsx
│   └── ...
│
├── utils/                 # 工具函数
│   └── pageAnimations.ts  # 页面对动画配置
│
├── App.tsx                # 根组件（顶层路由）
├── main.tsx               # 入口文件（渲染根组件与 Provider）
└── theme.ts               # MUI 主题配置
```

## 关键设计与实现

### 主布局 (`MainLayout.tsx`)

* **统一外部间距**：`<Box component="main">` 负责给整个内容区（含白底卡片与右侧面板）加统一 padding。
* **静态背景卡片**：内部静态 `<Box>` 设置 `bgcolor: 'background.paper'` 和圆角，保证页面背景稳定、不随路由动画抖动。
* **内容与面板并排**：`display: 'flex'` 让内容区和右侧面板在桌面端并排展示。
* **布局上下文**：`LayoutProvider` 把面板控制函数与状态注入所有子组件。

### 侧边栏 (`SideNav.tsx`)

* 桌面端：可折叠侧栏；移动端：顶部栏 + 临时抽屉。
* Framer Motion 实现展开/收起动画与图标旋转。
* 集中管理导航路由，并集成账户信息下拉菜单。

### 页面内容动画

* 静态背景 `<Box>` 内包裹 `MotionBox`。
* `MotionBox` 仅对 `<Outlet />` 渲染的页面内容做淡入淡出 + 缩放过渡。
* 视觉上“内容动、背景静”，动效自然且页面不跳动。

### 动态右侧搜索面板

* 全局上下文（`LayoutContext.tsx`）统一管理
    * `isPanelOpen` —— 面板开关
    * `panelContent` —— 面板实际渲染内容
    * `panelTitle` —— 标题
    * `isPanelRelevant` —— 当前页面是否与面板相关
* 页面（如 `Servers.tsx`）不直接渲染 `RightSearchPanel`，而是通过 `useLayout()` 把表单注入。
* `MainLayout` 监听上下文，在内容区旁渲染 `RightSearchPanel` 并呈现注入内容。
* **关注点分离**：布局管“怎么放”，页面管“放什么”。

## 使用动态搜索面板

以 `TemplatePage.tsx` 为例：

### 1. 导入 Hook 和表单组件

```tsx
import { useEffect, useCallback } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import TemplateSearchForm, { type TemplateSearchValues } from '../components/forms/TemplateSearchForm';
```

### 2. 获取控制函数

```tsx
const {
  togglePanel,
  setPanelContent,
  setPanelTitle,
  setIsPanelRelevant,
} = useLayout();
```

### 3. 定义表单事件处理

```tsx
const handleSearch = useCallback((values: TemplateSearchValues) => {
  console.log('在页面中接收到搜索条件:', values);
  alert(`搜索: ${JSON.stringify(values)}`);
  togglePanel(); // 搜索后关闭面板
}, [togglePanel]);
```

### 4. 在 `useEffect` 中注入表单并声明相关性

```tsx
useEffect(() => {
  // 1. 注入表单
  setPanelContent(<TemplateSearchForm onSearch={handleSearch} />);

  // 2. 设置标题
  setPanelTitle('模板搜索');

  // 3. 声明面板相关
  setIsPanelRelevant(true);

  // 4. 清理函数
  return () => {
    setPanelContent(null);
    setPanelTitle('');
    setIsPanelRelevant(false);
  };
}, [setPanelContent, setPanelTitle, setIsPanelRelevant, handleSearch]);
```

### 5. 添加按钮触发面板

```tsx
<Button variant="contained" onClick={togglePanel}>
  搜索
</Button>
```

## 许可证

本项目基于 MIT License，详情请见根目录 `LICENSE` 文件。（其实还没加许可证，以后再说）
