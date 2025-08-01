/**
 * @file src/layouts/AppLayout.tsx
 * @description 此文件定义了全局权限判断的布局容器。它的核心职责是检查用户的登录状态。
 * @modification 实现了每次打开浏览器都需重新登录的功能。
 *   - [核心修改]：将 token 的读取来源从 `localStorage` 更改为 `sessionStorage`。
 *   - [原因]：`sessionStorage` 中的数据在浏览器关闭后会被清除，因此下次打开时 `getItem` 将返回 `null`，从而触发重定向到登录页的逻辑。
 */
import type {JSX} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';

const AppLayout = (): JSX.Element => {
    const location = useLocation();
    // 核心修改：使用 sessionStorage 替代 localStorage
    const token = sessionStorage.getItem('token');

    if (location.pathname === '/login') {
        return <Outlet/>;
    }

    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
};

export default AppLayout;