/**
 * 文件名: src/components/ui/TooltipCell.tsx
 *
 * 本次修改内容:
 * - 【布局终极修复 & 功能恢复】采用全新的、手动控制 Tooltip 状态的方案，
 *   彻底解决了所有已知问题：
 *   1. **Tooltip 样式和层级正确**：重新使用 MUI 的 `<Tooltip>` 组件，
 *      通过 React Portal 渲染，无视表格的 `z-index` 层叠上下文，不会被固定列遮挡。
 *   2. **页面滚动条问题解决**:
 *      - 不再使用 `disableHoverListener`，而是通过 `open` prop 和 `useState` 手动控制 Tooltip。
 *      - 在 `onMouseEnter` 事件中，先检查内容是否溢出，只有溢出时才调用 `setOpen(true)`。
 *      - **关键**: `setOpen(true)` 的调用被包裹在 `requestAnimationFrame` 中，
 *        这会将状态更新推迟到浏览器下一次重绘之前，有效避免了状态更新与布局计算冲突
 *        导致的“布局抖动”和页面滚动条问题。
 *
 * 文件功能描述:
 * 此文件定义了一个 `TooltipCell` 组件，它是一个增强版的 `TableCell`，
 * 专用于在数据表格中优雅地处理长文本的显示。
 */
import React, { useState, useRef } from 'react';
import { TableCell, Tooltip, type TableCellProps } from '@mui/material';

interface TooltipCellProps extends TableCellProps {
    children: React.ReactNode;
}

const TooltipCell: React.FC<TooltipCellProps> = ({ children, sx, ...rest }) => {
    const [open, setOpen] = useState(false);
    const cellRef = useRef<HTMLTableCellElement>(null);

    const noWrapCellSx = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const handleMouseEnter = () => {
        const cell = cellRef.current;
        if (cell && cell.scrollWidth > cell.clientWidth) {
            // 使用 requestAnimationFrame 避免布局抖动
            requestAnimationFrame(() => {
                setOpen(true);
            });
        }
    };

    const handleMouseLeave = () => {
        requestAnimationFrame(() => {
            setOpen(false);
        });
    };

    return (
        <Tooltip
            title={children as string}
            placement="top"
            open={open}
            onClose={handleMouseLeave} // 当 Tooltip 因其他原因关闭时（例如点击外部），也同步状态
            onOpen={handleMouseEnter}  // 虽然我们手动控制，但保留 onOpen 以处理触摸设备等情况
            disableFocusListener     // 禁用焦点触发
            disableTouchListener     // 禁用触摸触发，完全由 mouse enter/leave 控制
            slotProps={{ tooltip: { className: 'tooltip-sidenav' } }}
        >
            <TableCell
                ref={cellRef}
                sx={{ ...noWrapCellSx, ...sx }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...rest}
            >
                {children}
            </TableCell>
        </Tooltip>
    );
};

export default TooltipCell;