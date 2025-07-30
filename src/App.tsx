/**
 * 文件名: src/App.tsx
 *
 * 文件功能描述:
 * 此文件是应用的根组件，也是所有全局 Provider 和配置的集成中心。
 * 它负责设置 React Router、TanStack Query、MUI 主题、全局通知系统，
 * 以及最重要的——全局错误边界，以确保应用的整体稳定性和一致性。
 *
 * 本次修改内容:
 * - 【TS 类型终极修复】根据 TanStack Query v5 的 API 规范，修正了全局错误处理的配置方式。
 * - **问题根源**:
 *   在 TanStack Query v5 中，`onError` 回调已从 `defaultOptions` 中移除。
 * - **解决方案**:
 *   1.  导入 `QueryCache`。
 *   2.  在创建 `QueryClient` 时，为其传递一个 `queryCache` 选项。
 *   3.  `queryCache` 的值是一个新的 `QueryCache` 实例，并将全局的 `onError` 回调函数配置在其构造函数中。
 * - **最终效果**:
 *   代码现在完全符合 TanStack Query v5 的 API，所有 TypeScript 错误均已解决。
 */
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
// 【核心修复】导入 QueryCache
import {QueryClient, QueryClientProvider, QueryCache} from '@tanstack/react-query';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme';
import {LayoutProvider, useLayoutDispatch} from './contexts/LayoutContext';
import {NotificationProvider, useNotification} from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorFallback from './components/GlobalErrorFallback';
import {ApiError} from './api';

import AppLayout from './layouts/AppLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Changelog from './pages/Changelog';
import InspectionBackup from './pages/InspectionBackup';
import Tickets from './pages/Tickets';
import Stats from './pages/Stats';
import Labs from './pages/Labs';
import Search from './pages/Search';
import Settings from './pages/Settings';
import TemplatePage from './pages/TemplatePage';

import ServerDetailMobile from './pages/mobile/ServerDetailMobile';
import ChangelogDetailMobile from './pages/mobile/ChangelogDetailMobile';
import TicketDetailMobile from './pages/mobile/TicketDetailMobile';
import TemplateDetailMobile from './pages/mobile/TemplateDetailMobile';


// 这是一个内部组件，用于访问在 Provider 树中定义的 hooks
const AppLogic: React.FC = () => {
    const showNotification = useNotification();
    const {closePanel} = useLayoutDispatch();

    const handleFakeLogin = () => localStorage.setItem('token', 'fake-token');
    const handleFakeLogout = () => {
        localStorage.removeItem('token');
        closePanel();
        window.location.href = '/login';
    };

    // 【核心修复】使用 QueryCache 来配置全局 onError 回调
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error: unknown) => {
                let errorMessage = '数据请求失败，请稍后重试。';
                if (error instanceof ApiError) {
                    if (error.status === 401) {
                        showNotification('会话已过期，请重新登录。', 'error');
                        handleFakeLogout();
                        return;
                    }
                    errorMessage = `请求错误: ${error.message} (状态码: ${error.status})`;
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }
                showNotification(errorMessage, 'error');
            },
        }),
        defaultOptions: {
            queries: {
                retry: false, // 仍然可以在这里设置其他默认选项
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/login" element={<Login onFakeLogin={handleFakeLogin}/>}/>
                <Route path="/" element={<AppLayout/>}>
                    <Route index element={<Navigate to="/app/dashboard" replace/>}/>
                    <Route path="app" element={<MainLayout onFakeLogout={handleFakeLogout}/>}>
                        <Route path="dashboard" element={<Dashboard/>}/>
                        <Route path="servers" element={<Servers/>}/>
                        <Route path="servers/:serverId" element={<Servers/>}/>
                        <Route path="servers/mobile/:serverId" element={<ServerDetailMobile/>}/>
                        <Route path="changelog" element={<Changelog/>}/>
                        <Route path="changelog/:logId" element={<Changelog/>}/>
                        <Route path="changelog/mobile/:logId" element={<ChangelogDetailMobile/>}/>
                        <Route path="inspection-backup" element={<InspectionBackup/>}/>
                        <Route path="tickets" element={<Tickets/>}/>
                        <Route path="tickets/:ticketId" element={<Tickets/>}/>
                        <Route path="tickets/mobile/:ticketId" element={<TicketDetailMobile/>}/>
                        <Route path="stats" element={<Stats/>}/>
                        <Route path="labs" element={<Labs/>}/>
                        <Route path="search" element={<Search/>}/>
                        <Route path="settings" element={<Settings/>}/>
                        <Route path="template-page" element={<TemplatePage/>}/>
                        <Route path="template-page/:itemId" element={<TemplatePage/>}/>
                        <Route path="template-page/mobile/:itemId" element={<TemplateDetailMobile/>}/>
                    </Route>
                </Route>
            </Routes>
        </QueryClientProvider>
    );
};


const App: React.FC = () => {
    return (
        <ErrorBoundary fallback={<GlobalErrorFallback/>}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter>
                    <LayoutProvider>
                        <NotificationProvider>
                            <AppLogic/>
                        </NotificationProvider>
                    </LayoutProvider>
                </BrowserRouter>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default App;