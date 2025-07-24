/**
 * 文件名: src/App.tsx
 *
 * 代码功能:
 * 此文件是应用的根组件和主路由配置文件。
 * 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
 *
 * 本次修改内容:
 * - 【懒加载重构】修复了因错误的组件嵌套导致的 TS2322 类型错误。
 * - **解决方案**:
 *   1.  移除了之前创建的 `AppLayout` 包装组件。
 *   2.  路由配置中的 `element` 现在直接渲染 `<MainLayout />` 组件，不再向其传递任何 `children`。
 *   3.  `React.Suspense` 的逻辑被正确地移入了 `MainLayout.tsx` 内部，由它自己负责处理懒加载子路由的等待状态。
 * - **最终效果**: 路由配置更加简洁清晰，修复了类型错误，并以更健壮的方式实现了路由懒加载。
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy } from 'react'; // 【核心修复】移除 Suspense, Outlet 的导入

/* ---- MUI Provider & Components ---- */
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* ---- 日期本地化 ---- */
import { zhCN as pickersZhCN } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

/* ---- 自定义主题 ---- */
import theme from './theme';

/* ---- 布局与非懒加载页面 ---- */
import MainLayout from './layouts/MainLayout'; // MainLayout 现在自己处理 Suspense
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

const STORAGE_KEY = 'fake_authed';

dayjs.locale('zh-cn');

// 【核心修复】移除 AppLayout 包装器

export default function App() {
    const [authed, setAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');
    const fakeLogin  = () => { localStorage.setItem(STORAGE_KEY, '1'); setAuthed(true); };
    const fakeLogout = () => { localStorage.removeItem(STORAGE_KEY); setAuthed(false); };

    useEffect(() => { if (location.search.includes('logout')) fakeLogout(); }, []);

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="zh-cn"
                localeText={pickersZhCN.components.MuiLocalizationProvider.defaultProps.localeText}
            >
                <Router>
                    <Routes>
                        <Route path="/" element={<Login onFakeLogin={fakeLogin} />} />
                        <Route path="/honeypot-info" element={<HoneypotInfo />} />

                        {/* 【核心修复】路由 element 直接渲染 MainLayout，不再需要包装器 */}
                        <Route
                            path="/app"
                            element={authed
                                ? <MainLayout onFakeLogout={fakeLogout} />
                                : <Navigate to="/" replace />}
                        >
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="servers" element={<Servers />}>
                                <Route path=":serverId" element={null} />
                            </Route>
                            <Route path="changelog" element={<Changelog />}>
                                <Route path=":logId" element={null} />
                            </Route>
                            <Route path="inspection-backup" element={<InspectionBackup />} />
                            <Route path="tickets" element={<Tickets />} />
                            <Route path="stats" element={<Stats />} />
                            <Route path="labs" element={<Labs />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="search" element={<Search />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </LocalizationProvider>
        </ThemeProvider>
    );
}