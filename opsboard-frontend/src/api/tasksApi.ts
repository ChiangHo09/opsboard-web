/**
 * @file src/api/tasksApi.ts
 * @description 提供了与巡检备份任务相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以封装获取任务列表的 API 调用。
 *   - [类型定义]：定义了 `TaskRow` 类型和 `GoNullString` 辅助类型，以匹配后端 `Task` 模型，确保前后端数据结构的一致性。
 *   - [功能]：实现了 `fetchAll` 函数，该函数调用后端的 `/tasks/list` 端点来获取数据，并进行必要的类型转换。
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

// 定义与后端 models.Task 的 JSON 输出完全匹配的前端数据类型
export interface TaskRow {
    id: string;
    taskName: string;
    type: string; // 后端是 '巡检' 或 '备份'
    status: '完成' | '挂起' | '未完成'; // 对应数据库的 status
    executionTime: GoNullTime;
    target: GoNullString;
}

// 这是一个临时的内部类型，用于匹配 API 的原始响应
type TaskApiResponse = Omit<TaskRow, 'id'> & {
    id: number;
};

export const tasksApi = {
    /**
     * 从后端获取所有巡检备份任务的列表。
     * @returns {Promise<TaskRow[]>} 返回一个解析为任务数组的 Promise。
     */
    fetchAll: async (): Promise<TaskRow[]> => {
        const response = await api<TaskApiResponse[]>('/tasks/list');

        // 转换 id 的类型
        return response.map(task => ({
            ...task,
            id: String(task.id),
        }));
    },
};