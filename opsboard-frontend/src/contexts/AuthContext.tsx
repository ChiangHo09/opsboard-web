/**
 * @file src/contexts/AuthContext.tsx
 * @description 提供了全局认证状态管理。
 * @modification
 *   - [Routing Fix]: 从 `login` 函数中移除了 `navigate` 调用。
 *   - [Reason]: 将导航的职责完全交给路由层（`AppRoutes` 组件），可以避免状态更新和导航之间的竞态条件。现在，`AuthContext` 只专注于认证状态的管理，符合单一职责原则。
 */
import { createContext, useState, useEffect, useMemo, type ReactNode, type JSX } from 'react';
import { login as apiLogin, type Credentials } from '@/api/auth';
import { getMe } from '@/api/user';
import type { User } from '@/types/user';
import { Box, CircularProgress } from '@mui/material';

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

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const currentUser = await getMe();
                    setUser(currentUser);
                } catch (err) {
                    localStorage.removeItem('token');
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
            localStorage.setItem('token', token);
            const currentUser = await getMe();
            setUser(currentUser);
            // [核心修改] 移除导航逻辑。导航现在由 AppRoutes 组件根据 isAuthenticated 状态的变化来处理。
        } catch (err: any) {
            setError(err.message || '登录失败，请检查您的凭证。');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
        window.location.assign('/login');
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};