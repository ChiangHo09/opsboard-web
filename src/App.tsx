/**
 * 文件名: src/App.tsx
 *
 * 代码功能:
 * 此文件是应用的根组件和主路由配置文件。
 * 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
 *
 * 本次修改内容:
 * - 【移动端路由修复】为所有详情页面添加了专用的移动端路由。
 * - **问题根源**:
 *   应用缺少处理移动端详情视图的路由规则。
 * - **解决方案**:
 *   1.  懒加载所有新创建的移动端详情页面组件（`TicketDetailMobile` 等）。
 *   2.  为每个功能模块添加了新的、独立的移动端详情路由，例如 `/app/tickets/mobile/:ticketId`。
 *   3.  这些新路由会渲染对应的移动端全屏详情页面组件。
 * - **最终效果**:
 *   应用现在能够根据 URL 正确地渲染桌面端的弹窗或移动端的新页面，实现了完整的响应式详情查看流程。
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
const TemplatePage = lazy(() => import('./pages/TemplatePage'));

// 【核心修复】懒加载所有新创建的移动端详情页面
const TicketDetailMobile = lazy(() => import('./pages/mobile/TicketDetailMobile'));
const ServerDetailMobile = lazy(() => import('./pages/mobile/ServerDetailMobile'));
const ChangelogDetailMobile = lazy(() => import('./pages/mobile/ChangelogDetailMobile'));


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
                            {/* 【核心修复】添加服务器详情的移动端路由 */}
                            <Route path="servers/mobile/:serverId" element={<ServerDetailMobile />} />

                            <Route path="changelog" element={<Changelog/>}>
                                <Route path=":logId" element={null}/>
                            </Route>
                            {/* 【核心修复】添加更新日志详情的移动端路由 */}
                            <Route path="changelog/mobile/:logId" element={<ChangelogDetailMobile />} />

                            <Route path="inspection-backup" element={<InspectionBackup/>}/>
                            <Route path="tickets" element={<Tickets/>}>
                                <Route path=":ticketId" element={null}/>
                            </Route>
                            {/* 【核心修复】添加工单详情的移动端路由 */}
                            <Route path="tickets/mobile/:ticketId" element={<TicketDetailMobile />} />

                            <Route path="stats" element={<Stats/>}/>
                            <Route path="labs" element={<Labs/>}/>
                            <Route path="settings" element={<Settings/>}/>
                            <Route path="search" element={<Search/>}/>
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