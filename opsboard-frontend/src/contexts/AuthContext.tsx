/**
 * @file src/contexts/AuthContext.tsx
 * @description 提供了全局认证状态管理。此版本已重构为配合行业标准的 JWT 刷新令牌模型工作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [健壮性加固]：在 `login` 函数中，增加了对从后端接收到的 `accessToken` 和 `refreshToken` 的存在性验证。
 *   - [原因]：此修改是为了防止因后端返回非预期响应体而导致前端认证流程出错。通过在设置令牌前进行检查，可以避免将 `undefined` 存入 `sessionStorage`，从而从根本上解决了 `Authorization: Bearer undefined` 的问题，并能提供更明确的错误提示。
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
                    if (isMounted) logout();
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

            // [核心修复] 验证从后端收到的令牌
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