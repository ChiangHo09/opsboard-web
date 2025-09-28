/**
 * @file src/hooks/useSessionTimeout.ts
 * @description 一个自定义 Hook，通过定期检查上次活动时间来实现高效的闲置超时检测。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码规范]：将 `UseSessionTimeoutProps` 接口中 `key` 属性的类型从 `any` 更改为 `unknown`。
 *   - [原因]：此修改是为了解决 `@typescript-eslint/no-explicit-any` 的 lint 错误。`unknown` 是比 `any` 更类型安全的替代方案，它允许我们接收任何类型的值，同时强制在使用前进行类型检查，从而提高了代码的健壮性。
 */
import { useEffect, useRef } from 'react';
import { getLastActivityTime } from '@/utils/session';

interface UseSessionTimeoutProps {
    // [核心修复] 使用 unknown 代替 any，这是一种更类型安全的做法
    key?: unknown;
    onIdle: () => void;
    idleTimeoutMs: number;
    checkIntervalMs?: number;
}

export const useSessionTimeout = ({ key, onIdle, idleTimeoutMs, checkIntervalMs = 5000 }: UseSessionTimeoutProps) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkIdleTime = () => {
            const lastActivityTime = getLastActivityTime();
            const now = Date.now();
            const idleTime = now - lastActivityTime;

            if (lastActivityTime > 0 && idleTime > idleTimeoutMs) {
                onIdle();
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            }
        };

        intervalRef.current = setInterval(checkIdleTime, checkIntervalMs);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [onIdle, idleTimeoutMs, checkIntervalMs, key]);
};