/**
 * 文件名: src/components/ui/TooltipCell.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个 `TooltipCell` 组件，它是一个增强版的 `TableCell`，
 * 专用于在数据表格中优雅地处理长文本的显示。仅当文本内容溢出时，
 * 才会通过鼠标悬停显示完整的 Tooltip。
 *
 * 本次修改内容:
 * - 【核心修复】通过添加 `disableHoverListener` 属性，彻底解决了 Tooltip 内部状态与外部 `open` prop 控制之间的冲突。
 * - 【逻辑优化】引入 `cellRef` 直接引用 `TableCell` 元素，使溢出判断逻辑 (`scrollWidth > clientWidth`) 更加健壮和明确。
 * - **问题根源**:
 *   未禁用 Tooltip 内置的悬停事件监听器。当通过 `open` prop 手动控制 Tooltip 的显示时，其内部的悬停逻辑仍然在运行。这种状态冲突是引发布局坍塌的直接导火索。
 * - **解决方案**:
 *   1.  在 `<Tooltip>` 组件上添加 `disableHoverListener` 属性，确保 Tooltip 的显示完全由 `open` 状态变量控制。
 *   2.  为 `TableCell` 添加 `ref={cellRef}`。
 *   3.  在 `handleMouseEnter` 事件中，使用 `cellRef.current.clientWidth` 来获取单元格的实际渲染宽度，替代了不够稳定的 `parentElement.clientWidth` 写法。
 * - **最终效果**:
 *   Tooltip 的显示逻辑现在是单一、可控的。鼠标悬停时，布局不再发生任何变化，仅在需要时平滑地显示提示信息，根除了列宽坍塌的问题。
 */
import React, {useState, useRef} from 'react';
import {TableCell, Tooltip, type TableCellProps, Box} from '@mui/material';

interface TooltipCellProps extends TableCellProps {
    children: React.ReactNode;
}

const TooltipCell: React.FC<TooltipCellProps> = ({children, sx, ...rest}) => {
    const [open, setOpen] = useState(false);
    // Ref 用于测量内容本身的真实宽度
    const contentRef = useRef<HTMLSpanElement>(null);
    // Ref 用于获取容器（单元格）的渲染宽度
    const cellRef = useRef<HTMLTableCellElement>(null);

    const handleMouseEnter = () => {
        const contentElement = contentRef.current;
        const cellElement = cellRef.current;

        // 仅当内容元素的滚动宽度大于其容器单元格的客户端宽度时，才显示 Tooltip
        if (contentElement && cellElement && contentElement.scrollWidth > cellElement.clientWidth) {
            setOpen(true);
        }
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    return (
        // TableCell 是布局的权威来源，为其添加 ref
        <TableCell
            ref={cellRef}
            sx={sx}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...rest}
        >
            <Tooltip
                title={children as string}
                placement="top"
                open={open}
                // 【核心修复】禁用 Tooltip 自己的悬停监听器，避免状态冲突
                disableHoverListener
                disableFocusListener
                disableTouchListener
                slotProps={{tooltip: {className: 'tooltip-sidenav'}}}
            >
                {/* 这个 Box/span 仅用于包裹内容和测量 scrollWidth */}
                <Box
                    ref={contentRef}
                    component="span"
                    sx={{
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {children}
                </Box>
            </Tooltip>
        </TableCell>
    );
};

export default TooltipCell;