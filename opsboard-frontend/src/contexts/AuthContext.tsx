/**
 * @file src/contexts/AuthContext.tsx
 * @description 提供了全局认证状态管理。此版本已重构为配合行业标准的 JWT 刷新令牌模型工作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：在 `useEffect` 中，当 `getMe` 请求失败时，立即将 `user` 设置为 `null` 并停止加载，然后再调用 `logout`。
 *   - [原因]：此修改解决了在令牌过期、`getMe` 失败后，应用可能在完全登出前错误地渲染子组件并发出无效业务请求的问题。通过立即清除用户状态，我们确保了在重定向到登录页之前，不会有任何需要认证的组件被渲染。
 */
import { createContext, useState, useEffect, useMemo, useRef, type ReactNode, type JSX } from 'react';
import { login as apiLogin, type Credentials } from '@/api/auth';
import { getMe } from '@/api/user';
import type { User } from '@/types/user';
import { Box, CircularProgress } from '@mui/material';
import { ApiError } from '@/api';

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
    const [accessToken, setAccessToken] = useState<string | null>(() => sessionStorage.getItem('accessToken'));

    const isLoggingIn = useRef(false);

    const logout = () => {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        setAccessToken(null);
        setUser(null);
        setError(null);
        isLoggingIn.current = false;
        window.location.assign('/login');
    };

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            if (accessToken) {
                if (!user) setIsLoading(true);
                try {
                    const currentUser = await getMe();
                    if (isMounted) {
                        setUser(currentUser);
                        setError(null);
                    }
                } catch (err) {
                    if (isMounted) {
                        // [核心修复] 在调用 logout 之前，立即清除用户状态并停止加载
                        setUser(null);
                        setIsLoading(false);
                        logout();
                    }
                } finally {
                    if (isMounted) setIsLoading(false);
                }
            } else {
                setUser(null);
                setIsLoading(false);
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [accessToken]);

    const login = async (credentials: Credentials) => {
        if (isLoggingIn.current) return;

        isLoggingIn.current = true;
        setError(null);
        setIsLoading(true);

        try {
            const response = await apiLogin(credentials);
            if (!response || !response.accessToken || !response.refreshToken) {
                throw new Error("登录响应无效，未收到令牌。");
            }
            sessionStorage.setItem('accessToken', response.accessToken);
            sessionStorage.setItem('refreshToken', response.refreshToken);
            setAccessToken(response.accessToken);
        } catch (err: unknown) {
            let errorMessage = '登录失败，请检查您的凭据。';
            if (err instanceof ApiError || err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            setIsLoading(false);
            throw err;
        } finally {
            isLoggingIn.current = false;
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

    if (isLoading && !user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};