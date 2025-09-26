/**
 * @file src/api/user.ts
 * @description 包含与用户相关的 API 函数。
 * @modification
 *   - [Auth Fix]: 更新了 `getMe` 函数的签名，使其可以接受一个可选的包含 `tokenOverride` 的对象。
 *   - [Reason]: 这是为了配合 `api` 客户端的重构，允许在调用时直接注入一个特定的认证 Token。
 */
import api from './index';
import type { User } from '@/types/user';

interface GetMeOptions {
    tokenOverride?: string;
}

/**
 * 获取当前已认证用户的信息。
 * @param options - 可选参数，可以包含一个 `tokenOverride` 来覆盖默认的 Token 行为。
 * @returns 返回一个解析为用户对象的 Promise。
 */
export const getMe = (options?: GetMeOptions): Promise<User> => {
    // 将 options 对象直接传递给 api 函数
    return api<User>('/users/me', options);
};