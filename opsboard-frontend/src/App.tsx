/**
 * @file src/App.tsx
 * @description 此文件是应用的根组件，也是所有全局 Provider 和配置的集成中心。
 * @modification
 *   - [平台适配]：新增了一个 `useEffect`，用于在应用加载时检测当前操作系统。如果检测到是 macOS，则为 `document.body` 添加一个 `platform-mac` CSS 类。
 *   - [原因]：这是为了配合在全局 CSS (`index.css`) 中定义的平台特定样式。通过这种方式，我们可以为 macOS 浏览器提供专属的样式覆盖（如修复涟漪动画），而完全不影响其他平台，也避免了在动态主题中进行平台判断可能引发的重渲染问题。
 */
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {QueryClient, QueryClientProvider, QueryCache} from '@tanstack/react-query';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lazy, Suspense, type JSX, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

import theme from './theme';
import {LayoutProvider, useLayoutDispatch} from './contexts/LayoutContext';
import {NotificationProvider, useNotification} from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorFallback from './components/GlobalErrorFallback';
import {ApiError} from './api';

import Login from './pages/Login';
import AppLayout from './layouts/AppLayout';

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

    const loadingFallback = (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={loadingFallback}>
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
            </Suspense>
        </QueryClientProvider>
    );
};

const App = (): JSX.Element => {
    // [核心修复] 在应用加载时，进行一次平台检测
    useEffect(() => {
        // 通过 navigator.userAgent 检查字符串中是否包含 'Mac'
        if (navigator.userAgent.includes('Mac')) {
            // 如果是 macOS，则为 body 元素添加一个 CSS 类
            document.body.classList.add('platform-mac');
        }
        // 空依赖数组 [] 确保此 effect 仅在组件首次挂载时运行一次
    }, []);

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