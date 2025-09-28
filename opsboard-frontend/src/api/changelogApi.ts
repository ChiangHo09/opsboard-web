/**
 * @file src/api/changelogApi.ts
 * @description 提供了与更新日志相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：将 `ChangelogRow` 接口中的 `id` 和 `customerId` 字段的类型从 `number` 更改为 `string`，以满足通用组件的 `{ id: string; }` 类型约束。
 *   - [数据转换]：在 `fetchAll` 函数中增加了 `.map()` 操作，以在数据返回给应用层之前，将从后端接收到的 `number` 类型的 ID 显式转换为 `string`。
 */
import api from './index';

// [核心修复] 将 id 和 customerId 的类型改为 string
export interface ChangelogRow {
    id: string;
    customerId: string;
    userId: string;
    updateTime: string;
    updateType: string;
    updateContent: string;
    createdAt: string;
    customerName: string;
}

// 这是一个临时的内部类型，用于匹配 API 的原始响应
type ChangelogApiResponse = Omit<ChangelogRow, 'id' | 'customerId'> & {
    id: number;
    customerId: number;
};

export const changelogsApi = {
    /**
     * 从后端获取所有更新日志的列表，并进行类型转换。
     * @returns {Promise<ChangelogRow[]>} 返回一个解析为更新日志数组的 Promise。
     */
    fetchAll: async (): Promise<ChangelogRow[]> => {
        const response = await api<ChangelogApiResponse[]>('/changelogs/list');

        // [核心修复] 使用 map 转换 id 和 customerId 的类型
        return response.map(log => ({
            ...log,
            id: String(log.id),
            customerId: String(log.customerId),
        }));
    },
};