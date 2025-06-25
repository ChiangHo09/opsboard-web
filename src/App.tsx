// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const App: React.FC = () => (
    <Router>
        <Routes>
            {/* 根路径永远显示登录页 */}
            <Route path="/" element={<Login />} />

            {/* 登录后跳转到 /dashboard 显示后台页面 */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 兜底：其他任何路由都重定向到登录 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
)

export default App
