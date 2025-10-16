/**
 * @file src/utils/formatters.ts
 * @description 提供全应用范围内可复用的数据格式化工具函数。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [文件创建]：创建了该文件以集中管理格式化逻辑。
 *   - [功能新增]：添加了 `formatDateTime` 函数，用于将 ISO 8601 日期时间字符串或后端返回的 GoNullString 类型安全地格式化为本地化的、易于阅读的格式 (YYYY/MM/DD HH:mm:ss)。
 */
import { type GoNullString } from '@/api';

/**
 * 将 ISO 8601 格式的日期时间字符串或 GoNullString 对象格式化为 "YYYY/MM/DD HH:mm:ss" 格式。
 * 如果输入为 null、undefined 或无效的 GoNullString，则返回一个占位符。
 * @param {string | GoNullString | null | undefined} dateTimeInput - 输入的日期时间字符串或 GoNullString 对象。
 * @param {string} placeholder - 当输入无效时返回的占位符字符串，默认为 '-'。
 * @returns {string} 格式化后的日期时间字符串或占位符。
 */
export const formatDateTime = (dateTimeInput: string | GoNullString | null | undefined, placeholder: string = '-'): string => {
    // 检查 GoNullString 类型
    if (typeof dateTimeInput === 'object' && dateTimeInput !== null) {
        if (!dateTimeInput.Valid || !dateTimeInput.String) {
            return placeholder;
        }
        dateTimeInput = dateTimeInput.String;
    }

    if (!dateTimeInput || typeof dateTimeInput !== 'string') {
        return placeholder;
    }

    try {
        const date = new Date(dateTimeInput);
        // 验证日期是否有效
        if (isNaN(date.getTime())) {
            return placeholder;
        }

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return placeholder;
    }
};