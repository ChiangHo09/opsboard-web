/**
 * @file src/contexts/AuthContext.tsx
 * @description 提供了全局认证状态管理，并集成了闲置超时自动登出功能。
 * @modification
 *   - [Code Quality]: 修正了 `login` 函数中 `catch` 块的错误处理类型。将捕获的 `err` 变量视为 `unknown`，并通过类型守卫安全地访问其 `message` 属性，以解决 `no-explicit-any` ESLint 错误。
 */
import { createContext, useState, useEffect, useMemo, type ReactNode, type JSX } from 'react';
import { login as apiLogin, type Credentials } from '@/api/auth';
import { getMe } from '@/api/user';
import type { User } from '@/types/user';
import { Box, CircularProgress } from '@mui/material';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { SessionTimeoutModal } from '@/components/SessionTimeoutModal';
import { ApiError } from '@/api';

// --- 超时配置 ---
const IDLE_TIMEOUT_MS = 5000//59 * 60 * 1000;   // 59 分钟
const LOGOUT_TIMEOUT_MS = 1 * 60 * 1000;  // 60 秒 (1分钟) 宽限期

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isWarningModalOpen, setWarningModalOpen] = useState(false);

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
        setError(null);
        setWarningModalOpen(false);
        window.location.assign('/login');
    };

    const handleIdle = () => {
        setWarningModalOpen(true);
    };

    const { stayActive } = useIdleTimeout({
        onIdle: handleIdle,
        onLogout: logout,
        idleTimeoutMs: IDLE_TIMEOUT_MS,
        logoutTimeoutMs: LOGOUT_TIMEOUT_MS,
    });

    const handleStayLoggedIn = () => {
        setWarningModalOpen(false);
        stayActive();
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const currentUser = await getMe({ tokenOverride: token });
                    setUser(currentUser);
                } catch (err) {
                    sessionStorage.removeItem('token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (credentials: Credentials) => {
        setError(null);
        try {
            const { token } = await apiLogin(credentials);
            sessionStorage.setItem('token', token);
            const currentUser = await getMe({ tokenOverride: token });
            setUser(currentUser);
        } catch (err: unknown) { // [核心修复] 将 err 类型声明为 unknown
            let errorMessage = '登录失败，请检查您的凭证。';
            // 使用类型守卫安全地访问 message 属性
            if (err instanceof ApiError || err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            throw err;
        }
    };

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
    }), [user, isLoading, error]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
            {value.isAuthenticated && (
                <SessionTimeoutModal
                    open={isWarningModalOpen}
                    countdownSeconds={LOGOUT_TIMEOUT_MS / 1000}
                    onStayLoggedIn={handleStayLoggedIn}
                    onLogout={logout}
                />
            )}
        </AuthContext.Provider>
    );
};