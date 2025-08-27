/**
 * @file src/App.tsx
 * @description 此文件是应用的根组件，也是所有全局 Provider 和配置的集成中心。
 * @modification
 *   - [UI/UX]：修复了应用首次启动时，初始加载动画和路由懒加载动画之间的“闪烁”问题。
 *   - [原因]：之前的实现中，顶层的布局“外壳”组件（如 `AppLayout`）被懒加载。这导致在初始HTML动画结束后，React `Suspense`会因等待加载布局外壳的代码而立即显示另一个加载动画，造成视觉上的闪烁。
 *   - [解决方案]：将渲染首屏所必需的顶层布局组件 `Login` 和 `AppLayout` 从 `React.lazy()` 动态导入改回静态导入。
 *   - [最终效果]：现在，当初始加载动画消失时，无论是登录页还是已登录页面的基础布局都可以被立即渲染，无需等待，彻底解决了首次加载时的闪烁问题。应用内部的深层页面继续保持懒加载以优化性能。
 */
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {QueryClient, QueryClientProvider, QueryCache} from '@tanstack/react-query';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lazy, Suspense, type JSX } from 'react';
import { Box, CircularProgress } from '@mui/material';

import theme from './theme';
import {LayoutProvider, useLayoutDispatch} from './contexts/LayoutContext';
import {NotificationProvider, useNotification} from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorFallback from './components/GlobalErrorFallback';
import {ApiError} from './api';

// 【核心修改】将顶层布局“外壳”组件改为静态导入
import Login from './pages/Login';
import AppLayout from './layouts/AppLayout';

// 其他非首屏的、深层次的布局和页面组件继续使用 React.lazy 进行代码分割
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Servers = lazy(() => import('./pages/Servers'));
const Changelog = lazy(() => import('./pages/Changelog'));
const InspectionBackup = lazy(() => import('./pages/InspectionBackup'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Stats = lazy(() => import('./pages/Stats'));
const Labs = lazy(() => import('./pages/Labs'));
const Search = lazy(() => import('./pages/Search'));
const Settings = lazy(() => import('./pages/Settings'));
const TemplatePage = lazy(() => import('./pages/TemplatePage'));
const ServerDetailMobile = lazy(() => import('./pages/mobile/ServerDetailMobile'));
const ChangelogDetailMobile = lazy(() => import('./pages/mobile/ChangelogDetailMobile'));
const TicketDetailMobile = lazy(() => import('./pages/mobile/TicketDetailMobile'));
const TemplateDetailMobile = lazy(() => import('./pages/mobile/TemplateDetailMobile'));


const AppLogic = (): JSX.Element => {
    const showNotification = useNotification();
    const {closePanel} = useLayoutDispatch();

    const handleFakeLogin = () => sessionStorage.setItem('token', 'fake-token');
    const handleFakeLogout = () => {
        sessionStorage.removeItem('token');
        closePanel();
        window.location.href = '/login';
    };

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
                retry: false,
            },
        },
    });

    // 定义一个通用的加载后备UI，用于 Suspense
    const loadingFallback = (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <QueryClientProvider client={queryClient}>
            {/* Suspense 现在只处理懒加载的深层路由 */}
            <Suspense fallback={loadingFallback}>
                <Routes>
                    {/* Login 和 AppLayout 路由现在可以被立即渲染，不会触发 Suspense */}
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
            </Suspense>
        </QueryClientProvider>
    );
};

const App = (): JSX.Element => {
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