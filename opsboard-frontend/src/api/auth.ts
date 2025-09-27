/**
 * @file src/api/auth.ts
 * @description 提供了认证相关的 API 函数，例如登录。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [类型更新]：修改了 `LoginResponse` 接口，使其包含 `accessToken` 和 `refreshToken` 字段，以匹配新的后端 JWT 认证流程。
 *   - [字段重命名]：将原有的 `token` 字段移除，因为现在返回的是两个独立的令牌。
 */
import api from './index';

/**
 * 定义登录请求所需的凭证类型。
 */
export interface Credentials {
    username: string;
    password: string;
}

/**
 * 定义登录成功后 API 的响应体类型。
 */
export interface LoginResponse {
    accessToken: string;  // [核心修改]
    refreshToken: string; // [核心修改]
}

/**
 * 调用后端 API 执行登录操作。
 * @param credentials - 包含用户名和密码的对象。
 * @returns {Promise<LoginResponse>} 返回一个包含访问令牌和刷新令牌的 Promise。
 */
export const login = (credentials: Credentials): Promise<LoginResponse> => {
    // 登录请求本身不应被会话检查拦截，因为它就是为了创建会话
    return api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        // 在旧的超时模型中，我们使用 bypassSessionCheck。
        // 在新的刷新令牌模型中，这个 API 调用是公开的，不需要 Authorization 头，
        // 所以它自然不会触发401，也就无需特殊处理。
    });
};