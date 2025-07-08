/*****************************************************************
 *  src/layouts/AppLayout.tsx
 *  --------------------------------------------------------------
 *  全局权限判断容器（登录态判断）
 *    - 若未登录：强制跳转到 /login
 *    - 若访问 /login：直接放行
 *    - 其他路径：放行并显示子路由
 *****************************************************************/

import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const AppLayout: React.FC = () => {
    const location = useLocation()
    const token = localStorage.getItem('token')  // 或者从 context 获取

    // 放行登录页
    if (location.pathname === '/login') {
        return <Outlet />
    }

    // 未登录时强制跳转登录页
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // 已登录，正常渲染子页面（MainLayout）
    return <Outlet />
}

export default AppLayout
