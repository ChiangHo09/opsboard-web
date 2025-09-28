/**
 * @file src/api/index.ts
 * @description API 客户端配置和基础工具。此版本已重构为实现行业标准的 JWT 刷新令牌机制。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码规范]：根据 ESLint 的建议进行了代码清理。
 *   - [具体修复]：
 *     - 将未被重新赋值的 `let token` 更改为 `const token` (`prefer-const`)。
 *     - 为 `handleRefreshToken` 中未使用的 `catch` 块错误变量添加了下划线前缀 (`_error`)，以符合 `@typescript-eslint/no-unused-vars` 规则。
 *     - 移除了 `api` 函数中多余的、只用于重新抛出错误的 `try/catch` 包装器 (`no-useless-catch`)。
 */
export * from './changelogApi';
export * from './serversApi';
export * from './ticketsApi';
export * from './templateApi';
export * from './auth';
export * from './user';

const API_BASE_URL = '/api';

let refreshTokenPromise: Promise<string> | null = null;

export class ApiError extends Error {
    status: number;
    body: unknown;

    constructor(message: string, status: number, body: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

interface ApiOptions extends RequestInit {
    skipTokenRefresh?: boolean;
}

const rawFetch = async (endpoint: string, config: RequestInit) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        let errorBody: { message?: string };
        try {
            errorBody = await response.json();
        } catch (_e) {
            errorBody = { message: response.statusText };
        }
        throw new ApiError(
            errorBody.message || '发生未知 API 错误',
            response.status,
            errorBody
        );
    }
    if (response.status === 204) return null;
    return response.json();
};

const handleRefreshToken = async (): Promise<string> => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response: { accessToken: string } = await rawFetch('/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        const newAccessToken = response.accessToken;
        sessionStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
    } catch (_error) { // [核心修复] 使用下划线前缀标记未使用的变量
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.assign('/login');
        throw new Error('Session expired. Please log in again.');
    }
};

async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    // [核心修复] 使用 const 代替 let
    const token = sessionStorage.getItem('accessToken');

    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = { ...options, headers };

    try {
        return await rawFetch(endpoint, config);
    } catch (error) {
        if (error instanceof ApiError && error.status === 401 && !options.skipTokenRefresh) {
            // [核心修复] 移除了多余的 try/catch 包装器
            if (!refreshTokenPromise) {
                refreshTokenPromise = handleRefreshToken();
            }
            const newAccessToken = await refreshTokenPromise;

            refreshTokenPromise = null;

            headers.set('Authorization', `Bearer ${newAccessToken}`);
            const retryConfig = { ...options, headers };
            return await rawFetch(endpoint, retryConfig);
        }
        throw error;
    }
}

export default api;