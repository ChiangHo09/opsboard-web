/**
 * @file src/main.tsx
 * @description 此文件是整个 React 应用的入口文件。
 * @modification
 *   - [UI/UX]：在 React 应用成功渲染到 DOM (`root.render`) 之后，添加了移除初始加载动画的逻辑。通过查询并移除在 `index.html` 中定义的 `.app-loading-spinner` 元素，实现了从初始加载动画到应用主界面的无缝过渡。
 *   - [日期本地化修复]：将日期处理库从 date-fns 更换为 dayjs，并全局设置为中文，确保日期选择器正确显示中文。
 */

/* ===== 0. React 核心 ===== */
import {StrictMode} from 'react'; // 导入 StrictMode 组件，用于在开发模式下检查潜在问题。
import {createRoot} from 'react-dom/client'; // 导入 createRoot 函数，用于创建 React 根。

/* ===== 1. 全局样式 ===== */
import './index.css'; // 导入应用程序的全局 CSS 样式。

/* ===== 2. 字体文件（@fontsource 离线方案）===== */
// 导入 Roboto 字体的不同字重，用于英文字符。
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// 导入 Noto Sans SC 字体的不同字重，用于中文字符。
import '@fontsource/noto-sans-sc/300.css';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';

/* ===== 3. MUI —— 主题 / 样式重置 / 本地化 ===== */
import {ThemeProvider, CssBaseline} from '@mui/material'; // 导入 ThemeProvider 用于提供主题，CssBaseline 用于样式重置。
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'; // 导入 LocalizationProvider，用于为日期选择器提供本地化上下文。
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'; // 导入 Day.js 的日期适配器，与 LocalizationProvider 配合使用。
import dayjs from 'dayjs'; // 导入 dayjs 库。
import 'dayjs/locale/zh-cn'; // 导入 dayjs 的中文（简体）语言包。
import theme from './theme'; // 导入应用程序的自定义主题配置。

/* ===== 4. 全局配置 ===== */
dayjs.locale('zh-cn'); // 设置 dayjs 的全局语言环境为中文（简体）。

/* ===== 5. 根组件 ===== */
import App from './App'; // 导入应用程序的根组件 App。

/* -----------------------------------------------------------------
 * 6. 找到 HTML 挂载点并创建 React Root
 * ----------------------------------------------------------------*/
const container = document.getElementById('root')!; // 获取 HTML 中 ID 为 'root' 的元素作为 React 应用的挂载点。
const root = createRoot(container); // 使用 createRoot 创建 React 根。

/* -----------------------------------------------------------------
 * 7. 渲染组件树
 * ----------------------------------------------------------------*/
root.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline/>
                <App/>
            </LocalizationProvider>
        </ThemeProvider>
    </StrictMode>,
);

/* -----------------------------------------------------------------
 * 8. 【核心修改】移除初始加载动画
 * ----------------------------------------------------------------*/
// 在 React 应用完成首次渲染后，查找并移除在 index.html 中设置的加载动画元素。
const spinner = document.querySelector('.app-loading-spinner');
if (spinner) {
    spinner.remove();
}