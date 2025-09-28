/**
 * @file src/components/ui/ClickableTableRow.tsx
 * @description 提供一个带涟漪效果、可交互且支持悬浮操作按钮的表格行。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：为表格行增加了 `actions` prop，允许父组件传入一组在行尾悬浮显示的操作按钮。
 *   - [UI 实现]：通过 CSS `:hover` 伪类和绝对定位，实现了操作按钮只在鼠标悬浮于特定行时才平滑出现的效果，且不影响表格原有布局。
 *   - [布局调整]：将最后一列单元格设置为 `position: relative`，为操作按钮的绝对定位提供了容器。
 */
import { type ReactNode, type JSX, type MouseEvent, memo } from 'react';
import { TableRow, TableCell, ButtonBase, Box, type TableRowProps, Stack } from '@mui/material';

export interface ColumnConfig<T> {
    id: string;
    label: string;
    renderCell: (row: T) => ReactNode;
    sx?: { width?: string | number };
}

interface ClickableTableRowProps<T> extends Omit<TableRowProps, 'onClick' | 'children'> {
    row: T;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    columns: ColumnConfig<T>[];
    // [核心修改] 新增 actions prop，用于接收操作按钮
    actions?: ReactNode;
}

function ClickableTableRowComponent<T extends { id: string }>({
                                                                  row,
                                                                  columns,
                                                                  onClick,
                                                                  selected,
                                                                  sx,
                                                                  actions, // [核心修改]
                                                                  ...rest
                                                              }: ClickableTableRowProps<T>): JSX.Element {
    return (
        <TableRow
            selected={selected}
            sx={{
                '&:last-child > td': {
                    borderBottom: 'none',
                },
                // [核心修改] 当鼠标悬浮在行上时，显示内部的操作按钮
                '&:hover .row-actions': {
                    opacity: 1,
                    visibility: 'visible',
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
                    position: 'relative', // [核心修改] 为绝对定位的按钮提供容器
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

                {/* [核心修改] 渲染操作按钮 */}
                {actions && (
                    <Stack
                        direction="row"
                        spacing={1}
                        className="row-actions"
                        sx={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            opacity: 0,
                            visibility: 'hidden',
                            transition: 'opacity 0.2s, visibility 0.2s',
                            // 确保按钮背景不是透明的，以免看到下面的内容
                            bgcolor: selected ? 'action.selected' : 'background.paper',
                            p: '4px',
                            borderRadius: '50px',
                        }}
                    >
                        {actions}
                    </Stack>
                )}
            </TableCell>
        </TableRow>
    );
}

const ClickableTableRow = memo(ClickableTableRowComponent) as typeof ClickableTableRowComponent;

export default ClickableTableRow;