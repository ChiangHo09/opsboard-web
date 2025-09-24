/**
 * @file src/api/ticketsApi.ts
 * @description 此文件定义了工单（Tickets）的模拟 API 层。
 * @modification
 *   - [依赖修复]: 将 `sleep` 函数的导入路径从 './index' 修改为 './utils'，以打破与 `index.ts` 的循环依赖。
 */
import { sleep } from './utils';

export interface TicketRow {
    id: string;
    customerName: string;
    status: '就绪' | '挂起';
    operationType: string;
    operationContent: string;
}

const ticketRows: TicketRow[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `tkt-${String(i + 1).padStart(3, '0')}`,
    customerName: `客户${['A', 'B', 'C', 'D', 'E'][i % 5]}`,
    status: (['就绪', '挂起'] as const)[i % 2],
    operationType: ['故障报修', '需求变更', '技术咨询'][i % 3],
    operationContent: `这是工单 #${i + 1} 的具体操作内容描述，用于记录问题的详细情况。`
}));

export const ticketsApi = {
    Row: {} as TicketRow,
    async fetchAll(): Promise<TicketRow[]> {
        await sleep(300);
        return ticketRows;
    }
};