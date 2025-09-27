/**
 * @file src/utils/session.ts
 * @description 提供了用于管理用户会话活动时间的工具函数。
 * @modification
 *   - [New File]: 创建此文件以集中管理会话时间戳的读写逻辑。
 *   - [Functionality]:
 *     - `updateLastActivityTime`: 用于在用户执行操作时更新存储在 sessionStorage 中的时间戳。
 *     - `getLastActivityTime`: 用于获取上次活动的时间戳。
 *     - `clearActivityTime`: 用于在登出时清除时间戳。
 */

const LAST_ACTIVITY_KEY = 'lastActivityTime';

/**
 * 更新存储在 sessionStorage 中的最后用户活动时间戳为当前时间。
 */
export const updateLastActivityTime = (): void => {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

/**
 * 从 sessionStorage 中获取最后用户活动时间戳。
 * @returns {number} 返回时间戳（毫秒），如果不存在则返回 0。
 */
export const getLastActivityTime = (): number => {
    const time = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    return time ? parseInt(time, 10) : 0;
};

/**
 * 从 sessionStorage 中清除最后用户活动时间戳。
 */
export const clearActivityTime = (): void => {
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
};