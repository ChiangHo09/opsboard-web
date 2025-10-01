/**
 * @file src/api/ticketsApi.ts
 * @description 此文件定义了工单（Tickets）的模拟 API 层，已支持分页。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：更新了 `fetchAll` 函数以模拟后端分页。它现在接收 `page` 和 `pageSize` 参数，并返回一个符合 `PaginatedResponse` 结构的对像。
 *   - [原因]：此修改是为了使其函数签名与 `useResponsiveDetailView` 钩子的期望相匹配，从而解决了 TypeScript 的类型不兼容错误 (TS2322)。
 */
import { sleep } from './utils';
import type { PaginatedResponse } from './index';

export interface TicketRow {
    id: string;
    customerName: string;
    status: '就绪' | '挂起';
    operationType: string;
    operationContent: string;
}

const ticketRows: TicketRow[] = Array.from({ length: 25 }).map((_, i) => ({
    id: `ticket-${String(i + 1).padStart(3, '0')}`,
    customerName: `客户${['A', 'B', 'C', 'D', 'E'][i % 5]}`,
    status: i % 4 === 0 ? '挂起' : '就绪',
    operationType: ['服务器重启', '数据迁移', '权限申请'][i % 3],
    operationContent: `这是工单 ${i + 1} 的具体操作内容描述。`
}));

export const ticketsApi = {
    /**
     * 异步模拟获取所有工单数据（支持分页）。
     * @param {number} page - 当前页码 (从1开始)。
     * @param {number} pageSize - 每页记录数。
     * @returns {Promise<PaginatedResponse<TicketRow>>} 返回一个包含总数和当前页数据的 Promise。
     */
    async fetchAll(page: number, pageSize: number): Promise<PaginatedResponse<TicketRow>> {
        await sleep(600);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = ticketRows.slice(start, end);
        return {
            total: ticketRows.length,
            data: paginatedData,
        };
    }
};