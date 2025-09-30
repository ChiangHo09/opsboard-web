/**
 * @file src/api/templateApi.ts
 * @description 此文件定义了模板页面（Template）的模拟 API 层。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `deleteById` 函数，用于模拟根据 ID 删除一条记录的异步操作。
 *   - [实现]：该函数会从模拟数据数组中找到并移除指定的项，并模拟一个网络延迟，以使其行为更接近真实的 API 调用。
 */
import { sleep } from './utils';

export interface TemplateRow {
    id: string;
    name: string;
    category: 'A' | 'B' | 'C';
    description: string;
}

const LONG_TEMPLATE_TEXT = '这是一个非常长的描述，用于演示当文本内容超出单元格宽度时，TooltipCell 组件是如何自动截断文本并提供悬停提示的。';

// [核心修复] 将数据源声明为 let，以便可以被修改
let templateRows: TemplateRow[] = [
    { id: 'item-001', name: '模板项目 Alpha', category: 'A', description: '这是 Alpha 项目的简短描述。' },
    { id: 'item-002', name: '模板项目 Beta', category: 'B', description: LONG_TEMPLATE_TEXT },
    { id: 'item-003', name: '模板项目 Gamma', category: 'C', description: '这是 Gamma 项目的简短描述。' },
    ...Array.from({ length: 20 }).map((_, i) =>
        ({
            id: `item-${i + 4}`,
            name: `模板项目 ${i + 4}`,
            category: ['A', 'B', 'C'][i % 3] as TemplateRow['category'],
            description: `这是第 ${i + 4} 条项目的描述。`
        })
    ),
];

export const templateApi = {
    /**
     * 异步获取所有模板数据。
     * @returns {Promise<TemplateRow[]>} 返回一个解析为模板数据数组的 Promise。
     */
    async fetchAll(): Promise<TemplateRow[]> {
        await sleep(500);
        return templateRows;
    },

    /**
     * 异步删除指定 ID 的模板数据。
     * @param {string} id - 要删除的模板项的 ID。
     * @returns {Promise<void>} 操作成功时，返回一个 resolved 的 Promise。
     */
    async deleteById(id: string): Promise<void> {
        await sleep(500);
        templateRows = templateRows.filter(row => row.id !== id);
        return Promise.resolve();
    }
};