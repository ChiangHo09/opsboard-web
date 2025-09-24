/**
 * @file src/types/user.ts
 * @description 定义了整个应用中使用的 User 数据结构。
 * @modification
 *   - [New File]: 创建此文件以提供一个标准的、可复用的用户类型定义，确保类型安全。
 */
export interface User {
    id: string;
    username: string;
    nickname: string;
    avatar?: string; // 头像 URL 是可选的
}