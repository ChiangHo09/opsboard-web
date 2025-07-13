/*
 * [文件用途说明]
 * - 此文件是应用的根组件和主路由配置文件。
 * - 它负责管理用户的登录状态，并根据该状态决定渲染登录页面还是受保护的主应用布局。
 *
 * [本次修改记录]
 * - 导入了新的 `InspectionBackup` 页面组件。
 * - 在 `/app/*` 的受保护路由下，添加了一条新的子路由配置 `<Route path="inspection-backup" ... />`，
 *   以将侧边栏中新增的导航项与其实际页面关联起来。
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

/* 页面 */
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Servers from './pages/Servers'
import Changelog from './pages/Changelog'
import InspectionBackup from './pages/InspectionBackup' // <- 新增页面导入
import Tickets from './pages/Tickets'
import Stats from './pages/Stats'
import Labs from './pages/Labs'
import Settings from './pages/Settings'
import Search from './pages/Search'
import HoneypotInfo from './pages/HoneypotInfo'

/* 布局：后台主框架（侧栏 + 顶栏 + <Outlet/>）*/
import MainLayout from './layouts/MainLayout'

const STORAGE_KEY = 'fake_authed' // ← localStorage 里的标记位

export default function App() {
    /* 把登录状态存在 localStorage，刷新也能记住 */
    const [authed, setAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

    /* 登录 / 退出 两个方法传给子组件用 */
    const fakeLogin = () => { localStorage.setItem(STORAGE_KEY, '1'); setAuthed(true) }
    const fakeLogout = () => { localStorage.removeItem(STORAGE_KEY); setAuthed(false) }

    /* 退出按钮：监听 route 中的 "?logout" (可选) */
    useEffect(() => {
        if (location.search.includes('logout')) fakeLogout()
    }, [])

    return (
        <Router>
            <Routes>
                {/* 根路径：永远显示登录页（把 fakeLogin 方法作为 prop 传下去） */}
                <Route path="/" element={<Login onFakeLogin={fakeLogin} />} />
                <Route path="/honeypot-info" element={<HoneypotInfo />} />

                {/* 受保护的后台路由：必须 authed 才能访问 */}
                <Route
                    path="/app/*"
                    element={
                        authed ? (
                            <MainLayout onFakeLogout={fakeLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="servers" element={<Servers />} />
                    <Route path="changelog" element={<Changelog />} />
                    <Route path="inspection-backup" element={<InspectionBackup />} /> {/* <- 新增路由配置 */}
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
    )
}