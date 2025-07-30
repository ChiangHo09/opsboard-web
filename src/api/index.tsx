/**
 * 文件名: src/api/index.ts
 *
 * 文件功能描述:
 * 此文件是应用的模拟 API 层。它通过将每个数据实体（如 Tickets, Servers）
 * 封装在各自的对象中，提供了一个结构化、模块化的方式来定义和导出所有与后端
 * 交互的数据获取函数。这种模式使得 API 层更易于管理、测试和未来的扩展。
 *
 * 本次修改内容:
 * - 【代码结构优化】将分散的数据、类型和获取函数整合到独立的、以实体命名的对象
 *   （`ticketsApi`, `serversApi`, `changelogsApi`）中。
 * - **最终效果**:
 *   1.  **命名空间**: 避免了全局命名冲突（例如，多个实体都可能有 `Row` 类型）。
 *   2.  **可维护性**: 所有与特定实体相关的代码都集中在一起，更易于查找和修改。
 *   3.  **可测试性**: 每个 API 模块都可以被独立地导入和模拟（mock）。
 *   4.  **IDE 自动完成**: 在使用时，输入 `api.` 即可获得所有可用的 API 模块提示。
 */

// --- 1. 通用工具 ---

/**
 * @function sleep
 * @description 一个模拟网络延迟的辅助函数。
 * @param {number} ms - 延迟的毫秒数。
 * @returns {Promise<void>}
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @class ApiError
 * @description 一个自定义错误类，用于模拟或处理带有HTTP状态码的API错误。
 */
export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}


// --- 2. 工单 (Tickets) API 模块 ---

// 将所有与工单相关的类型、数据和函数封装在一个对象中
export const ticketsApi = {
    /**
     * @interface Row
     * @description 定义了单条工单数据的类型结构。
     */
    Row: {} as import('./index').TicketRow, // 用于类型重导出
    /**
     * @function fetchAll
     * @description 异步获取所有工单数据。
     * @returns {Promise<TicketRow[]>} - 一个解析为工单数据数组的 Promise。
     */
    async fetchAll(): Promise<TicketRow[]> {
        await sleep(500);
        console.log('API: Fetched Tickets');
        return ticketRows;
    }
};

export interface TicketRow {
    id: string;
    customerName: string;
    status: '挂起' | '就绪';
    operationType: '更新' | '备份' | '巡检';
    operationContent: string;
}

const LONG_TICKET_TEXT = '这是一个非常长的操作内容描述，用于测试在表格单元格中的文本溢出和鼠标悬停时的 Tooltip 显示效果。';
const TICKET_OPERATION_TYPES = ['更新', '备份', '巡检'] as const;

const ticketRows: TicketRow[] = [
    { id: 'tkt001', customerName: '客户a', status: '就绪', operationType: '更新', operationContent: '对核心应用服务器 APP-SERVER-A 进行了版本升级。' },
    { id: 'tkt002', customerName: '客户b', status: '挂起', operationType: '备份', operationContent: `执行了对 DB-SERVER-B 数据库的全量备份任务。${LONG_TICKET_TEXT}` },
    { id: 'tkt003', customerName: '客户c', status: '就绪', operationType: '巡检', operationContent: '完成了对客户C所有服务器的季度例行巡检。' },
    ...Array.from({length: 40}).map((_, i) => {
        const status: TicketRow['status'] = i % 3 === 0 ? '挂起' : '就绪';
        return {
            id: `tkt${i + 4}`,
            customerName: `测试客户${(i % 7) + 1}`,
            status,
            operationType: TICKET_OPERATION_TYPES[i % 3],
            operationContent: `（第 ${i + 4} 条）${LONG_TICKET_TEXT}`
        };
    }),
];


// --- 3. 服务器 (Servers) API 模块 ---

export const serversApi = {
    Row: {} as import('./index').ServerRow,
    async fetchAll(): Promise<ServerRow[]> {
        await sleep(500);
        console.log('API: Fetched Servers');
        return serverRows;
    }
};

export interface ServerRow {
    id: string;
    customerName: string;
    serverName: string;
    ip: string;
    role: string;
    note?: string;
    dep?: string;
    custNote?: string;
}

const LONG_SERVER_NOTE = '这是一段非常非常长的使用备注，用于测试在表格单元格中的文本溢出和 Tooltip 显示效果。';

const serverRows: ServerRow[] = [
    { id: 'srv001', customerName: '客户a', serverName: 'APP-SERVER-A', ip: '192.168.1.10', role: '应用', note: LONG_SERVER_NOTE },
    { id: 'srv002', customerName: '客户a', serverName: 'DB-SERVER-AB', ip: '192.168.1.20', role: '数据库', note: LONG_SERVER_NOTE, dep: '共享', custNote: '客户 a/b 共用' },
    ...Array.from({length: 100}).map((_, i) => (
        {
            id: `test${i + 1}`,
            customerName: `测试客户${i + 1}`,
            serverName: `TestServer${i + 1}`,
            ip: `10.0.0.${i + 1}`,
            role: i % 2 === 0 ? '应用' : '数据库',
            note: `（第 ${i + 1} 条）${LONG_SERVER_NOTE}`,
            dep: i % 3 === 0 ? '测试版' : undefined
        }
    )),
];


// --- 4. 更新日志 (Changelog) API 模块 ---

export const changelogsApi = {
    Row: {} as import('./index').ChangelogRow,
    async fetchAll(): Promise<ChangelogRow[]> {
        await sleep(500);
        console.log('API: Fetched Changelogs');
        return changelogRows;
    }
};

export interface ChangelogRow {
    id: string;
    customerName: string;
    updateTime: string;
    updateType: string;
    updateContent: string;
}

const LONG_LOG_TEXT = '这是一个用于测试 hover 效果的特别长的文本，需要足够多的内容才能在宽屏的50%列宽中产生溢出效果。';

const changelogRows: ChangelogRow[] = [
    { id: 'log001', customerName: '客户a', updateTime: '2025-07-21 10:30', updateType: '功能更新', updateContent: LONG_LOG_TEXT },
    { id: 'log002', customerName: '客户b', updateTime: '2025-07-20 15:00', updateType: '安全修复', updateContent: LONG_LOG_TEXT },
    ...Array.from({length: 50}).map((_, i) => ({
        id: `log${i + 4}`,
        customerName: `测试客户${(i % 5) + 1}`,
        updateTime: `2025-06-${20 - (i % 20)} 14:00`,
        updateType: i % 2 === 0 ? 'Bug 修复' : '常规维护',
        updateContent: `（第 ${i + 4} 条）${LONG_LOG_TEXT}`
    })),
];