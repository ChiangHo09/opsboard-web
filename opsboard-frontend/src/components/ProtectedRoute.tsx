/**
 * @file src/components/ProtectedRoute.tsx
 * @description 一个用于保护需要认证才能访问的路由的组件。
 * @modification
 *   - [New File]: 创建此文件以实现路由保护逻辑。
 *   - [Logic]: 组件使用 `useAuth` 钩子来检查认证状态。如果用户未认证，它会将用户重定向到登录页面，并保存他们原本想访问的位置，以便登录后可以重定向回去。
 */
import { type JSX } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = (): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // 保存用户尝试访问的原始位置，以便登录后可以将他们重定向回去。
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;