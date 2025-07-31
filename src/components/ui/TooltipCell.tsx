/**
 * 文件名: src/components/ui/TooltipCell.tsx
 *
 * 文件职责:
 * 此文件定义了一个 `TooltipCell` 组件，一个增强版的 `TableCell`，
 * 专用于在数据表格中优雅地处理长文本，仅在内容溢出时显示 Tooltip。
 *
 * 本次改动内容:
 * - 【样式统一】将弹出的 Tooltip 提示框的样式与全局主题中定义的 `tooltip-sidenav` 样式保持一致。
 * - **解决方案**:
 *   移除了之前在 `slotProps` 中内联的 `sx` 样式。取而代之的是，通过 `slotProps={{ tooltip: { className: 'tooltip-sidenav' } }}`，为弹出的提示框应用了在 `theme.ts` 中预先定义好的全局 CSS 类。
 * - **最终效果**:
 *   Tooltip 的外观（背景色、字体颜色、边框等）现在完全由全局主题控制，与应用中其他部分的 Tooltip 风格完全统一，实现了样式的单一来源管理。
 */
import {useState, useRef, type ReactNode, type JSX} from 'react';
import {TableCell, Tooltip, type TableCellProps, Box} from '@mui/material';

interface TooltipCellProps extends TableCellProps {
    children: ReactNode;
}

const TooltipCell = ({children, sx, ...rest}: TooltipCellProps): JSX.Element => {
    const [open, setOpen] = useState(false);
    const cellRef = useRef<HTMLTableCellElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = () => {
        const contentElement = contentRef.current;
        const cellElement = cellRef.current;

        if (contentElement && cellElement && contentElement.scrollWidth > cellElement.clientWidth) {
            setOpen(true);
        }
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    return (
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
                disableHoverListener
                disableFocusListener
                disableTouchListener
                slotProps={{
                    tooltip: {
                        // 【核心修改】应用在 theme.ts 中定义的全局样式类
                        className: 'tooltip-sidenav',
                    },
                }}
            >
                <Box
                    ref={contentRef}
                    component="span"
                    sx={{
                        display: 'inline-block',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        verticalAlign: 'bottom',
                    }}
                >
                    {children}
                </Box>
            </Tooltip>
        </TableCell>
    );
};

export default TooltipCell;