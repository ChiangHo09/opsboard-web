/**
 * @file src/api/changelogApi.ts
 * @description 提供了与更新日志相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [后端分页]：`fetchAll` 函数现在接收 `page` 和 `pageSize` 参数，并将其作为 URL 查询参数发送给后端。
 *   - [类型更新]：`fetchAll` 的返回类型更新为 `PaginatedResponse<ChangelogRow>`，以匹配后端分页接口返回的 `{ total: number, data: T[] }` 结构。
 */
import api, { type PaginatedResponse } from './index'; // 导入通用的 PaginatedResponse 类型

// 将 id 和 customerId 的类型改为 string
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

type ChangelogApiResponse = Omit<ChangelogRow, 'id' | 'customerId'> & {
    id: number;
    customerId: number;
};

export const changelogsApi = {
    /**
     * 从后端分页获取更新日志列表。
     * @param {number} page - 当前页码 (从1开始)。
     * @param {number} pageSize - 每页记录数。
     * @returns {Promise<PaginatedResponse<ChangelogRow>>} 返回一个包含总数和当前页数据的 Promise。
     */
    fetchAll: async (page: number, pageSize: number): Promise<PaginatedResponse<ChangelogRow>> => {
        const response = await api<PaginatedResponse<ChangelogApiResponse>>(`/changelogs/list?page=${page}&pageSize=${pageSize}`);

        const transformedData = response.data.map(log => ({
            ...log,
            id: String(log.id),
            customerId: String(log.customerId),
        }));

        return {
            total: response.total,
            data: transformedData,
        };
    },
};