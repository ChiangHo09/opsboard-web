/**
 * 文件名: src/contexts/NotificationContext.tsx
 *
 * 文件功能描述:
 * 此文件定义了全局通知上下文，用于在应用各处触发和显示 Snackbar 通知。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `NotificationProvider` 组件的 `React.FC` 写法。
 * - **解决方案**:
 *   1. 为 `NotificationProvider` 的 props 定义了独立的 `NotificationProviderProps` 接口，
 *      并显式地在其中定义了 `children: ReactNode`。
 *   2. 为组件注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import React, {createContext, useState, useContext, useMemo, type ReactNode, type JSX} from 'react';
import {Snackbar, Alert, type AlertColor} from '@mui/material';

interface NotificationState {
    open: boolean;
    message: string;
    severity: AlertColor;
    duration: number | null;
}

type ShowNotification = (message: string, severity?: AlertColor, duration?: number | null) => void;

const NotificationContext = createContext<ShowNotification | undefined>(undefined);

// 【核心修改】为 Provider 的 props 定义一个接口
interface NotificationProviderProps {
    children: ReactNode;
}

// 【核心修改】移除 React.FC，使用现代写法
export const NotificationProvider = ({children}: NotificationProviderProps): JSX.Element => {
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
        setNotification({open: true, message, severity, duration});
    };

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(prev => ({...prev, open: false}));
    };

    const contextValue = useMemo(() => showNotification, []);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={notification.duration}
                onClose={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleClose} severity={notification.severity} sx={{width: '100%'}}>
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