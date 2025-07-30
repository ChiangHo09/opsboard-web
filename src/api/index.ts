/**
 * 文件名: src/api/index.ts
 *
 * 文件功能描述:
 * 此文件是应用的模拟 API 层。它定义了所有与后端交互的数据获取函数。
 * 为了在没有真实后端的情况下进行开发，此文件中的函数会返回一个在短暂延迟后解析的 Promise，
 * 并携带一份硬编码的、模拟真实数据结构的静态数据。
 *
 * 本次修改内容:
 * - 【类型修复】修复了在生成工单模拟数据时遇到的 TypeScript 类型错误。
 * - 1. 对操作类型数组使用 `as const`（常量断言），让 TypeScript 能够正确地将数组元素的类型推断为
 *   精确的字面量联合类型 (`'更新' | '备份' | '巡检'`)。
 * - 2. 为 `status` 变量添加了显式的类型注解 (`: TicketRow['status']`)，以确保三元表达式的结果
 *   被正确地识别为 `'挂起' | '就绪'` 类型，而不是被放宽为 `string`。
 */

// 模拟网络延迟的辅助函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* -------------------- 工单 (Tickets) -------------------- */

export interface TicketRow {
    id: string;
    customerName: string;
    status: '挂起' | '就绪';
    operationType: '更新' | '备份' | '巡检';
    operationContent: string;
}

const LONG_TICKET_TEXT = '这是一个非常长的操作内容描述，用于测试在表格单元格中的文本溢出和鼠标悬停时的 Tooltip 显示效果。我们需要确保这段文本足够长，以便在不同屏幕宽度下都能被正确地截断，从而验证UI的健壮性。';

const TICKET_OPERATION_TYPES = ['更新', '备份', '巡检'] as const;

const ticketRows: TicketRow[] = [
    {
        id: 'tkt001',
        customerName: '客户a',
        status: '就绪',
        operationType: '更新',
        operationContent: '对核心应用服务器 APP-SERVER-A 进行了版本升级，从 v1.2.5 升级到 v1.3.0，并应用了最新的安全补丁。'
    },
    {
        id: 'tkt002',
        customerName: '客户b',
        status: '挂起',
        operationType: '备份',
        operationContent: `执行了对 DB-SERVER-B 数据库的全量备份任务，备份文件已存储至远程存储桶，并验证了备份文件的完整性。${LONG_TICKET_TEXT}`
    },
    {
        id: 'tkt003',
        customerName: '客户c',
        status: '就绪',
        operationType: '巡检',
        operationContent: '完成了对客户C所有服务器的季度例行巡检，检查了系统日志、磁盘空间和CPU使用率，未发现异常。'
    },
    ...Array.from({length: 40}).map((_, i) => {
        // 【核心修复】为 status 变量添加显式类型注解
        const status: TicketRow['status'] = i % 3 === 0 ? '挂起' : '就绪';
        const opType = TICKET_OPERATION_TYPES[i % 3];
        return {
            id: `tkt${i + 4}`,
            customerName: `测试客户${(i % 7) + 1}`,
            status,
            operationType: opType,
            operationContent: `（第 ${i + 4} 条）${LONG_TICKET_TEXT}`
        };
    }),
];

export const fetchTickets = async (): Promise<TicketRow[]> => {
    await sleep(500); // 模拟 500ms 网络延迟
    console.log('API: Fetched Tickets');
    return ticketRows;
};


/* -------------------- 服务器 (Servers) -------------------- */

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

const LONG_SERVER_NOTE = '这是一段非常非常长的使用备注，用于测试在表格单元格中的文本溢出和 Tooltip 显示效果。我们需要确保这段文本足够长，以便在不同屏幕宽度下都能被截断。';

const serverRows: ServerRow[] = [
    {
        id: 'srv001',
        customerName: '客户a',
        serverName: 'APP-SERVER-A',
        ip: '192.168.1.10',
        role: '应用',
        note: LONG_SERVER_NOTE
    },
    {
        id: 'srv002',
        customerName: '客户a',
        serverName: 'DB-SERVER-AB',
        ip: '192.168.1.20',
        role: '数据库',
        note: LONG_SERVER_NOTE,
        dep: '共享',
        custNote: '客户 a/b 共用'
    },
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

export const fetchServers = async (): Promise<ServerRow[]> => {
    await sleep(500);
    console.log('API: Fetched Servers');
    return serverRows;
};

/* -------------------- 更新日志 (Changelog) -------------------- */

export interface ChangelogRow {
    id: string;
    customerName: string;
    updateTime: string;
    updateType: string;
    updateContent: string;
}

const LONG_LOG_TEXT = '这是一个用于测试 hover 效果的特别长的文本，需要足够多的内容才能在宽屏的50%列宽中产生溢出效果。我们再加一点，再加一点，现在应该足够长了。';

const changelogRows: ChangelogRow[] = [
    {
        id: 'log001',
        customerName: '客户a',
        updateTime: '2025-07-21 10:30',
        updateType: '功能更新',
        updateContent: LONG_LOG_TEXT
    },
    {
        id: 'log002',
        customerName: '客户b',
        updateTime: '2025-07-20 15:00',
        updateType: '安全修复',
        updateContent: LONG_LOG_TEXT
    },
    ...Array.from({length: 50}).map((_, i) => ({
        id: `log${i + 4}`,
        customerName: `测试客户${(i % 5) + 1}`,
        updateTime: `2025-06-${20 - (i % 20)} 14:00`,
        updateType: i % 2 === 0 ? 'Bug 修复' : '常规维护',
        updateContent: `（第 ${i + 4} 条）${LONG_LOG_TEXT}`
    })),
];


export const fetchChangelogs = async (): Promise<ChangelogRow[]> => {
    await sleep(500);
    console.log('API: Fetched Changelogs');
    return changelogRows;
};