/*****************************************************************
 *  src/main.tsx —— React 应用入口
 *  --------------------------------------------------------------
 *  职责：只做「挂载根节点 + 注入全局主题」这两件事
 *  每一行都附中文注释，便于初学者阅读
 *****************************************************************/

/* ===== 0. React 核心 ===== */
import { StrictMode } from 'react'                // React 严格模式：开发阶段帮助发现潜在问题
import { createRoot } from 'react-dom/client'     // React 18 并发渲染入口

/* ===== 1. 全局样式 ===== */
import './index.css'                              // 自己的全局 CSS（应最先加载，方便覆盖默认样式）

/* ===== 2. 字体文件（@fontsource 离线方案）===== */
// Roboto：Material Design 官方拉丁字体（常用 300 / 400 / 500 / 700）
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
// Noto Sans SC：中文回退字体（同样引入常用粗细）
import '@fontsource/noto-sans-sc/300.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'

/* ===== 3. MUI —— 主题 / 样式重置 ===== */
import { ThemeProvider, CssBaseline } from '@mui/material' // 主题注入 Provider + 样式重置
import theme from './theme'                                // 新建的全局主题（src/theme.ts）

/* ===== 4. 根组件 ===== */
import App from './App'                         // 业务入口（路由、页面容器等）

/* -----------------------------------------------------------------
 * 5. 找到 HTML 挂载点并创建 React Root
 * ----------------------------------------------------------------*/
const container = document.getElementById('root')!   // 非空断言：确信 index.html 中存在该节点
const root = createRoot(container)                   // React 18 并发渲染 API

/* -----------------------------------------------------------------
 * 6. 渲染组件树
 *    结构（由外到内）：
 *      <StrictMode>      —— 开发环境问题检测
 *      <ThemeProvider>   —— 提供 MUI 主题（含调色板 / 圆角 / 字体）
 *      <CssBaseline>     —— 重置浏览器默认样式，继承主题字体
 *      <App>             —— 应用根组件
 * ----------------------------------------------------------------*/
root.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />   {/* 开启 MUI 全局样式重置，并启用 theme.typography.fontFamily */}
            <App />
        </ThemeProvider>
    </StrictMode>,
)

/* ------------------------------ 文件结束 ------------------------------ */
