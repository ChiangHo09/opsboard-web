/**
 * @file src/components/ui/ClickableTableRow.tsx
 * @description 提供一个带涟漪效果的、完全可交互的表格行，同时确保布局稳定且子组件事件正常。
 * @modification
 *   - [Code Quality]: 修复了 "unused variable" (TS6133) 的编译警告。移除了 `handleClick` 函数中未被使用的 `event` 参数，使代码更简洁、意图更明确。
 *   - [最终架构]：采用事件委托与程序化涟漪触发的终极方案，彻底解决了所有已知问题。
 */
import { useRef, type ReactNode, type JSX } from 'react';
import React from 'react';
import { TableRow, type TableRowProps } from '@mui/material';
import RippleRow, { type RippleRowRef } from './RippleRow';

interface ClickableTableRowProps extends Omit<TableRowProps, 'onClick' | 'children'> {
    children: ReactNode;
    onClick: () => void;
}

const ClickableTableRow = ({ children, onClick, selected, ...rest }: ClickableTableRowProps): JSX.Element => {
    const rippleRowRef = useRef<RippleRowRef>(null);
    const colSpan = React.Children.count(children);

    /**
     * @function handleClick
     * @description 处理整行的点击事件。
     */
        // 【核心修改】移除了未使用的 `event` 参数，以修复 TS6133 警告。
    const handleClick = () => {
            // 1. 触发涟漪效果
            if (rippleRowRef.current) {
                rippleRowRef.current.triggerRipple();
            }

            // 2. 执行从 props 传入的业务逻辑（例如，导航）
            onClick();
        };

    return (
        <TableRow
            {...rest}
            selected={selected}
            onClick={handleClick}
            sx={{
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                    '.MuiTableCell-root': {
                        backgroundColor: 'action.hover',
                    }
                },
                '&.Mui-selected': {
                    '.MuiTableCell-root': {
                        backgroundColor: 'action.selected',
                    },
                    '&:hover': {
                        '.MuiTableCell-root': {
                            backgroundColor: 'action.selected',
                        }
                    }
                },
            }}
        >
            {children}
            <RippleRow ref={rippleRowRef} colSpan={colSpan} />
        </TableRow>
    );
};

export default ClickableTableRow;