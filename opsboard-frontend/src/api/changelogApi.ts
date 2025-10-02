/**
 * @file src/api/changelogApi.ts
 * @description 提供了与更新日志相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `markAsCompleted` 和 `markAsPending` 两个函数，用于调用后端的状态变更接口。
 *   - [类型更新]：`ChangelogRow` 接口增加了 `status` 和 `completionTime` 字段，以与后端模型保持同步。
 */
import api, { type PaginatedResponse, type GoNullTime } from './index';

// [核心修改] 更新类型定义
export interface ChangelogRow {
    id: string;
    customerId: string;
    userId: string;
    updateTime: string;
    updateType: string;
    updateContent: string;
    status: '完成' | '挂起';
    completionTime: GoNullTime;
    createdAt: string;
    customerName: string;
}

type ChangelogApiResponse = Omit<ChangelogRow, 'id' | 'customerId' | 'completionTime'> & {
    id: number;
    customerId: number;
    completionTime: GoNullTime;
};

export const changelogsApi = {
    fetchAll: async (page: number, pageSize: number): Promise<PaginatedResponse<ChangelogRow>> => {
        const response = await api<PaginatedResponse<ChangelogApiResponse>>(`/changelogs/list?page=${page}&pageSize=${pageSize}`);
        const transformedData = response.data.map(log => ({
            ...log,
            id: String(log.id),
            customerId: String(log.customerId),
        }));
        return { total: response.total, data: transformedData };
    },

    deleteById: (id: string): Promise<void> => {
        return api(`/changelogs/${id}`, { method: 'DELETE' });
    },

    /**
     * 将指定ID的更新日志标记为“完成”。
     * @param {string} id - 日志 ID。
     * @returns {Promise<void>}
     */
    markAsCompleted: (id: string): Promise<void> => {
        return api(`/changelogs/${id}/complete`, { method: 'PUT' });
    },

    /**
     * 将指定ID的更新日志标记为“挂起”。
     * @param {string} id - 日志 ID。
     * @returns {Promise<void>}
     */
    markAsPending: (id: string): Promise<void> => {
        return api(`/changelogs/${id}/uncomplete`, { method: 'PUT' });
    },
};