/**
 * @file src/api/user.ts
 * @description 包含与用户相关的 API 函数。
 * @modification
 *   - [New File]: 创建此文件以封装用户相关的 API 调用。
 *   - [getMe function]: 实现了一个函数，用于在持有有效 token 的情况下获取当前登录用户的信息。这是会话恢复的关键。
 */
import api from './index.ts';
import type { User } from '@/types/user';

/**
 * 获取当前已认证用户的信息。
 * API 客户端会自动附加 Authorization 头。
 * @returns 返回一个解析为用户对象的 Promise。
 */
export const getMe = (): Promise<User> => {
    return api<User>('/users/me');
};