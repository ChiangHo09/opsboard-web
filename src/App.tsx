/**
 * 文件名: src/App.tsx
 *
 * 文件功能描述:
 * 此文件是应用的根组件和主路由配置文件。
 * 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
 *
 * 本次修改内容:
 * - 【服务端状态管理】集成了 TanStack Query (原 React Query)。
 * - 1. 导入了 `QueryClient` 和 `QueryClientProvider`。
 * - 2. 创建了一个全局唯一的 `queryClient` 实例。
 * - 3. 使用 `<QueryClientProvider>` 包裹了整个路由系统 (`<Router>`)，
 *   使得应用内的所有组件都可以通过 Hooks 访问到这个全局客户端，从而实现统一的服务端状态管理。
 */
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useState, useEffect, lazy} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

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

const TicketDetailMobile = lazy(() => import('./pages/mobile/TicketDetailMobile'));
const ServerDetailMobile = lazy(() => import('./pages/mobile/ServerDetailMobile'));
const ChangelogDetailMobile = lazy(() => import('./pages/mobile/ChangelogDetailMobile'));


const STORAGE_KEY = 'fake_authed';

// 创建一个全局唯一的 TanStack Query 客户端实例
const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
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
                                <Route path="servers/mobile/:serverId" element={<ServerDetailMobile/>}/>

                                <Route path="changelog" element={<Changelog/>}>
                                    <Route path=":logId" element={null}/>
                                </Route>
                                <Route path="changelog/mobile/:logId" element={<ChangelogDetailMobile/>}/>

                                <Route path="inspection-backup" element={<InspectionBackup/>}/>
                                <Route path="tickets" element={<Tickets/>}>
                                    <Route path=":ticketId" element={null}/>
                                </Route>
                                <Route path="tickets/mobile/:ticketId" element={<TicketDetailMobile/>}/>

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
        </QueryClientProvider>
    );
}