/**
 * @file src/api/maintenanceApi.ts
 * @description 提供了与维护任务相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `markAsCompleted` 和 `markAsPending` 两个函数，用于调用后端的状态变更接口。
 *   - [类型更新]：`MaintenanceTaskRow` 接口增加了 `publicationTime` 和 `completionTime` 字段，并更新了 `status` 类型，以与后端模型保持同步。
 */
import api, { type PaginatedResponse, type GoNullString, type GoNullTime } from './index';

// [核心修改] 更新类型定义
export interface MaintenanceTaskRow {
    id: string;
    taskName: string;
    type: string;
    status: '完成' | '挂起';
    publicationTime: string;
    completionTime: GoNullTime;
    target: GoNullString;
}

type MaintenanceTaskApiResponse = Omit<MaintenanceTaskRow, 'id'> & {
    id: number;
};

export const maintenanceApi = {
    fetchAll: async (page: number, pageSize: number): Promise<PaginatedResponse<MaintenanceTaskRow>> => {
        const response = await api<PaginatedResponse<MaintenanceTaskApiResponse>>(`/maintenance/list?page=${page}&pageSize=${pageSize}`);
        const transformedData = response.data.map(task => ({
            ...task,
            id: String(task.id),
        }));
        return { total: response.total, data: transformedData };
    },

    deleteById: (id: string): Promise<void> => {
        return api(`/maintenance/${id}`, { method: 'DELETE' });
    },

    /**
     * 将指定ID的任务标记为“完成”。
     * @param {string} id - 任务 ID。
     * @returns {Promise<void>}
     */
    markAsCompleted: (id: string): Promise<void> => {
        return api(`/maintenance/${id}/complete`, { method: 'PUT' });
    },

    /**
     * 将指定ID的任务标记为“挂起”。
     * @param {string} id - 任务 ID。
     * @returns {Promise<void>}
     */
    markAsPending: (id: string): Promise<void> => {
        return api(`/maintenance/${id}/uncomplete`, { method: 'PUT' });
    },
};