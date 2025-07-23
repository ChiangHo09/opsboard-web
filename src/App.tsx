/*
 * 文件名: src/App.tsx
 *
 * 代码功能:
 * 此文件是应用的根组件和主路由配置文件。
 * 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
 *
 * 本次修改内容:
 * - 【核心问题修复】解决了从列表页点击进入详情时，弹窗不出现的问题。
 * - 问题原因：之前的路由配置中，`index` 和 `:param` 两个子路由都渲染了同一个组件，导致路由切换时组件被完全卸载和重新挂载，使得弹窗状态更新失败。
 * - 解决方案：采用“布局路由”模式。父路由（例如 `path="servers"`）负责渲染组件本身，而子路由（例如 `path=":serverId"`）仅用于匹配 URL 参数，但其 `element` 设置为 `null`。
 * - 这样可以确保在 URL 变化时，页面组件实例保持挂载状态，不会被重新创建，从而让 `useEffect` 能够正确地更新弹窗状态。
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* ---- MUI Provider ---- */
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* ---- 日期本地化 ---- */
import { zhCN as pickersZhCN } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

/* ---- 自定义主题 ---- */
import theme from './theme';

/* ---- 页面组件 ---- */
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Changelog from './pages/Changelog';
import InspectionBackup from './pages/InspectionBackup';
import Tickets from './pages/Tickets';
import Stats from './pages/Stats';
import Labs from './pages/Labs';
import Settings from './pages/Settings';
import Search from './pages/Search';
import HoneypotInfo from './pages/HoneypotInfo';
import MainLayout from './layouts/MainLayout';

const STORAGE_KEY = 'fake_authed';

// 全局设置 dayjs 使用中文，一次即可
dayjs.locale('zh-cn');

export default function App() {
    /* ------------- 简易登录状态（示例用） ------------- */
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
                        {/* 登录页（公开） */}
                        <Route path="/" element={<Login onFakeLogin={fakeLogin} />} />
                        <Route path="/honeypot-info" element={<HoneypotInfo />} />

                        {/* 后台（受保护） */}
                        <Route
                            path="/app"
                            element={authed
                                ? <MainLayout onFakeLogout={fakeLogout} />
                                : <Navigate to="/" replace />}
                        >
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard"         element={<Dashboard />} />

                            {/* 【修复】将 Servers 组件作为布局路由，确保它不会在子路由切换时重新挂载 */}
                            <Route path="servers" element={<Servers />}>
                                {/* 子路由只负责匹配 URL 参数，不渲染任何内容 */}
                                <Route path=":serverId" element={null} />
                            </Route>

                            {/* 【修复】对 Changelog 应用相同的修复模式 */}
                            <Route path="changelog" element={<Changelog />}>
                                <Route path=":logId" element={null} />
                            </Route>

                            <Route path="inspection-backup" element={<InspectionBackup />} />
                            <Route path="tickets"           element={<Tickets />} />
                            <Route path="stats"             element={<Stats />} />
                            <Route path="labs"              element={<Labs />} />
                            <Route path="settings"          element={<Settings />} />
                            <Route path="search"            element={<Search />} />
                            <Route path="*"                 element={<Navigate to="dashboard" replace />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </LocalizationProvider>
        </ThemeProvider>
    );
}