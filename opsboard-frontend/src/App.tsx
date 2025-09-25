/**
 * @file src/App.tsx
 * @description 此文件是应用的根组件，也是所有全局 Provider 和配置的集成中心。
 * @modification
 *   - [Typo Fix]: 修正了文件末尾处 `</NotificationProvider>` 的拼写错误（之前被错误地写为 `</Notification-provider>`）。
 *   - [Reason]: 此修复解决了由于 JSX 标签大小写不匹配而导致的解析错误。
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
import { useAuth } from '@/hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalErrorFallback from './components/GlobalErrorFallback';
import { ApiError } from './api';

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
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {isAuthenticated ? (
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
                    <Route path="/login" element={<Navigate to="/app/dashboard" replace />} />
                </Route>
            ) : (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            )}
        </Routes>
    );
};

const AppProviders = ({ children }: { children: JSX.Element }): JSX.Element => {
    const showNotification = useNotification();
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error: unknown) => {
                let errorMessage = '数据请求失败，请稍后重试。';
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
    });

    const loadingFallback = (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <QueryClientProvider client={queryClient}>
            <LayoutProvider>
                <Suspense fallback={loadingFallback}>
                    {children}
                </Suspense>
            </LayoutProvider>
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
                            <AppProviders>
                                <AppRoutes />
                            </AppProviders>
                        </AuthProvider>
                    </NotificationProvider>
                </BrowserRouter>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default App;