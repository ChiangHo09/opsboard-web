/**
 * @file src/api/ticketsApi.ts
 * @description 提供了与工单相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [类型更新]：更新了 `TicketRow` 接口，移除了 `createdAt`，并新增了 `publicationTime` 和 `completionTime` 字段，以与后端 `v_tickets` 视图的最新结构保持同步。
 */
import api, { type PaginatedResponse, type GoNullTime } from './index';

// 定义与后端 v_tickets 视图的 JSON 输出完全匹配的前端数据类型
export interface TicketRow {
    id: string;
    customerName: string;
    status: '完成' | '挂起';
    operationType: string;
    operationContent: string;
    // [核心修改] 更新时间字段
    publicationTime: string;
    completionTime: GoNullTime;
}

export const ticketsApi = {
    /**
     * 从后端分页获取所有工单数据。
     * @param {number} page - 当前页码 (从1开始)。
     * @param {number} pageSize - 每页记录数。
     * @returns {Promise<PaginatedResponse<TicketRow>>} 返回一个包含总数和当前页数据的 Promise。
     */
    fetchAll: async (page: number, pageSize: number): Promise<PaginatedResponse<TicketRow>> => {
        return api(`/tickets/list?page=${page}&pageSize=${pageSize}`);
    }
};