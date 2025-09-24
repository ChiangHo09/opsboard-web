/**
 * @file src/App.tsx
 * @description 此文件是应用的根组件，也是所有全局 Provider 和配置的集成中心。
 * @modification
 *   - [类型修复]: `onError` 回调中的 `error` 参数类型为 `unknown`。通过使用 `instanceof ApiError` 和 `instanceof Error` 作为类型守卫，我们可以安全地访问 error 对象的属性（如 `status` 和 `message`），从而解决了 `TS18046` 错误。
 *   - [导入修复]: 确保从 `./api` 导入 `ApiError` 的语句能够正常工作，因为 `src/api/index.ts` 现在已修复并能正确导出该类。
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lazy, Suspense, type JSX, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

import theme from './theme';
import { LayoutProvider } from './contexts/LayoutContext';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorFallback from './components/GlobalErrorFallback';
import ProtectedRoute from './components/ProtectedRoute';
import { ApiError } from './api'; // 此导入现在可以正常工作

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

const AppRoutes = (): JSX.Element => {
    const showNotification = useNotification();

    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error: unknown) => {
                let errorMessage = '数据请求失败，请稍后重试。';
                // [类型修复] 使用 `instanceof` 作为类型守卫来安全地处理 `unknown` 类型的错误
                if (error instanceof ApiError) {
                    if (error.status === 401) {
                        localStorage.removeItem('token');
                        window.location.assign('/login');
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
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<AppLayout />}>
                            <Route index element={<Navigate to="/app/dashboard" replace />} />
                            <Route path="app" element={<MainLayout />}>
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="servers" element={<Servers />} />
                                <Route path="servers/:serverId" element={<Servers />} />
                                <Route path="servers/mobile/:serverId" element={<ServerDetailMobile />} />
                                <Route path="changelog" element={<Changelog />} />
                                <Route path="changelog/:logId" element={<Changelog />} />
                                <Route path="changelog/mobile/:logId" element={<ChangelogDetailMobile />} />
                                <Route path="inspection-backup" element={<InspectionBackup />} />
                                <Route path="tickets" element={<Tickets />} />
                                <Route path="tickets/:ticketId" element={<Tickets />} />
                                <Route path="tickets/mobile/:ticketId" element={<TicketDetailMobile />} />
                                <Route path="stats" element={<Stats />} />
                                <Route path="labs" element={<Labs />} />
                                <Route path="search" element={<Search />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="template-page" element={<TemplatePage />} />
                                <Route path="template-page/:itemId" element={<TemplatePage />} />
                                <Route path="template-page/mobile/:itemId" element={<TemplateDetailMobile />} />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </QueryClientProvider>
    );
};

const App = (): JSX.Element => {
    useEffect(() => {
        if (navigator.userAgent.includes('Mac')) {
            document.body.classList.add('platform-mac');
        }
    }, []);

    return (
        <ErrorBoundary fallback={<GlobalErrorFallback />}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <NotificationProvider>
                        <AuthProvider>
                            <LayoutProvider>
                                <AppRoutes />
                            </LayoutProvider>
                        </AuthProvider>
                    </NotificationProvider>
                </BrowserRouter>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default App;