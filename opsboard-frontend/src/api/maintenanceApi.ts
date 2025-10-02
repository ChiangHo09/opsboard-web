/**
 * @file src/api/maintenanceApi.ts
 * @description 提供了与维护任务相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `deleteById` 函数，用于调用后端的删除维护任务接口。
 *   - [实现]：该函数接收一个任务 ID，并向 `/maintenance/:id` 端点发送一个 `DELETE` 方法的 HTTP 请求。
 */
import api, { type PaginatedResponse, type GoNullString, type GoNullTime } from './index';

export interface MaintenanceTaskRow {
    id: string;
    taskName: string;
    type: string;
    status: '完成' | '挂起' | '未完成';
    executionTime: GoNullTime;
    target: GoNullString;
}

type MaintenanceTaskApiResponse = Omit<MaintenanceTaskRow, 'id'> & {
    id: number;
};

export const maintenanceApi = {
    /**
     * 从后端分页获取所有维护任务的列表。
     * @param {number} page - 当前页码 (从1开始)。
     * @param {number} pageSize - 每页记录数。
     * @returns {Promise<PaginatedResponse<MaintenanceTaskRow>>} 返回一个包含总数和当前页数据的 Promise。
     */
    fetchAll: async (page: number, pageSize: number): Promise<PaginatedResponse<MaintenanceTaskRow>> => {
        const response = await api<PaginatedResponse<MaintenanceTaskApiResponse>>(`/maintenance/list?page=${page}&pageSize=${pageSize}`);

        const transformedData = response.data.map(task => ({
            ...task,
            id: String(task.id),
        }));

        return {
            total: response.total,
            data: transformedData,
        };
    },

    /**
     * 根据 ID 删除一个维护任务。
     * @param {string} id - 要删除的任务的 ID。
     * @returns {Promise<void>} 操作成功时不返回任何内容。
     */
    deleteById: (id: string): Promise<void> => {
        return api(`/maintenance/${id}`, {
            method: 'DELETE',
        });
    },
};