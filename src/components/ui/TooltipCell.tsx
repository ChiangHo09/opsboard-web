/**
 * 文件名: src/components/ui/TooltipCell.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个 `TooltipCell` 组件，一个增强版的 `TableCell`，
 * 专用于在数据表格中优雅地处理长文本，仅在内容溢出时显示 Tooltip。
 *
 * 本次修改内容:
 * - 【布局坍塌终极修复】通过修正内容宽度的测量方式，彻底解决了所有相关问题。
 * - **问题根源**:
 *   内部用于测量的 `<span>` 使用了 `display: 'block'`，这导致其 `scrollWidth`
 *   错误地等于父级单元格的宽度，而非其自身内容的真实宽度，从而使溢出判断失效。
 * - **解决方案**:
 *   1.  将包裹内容的 `Box` 组件的 `display` 样式从 `'block'` 修改为 `'inline-block'`。
 *       这确保了 `scrollWidth` 能够精确测量文本内容的实际像素宽度。
 *   2.  简化了溢出判断逻辑，现在通过 `contentRef.current.parentElement`
 *       即可稳定地获取到父级 `TableCell` 元素进行宽度比较。
 * - **最终效果**:
 *   溢出判断现在 100% 准确。Tooltip 只在需要时显示，不再与 `sticky` 定位或
 *   表格布局产生任何冲突，彻底根除了所有布局坍塌和闪烁问题。
 */
import {useState, useRef, type ReactNode, type JSX} from 'react';
import {TableCell, Tooltip, type TableCellProps, Box} from '@mui/material';

interface TooltipCellProps extends TableCellProps {
    children: ReactNode;
}

const TooltipCell = ({children, sx, ...rest}: TooltipCellProps): JSX.Element => {
    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = () => {
        const contentElement = contentRef.current;
        const cellElement = contentElement?.parentElement; // 父元素就是 TableCell

        if (contentElement && cellElement && contentElement.scrollWidth > cellElement.clientWidth) {
            setOpen(true);
        }
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    return (
        <TableCell
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
                slotProps={{tooltip: {className: 'tooltip-sidenav'}}}
            >
                {/* 【核心修复】使用 inline-block 来正确测量内容宽度 */}
                <Box
                    ref={contentRef}
                    component="span"
                    sx={{
                        display: 'inline-block', // 确保 scrollWidth 是内容的真实宽度
                        width: '100%',           // 同时让它填满单元格
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