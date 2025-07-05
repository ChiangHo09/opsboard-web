// src/App.tsx
import React from 'react'
// 路由相关 API 引入
import {
    BrowserRouter as Router, // 给 BrowserRouter 起个别名 Router，使用时更简洁
    Routes,                  // 路由表容器
    Route,                   // 单条路由
    Navigate,                // 重定向组件
} from 'react-router-dom'

// 样式 & 页面组件引入
import './App.css'
import Login from './pages/Login'         // 登录页面
import Dashboard from './pages/Dashboard' // 后台主界面

/**
 * App 组件 —— 描述整站的路由结构
 * ⭐ 不负责挂载根节点，也不直接包裹 ThemeProvider
 */
const App: React.FC = () => (
    // Router 必须包住 Routes，才能启用 HTML5 history 路由
    <Router>
        <Routes>
            {/* ① 访问根路径时渲染登陆页 */}
            <Route path="/" element={<Login />} />

            {/* ② 成功登录后跳转到 /dashboard 渲染后台主界面 */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* ③ 兜底：任何未知路径都重定向到根路径（可防 404） */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
)

export default App
