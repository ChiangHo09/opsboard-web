/**
 * @file src/components/ui/TooltipCell.tsx
 * @description 定义了一个增强版的 `TableCell`，它能智能地在内容因宽度不足而溢出时，自动显示一个包含完整内容的 Tooltip。
 * @modification 彻底重构了组件的内部结构，以“内外分离”的策略从根本上解决了布局塌陷和悬浮时出现空白的问题。
 *   - [核心修复]：将所有布局约束、事件监听和溢出检测逻辑从根元素 `TableCell` 移至其内部的一个 `Box` 组件上。
 *   - [原因]：此前的实现中，`TableCell` 自身的重渲染会干扰 `table-layout: fixed` 的计算。新方法让 `TableCell` 变成一个纯粹、稳定的布局容器，而内部的 `Box` 成为一个独立的、负责所有动态逻辑的功能单元。
 *   - [效果]：`TableCell` 的尺寸不再受内部状态变化影响，创建了一个绝对稳定的布局边界，彻底消除了悬浮时的布局塌陷问题，并使溢出检测更加可靠。
 */
import {useState, useRef, type ReactNode, type JSX} from 'react';
import {TableCell, Tooltip, type TableCellProps, Box} from '@mui/material';

interface TooltipCellProps extends TableCellProps {
    children: ReactNode;
}

const TooltipCell = ({children, sx, ...rest}: TooltipCellProps): JSX.Element => {
    const [isOverflowed, setIsOverflowed] = useState(false);
    // ref 现在绑定在负责内容显示和截断的内部 Box 上。
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
        // TableCell 现在是一个纯粹的容器，其 sx 来自外部，不参与内部逻辑。
        <TableCell sx={sx} {...rest}>
            <Tooltip
                title={isOverflowed ? (contentRef.current?.textContent || '') : ''}
                placement="top"
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
                  这个 Box 是所有逻辑的核心：
                  1. 它应用了所有截断样式。
                  2. 它监听鼠标事件。
                  3. 它的 ref 被用于溢出检测。
                */}
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