/**
 * @file src/api/user.ts
 * @description 提供了获取用户相关信息的 API 函数。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [语法修正]：移除了对 `api` 函数的显式泛型调用（即 `api<User>`)。
 *   - [原因]：此修改利用了 TypeScript 的类型推断机制来解决泛型与 JSX 语法的歧义问题。由于 `getMe` 函数已明确声明返回类型为 `Promise<User>`，TypeScript 能够自动推断出 `api` 函数的返回类型，从而无需使用可能引起解析错误的 `<...>` 语法。这是解决此类问题的最简洁和最健壮的方法。
 */
import api from './index';
import type { User } from '@/types/user';

/**
 * 获取当前已认证用户的个人资料。
 * 这个函数现在不需要任何参数，因为 API 客户端会自动处理认证头。
 * @returns {Promise<User>} 返回一个解析为用户对象的 Promise。
 */
export const getMe = (): Promise<User> => {
    // [核心修改] 移除显式的 <User> 泛型，让 TypeScript 根据 getMe 的返回类型自动推断
    return api('/users/me');
};