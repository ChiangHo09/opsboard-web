/**
 * @file src/components/ui/TooltipCell.tsx
 * @description 定义了一个增强版的 `TableCell`，它能智能地在内容因宽度不足而溢出时，自动显示一个包含完整内容的 Tooltip。
 * @modification 本次提交为最终修复方案的一部分，旨在消除与父组件的交互冲突。
 *   - [架构重构]：组件不再渲染根部的 `<TableCell>` 元素。它现在只作为一个纯粹的内容包装器，提供溢出检测和 Tooltip 功能，以适应新的 Flexbox 布局。
 *   - [核心修复]：移除了在 `onMouseEnter` 中触发的状态更新。现在使用 `useLayoutEffect` 在渲染后进行一次性的溢出检测。
 *   - [最终效果]：此修改将高频的 `hover` 事件与 `state update` 彻底解耦，避免了在悬浮时触发不必要的重渲染，从而根除了导致父组件布局崩溃的bug。
 */
import {useState, useRef, type ReactNode, type JSX, useLayoutEffect} from 'react';
import {Tooltip, Box} from '@mui/material';

interface TooltipCellProps {
    children: ReactNode;
}

const TooltipCell = ({children}: TooltipCellProps): JSX.Element => {
    const [isOverflowed, setIsOverflowed] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const element = contentRef.current;
        if (element) {
            const hasOverflow = element.scrollWidth > element.offsetWidth;
            if (hasOverflow !== isOverflowed) {
                setIsOverflowed(hasOverflow);
            }
        }
    }, [children, isOverflowed]);

    return (
        <Tooltip
            title={isOverflowed ? children : ''}
            placement="top"
        >
            <Box
                ref={contentRef}
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                }}
            >
                {children}
            </Box>
        </Tooltip>
    );
};

export default TooltipCell;