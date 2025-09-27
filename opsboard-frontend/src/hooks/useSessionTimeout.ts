/**
 * @file src/hooks/useSessionTimeout.ts
 * @description 一个自定义 Hook，通过定期检查上次活动时间来实现高效的闲置超时检测。
 * @modification
 *   - [New File]: 创建此文件以实现新的“惰性检查”超时逻辑。
 *   - [Restart Logic]: 将 `key` 添加到 `useEffect` 的依赖项数组中。当外部传入的 `key` 发生变化时，`useEffect` 会自动清理旧的 interval 并创建一个新的，从而以一种符合 React 模式的方式“重启”计时器。
 */
import { useEffect, useRef } from 'react';
import { getLastActivityTime } from '@/utils/session';

interface UseSessionTimeoutProps {
    key?: any; // 接收一个可选的 key prop，用于重启
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
    }, [onIdle, idleTimeoutMs, checkIntervalMs, key]); // 将 key 添加到依赖数组
};