/**
 * @file src/api/auth.ts
 * @description 包含与认证相关的 API 函数。
 * @modification
 *   - [New File]: 创建此文件以封装所有认证相关的 API 调用。
 *   - [login function]: 实现了调用后端登录端点的函数。它负责发送用户凭证，并期望在响应中收到一个认证令牌。
 */
import api from './index.ts';

export interface Credentials {
    username?: string;
    password?: string;
}

interface LoginResponse {
    token: string;
}

/**
 * 调用后端 API 以认证用户。
 * @param credentials - 包含用户 `username` 和 `password` 的对象。
 * @returns 返回一个解析为登录响应（包含认证 token）的 Promise。
 */
export const login = (credentials: Credentials): Promise<LoginResponse> => {
    return api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};