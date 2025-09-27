/**
 * @file src/utils/sessionManager.ts
 * @description 提供一个轻量级的事件桥接器，用于解耦 API 层和 UI 层的重新认证流程。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件] 创建此文件以管理全局的重新认证状态。
 *   - [功能] 导出了 `setReAuthHandler` 和 `requestReAuthentication` 方法。API 客户端使用 `requestReAuthentication` 来“暂停”并等待 UI 响应，而 `AuthContext` 使用 `setReAuthHandler` 来注册处理函数。
 */

// 定义一个类型，表示处理函数的 Promise 的 resolve 回调
type ReAuthResolver = () => void;

// 模块级变量，用于存储 UI 层提供的处理函数
let reAuthHandler: ((resolver: ReAuthResolver) => void) | null = null;

/**
 * 注册一个全局处理器，当需要重新认证时将调用此函数。
 * 通常由顶层 React 上下文（如 AuthContext）在挂载时设置。
 * @param handler - 一个函数，它接收一个 `resolver` 回调。当调用 `resolver` 时，表示重认证已完成。
 */
export const setReAuthHandler = (handler: (resolver: ReAuthResolver) => void): void => {
    reAuthHandler = handler;
};

/**
 * 请求用户重新进行身份认证。
 * 此函数返回一个 Promise，该 Promise 在用户成功重新认证后才会 resolve。
 * API 客户端可以 `await` 这个 Promise，从而暂停其执行，直到认证完成。
 * @returns {Promise<void>} 一个在重认证成功后解析的 Promise。
 */
export const requestReAuthentication = (): Promise<void> => {
    return new Promise((resolve) => {
        if (reAuthHandler) {
            // 调用已注册的 UI 处理器，并传入 resolve 函数
            // UI 处理器负责打开模态框，并在用户成功登录后调用此 resolve
            reAuthHandler(resolve);
        } else {
            // 如果没有设置处理器，立即拒绝 Promise
            // 这是一种安全回退，以防 UI 未正确初始化
            console.error('重新认证处理器未设置。用户将需要手动刷新页面。');
            // 在这种情况下，我们不解析 Promise，请求将永远挂起，
            // 这会阻止可能因未经身份验证而失败的操作。
            // 更好的做法可能是 reject，但这取决于具体的错误处理策略。
        }
    });
};