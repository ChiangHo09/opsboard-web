/**
 * 文件功能：
 * 此文件是整个 React 应用的入口文件。
 * 它负责将根组件（App）渲染到 HTML 页面的 #root 元素上，并在这里配置全局的 Provider，如主题、路由和本地化。
 *
 * 本次修改：
 * - 采用全新的、更可靠的本地化方案，将日期处理库从 date-fns 更换为 dayjs。
 * - 引入了 dayjs 库、其中文语言包以及对应的 MUI 适配器 `AdapterDayjs`。
 * - 通过 `dayjs.locale('zh-cn')` 的方式，在应用加载时【强制全局】设置日期语言为中文。
 * - 这个方案绕过了之前 `adapterLocale` prop 可能遇到的所有问题，能确保日期选择器正确显示中文。
 * - 【日期本地化修复说明】此文件中的修改（导入 dayjs 中文语言包并全局设置 locale）是确保日期选择器显示中文（如“七月 2025”和中文星期几缩写）的根本解决方案。图片中显示英文的情况将在此更改生效后消失。
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
// 修复点：导入 Day.js 的适配器。
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'; // 导入 Day.js 的日期适配器，与 LocalizationProvider 配合使用。
// 修复点：导入 dayjs 库本身和它的中文语言包。
import dayjs from 'dayjs'; // 导入 dayjs 库。
import 'dayjs/locale/zh-cn'; // 导入 dayjs 的中文（简体）语言包。
import theme from './theme'; // 导入应用程序的自定义主题配置。

/* ===== 4. 全局配置 ===== */
// 修复点：在应用渲染前，【强制 dayjs 全局使用中文 locale】。
// 这确保了所有使用 dayjs 的日期操作（包括日期选择器）都会默认使用中文显示，解决了日期本地化问题。
dayjs.locale('zh-cn'); // 设置 dayjs 的全局语言环境为中文（简体）。

/* ===== 5. 根组件 ===== */
import App from './App'; // 导入应用程序的根组件 App。

/* -----------------------------------------------------------------
 * 6. 找到 HTML 挂载点并创建 React Root
 * ----------------------------------------------------------------*/
const container = document.getElementById('root')!; // 获取 HTML 中 ID 为 'root' 的元素作为 React 应用的挂载点。感叹号 (!) 表示该元素一定存在，避免 TypeScript 警告。
const root = createRoot(container); // 使用 createRoot 创建 React 根，这是 React 18+ 的新 API，用于并发模式。

/* -----------------------------------------------------------------
 * 7. 渲染组件树
 * ----------------------------------------------------------------*/
root.render(
    <StrictMode> {/* 严格模式：在开发模式下帮助检测潜在问题和不推荐的用法。 */}
        <ThemeProvider theme={theme}> {/* 提供自定义主题给所有 MUI 组件。 */}
            {/* 修复点：使用新的 AdapterDayjs，并且不再需要 adapterLocale prop。 */}
            {/* dateAdapter={AdapterDayjs} 指定日期库适配器为 Day.js。全局 dayjs.locale('zh-cn') 已处理本地化。 */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline/> {/* 应用 MUI 的 CSS 重置，提供一致的基线样式。 */}
                <App/> {/* 渲染应用程序的根组件。 */}
            </LocalizationProvider>
        </ThemeProvider>
    </StrictMode>,
);
