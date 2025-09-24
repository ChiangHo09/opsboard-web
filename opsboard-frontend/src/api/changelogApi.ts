/**
 * @file src/api/changelogApi.ts
 * @description 此文件定义了变更日志（Changelog）的模拟 API 层。
 * @modification
 *   - [依赖修复]: 将 `sleep` 函数的导入路径从 './index' 修改为 './utils'，以打破与 `index.ts` 的循环依赖。
 */
import { sleep } from './utils';

export interface ChangelogRow {
    id: string;
    customerName: string;
    updateTime: string;
    updateType: string;
    updateContent: string;
}

const changelogRows: ChangelogRow[] = Array.from({ length: 30 }).map((_, i) => ({
    id: `log${String(i + 1).padStart(3, '0')}`,
    customerName: `客户${['A', 'B', 'C'][i % 3]}`,
    updateTime: `2023-10-${String(28 - i).padStart(2, '0')} 14:00`,
    updateType: ['功能新增', 'Bug修复', '性能优化'][i % 3],
    updateContent: `这是第 ${i + 1} 条更新日志的详细内容，用于描述本次更新的具体事项。`
}));

export const changelogsApi = {
    Row: {} as ChangelogRow,
    async fetchAll(): Promise<ChangelogRow[]> {
        await sleep(400);
        return changelogRows;
    }
};