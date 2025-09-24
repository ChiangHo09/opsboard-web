/**
 * @file src/hooks/useScrollbarVisibility.ts
 * @description 一个自定义 React 钩子，用于检测指定元素上垂直滚动条的可见性。
 * @modification
 *   - [New File]: 创建此文件以解决 `PageLayout.tsx` 中找不到此模块的错误。
 *   - [Implementation]: 使用 `useEffect` 和 `ResizeObserver` 来高效地监控元素尺寸变化，并根据 `scrollHeight` 和 `clientHeight` 的差异判断滚动条是否存在。
 */
import { useState, useEffect, type RefObject } from 'react';

export const useScrollbarVisibility = (ref: RefObject<HTMLElement>): boolean => {
    const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // ResizeObserver 可以在元素尺寸变化时触发回调，比监听 window.resize 更高效
        const observer = new ResizeObserver(() => {
            // 当元素的内容高度大于其可见高度时，滚动条出现
            setIsScrollbarVisible(element.scrollHeight > element.clientHeight);
        });

        observer.observe(element);

        // 组件卸载时停止观察
        return () => observer.disconnect();
    }, [ref]);

    return isScrollbarVisible;
};