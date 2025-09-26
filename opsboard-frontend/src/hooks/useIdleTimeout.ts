/**
 * @file src/hooks/useIdleTimeout.ts
 * @description 一个可重用的自定义 Hook，用于检测用户闲置并触发相应的回调。
 * @modification
 *   - [Type Fix]: 修正了 `useRef` 的类型定义和初始化。将 ref 的类型定义为 `NodeJS.Timeout | null` 并以 `null` 作为初始值。
 *   - [Reason]: 此更改正确地反映了计时器 ID 在初始状态或被清除后可能不存在（为 `null`）的情况，解决了 `Expected 1 arguments, but got 0` 的 TypeScript 编译错误。
 */
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIdleTimeoutProps {
    onIdle: () => void;
    onLogout: () => void;
    idleTimeoutMs: number;
    logoutTimeoutMs: number;
}

export const useIdleTimeout = ({ onIdle, onLogout, idleTimeoutMs, logoutTimeoutMs }: UseIdleTimeoutProps) => {
    const [isIdle, setIsIdle] = useState(false);
    // [核心修复] 正确地初始化 useRef，并定义其类型可以为 null
    const idleTimer = useRef<NodeJS.Timeout | null>(null);
    const logoutTimer = useRef<NodeJS.Timeout | null>(null);

    const resetTimers = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        if (logoutTimer.current) clearTimeout(logoutTimer.current);

        if (isIdle) {
            setIsIdle(false);
        }

        idleTimer.current = setTimeout(() => {
            setIsIdle(true);
            onIdle();
            logoutTimer.current = setTimeout(() => {
                onLogout();
            }, logoutTimeoutMs);
        }, idleTimeoutMs);
    }, [isIdle, onIdle, onLogout, idleTimeoutMs, logoutTimeoutMs]);

    const stayActive = () => {
        resetTimers();
    };

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

        const handleUserActivity = () => {
            resetTimers();
        };

        resetTimers();

        events.forEach(event => {
            window.addEventListener(event, handleUserActivity);
        });

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleUserActivity);
            });
            if (idleTimer.current) clearTimeout(idleTimer.current);
            if (logoutTimer.current) clearTimeout(logoutTimer.current);
        };
    }, [resetTimers]);

    return { stayActive };
};