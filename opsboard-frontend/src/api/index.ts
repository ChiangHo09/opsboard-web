/**
 * @file src/api/index.ts
 * @description API 客户端配置和基础工具。
 * @modification
 *   - [Auth Fix]: 重构了核心 `api` 函数，使其可以接受一个可选的 `tokenOverride` 参数。
 *   - [Reason]: 此更改解决了在登录流程中 `getMe` 请求无法立即获取到新 Token 的问题。现在，`AuthContext` 可以在 `login` 成功后，将新获取的 Token 直接注入到 `getMe` 的 API 调用中，确保了请求的原子性和正确性，而无需依赖 `sessionStorage` 的读取时机。
 */
// 导入并重新导出所有模块化的 API
export * from './changelogApi';
export * from './serversApi';
export * from './ticketsApi';
export * from './templateApi';
export * from './auth';
export * from './user';

// ------------------- 核心 API 客户端实现 -------------------

const API_BASE_URL = '/api';

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

// 定义 api 函数的选项
interface ApiOptions extends RequestInit {
    tokenOverride?: string; // 可选的 token 覆盖参数
}

async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    // [核心修改] 优先使用 tokenOverride，否则从 sessionStorage 读取
    const token = options.tokenOverride ?? sessionStorage.getItem('token');
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
        } catch (_e) {
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