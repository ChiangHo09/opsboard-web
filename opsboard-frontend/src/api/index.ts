/**
 * @file src/api/index.ts
 * @description API 客户端配置和基础工具。此版本已重构为实现行业标准的 JWT 刷新令牌机制。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [架构重构]：实现了完整的刷新令牌（Refresh Token）和请求重试逻辑。
 *   - [功能]：当API请求因访问令牌（Access Token）过期而返回401时，客户端会自动使用刷新令牌获取新的访问令牌，并无缝地重试失败的请求。
 *   - [健壮性]：通过 Promise 锁（`refreshTokenPromise`）防止了多个并发请求同时触发刷新流程（“狗桩效应”）。
 *   - [职责]：这是现在整个应用会话管理的唯一核心，确保了会话的无缝延续和最终的安全登出。
 */
export * from './changelogApi';
export * from './serversApi';
export * from './ticketsApi';
export * from './templateApi';
export * from './auth';
export * from './user';

const API_BASE_URL = '/api';

// 用于防止并发刷新请求的 Promise 锁
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

// 这是一个不经过我们拦截器的原始 fetch 函数
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
        // 假设 /auth/refresh 是你的刷新令牌端点
        const response = await rawFetch('/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        const newAccessToken = response.accessToken;
        sessionStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
    } catch (error) {
        // 如果刷新失败，则会话彻底结束
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.assign('/login');
        throw new Error('Session expired. Please log in again.');
    }
};

async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token = sessionStorage.getItem('accessToken');

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
        if (error instanceof ApiError && error.status === 401) {
            // 访问令牌过期，开始刷新流程
            try {
                if (!refreshTokenPromise) {
                    refreshTokenPromise = handleRefreshToken();
                }
                const newAccessToken = await refreshTokenPromise;

                // 刷新完成后，重置 Promise 锁
                refreshTokenPromise = null;

                // 使用新的令牌重试原始请求
                headers.set('Authorization', `Bearer ${newAccessToken}`);
                const retryConfig = { ...options, headers };
                return await rawFetch(endpoint, retryConfig);

            } catch (refreshError) {
                // 如果刷新流程本身就失败了，则直接抛出错误
                throw refreshError;
            }
        }
        // 对于非401错误，直接抛出
        throw error;
    }
}

export default api;