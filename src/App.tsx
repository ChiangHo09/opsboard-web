/**
 * 文件名: src/App.tsx
 *
 * 本次修改内容:
 * - 【路由更新】为了支持服务器详情页面，将原本的 "servers" 路由修改为嵌套路由。
 * - `Route path="servers"` 现在不再直接渲染组件，而是作为父路由。
 * - 在其内部，添加了两个子路由：
 *   1. `<Route index ... />`: 当访问 `/app/servers` 时，默认渲染 `<Servers />` 组件来显示列表。
 *   2. `<Route path=":serverId" ... />`: 当访问 `/app/servers/具体ID` 时，也渲染 `<Servers />` 组件。
 *      该组件内部会通过 `useParams` 钩子捕获 `:serverId`，并根据该 ID 显示详情视图。
 *
 * 文件功能描述:
 * 此文件是应用的根组件和主路由配置文件。
 * 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* 页面 */
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

/* 布局：后台主框架（侧栏 + 顶栏 + <Outlet/>）*/
import MainLayout from './layouts/MainLayout';

const STORAGE_KEY = 'fake_authed'; // ← localStorage 里的标记位

export default function App() {
    /* 把登录状态存在 localStorage，刷新也能记住 */
    const [authed, setAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');

    /* 登录 / 退出 两个方法传给子组件用 */
    const fakeLogin = () => { localStorage.setItem(STORAGE_KEY, '1'); setAuthed(true); };
    const fakeLogout = () => { localStorage.removeItem(STORAGE_KEY); setAuthed(false); };

    /* 退出按钮：监听 route 中的 "?logout" (可选) */
    useEffect(() => {
        if (location.search.includes('logout')) fakeLogout();
    }, []);

    return (
        <Router>
            <Routes>
                {/* 根路径：永远显示登录页（把 fakeLogin 方法作为 prop 传下去） */}
                <Route path="/" element={<Login onFakeLogin={fakeLogin} />} />
                <Route path="/honeypot-info" element={<HoneypotInfo />} />

                {/* 受保护的后台路由：必须 authed 才能访问 */}
                <Route
                    path="/app" // 【修改】移除 "/*" 以支持嵌套路由
                    element={
                        authed ? (
                            <MainLayout onFakeLogout={fakeLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                >
                    {/* 添加默认子路由，/app 会自动导航到 /app/dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />

                    <Route path="dashboard" element={<Dashboard />} />

                    {/* 【核心修改】将 servers 路由改为嵌套形式 */}
                    <Route path="servers">
                        <Route index element={<Servers />} />
                        <Route path=":serverId" element={<Servers />} />
                    </Route>

                    <Route path="changelog" element={<Changelog />} />
                    <Route path="inspection-backup" element={<InspectionBackup />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="labs" element={<Labs />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="search" element={<Search />} />
                    {/* 未匹配的后台路径 → 仪表盘 */}
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* 兜底：任何未知路径都去登录页 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}