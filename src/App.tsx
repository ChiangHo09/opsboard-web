/**
 * 文件名: src/App.tsx
 *
 * 本次修改内容:
 * - 【代码对齐 & 问题修复】根据您提供的原始代码结构，进行了最终的修正。
 * - **修复 ESLint 错误**: 彻底移除了不符合 ES Module 规范的 `require()` 语法。
 *   `import 'dayjs/locale/zh-cn'` 和 `dayjs.locale('zh-cn')` 已经是正确的全局本地化方式。
 * - **修复 TS2345 错误**: 移除了之前错误添加的 `dayjs.locale()` 调用中的 `null` 参数，该参数不符合类型定义。
 * - **遵循原始设计**: `LocalizationProvider` 的配置现在完全遵循您提供的代码，
 *   日期格式化 (dateFormats) 的职责交由传入的自定义 `theme` 对象处理，此处不再配置。
 *
 * 文件功能描述:
 * 此文件是应用的根组件和主路由配置文件。
 * 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
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

                            {/* 更新 servers 路由以支持详情页 */}
                            <Route path="servers">
                                <Route index element={<Servers />} />
                                <Route path=":serverId" element={<Servers />} />
                            </Route>

                            {/* 更新 changelog 路由以支持详情页 */}
                            <Route path="changelog">
                                <Route index element={<Changelog />} />
                                <Route path=":logId" element={<Changelog />} />
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