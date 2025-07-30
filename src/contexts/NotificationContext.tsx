/**
 * 文件名: src/contexts/NotificationContext.tsx
 *
 * 文件功能描述:
 * 此文件定义了全局通知上下文（NotificationContext），用于在应用的任何地方
 * 触发和显示轻量级的 Snackbar (或 Toast) 通知。它封装了通知的状态管理
 * 和MUI Snackbar组件的渲染，提供一个简单的 `showNotification` 函数供其他组件调用。
 *
 * 本次修改内容:
 * - 【TS Lint 修复】修复了 TS6133 错误（'event' is declared but its value is never read）。
 * - **解决方案**: 将 `handleClose` 函数中未使用的 `event` 参数重命名为 `_event`，
 *   这是 TypeScript/ESLint 中处理有意未使用的参数的标准惯例。
 */
import React, { createContext, useState, useContext, useMemo, type ReactNode, type FC } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';

interface NotificationState {
    open: boolean;
    message: string;
    severity: AlertColor;
    duration: number | null;
}

type ShowNotification = (message: string, severity?: AlertColor, duration?: number | null) => void;

const NotificationContext = createContext<ShowNotification | undefined>(undefined);

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info',
        duration: 4000,
    });

    const showNotification = (
        message: string,
        severity: AlertColor = 'error',
        duration: number | null = 4000
    ) => {
        setNotification({ open: true, message, severity, duration });
    };

    // 【核心修复】将未使用的 event 参数重命名为 _event
    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(prev => ({ ...prev, open: false }));
    };

    const contextValue = useMemo(() => showNotification, []);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={notification.duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = (): ShowNotification => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification 必须在 NotificationProvider 内部使用');
    }
    return context;
};