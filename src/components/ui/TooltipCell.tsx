/**
 * 文件名: src/components/ui/TooltipCell.tsx
 *
 * 本次修改内容:
 * - 【样式统一 & 修复】为了与 `SideNav` 中的 Tooltip 样式保持一致，并修复之前不显示的问题，
 *   此组件现在通过 `slotProps={{ tooltip: { className: 'tooltip-sidenav' } }}`
 *   来正确地应用在 `theme.ts` 中定义的全局样式。
 *
 * 文件功能描述:
 * 此文件定义了一个 `TooltipCell` 组件，它是一个增强版的 `TableCell`，
 * 专用于在数据表格中优雅地处理长文本的显示。
 */
import React, { useState, useRef, useEffect } from 'react';
import { TableCell, Tooltip, type TableCellProps } from '@mui/material';

interface TooltipCellProps extends TableCellProps {
    children: React.ReactNode;
}

const TooltipCell: React.FC<TooltipCellProps> = ({ children, sx, ...rest }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const cellRef = useRef<HTMLTableCellElement>(null);

    const noWrapCellSx = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    useEffect(() => {
        const cell = cellRef.current;
        if (cell) {
            const checkOverflow = () => {
                setIsOverflowing(cell.scrollWidth > cell.clientWidth);
            };
            checkOverflow();
            const resizeObserver = new ResizeObserver(checkOverflow);
            resizeObserver.observe(cell);
            return () => resizeObserver.disconnect();
        }
    }, [children]);

    return (
        <Tooltip
            title={children as string}
            placement="top"
            disableHoverListener={!isOverflowing}
            // 【核心修复】使用 slotProps 将 className 传递给正确的元素
            slotProps={{ tooltip: { className: 'tooltip-sidenav' } }}
        >
            <TableCell
                ref={cellRef}
                sx={{ ...noWrapCellSx, ...sx }}
                {...rest}
            >
                {children}
            </TableCell>
        </Tooltip>
    );
};

export default TooltipCell;