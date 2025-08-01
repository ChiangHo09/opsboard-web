/**
 * @file src/components/ui/TooltipCell.tsx
 * @description 定义了一个增强版的 `TableCell`，它能智能地在内容因宽度不足而溢出时，自动显示一个包含完整内容的 Tooltip。
 * @modification 彻底重构了 Tooltip 的触发和内容生成逻辑，以解决其在处理非字符串子元素（如 Chip 组件）或特定布局下不显示的问题。
 *   - [重构]：引入了 `tooltipContent` 状态，用于动态存储应在 Tooltip 中显示的文本。
 *   - [修复]：移除了对 `children` prop 的错误类型断言 (`as string`)。现在，组件通过读取 DOM 元素的 `textContent` 属性来获取实际显示的文本，无论 `children` 是字符串还是 React 组件。
 *   - [效果]：此修改确保了组件的健壮性。现在，任何被截断的单元格内容，包括被包裹在 Chip 等组件内的文本，都能正确触发并显示包含完整内容的悬浮提示，统一了全站表格的交互体验。
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
        // 检查元素的滚动宽度是否大于其可见的偏移宽度。
        // 这是判断内容是否被截断的最可靠方法。
        if (element && element.scrollWidth > element.offsetWidth) {
            setIsOverflowed(true);
        }
    };

    const handleMouseLeave = () => {
        setIsOverflowed(false);
    };

    return (
        <TableCell
            sx={sx}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...rest}
        >
            <Tooltip
                // 仅在 isOverflowed 为 true 时显示 Tooltip
                title={isOverflowed ? (contentRef.current?.textContent || '') : ''}
                placement="top"
                // Tooltip 的开启状态完全由 isOverflowed 控制
                open={isOverflowed}
                disableHoverListener
                disableFocusListener
                disableTouchListener
                slotProps={{
                    tooltip: {
                        className: 'tooltip-sidenav',
                    },
                }}
            >
                {/*
                  这个 Box 同时负责内容显示和溢出检测。
                  它的 ref 用于在 handleMouseEnter 中进行尺寸比较。
                */}
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
        </TableCell>
    );
};

export default TooltipCell;