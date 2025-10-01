/**
 * @file src/api/changelogApi.ts
 * @description 提供了与更新日志相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `deleteById` 函数，用于调用后端的删除更新日志接口。
 *   - [实现]：该函数接收一个日志 ID，并向 `/changelogs/:id` 端点发送一个 `DELETE` 方法的 HTTP 请求。
 */
import api, { type PaginatedResponse } from './index';

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

    /**
     * 根据 ID 删除一个更新日志。
     * @param {string} id - 要删除的日志的 ID。
     * @returns {Promise<void>} 操作成功时不返回任何内容。
     */
    deleteById: (id: string): Promise<void> => {
        return api(`/changelogs/${id}`, {
            method: 'DELETE',
        });
    },
};