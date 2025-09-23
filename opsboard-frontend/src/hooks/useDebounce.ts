/**
 * @file src/hooks/useDebounce.ts
 * @description 提供一个 useDebounce 自定义钩子，用于延迟处理快速变化的值（如用户输入）。
 * @modification
 *   - [新功能]：创建了此文件，实现了一个通用的防抖钩子。
 *     - 它接收一个值（value）和一个延迟时间（delay）。
 *     - 仅当该值在指定延迟时间内没有发生变化时，才返回最新的值。
 *     - 这对于避免在用户连续输入时频繁触发 API 请求或昂贵计算非常有效。
 */
import { useState, useEffect } from 'react';

/**
 * 一个自定义钩子，用于对一个快速变化的值进行防抖处理。
 * @template T 值的类型。
 * @param {T} value 需要进行防抖处理的值，例如搜索框的输入。
 * @param {number} delay 防抖延迟时间，单位为毫秒。
 * @returns {T} 返回经过防抖处理的值。该值仅在输入停止变化超过 `delay` 时间后才会更新。
 */
export function useDebounce<T>(value: T, delay: number): T {
    // 状态：存储经过防抖处理的值
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 设置一个定时器，在指定的延迟后更新防抖值
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 清理函数：在下一次 effect 运行前或组件卸载时清除上一个定时器。
        // 这是实现防抖的关键：如果在 delay 期间 value 发生变化，旧的定时器会被清除，新的定时器会重新开始计时。
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // 仅当 value 或 delay 变化时，才重新运行 effect

    return debouncedValue;
}