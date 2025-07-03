/*****************************************************************
 *  main.tsx —— React 应用入口
 *  --------------------------------------------------------------
 *  职责：只做「挂载根节点 + 注入全局主题」这两件事
 *  每一行均附中文注释，便于初学者阅读学习
 *****************************************************************/

/* ===== 0. React 核心 ===== */
// import React from 'react'                         // React 运行时（保留以便 JSX 转换、工具链提示）
import { StrictMode } from 'react'                // 严格模式：开发环境辅助检查

/* ===== 1. React-DOM 渲染 API（React 18 新写法）===== */
import { createRoot } from 'react-dom/client'     // 取代旧版 ReactDOM.render

/* ===== 2. 全局样式 ===== */
import './index.css'                              // 自己的全局 CSS（应最先引入，方便覆盖默认样式）

/* ===== 3. 字体文件（@fontsource 离线方案）===== */
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

/* ===== 4. MUI —— 主题 / 样式重置 ===== */
import {
    createTheme,          // 创建自定义主题
    ThemeProvider,        // 主题注入 Provider
    CssBaseline,          // 跨浏览器一致化 + 继承主题字体
} from '@mui/material'

/* ===== 5. 根组件 ===== */
import App from './App'                           // 业务入口（路由、页面容器等）

/* -----------------------------------------------------------------
 * 6. 创建 MUI 主题
 *    - 这里只统一了全局字体族
 *    - 后续可继续在 palette / components 等分区扩展
 * ----------------------------------------------------------------*/
const theme = createTheme({
    typography: {
        // 字体栈：先 Roboto（拉丁字符）→ Noto Sans SC（中文）→ 系统无衬线
        fontFamily: `'Roboto','Noto Sans SC','PingFang SC','Helvetica Neue',Arial,sans-serif`,
    },
})

/* -----------------------------------------------------------------
 * 7. 找到 HTML 挂载点并创建 React Root
 * ----------------------------------------------------------------*/
const container = document.getElementById('root')!   // 非空断言：确信 index.html 中存在该节点
const root = createRoot(container)                   // React 18 并发渲染入口

/* -----------------------------------------------------------------
 * 8. 渲染组件树
 *    结构（由外到内）：
 *      <StrictMode>      —— 开发环境问题检测
 *      <ThemeProvider>   —— 提供 MUI 主题
 *      <CssBaseline>     —— 重置浏览器默认样式，继承主题字体
 *      <App>             —— 应用根组件
 * ----------------------------------------------------------------*/
root.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </StrictMode>,
)

/* ------------------------------ 文件结束 ------------------------------ */
