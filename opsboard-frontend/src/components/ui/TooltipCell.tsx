/**
 * @file src/components/ui/TooltipCell.tsx
 * @description 定义了一个增强版的 `TableCell`，它能智能地在内容因宽度不足而溢出时，自动显示一个包含完整内容的 Tooltip。
 * @modification
 *   - [性能优化]：使用 `React.memo` 包裹 `TooltipCell` 组件。这将确保组件只有在其 props 发生引用变化时才重新渲染，从而减少不必要的 DOM 测量和状态更新，提高表格渲染性能。
 *   - [架构重构]：组件不再渲染根部的 `<TableCell>` 元素。它现在只作为一个纯粹的内容包装器，提供溢出检测和 Tooltip 功能，以适应新的 Flexbox 布局。
 *   - [核心修复]：移除了在 `onMouseEnter` 中触发的状态更新。现在使用 `useLayoutEffect` 在渲染后进行一次性的溢出检测。
 *   - [最终效果]：此修改将高频的 `hover` 事件与 `state update` 彻底解耦，避免了在悬浮时触发不必要的重渲染，从而根除了导致父组件布局崩溃的bug。
 */
import {useState, useRef, type ReactNode, type JSX, useLayoutEffect, memo} from 'react';
import {Tooltip, Box} from '@mui/material';

interface TooltipCellProps {
    children: ReactNode;
}

// 使用 React.memo 包裹 TooltipCell
const TooltipCell = memo(({children}: TooltipCellProps): JSX.Element => {
    const [isOverflowed, setIsOverflowed] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // useLayoutEffect 确保在 DOM 更新后同步执行，用于测量 DOM 元素。
    // 依赖项 [children, isOverflowed]：
    // - children: 当内容变化时需要重新检测溢出。
    // - isOverflowed: 当状态变化时，确保 effect 重新运行以反映最新的 DOM 状态。
    useLayoutEffect(() => {
        const element = contentRef.current;
        if (element) {
            // 检测内容是否溢出：如果滚动宽度大于实际宽度，则表示溢出。
            const hasOverflow = element.scrollWidth > element.offsetWidth;
            // 只有当溢出状态发生变化时才更新 state，避免不必要的 re-render。
            if (hasOverflow !== isOverflowed) {
                setIsOverflowed(hasOverflow);
            }
        }
    }, [children, isOverflowed]); // 依赖 children 和 isOverflowed

    return (
        <Tooltip
            // 只有当内容溢出时才显示 Tooltip
            title={isOverflowed ? children : ''}
            placement="top"
        >
            <Box
                ref={contentRef}
                sx={{
                    whiteSpace: 'nowrap', // 强制文本不换行
                    overflow: 'hidden', // 隐藏溢出部分
                    textOverflow: 'ellipsis', // 溢出时显示省略号
                    width: '100%', // 占据父容器所有宽度
                }}
            >
                {children}
            </Box>
        </Tooltip>
    );
});

export default TooltipCell;