/**
 * @file src/api/templateApi.tsx
 * @description 此文件定义了模板页面（TemplatePage）的模拟 API 层。
 *   它封装了与模板数据相关的类型、模拟数据和数据获取函数，
 *   将其从主 API 文件中分离，以提高模块化和代码清晰度。
 * @modification
 *   - [架构重构]：从 `src/api/index.ts` 中分离出模板 API 模块。
 *   - [架构重构]：将 `TemplateRow` 接口、`LONG_TEMPLATE_TEXT` 常量、`templateRows` 模拟数据数组和 `templateApi` 模块的定义移动到此文件。
 *   - [性能优化]：确保 `templateRows` 模拟数据数组作为模块级别的常量只生成一次，以提供稳定的数据引用。
 *   - [功能实现]：`fetchAll` 函数模拟异步数据获取，并返回稳定的 `templateRows` 引用。
 */

// 导入通用的 sleep 辅助函数，用于模拟网络延迟
import { sleep } from './index'; // 假设 index.ts 中导出了 sleep

/**
 * @interface TemplateRow
 * @description 定义了表格中单行模板数据的类型结构。
 * @property {string} id - 行的唯一标识符。
 * @property {string} name - 项目名称。
 * @property {'A' | 'B' | 'C'} category - 项目的分类。
 * @property {string} description - 项目的详细描述。
 */
export interface TemplateRow {
    id: string;
    name: string;
    category: 'A' | 'B' | 'C';
    description: string;
}

/**
 * @constant LONG_TEMPLATE_TEXT
 * @description 一个非常长的文本常量，用于测试表格单元格的文本溢出和 Tooltip 功能。
 */
const LONG_TEMPLATE_TEXT = '这是一个非常长的描述，用于演示当文本内容超出单元格宽度时，TooltipCell 组件是如何自动截断文本并提供悬停提示的。';

/**
 * @constant templateRows
 * @description 模拟的模板数据数组，作为模块级别的常量只生成一次。
 * @type {TemplateRow[]}
 */
const templateRows: TemplateRow[] = [
    { id: 'item-001', name: '模板项目 Alpha', category: 'A', description: '这是 Alpha 项目的简短描述。' },
    { id: 'item-002', name: '模板项目 Beta', category: 'B', description: LONG_TEMPLATE_TEXT },
    { id: 'item-003', name: '模板项目 Gamma', category: 'C', description: '这是 Gamma 项目的简短描述。' },
    ...Array.from({length: 20}).map((_, i) =>
        ({
            id: `item-${i + 4}`,
            name: `模板项目 ${i + 4}`,
            category: ['A', 'B', 'C'][i % 3] as TemplateRow['category'],
            description: `这是第 ${i + 4} 条项目的描述。`
        })
    ),
];

/**
 * @constant templateApi
 * @description 模板 API 模块，封装了与模板数据相关的获取函数。
 */
export const templateApi = {
    /**
     * @property {TemplateRow} Row - 用于类型重导出，方便其他模块引用 TemplateRow 类型。
     */
    Row: {} as import('./templateApi').TemplateRow, // 修正类型重导出路径
    /**
     * @function fetchAll
     * @description 异步获取所有模板数据。
     * @returns {Promise<TemplateRow[]>} - 一个解析为模板数据数组的 Promise。
     */
    async fetchAll(): Promise<TemplateRow[]> {
        await sleep(500); // 模拟网络延迟
        console.log('API: Fetched Templates');
        return templateRows; // 返回稳定的数据引用
    }
};
