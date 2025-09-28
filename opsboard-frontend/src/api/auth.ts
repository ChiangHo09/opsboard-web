/**
 * @file src/api/auth.ts
 * @description 提供了认证相关的 API 函数，例如登录。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：在调用 `api` 客户端时，为登录请求明确传递了 `skipTokenRefresh: true` 选项。
 *   - [原因]：此修改是为了告知 API 拦截器，如果登录请求本身返回 401 错误，这应被视为“凭据错误”而非“令牌过期”，因此不应触发自动的令牌刷新流程。这是解决登录时报错问题的关键一步。
 */
import api from './index';

export interface Credentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const login = (credentials: Credentials): Promise<LoginResponse> => {
    return api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        // [核心修改] 告诉 api 客户端，如果此请求失败，不要尝试刷新令牌
        skipTokenRefresh: true,
    });
};