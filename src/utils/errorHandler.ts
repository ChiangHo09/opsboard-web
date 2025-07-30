/**
 * 文件名: src/utils/errorHandler.ts
 *
 * 文件功能描述:
 * 此文件定义了一个统一的异步错误处理工具函数 `handleAsyncError`。
 * 它的职责是为那些无法被React错误边界捕获的错误（如事件处理器、Promise回调中的错误）
 * 提供一个标准的处理流程，通常包括记录错误和向用户显示通知。
 *
 * 本次修改内容:
 * - 【全新文件】创建此工具函数以标准化对异步错误的捕获和处理。
 */
import {type AlertColor} from '@mui/material';

// 在真实应用中，这个函数会更复杂，可能会接受一个通知回调函数作为参数
// 但为了演示，我们暂时让它直接在控制台打印
// 在与NotificationContext集成后，它可以调用showNotification

export const handleAsyncError = (
    error: unknown,
    showNotification?: (message: string, severity?: AlertColor) => void
) => {
    let errorMessage = '发生了一个未知错误。';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    console.error("handleAsyncError 捕获到错误:", error);

    // 如果提供了通知函数，则调用它
    if (showNotification) {
        showNotification(`操作失败: ${errorMessage}`, 'error');
    }
};