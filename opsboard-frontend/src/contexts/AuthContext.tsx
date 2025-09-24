/**
 * @file src/contexts/AuthContext.tsx
 * @description 提供了全局认证状态管理。这是整个应用认证逻辑的核心。
 * @modification
 *   - [New File]: 创建此文件以实现一个中心化的、上下文驱动的认证系统。
 *   - [State Management]: 管理 `user`, `isAuthenticated`, 和 `isLoading` (用于初始加载时的token验证) 状态。
 *   - [Session Persistence]: 在 Provider 加载时，通过 `useEffect` 检查 localStorage 中的 token，并调用 API 获取用户信息以恢复会话。
 *   - [Core Methods]: 提供了 `login` 和 `logout` 方法，封装了 API 调用、token 管理和状态更新的逻辑。
 */
import { createContext, useState, useEffect, useMemo, type ReactNode, type JSX } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const navigate = useNavigate();
    const location = useLocation();

    // 在应用加载时检查 token 并尝试恢复会话
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const currentUser = await getMe();
                    setUser(currentUser);
                } catch (err) {
                    // Token 无效或已过期，清除它
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
            // 登录成功后，重定向到他们之前想访问的页面，或者仪表盘
            const from = location.state?.from?.pathname || '/app/dashboard';
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || '登录失败，请检查您的凭证。');
            // 抛出错误以便 UI 组件可以捕获并处理
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
        // 使用 window.location.assign 确保完全重载，清除所有应用状态
        window.location.assign('/login');
    };

    // 使用 useMemo 防止不必要的重渲染
    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
    }), [user, isLoading, error]);

    // 在验证初始 token 期间显示全局加载指示器
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};