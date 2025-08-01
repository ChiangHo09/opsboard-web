/**
 * @file src/App.tsx
 * @description 此文件是应用的根组件，也是所有全局 Provider 和配置的集成中心。
 * @modification 实现了每次打开浏览器都需重新登录的功能。
 *   - [核心修改]：在 `handleFakeLogin` 和 `handleFakeLogout` 函数中，将 token 的存储目标从 `localStorage` 更改为 `sessionStorage`。
 *   - [原因]：`sessionStorage` 的生命周期与浏览器会话绑定，关闭浏览器后数据自动清除，从而强制用户在下一次访问时必须重新登录。
 */
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
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
import type { JSX } from 'react';


const AppLogic = (): JSX.Element => {
    const showNotification = useNotification();
    const {closePanel} = useLayoutDispatch();

    // 核心修改：使用 sessionStorage 替代 localStorage
    const handleFakeLogin = () => sessionStorage.setItem('token', 'fake-token');
    const handleFakeLogout = () => {
        // 核心修改：使用 sessionStorage 替代 localStorage
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