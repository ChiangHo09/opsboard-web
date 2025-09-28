/**
 * @file src/api/maintenanceApi.ts
 * @description 提供了与维护任务相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码重构]：将文件名、API 对象和类型定义中的 `Task` 替换为 `Maintenance`，并更新了 API 端点路径，以提高命名的业务清晰度。
 */
import api from './index';

export type GoNullString = {
    String: string;
    Valid: boolean;
} | null;

export type GoNullTime = {
    Time: string;
    Valid: boolean;
} | null;

// 定义与后端 models.MaintenanceTask 的 JSON 输出完全匹配的前端数据类型
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
     * 从后端获取所有维护任务的列表。
     * @returns {Promise<MaintenanceTaskRow[]>} 返回一个解析为任务数组的 Promise。
     */
    fetchAll: async (): Promise<MaintenanceTaskRow[]> => {
        const response = await api<MaintenanceTaskApiResponse[]>('/maintenance/list');

        return response.map(task => ({
            ...task,
            id: String(task.id),
        }));
    },
};