/**
 * 文件名: src/utils/__tests__/errorHandler.test.ts
 *
 * 文件功能描述:
 * 此文件是 `errorHandler.ts` 工具函数的单元测试集。
 * 它负责验证 `handleAsyncError` 函数在接收不同类型的错误时，
 * 是否能够正确地执行其核心逻辑（如记录日志、调用通知回调）。
 */

import {handleAsyncError} from '../errorHandler';

// 使用 describe 来组织一组相关的测试
describe('handleAsyncError', () => {
    let consoleSpy: jest.SpyInstance;

    // 在每个测试运行之前，创建一个 console.error 的“间谍”
    // 这允许我们检查它是否被调用，同时 .mockImplementation(() => {}) 可以阻止它在测试报告中打印日志
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    // 在每个测试运行之后，恢复 console.error 的原始功能，防止测试之间相互影响
    afterEach(() => {
        consoleSpy.mockRestore();
    });

    // 测试用例 1: 当传入一个 Error 对象时
    it('should log the error and its message when given an Error object', () => {
        const testError = new Error('这是一个测试错误');
        const mockShowNotification = jest.fn(); // 创建一个模拟的通知函数

        // 执行被测试的函数
        handleAsyncError(testError, mockShowNotification);

        // 断言：检查 console.error 是否被以预期的参数调用
        expect(consoleSpy).toHaveBeenCalledWith("handleAsyncError 捕获到错误:", testError);
        // 断言：检查通知函数是否被以预期的消息调用
        expect(mockShowNotification).toHaveBeenCalledWith('操作失败: 这是一个测试错误', 'error');
    });

    // 测试用例 2: 当传入一个字符串时
    it('should log the string and use it as a message when given a string', () => {
        const testErrorString = '发生了一个字符串错误';
        const mockShowNotification = jest.fn();

        handleAsyncError(testErrorString, mockShowNotification);

        expect(consoleSpy).toHaveBeenCalledWith("handleAsyncError 捕获到错误:", testErrorString);
        expect(mockShowNotification).toHaveBeenCalledWith('操作失败: 发生了一个字符串错误', 'error');
    });

    // 测试用例 3: 当传入未知类型时
    it('should use a generic message for unknown error types', () => {
        const unknownError = {code: 500};
        const mockShowNotification = jest.fn();

        handleAsyncError(unknownError, mockShowNotification);

        expect(consoleSpy).toHaveBeenCalledWith("handleAsyncError 捕获到错误:", unknownError);
        expect(mockShowNotification).toHaveBeenCalledWith('操作失败: 发生了一个未知错误。', 'error');
    });

    // 测试用例 4: 当没有提供通知函数时
    it('should only log to console if no notification function is provided', () => {
        const testError = new Error('仅记录日志');

        handleAsyncError(testError); // 不传入第二个参数

        expect(consoleSpy).toHaveBeenCalledWith("handleAsyncError 捕获到错误:", testError);
    });
});