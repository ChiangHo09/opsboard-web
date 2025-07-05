/*****************************************************************
 *  src/App.tsx
 *  --------------------------------------------------------------
 *  负责描述整站路由结构：
 *    ① /login                 → <Login />               （无侧栏）
 *    ② /、/dashboard…         → <MainLayout />
 *         └─ Outlet           → 各业务页面组件
 *    ③ 任何未知路径           → 重定向到 /
 *****************************************************************/

import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

/* --------- 页面组件 --------- */
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Servers    from './pages/Servers'
import Changelog  from './pages/Changelog'
import Tickets    from './pages/Tickets'
import Stats      from './pages/Stats'
import Labs       from './pages/Labs'
import Settings   from './pages/Settings'

/* --------- 布局组件（左侧侧栏 + 右侧内容 + 动画） --------- */
import MainLayout from './layouts/MainLayout'

const App: React.FC = () => (
    <Router>
        <Routes>
            {/* ① 登录页：单独路由，不显示侧边栏 */}
            <Route path="/login" element={<Login />} />

            {/* ② 主布局：带侧边栏的所有业务页面都写在这里 */}
            <Route path="/" element={<MainLayout />}>
                {/* index == “/” → 默认仪表盘 */}
                <Route index            element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="servers"   element={<Servers   />} />
                <Route path="changelog" element={<Changelog />} />
                <Route path="tickets"   element={<Tickets   />} />
                <Route path="stats"     element={<Stats     />} />
                <Route path="labs"      element={<Labs      />} />
                <Route path="settings"  element={<Settings  />} />
            </Route>

            {/* ③ 兜底：所有未知路径重定向到根路径 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
)

export default App
