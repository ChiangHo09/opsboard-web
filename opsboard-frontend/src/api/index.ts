/**
 * @file src/api/index.ts
 * @description API 客户端配置和基础工具。这是所有 API 模块的统一入口点。
 * @modification
 *   - [Code Quality]: 将 `ApiError` 类中的 `body` 属性及其构造函数参数的类型从 `any` 更改为 `unknown`，以遵循 `no-explicit-any` ESLint 规则，提高类型安全性。
 *   - [Code Quality]: 在 `api` 函数的 `catch` 块中，将未使用的错误变量 `e` 重命名为 `_e`，以遵循 `no-unused-vars` ESLint 规则。
 */
// 导入并重新导出所有模块化的 API
export * from './changelogApi';
export * from './serversApi';
export * from './ticketsApi';
export * from './templateApi';
export * from './auth';
export * from './user';

// ------------------- 核心 API 客户端实现 -------------------

// 在真实应用中，此 URL 应通过环境变量（如 import.meta.env.VITE_API_URL）配置
const API_BASE_URL = '/api';

/**
 * API 响应的自定义错误类。
 * 这使我们能够在 React Query 或其他应用部分中处理错误时，
 * 轻松访问 HTTP 状态码和响应体。
 */
export class ApiError extends Error {
    status: number;
    body: unknown; // [核心修复] 使用 `unknown` 替代 `any` 以提高类型安全

    constructor(message: string, status: number, body: unknown) { // [核心修复] 使用 `unknown` 替代 `any`
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

/**
 * 核心 API 客户端函数。
 * @param endpoint - API 端点路径 (例如, '/users')。
 * @param options - `fetch` API 的配置选项 (如 method, body)。
 * @returns 返回一个解析为 JSON 响应的 Promise。
 * @throws {ApiError} 如果网络响应状态码不是 'ok' (即非 2xx)。
 */
async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = new Headers(options.headers || {});

    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        let errorBody: { message?: string };
        try {
            errorBody = await response.json();
        } catch (_e) { // [核心修复] 将未使用的 'e' 重命名为 '_e'
            errorBody = { message: response.statusText };
        }
        throw new ApiError(
            errorBody.message || '发生未知 API 错误',
            response.status,
            errorBody
        );
    }

    if (response.status === 204) {
        return Promise.resolve(null as T);
    }

    return response.json();
}

export default api;