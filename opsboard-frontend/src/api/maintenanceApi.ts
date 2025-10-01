/**
 * @file src/api/maintenanceApi.ts
 * @description 提供了与维护任务相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [类型统一]：移除了本地的 `GoNullString` 和 `GoNullTime` 定义，改为从 `api/index.ts` 导入，以解决重复导出问题。
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
};