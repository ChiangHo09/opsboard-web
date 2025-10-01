/**
 * @file src/api/index.ts
 * @description API 客户端配置和基础工具。此版本已重构为实现行业标准的 JWT 刷新令牌机制。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [类型统一]：将 `GoNullString` 和 `GoNullTime` 等通用辅助类型移至此文件并导出，以解决因重复导出导致的模块解析歧义 (TS2308)。
 *   - [类型导出]：新增并导出了 `PaginatedResponse` 接口，用于为所有分页 API 的响应提供一个统一的、可复用的类型定义。
 */
export * from './changelogApi';
export * from './serversApi';
export * from './ticketsApi';
export * from './templateApi';
export * from './auth';
export * from './user';
export * from './maintenanceApi';

// [核心修改] 定义并导出所有通用的辅助类型
export type GoNullString = {
    String: string;
    Valid: boolean;
} | null;

export type GoNullTime = {
    Time: string;
    Valid: boolean;
} | null;

export interface PaginatedResponse<T> {
    total: number;
    data: T[];
}

const API_BASE_URL = '/api';

// ... 文件其余部分保持不变 ...
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
    } catch (_error) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.assign('/login');
        throw new Error('Session expired. Please log in again.');
    }
};

async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
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