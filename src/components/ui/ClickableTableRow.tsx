/**
 * @file src/components/ui/ClickableTableRow.tsx
 * @description 提供一个带涟漪效果的、完全可交互的表格行，同时确保布局稳定且子组件事件正常。
 * @modification
 *   - [Bug修复]：修复 `TS2552: Cannot find name 'HTMLButtonBaseElement'` 错误，将 `MouseEvent<HTMLButtonBaseElement>` 更正为 `MouseEvent<HTMLButtonElement>`。
 *   - [类型优化]：将泛型约束 `T extends { id: any }` 更改为 `T extends { id: string }`，以提高类型精确性。
 *   - [类型推断优化]：调整组件定义结构，先定义一个普通泛型函数组件 `ClickableTableRowComponent`，再将其 `memo` 化为 `ClickableTableRow`，并使用 `as typeof ClickableTableRowComponent` 进行类型断言，以帮助 TypeScript 更准确地推断泛型类型，解决页面组件中 `ColumnConfig` 的类型不兼容错误 (TS2322) 和组件内部的 `TS2339` 错误。
 *   - [Bug修复]：修复 `TS7006: Parameter 'col' implicitly has an 'any' type` 错误，显式为 `columns.map` 中的 `col` 参数添加 `ColumnConfig<T>` 类型。
 *   - [性能优化]：使用 `React.memo` 包裹 `ClickableTableRow` 组件。这将确保组件只有在其 props 发生引用变化时才重新渲染，从而减少表格行的不必要渲染，提高表格渲染性能。
 *   - [UI/UX]：优化了最后一行的显示效果。通过使用 `:last-child` CSS 伪选择器，移除了表格主体中最后一行的底部分割线，避免了与分页器顶部分割线重叠导致视觉加粗的问题。
 *   - [UI/UX]：为表格行之间添加了分割线。
 *   - [架构重构]：采纳了 `colSpan` + `Flexbox` 的健壮模式，彻底分离了表格的结构布局与内容的视觉布局，确保了布局的绝对稳定和所有交互的流畅性。
 */
import { type ReactNode, type JSX, type MouseEvent, memo } from 'react';
import { TableRow, TableCell, ButtonBase, Box, type TableRowProps } from '@mui/material';

// 定义列配置对象的通用接口
export interface ColumnConfig<T> {
    id: string;
    label: string;
    renderCell: (row: T) => ReactNode;
    sx?: { width?: string | number };
}

interface ClickableTableRowProps<T> extends Omit<TableRowProps, 'onClick' | 'children'> {
    row: T;
    // 【核心修改】将事件类型更正为 HTMLButtonElement
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    columns: ColumnConfig<T>[];
}

// 【核心修改】先定义一个普通的泛型函数组件
function ClickableTableRowComponent<T extends { id: string }>({ // 【核心修改】泛型约束改为 { id: string }
                                                                  row,
                                                                  columns,
                                                                  onClick,
                                                                  selected,
                                                                  sx,
                                                                  ...rest
                                                              }: ClickableTableRowProps<T>): JSX.Element {
    return (
        <TableRow
            selected={selected}
            sx={{
                '&:last-child > td': {
                    borderBottom: 'none',
                },
                ...sx
            }}
            {...rest}
            hover
        >
            <TableCell
                colSpan={columns.length}
                sx={{
                    padding: 0,
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
            >
                <ButtonBase
                    onClick={onClick}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                        ...(selected && {
                            backgroundColor: 'action.selected',
                            '&:hover': {
                                backgroundColor: 'action.selected',
                            }
                        }),
                    }}
                >
                    {/* 【核心修改】显式为 col 参数添加类型 */}
                    {columns.map((col: ColumnConfig<T>) => (
                        <Box
                            key={col.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: col.sx?.width,
                                padding: '16px',
                                flexShrink: 0,
                                ...(!col.sx?.width && { flex: '1 1 0' }),
                                overflow: 'hidden',
                            }}
                        >
                            {col.renderCell(row)}
                        </Box>
                    ))}
                </ButtonBase>
            </TableCell>
        </TableRow>
    );
}

// 【核心修改】再将函数组件 memo 化，并使用类型断言以保留泛型信息
const ClickableTableRow = memo(ClickableTableRowComponent) as typeof ClickableTableRowComponent;

export default ClickableTableRow;