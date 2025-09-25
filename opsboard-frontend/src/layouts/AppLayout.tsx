/**
 * @file src/layouts/AppLayout.tsx
 * @description 应用的核心布局框架，通常包含 Outlet 用于渲染子路由。
 * @modification
 *   - [New File]: 创建此文件以提供一个健壮的、无副作用的 AppLayout 实现。
 *   - [Bug Fix]: 解决了 "Maximum update depth exceeded" 错误。此实现确保了组件内没有任何会导致无限重渲染循环的 `useEffect`。
 *   - [Best Practice]: 组件被简化为一个纯粹的布局容器，只负责通过 `<Outlet />` 渲染当前匹配的子路由，将所有复杂的逻辑和状态管理交给子路由或全局上下文。
 */
import { type JSX } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

/**
 * AppLayout 是应用认证后所有页面的顶层布局容器。
 * 它的主要职责是通过 React Router 的 `<Outlet />` 组件
 * 来渲染当前 URL 匹配到的子路由。
 *
 * 这个组件被设计为无状态、无副作用的，以避免渲染循环。
 */
const AppLayout = (): JSX.Element => {
    // 之前可能存在问题的 useEffect 已被移除。
    // 布局组件通常不应该包含复杂的、可能触发重渲染的副作用。
    // 如果需要根据路由变化执行操作，这些逻辑应该放在具体的页面组件
    // 或专门的自定义钩子中，并使用正确的依赖项数组。

    return (
        <Box sx={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* Outlet 是 React Router 的核心组件，
                它会在此处渲染匹配到的子路由组件
                (例如 MainLayout, Dashboard 等)。 */}
            <Outlet />
        </Box>
    );
};

export default AppLayout;