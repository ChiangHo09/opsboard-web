/*****************************************************************
 *  src/App.tsx
 *  --------------------------------------------------------------
 *  路由结构：
 *    /login                 → <Login />          （无侧栏）
 *    其余所有业务路径       → <MainLayout />
 *       └─ Outlet           → Dashboard / Servers ...
 *    未知路径               → 重定向到 /
 *****************************************************************/

import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

/* ---------- 页面组件 ---------- */
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Servers    from './pages/Servers'
import Changelog  from './pages/Changelog'
import Tickets    from './pages/Tickets'
import Stats      from './pages/Stats'
import Labs       from './pages/Labs'
import Settings   from './pages/Settings'
import Search     from './pages/Search'        // 新增：搜索页

/* ---------- 布局组件 ---------- */
import MainLayout from './layouts/MainLayout'

const App: React.FC = () => (
    <Router>
        <Routes>
            {/* ① 登录页（不带侧栏） */}
            <Route path="/login" element={<Login />} />

            {/* ② 主布局：不加 path，匹配除 /login 外的所有子路由 */}
            <Route element={<MainLayout />}>
                {/* index == '/' → 默认仪表盘 */}
                <Route index            element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="servers"   element={<Servers   />} />
                <Route path="changelog" element={<Changelog />} />
                <Route path="tickets"   element={<Tickets   />} />
                <Route path="stats"     element={<Stats     />} />
                <Route path="labs"      element={<Labs      />} />
                <Route path="settings"  element={<Settings  />} />
                <Route path="search"    element={<Search    />} />
            </Route>

            {/* ③ 兜底：未知路径重定向到根路径 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
)

export default App
