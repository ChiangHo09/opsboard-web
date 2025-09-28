/**
 * @file src/api/changelogApi.ts
 * @description 提供了与更新日志相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [真实 API 对接]：彻底移除了所有前端模拟数据和 `sleep` 函数，将 `fetchAll` 重构为调用真实后端 API (`/changelogs/list`)。
 *   - [类型对齐]：更新了 `ChangelogRow` 接口，使其字段与后端 Go `Changelog` 结构体的 JSON 输出完全匹配，确保了端到端的数据类型安全。
 */
import api from './index';

// 定义与后端 models.Changelog 的 JSON 输出完全匹配的前端数据类型
export interface ChangelogRow {
    id: number;           // log_id (uint)
    customerId: number;     // customer_id (uint)
    userId: string;         // user_id (string, UUID)
    updateTime: string;     // update_time (time.Time)
    updateType: string;     // update_type
    updateContent: string;  // update_content
    createdAt: string;      // created_at (time.Time)
    customerName: string;   // customer_name (from JOIN)
}

// 创建一个包含所有更新日志相关API函数的对象
export const changelogsApi = {
    /**
     * 从后端获取所有更新日志的列表。
     * @returns {Promise<ChangelogRow[]>} 返回一个解析为更新日志数组的 Promise。
     */
    fetchAll: (): Promise<ChangelogRow[]> => {
        // 调用我们新创建的、受保护的真实后端接口
        return api('/changelogs/list');
    },
};