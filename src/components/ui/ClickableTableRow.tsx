/**
 * @file src/components/ui/ClickableTableRow.tsx
 * @description 提供一个带涟漪效果的、完全可交互的表格行。通过“第一单元格锚点”策略，从根本上解决了在 `table-layout: fixed` 表格中交互导致布局塌陷的问题。
 * @modification
 *   - [Type Safety]: 修复了所有 TypeScript 错误。通过为被克隆的元素提供精确的 props 类型（`{ children?: ReactNode }`），解决了 `no-explicit-any` 和 `props is of type unknown` 的问题。
 *   - [Robustness]: 使用 `React.Children.toArray` 来安全地处理所有类型的子节点。
 *   - [Type Guard]: 在执行 `React.cloneElement` 之前，使用 `React.isValidElement` 作为类型守卫，确保只对有效的 React 元素进行操作。
 */
import React, {type ReactNode, type JSX} from 'react';
import {TableRow, ButtonBase, type TableRowProps} from '@mui/material';

interface ClickableTableRowProps extends Omit<TableRowProps, 'onClick' | 'children'> {
    children: ReactNode; // 接受所有合法的 React 子节点
    onClick: () => void;
}

const ClickableTableRow = ({children, onClick, selected, ...rest}: ClickableTableRowProps): JSX.Element | null => {
    // 使用 React.Children.toArray 安全地将 children 转换为数组，以处理各种情况（单个元素、数组、Fragment 等）
    const childrenArray = React.Children.toArray(children);

    // 守卫：如果没有任何子元素，则不渲染任何内容
    if (childrenArray.length === 0) {
        return null;
    }

    // 分离第一个子元素和其他子元素
    const [firstChild, ...otherChildren] = childrenArray;

    // 类型守卫：确保第一个子元素是我们可以克隆的有效 React 元素
    if (!React.isValidElement(firstChild)) {
        // 如果第一个子元素不是有效元素（例如，只是一个字符串），
        // 则打印一个开发时错误，并渲染一个不带点击功能的普通行作为回退，以避免应用崩溃。
        console.error(
            "ClickableTableRow's first child is not a valid React element. The ripple effect will not be applied.",
            firstChild
        );
        return <TableRow {...rest} selected={selected}>{children}</TableRow>;
    }

    // 为被克隆的元素定义一个精确的 props 类型，以替代 'any' 和 'unknown'
    type ClonableElementProps = {
        children?: ReactNode;
    };

    return (
        <TableRow
            {...rest}
            selected={selected}
            sx={{
                position: 'relative', // 为绝对定位的 ButtonBase 提供定位上下文
                // 将悬浮和选中样式直接应用到 TableRow，由其子单元格继承
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
                }
            }}
        >
            {/*
              现在 firstChild 已被确认为 ReactElement，可以安全地克隆它。
              我们使用一个精确的类型断言来告知 TypeScript props 的形状。
            */}
            {React.cloneElement(
                firstChild as React.ReactElement<ClonableElementProps>, // 使用精确类型，解决 no-explicit-any
                {
                    // 将 ButtonBase 作为 firstChild 的新子元素注入
                    children: (
                        <>
                            {/* 此处使用相同的类型断言，安全地访问 .props.children，解决 props is unknown */}
                            {(firstChild as React.ReactElement<ClonableElementProps>).props.children}
                            <ButtonBase
                                onClick={onClick}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 1, // 确保交互层在最上方
                                }}
                            />
                        </>
                    ),
                }
            )}
            {/* 渲染剩余的单元格 */}
            {otherChildren}
        </TableRow>
    );
};

export default ClickableTableRow;