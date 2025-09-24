/**
 * @file src/api/templateApi.ts
 * @description 此文件定义了模板页面（TemplatePage）的模拟 API 层。
 * @modification
 *   - [依赖修复]: 将 `sleep` 函数的导入路径从 './index' 修改为 './utils'，以打破与 `index.ts` 的循环依赖。
 */
import { sleep } from './utils';

export interface TemplateRow {
    id: string;
    name: string;
    category: 'A' | 'B' | 'C';
    description: string;
}

const LONG_TEMPLATE_TEXT = '这是一个非常长的描述，用于演示当文本内容超出单元格宽度时，TooltipCell 组件是如何自动截断文本并提供悬停提示的。';

const templateRows: TemplateRow[] = [
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
    Row: {} as TemplateRow,
    async fetchAll(): Promise<TemplateRow[]> {
        await sleep(500);
        return templateRows;
    }
};