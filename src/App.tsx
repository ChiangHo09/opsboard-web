/**
 * 文件名: src/App.tsx
 *
 * 代码功能:
 * 此文件是应用的根组件和主路由配置文件。
 * 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
 *
 * 本次修改内容:
 * - 【路由修复】为所有支持详情弹窗的页面添加了嵌套的动态路由，以修复点击详情时错误跳转到 Dashboard 的问题。
 * - **问题根源**:
 *   `tickets` 和 `template-page` 等路由缺少对其详情路径（如 `/app/tickets/:ticketId`）的定义。这导致 React Router 无法匹配这些路径，从而触发了通配符 `*` 路由，重定向到了 Dashboard。
 * - **解决方案**:
 *   1.  在 `tickets` 路由下，添加了嵌套的 `<Route path=":ticketId" element={null} />`。
 *   2.  （为保持一致性）新增了 `template-page` 路由，并为其添加了嵌套的 `<Route path=":itemId" element={null} />`。
 * - **最终效果**:
 *   现在所有详情页的 URL 都能被路由系统正确识别，点击详情条目后，页面会停留在原地并正确弹出模态框，不再发生意外跳转。
 */
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useState, useEffect, lazy} from 'react';

/* ---- MUI Provider & Components ---- */
import {ThemeProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

/* ---- 日期本地化 ---- */
import {zhCN as pickersZhCN} from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

/* ---- 自定义主题 ---- */
import theme from './theme';

/* ---- 布局与非懒加载页面 ---- */
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import HoneypotInfo from './pages/HoneypotInfo';

/* ---- 懒加载所有页面组件 ---- */
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Servers = lazy(() => import('./pages/Servers'));
const Changelog = lazy(() => import('./pages/Changelog'));
const InspectionBackup = lazy(() => import('./pages/InspectionBackup'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Stats = lazy(() => import('./pages/Stats'));
const Labs = lazy(() => import('./pages/Labs'));
const Settings = lazy(() => import('./pages/Settings'));
const Search = lazy(() => import('./pages/Search'));
const TemplatePage = lazy(() => import('./pages/TemplatePage')); // 导入模板页面

const STORAGE_KEY = 'fake_authed';

dayjs.locale('zh-cn');

export default function App() {
    const [authed, setAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');
    const fakeLogin = () => {
        localStorage.setItem(STORAGE_KEY, '1');
        setAuthed(true);
    };
    const fakeLogout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setAuthed(false);
    };

    useEffect(() => {
        if (location.search.includes('logout')) fakeLogout();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="zh-cn"
                localeText={pickersZhCN.components.MuiLocalizationProvider.defaultProps.localeText}
            >
                <Router>
                    <Routes>
                        <Route path="/" element={<Login onFakeLogin={fakeLogin}/>}/>
                        <Route path="/honeypot-info" element={<HoneypotInfo/>}/>

                        <Route
                            path="/app"
                            element={authed
                                ? <MainLayout onFakeLogout={fakeLogout}/>
                                : <Navigate to="/" replace/>}
                        >
                            <Route index element={<Navigate to="dashboard" replace/>}/>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route path="servers" element={<Servers/>}>
                                <Route path=":serverId" element={null}/>
                            </Route>
                            <Route path="changelog" element={<Changelog/>}>
                                <Route path=":logId" element={null}/>
                            </Route>
                            <Route path="inspection-backup" element={<InspectionBackup/>}/>
                            {/* 【核心修复】为 tickets 路由添加嵌套的详情路由 */}
                            <Route path="tickets" element={<Tickets/>}>
                                <Route path=":ticketId" element={null}/>
                            </Route>
                            <Route path="stats" element={<Stats/>}/>
                            <Route path="labs" element={<Labs/>}/>
                            <Route path="settings" element={<Settings/>}/>
                            <Route path="search" element={<Search/>}/>
                            {/* 【核心修复】添加模板页面的路由，并为其添加嵌套的详情路由 */}
                            <Route path="template-page" element={<TemplatePage/>}>
                                <Route path=":itemId" element={null}/>
                            </Route>
                            <Route path="*" element={<Navigate to="dashboard" replace/>}/>
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </Router>
            </LocalizationProvider>
        </ThemeProvider>
    );
}