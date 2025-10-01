/**
 * @file src/api/templateApi.ts
 * @description 此文件定义了模板页面（Template）的模拟 API 层，已支持分页。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：更新了 `fetchAll` 函数以模拟后端分页。它现在接收 `page` 和 `pageSize` 参数，并返回一个符合 `PaginatedResponse` 结构的对像。
 *   - [原因]：此修改是为了使其函数签名与 `useResponsiveDetailView` 钩子的期望相匹配，从而解决了 TypeScript 的类型不兼容错误 (TS2322)。
 */
import { sleep } from './utils';
import type { PaginatedResponse } from './index';

export interface TemplateRow {
    id: string;
    name: string;
    category: 'A' | 'B' | 'C';
    description: string;
}

const LONG_TEMPLATE_TEXT = '这是一个非常长的描述，用于演示当文本内容超出单元格宽度时，TooltipCell 组件是如何自动截断文本并提供悬停提示的。';

let allTemplateRows: TemplateRow[] = [
    { id: 'item-001', name: '模板项目 Alpha', category: 'A', description: '这是 Alpha 项目的简短描述。' },
    { id: 'item-002', name: '模板项目 Beta', category: 'B', description: LONG_TEMPLATE_TEXT },
    { id: 'item-003', name: '模板项目 Gamma', category: 'C', description: '这是 Gamma 项目的简短描述。' },
    ...Array.from({ length: 47 }).map((_, i) =>
        ({
            id: `item-${String(i + 4).padStart(3, '0')}`,
            name: `模板项目 ${i + 4}`,
            category: ['A', 'B', 'C'][i % 3] as TemplateRow['category'],
            description: `这是第 ${i + 4} 条项目的描述。`
        })
    ),
];

export const templateApi = {
    /**
     * 异步模拟获取所有模板数据（支持分页）。
     * @param {number} page - 当前页码 (从1开始)。
     * @param {number} pageSize - 每页记录数。
     * @returns {Promise<PaginatedResponse<TemplateRow>>} 返回一个包含总数和当前页数据的 Promise。
     */
    async fetchAll(page: number, pageSize: number): Promise<PaginatedResponse<TemplateRow>> {
        await sleep(300);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = allTemplateRows.slice(start, end);
        return {
            total: allTemplateRows.length,
            data: paginatedData,
        };
    },

    async deleteById(id: string): Promise<void> {
        await sleep(500);
        allTemplateRows = allTemplateRows.filter(row => row.id !== id);
        return Promise.resolve();
    }
};