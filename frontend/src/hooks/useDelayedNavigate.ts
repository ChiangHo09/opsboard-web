/**
 * @file src/hooks/useDelayedNavigate.ts
 * @description 提供一个自定义的 useDelayedNavigate Hook，用于封装带有延迟的导航逻辑。
 * @modification
 *   - [新功能]：创建此文件以解决CSS动画与React状态更新之间的竞态条件问题。
 *     - 此 Hook 返回一个函数，该函数在调用后会延迟执行 `react-router-dom` 的 `navigate`。
 *     - 这为浏览器提供了充足的时间来启动视觉动画（如涟漪效果），然后再执行会导致组件重渲染的导航操作，从而避免动画被中断。
 */
import { useCallback } from 'react';
import { useNavigate, type NavigateOptions } from 'react-router-dom';

/**
 * 一个自定义Hook，返回一个带有延迟的导航函数。
 * @param {number} [delay=200] - 导航前的延迟时间（毫秒）。
 * @returns {(to: string, options?: NavigateOptions) => void} - 一个函数，其签名与 `react-router-dom` 的 `navigate` 函数兼容。
 */
export function useDelayedNavigate(delay: number = 200): (to: string, options?: NavigateOptions) => void {
    // 获取原始的 navigate 函数
    const navigate = useNavigate();

    // 使用 useCallback 记忆化返回的函数，确保其引用在重渲染之间保持稳定。
    const delayedNavigate = useCallback((to: string, options?: NavigateOptions) => {
        // 使用 setTimeout 来延迟导航操作
        setTimeout(() => {
            navigate(to, options);
        }, delay);
    }, [navigate, delay]); // 依赖项：只有当 navigate 函数或 delay 值变化时才重新创建

    return delayedNavigate;
}