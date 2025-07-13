# OpsBoard 运维信息表



> **请结合代码实际** 


# React 前端通用布局模板

这是一个现代、响应式的 React 前端应用模板，集成了 Material-UI (MUI) 组件库、React Router 进行页面路由以及 Framer Motion 实现流畅的动画效果。它提供了一个通用的管理后台布局，包括一个可折叠的侧边栏、一个带动画的主内容区，以及一个通过 Context API 实现的动态右侧搜索面板。

## 目录

*   [项目特性](#项目特性)
*   [技术栈](#技术栈)
*   [快速开始](#快速开始)
    *   [前提条件](#前提条件)
    *   [安装](#安装)
    *   [运行项目](#运行项目)
*   [项目结构](#项目结构)
*   [关键设计与实现](#关键设计与实现)
    *   [主布局 (`MainLayout`)](#主布局-mainlayout)
    *   [侧边栏 (`SideNav`)](#侧边栏-sidenav)
    *   [页面内容动画](#页面内容动画)
    *   [动态右侧搜索面板](#动态右侧搜索面板)
*   [使用动态搜索面板](#使用动态搜索面板)
*   [许可证](#许可证)

---

## 项目特性

*   **灵活的布局骨架**: 提供统一的页面结构，包括侧边栏和主内容区。
*   **Google AI Studio 风格侧边栏**: 可折叠的侧边导航菜单，提供直观的用户体验。
*   **平滑的页面切换动画**: 页面内容采用淡入淡出和Y轴位移的动画效果，提升视觉流畅度，同时保持白色背景面板的静态。
*   **动态右侧搜索面板**: 通过 React Context 实现，允许不同页面注入自定义的搜索表单内容。
*   **一致的间距与圆角**: 统一的主内容区外部间距，以及白色卡片背景和圆角样式。
*   **基于 Material-UI**: 利用 MUI 组件快速构建美观且响应式的 UI。
*   **TypeScript 支持**: 提供类型安全和更好的开发体验。
*   **React Router 集成**: 轻松管理应用内的导航。

## 技术栈

*   [React](https://react.dev/) (v18+)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Material-UI (MUI)](https://mui.com/) (v5+)
*   [React Router DOM](https://reactrouter.com/en/main) (v6+)
*   [Framer Motion](https://www.framer.com/motion/)
*   [Node.js](https://nodejs.org/)
*   [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/)

## 快速开始

### 前提条件

请确保您的开发环境中安装了以下软件：

*   Node.js (推荐 LTS 版本)
*   npm 或 Yarn

### 安装

1.  克隆项目仓库：
    ```bash
    git clone <your-repo-url>
    cd <your-project-directory>
    ```
2.  安装项目依赖：
    ```bash
    npm install
    # 或者
    yarn install
    ```

### 运行项目

在项目根目录运行以下命令启动开发服务器：

```bash
npm run dev
# 或者
yarn dev
```

项目将在您的浏览器中自动打开，通常是 `http://localhost:3000`。

## 项目结构

```
src/
├── components/           # 可重用的 UI 组件 (e.g., SideNav, RightSearchPanel)
├── contexts/             # React Contexts (e.g., LayoutContext.tsx 用于动态面板)
├── layouts/              # 主要布局组件 (e.g., MainLayout.tsx)
├── pages/                # 独立的页面组件 (e.g., Dashboard.tsx, Servers.tsx)
└── utils/                # 常用工具函数、动画变量 (e.g., pageAnimations.ts)
```

## 关键设计与实现

### 主布局 (`MainLayout.tsx`)

`MainLayout` 作为整个应用的外层骨架。它的主要职责如下：

*   **统一外部间距**: `MainLayout` 中的 `<Box component="main">` 元素负责为整个主内容区域（包括静态白色卡片和右侧搜索面板）提供统一的 `p: 3` (24px，取决于您的 MUI 主题 `spacing` 配置) 内边距。这确保了整个内容区域与侧边栏、顶部、底部和右侧屏幕边缘之间有适当的视觉间距。
*   **静态背景卡片**: 在 `<Box component="main">` 内部，有一个静态的 `<Box>` 元素，它具有 `bgcolor: 'background.paper'` 和 `borderRadius: 2` 样式，形成了页面内容的白色圆角背景。这个 `Box` 不会随页面切换而动画，保持稳定。
*   **内容与面板并排**: 使用 `display: 'flex'` 和 `gap: 3` 来让白色背景卡片和右侧搜索面板并排显示，并提供它们之间的间距。

### 侧边栏 (`SideNav.tsx`)

*   实现了类似 Google AI Studio 的可折叠侧边导航栏，具有动画展开/收起效果。
*   管理导航路由，并提供用户账户菜单。

### 页面内容动画

*   `MainLayout.tsx` 中，在静态白色背景 `<Box>` 内部有一个 `MotionBox`。
*   `MotionBox` 紧密包裹着 `<Outlet />` 组件，这意味着只有 `Outlet` 渲染的**实际页面内容**会应用 `framer-motion` 定义的淡入淡出和Y轴位移动画。
*   **每个页面组件** (如 `Dashboard.tsx`, `Servers.tsx` 等) 的根元素现在负责添加其**内部的 `p: 3` 内边距**。这样，页面的实际内容会在白色背景卡片内部呈现出适当的填充，同时白色卡片本身在页面切换时保持静止。

### 动态右侧搜索面板

*   通过 `src/contexts/LayoutContext.tsx` 提供一个全局上下文。
*   `Servers.tsx` 等需要搜索面板的页面不再直接渲染 `RightSearchPanel`。
*   这些页面使用 `useLayout` Hook，并在 `useEffect` 中通过 `setPanelContent` 方法向 `LayoutContext` 注入搜索面板的实际内容。
*   `MainLayout.tsx` 监听 `LayoutContext` 中的 `panelContent` 和 `isPanelOpen` 状态，并在主内容区旁渲染 `RightSearchPanel`，将注入的内容作为其 `children`。
*   这种设计实现了搜索面板的**解耦**：搜索面板的显示逻辑由 `MainLayout` 统一管理，而其具体内容则由各个页面动态提供。

## 使用动态搜索面板

以 `Servers.tsx` 为例，如何在您的页面中集成和控制右侧搜索面板：

1.  **导入 `useLayout` Hook**:
    ```typescript
    import { useLayout } from '../contexts/LayoutContext.tsx';
    ```

2.  **获取上下文控制函数**:
    在您的函数组件内部调用 `useLayout()` 获取 `isPanelOpen`, `togglePanel`, `setPanelContent`。
    ```typescript
    const { isPanelOpen, togglePanel, setPanelContent } = useLayout();
    ```

3.  **设置面板内容**:
    使用 `useEffect` 来在组件挂载时设置 `panelContent`，并在组件卸载时清除它。
    `panelInnerContent` 可以是任何 JSX 内容，例如包含表单字段的 `React.Fragment`。
    ```typescript
    useEffect(() => {
        const panelInnerContent = (
            <React.Fragment>
                <TextField fullWidth margin="normal" label="IP 地址" variant="outlined" />
                <TextField fullWidth margin="normal" label="服务器名称" variant="outlined" />
                {/* ... 更多表单字段 */}
            </React.Fragment>
        );
        setPanelContent(panelInnerContent);

        // 清理函数：组件卸载时清除面板内容，并可选地关闭面板
        return () => {
            setPanelContent(null);
            if (isPanelOpen) togglePanel(); // 如果需要，在页面切换时关闭面板
        };
    }, [setPanelContent, isPanelOpen, togglePanel]); // 确保依赖项完整
    ```

4.  **触发面板显示/隐藏**:
    在您的页面中添加一个按钮，调用 `togglePanel` 函数来控制搜索面板的开关。
    ```typescript
    <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={togglePanel} // 调用 LayoutContext 的 togglePanel
    >
        搜索
    </Button>
    ```

## 许可证

本项目采用 MIT 许可证。详见 `LICENSE` 文件（如果存在）或直接在仓库中查看。