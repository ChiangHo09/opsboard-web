/**
 * 文件名: src/layouts/AppLayout.tsx
 *
 * 文件功能描述:
 * 此文件定义了全局权限判断的布局容器。它的核心职责是检查用户的登录状态（例如，通过 token），
 * 并根据此状态以及当前的路由路径，决定是渲染子路由（如 MainLayout）、重定向到登录页，
 * 还是直接放行（如访问登录页本身）。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import type {JSX} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';

// 【核心修改】移除 React.FC，添加 : JSX.Element 返回值类型
const AppLayout = (): JSX.Element => {
    const location = useLocation();
    const token = localStorage.getItem('token'); // 或者从 context 获取

    // 放行登录页
    if (location.pathname === '/login') {
        return <Outlet/>;
    }

    // 未登录时强制跳转登录页
    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    // 已登录，正常渲染子页面（MainLayout）
    return <Outlet/>;
};

export default AppLayout;