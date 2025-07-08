/*****************************************************************
 *  src/App.tsx
 *  --------------------------------------------------------------
 *  路由结构：
 *    /login                 → <Login />          （无侧栏）
 *    登录后                → <MainLayout />     （含侧栏）
 *       └─ Outlet           → Dashboard / Servers ...
 *    未知路径               → 重定向到 /dashboard
 *****************************************************************/

import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

/* ---------- 页面组件 ---------- */
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Servers    from './pages/Servers'
import Changelog  from './pages/Changelog'
import Tickets    from './pages/Tickets'
import Stats      from './pages/Stats'
import Labs       from './pages/Labs'
import Settings   from './pages/Settings'
import Search     from './pages/Search'

/* ---------- 布局组件 ---------- */
import AppLayout  from './layouts/AppLayout'     // 新增：统一权限控制
import MainLayout from './layouts/MainLayout'

/* ---------- 全局主题 ---------- */
const theme = createTheme({
    typography: {
        fontFamily: `'Roboto','Noto Sans SC','PingFang SC',sans-serif`,
    },
})

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
            <Routes>

                {/* 所有页面都挂在 AppLayout 下，由其判断是否已登录 */}
                <Route element={<AppLayout />}>

                    {/* ① 登录页（不带侧栏） */}
                    <Route path="/login" element={<Login />} />

                    {/* ② 主布局：登录后的所有功能页（带侧栏） */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index            element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="servers"   element={<Servers   />} />
                        <Route path="changelog" element={<Changelog />} />
                        <Route path="tickets"   element={<Tickets   />} />
                        <Route path="stats"     element={<Stats     />} />
                        <Route path="labs"      element={<Labs      />} />
                        <Route path="settings"  element={<Settings  />} />
                        <Route path="search"    element={<Search    />} />
                    </Route>
                </Route>

                {/* ③ 兜底：未知路径重定向 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    </ThemeProvider>
)

export default App
