/*****************************************************************
 *  src/App.tsx
 *  --------------------------------------------------------------
 *  负责描述整站路由结构（只管“页面怎么切换”）。
 *  - 主题 / 挂载等全局工作已移到 main.tsx，
 *    这里无需再引入 ThemeProvider / CssBaseline。
 *  - 每条 Route 及其注释都保持原有业务逻辑，
 *    只是把多余 import / 主题代码删掉，以免重复包裹。
 *****************************************************************/

/* ---------- React 类型 ---------- */
import type { FC } from 'react'  // 仅作类型引用，无运行时代码

/* ---------- React-Router 核心 ---------- */
import {
    BrowserRouter as Router, // 给 BrowserRouter 起别名 Router，使用更直观
    Routes,                  // 路由表容器
    Route,                   // 单条路由
    Navigate,                // 重定向组件
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
import Search     from './pages/Search'

/* ---------- 布局组件 ---------- */
import AppLayout  from './layouts/AppLayout'   // 负责鉴权：已登录？→ MainLayout，否则跳 /login
import MainLayout from './layouts/MainLayout'  // 登录后主框架（含侧栏 + 顶栏 + <Outlet>）

/**
 * App 组件 —— 只描述路由，不处理挂载 & 主题
 * 🌟 若需修改导航逻辑，只需改这里即可
 */
const App: FC = () => (
    <Router>
        <Routes>

            {/* ------ 统一挂载到 AppLayout：判断是否已登录 ------ */}
            <Route element={<AppLayout />}>

                {/* ① 登录页（无侧栏）*/}
                <Route path="/login" element={<Login />} />

                {/* ② 主布局：登录后的业务页面（含侧栏）*/}
                <Route path="/" element={<MainLayout />}>
                    {/* index 重定向到 /dashboard */}
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

            {/* ③ 兜底：任何未知路径都重定向到 /dashboard（或按需改 /login）*/}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </Router>
)

export default App
