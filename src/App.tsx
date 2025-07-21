/**
 * 文件名：src/App.tsx
 * 功能：应用根组件 + 路由
 * 仅保留必要代码，未再改动配色/间距。
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

/* ---- 自定义主题：仅含 Date-Picker 格式 ---- */
import theme from './theme';

/* ---- 页面组件（省略 import 与之前一致） ---- */
import Login            from './pages/Login';
import Dashboard        from './pages/Dashboard';
import Servers          from './pages/Servers';
import Changelog        from './pages/Changelog';
import InspectionBackup from './pages/InspectionBackup';
import Tickets          from './pages/Tickets';
import Stats            from './pages/Stats';
import Labs             from './pages/Labs';
import Settings         from './pages/Settings';
import Search           from './pages/Search';
import HoneypotInfo     from './pages/HoneypotInfo';
import MainLayout       from './layouts/MainLayout';

const STORAGE_KEY = 'fake_authed';
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
                /* 这里的 dateFormats 只填合法键，不再造成视觉差异 */
                dateFormats={{
                    normalDate: 'MM月DD日',
                    shortDate:  'MM月DD日',
                    month:      'MM月',
                    monthShort: 'MM月',
                    year:       'YYYY年',
                }}
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
                            <Route path="servers"           element={<Servers />} />
                            <Route path="servers/:serverId" element={<Servers />} />
                            <Route path="changelog"         element={<Changelog />} />
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
