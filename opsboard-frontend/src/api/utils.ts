/**
 * @file src/api/utils.ts
 * @description 提供了 API 层可重用的辅助工具函数。
 * @modification
 *   - [New File]: 创建此文件，并将 `sleep` 函数从 `index.ts` 移至此处。
 *   - [Reason]: 此举旨在打破 API 模块间的循环依赖。模块化 API 文件（如 `changelogApi.ts`）现在可以安全地从此文件导入工具函数，而无需导入 `index.ts`，后者又需要从它们那里导出内容。
 */

/**
 * 一个模拟网络延迟的辅助函数。
 * @param ms - 延迟的毫秒数。
 * @returns 返回一个在指定时间后解析的 Promise。
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));