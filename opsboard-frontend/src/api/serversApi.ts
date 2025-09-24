/**
 * @file src/api/serversApi.ts
 * @description 此文件定义了服务器（Servers）的模拟 API 层。
 * @modification
 *   - [依赖修复]: 将 `sleep` 函数的导入路径从 './index' 修改为 './utils'，以打破与 `index.ts` 的循环依赖。
 */
import { sleep } from './utils';

export interface ServerRow {
    id: string;
    customerName: string;
    serverName: string;
    ip: string;
    role: string;
    dep: string;
    custNote: string;
    note: string;
}

const serverRows: ServerRow[] = Array.from({ length: 40 }).map((_, i) => ({
    id: `srv-${String(i + 1).padStart(3, '0')}`,
    customerName: `客户${['A', 'B', 'C', 'D'][i % 4]}`,
    serverName: `app-server-${i + 1}`,
    ip: `192.168.${i % 4}.${100 + i}`,
    role: ['数据库', 'Web', '缓存', 'API'][i % 4],
    dep: ['生产', '测试'][i % 2],
    custNote: `客户备注信息 ${i + 1}`,
    note: `内部使用备注 ${i + 1}`
}));

export const serversApi = {
    Row: {} as ServerRow,
    async fetchAll(): Promise<ServerRow[]> {
        await sleep(600);
        return serverRows;
    }
};