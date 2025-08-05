/**
 * @file src/components/ui/TooltipCell.tsx
 * @description 定义了一个增强版的 `TableCell`，它能智能地在内容因宽度不足而溢出时，自动显示一个包含完整内容的 Tooltip。
 * @modification 本次提交旨在清理冗余的样式代码。
 *   - [代码简化]：移除了组件本地的 `slotProps` 样式定义。现在该组件会直接继承在 `theme.ts` 中定义的全局默认 Tooltip 样式，确保了视觉一致性并简化了代码。
 */
import {useState, useRef, type ReactNode, type JSX} from 'react';
import {TableCell, Tooltip, type TableCellProps, Box} from '@mui/material';

interface TooltipCellProps extends TableCellProps {
    children: ReactNode;
}

const TooltipCell = ({children, sx, ...rest}: TooltipCellProps): JSX.Element => {
    const [isOverflowed, setIsOverflowed] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        const element = contentRef.current;
        if (element && element.scrollWidth > element.offsetWidth) {
            setIsOverflowed(true);
        }
    };

    const handleMouseLeave = () => {
        setIsOverflowed(false);
    };

    return (
        <TableCell sx={sx} {...rest}>
            <Tooltip
                title={isOverflowed ? (contentRef.current?.textContent || '') : ''}
                placement="top"
                open={isOverflowed}
                disableHoverListener
                disableFocusListener
                disableTouchListener
                // 【核心修改】移除所有 slotProps，样式将自动从 theme.ts 继承
            >
                <Box
                    ref={contentRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
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
        </TableCell>
    );
};

export default TooltipCell;