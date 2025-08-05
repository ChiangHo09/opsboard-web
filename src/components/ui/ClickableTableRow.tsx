/**
 * @file src/components/ui/ClickableTableRow.tsx
 * @description 提供一个可交互的表格行。通过将事件监听和状态管理提升至行级别，彻底解决了布局塌陷和子组件事件被劫持的问题。
 * @modification 彻底重构了组件实现，采用了更稳定和健壮的事件委托模式。
 *   - [核心架构]：移除了原有的、基于 `React.cloneElement` 和绝对定位 `ButtonBase` 的“第一单元格锚点”策略。
 *   - [事件处理]：将 `onClick` 事件直接绑定在 `<TableRow>` 上，并应用 `cursor: pointer` 样式，提供了清晰的交互指示。
 *   - [布局稳定]：此改动从根本上消除了因 `ButtonBase` 覆盖层导致的布局塌陷和渲染闪烁问题。
 *   - [子事件修复]：由于不再有覆盖层，鼠标事件（如 `onMouseEnter`）现在可以正确地传递到每一个子单元格（`TooltipCell`），使其能够按预期工作。
 *   - [代码简化]：新实现更加简洁、直观，易于理解和维护，且完全符合 React 的组合模式。
 */
import {type ReactNode, type JSX} from 'react';
import {TableRow, type TableRowProps} from '@mui/material';

// Omit 'children' from TableRowProps and redefine it to be more specific if needed,
// but for this component, ReactNode is appropriate.
interface ClickableTableRowProps extends Omit<TableRowProps, 'onClick' | 'children'> {
    children: ReactNode;
    onClick: () => void;
}

const ClickableTableRow = ({children, onClick, selected, ...rest}: ClickableTableRowProps): JSX.Element => {
    return (
        <TableRow
            {...rest}
            selected={selected}
            onClick={onClick} // 直接在 TableRow 上处理点击事件
            sx={{
                cursor: 'pointer', // 明确指示该行为可交互
                // 将悬浮和选中样式直接应用到 TableRow，由其子单元格继承
                '&:hover': {
                    '.MuiTableCell-root': {
                        backgroundColor: 'action.hover',
                    }
                },
                // 确保选中状态的样式优先级更高
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
                // 移除任何可能由旧实现残留的相对定位
                position: 'static',
            }}
        >
            {/*
              直接渲染子元素，不做任何克隆或注入。
              现在每个子组件（TooltipCell）都能独立接收自己的鼠标事件。
            */}
            {children}
        </TableRow>
    );
};

export default ClickableTableRow;