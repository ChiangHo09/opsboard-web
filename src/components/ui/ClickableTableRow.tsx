/**
 * @file src/components/ui/ClickableTableRow.tsx
 * @description 提供一个带涟漪效果的、完全可交互的表格行，同时确保布局稳定且子组件事件正常。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [类型修复]：为 `ColumnConfig<T>` 接口新增了 `label: string;` 属性。此修改是为了修复在页面级组件（如 `Servers.tsx`）中使用列配置数组时，因缺少 `label` 属性而导致的 TypeScript 编译错误 (TS2353)。
 *   - [UI/UX]：优化了最后一行的显示效果。通过使用 `:last-child` CSS 伪选择器，移除了表格主体中最后一行的底部分割线，避免了与分页器顶部分割线重叠导致视觉加粗的问题。
 *   - [UI/UX]：为表格行之间添加了分割线。
 *   - [架构重构]：采纳了 `colSpan` + `Flexbox` 的健壮模式，彻底分离了表格的结构布局与内容的视觉布局，确保了布局的绝对稳定和所有交互的流畅性。
 */
import { type ReactNode, type JSX, type MouseEvent } from 'react';
import { TableRow, TableCell, ButtonBase, Box, type TableRowProps } from '@mui/material';

// 定义列配置对象的通用接口
export interface ColumnConfig<T> {
    id: string;
    label: string; // 【核心修复】添加 label 属性以匹配页面中的使用
    renderCell: (row: T) => ReactNode;
    sx?: { width?: string | number };
}

interface ClickableTableRowProps<T> extends Omit<TableRowProps, 'onClick' | 'children'> {
    row: T;
    columns: ColumnConfig<T>[];
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

// 使用泛型 T 来表示任意类型的行数据
const ClickableTableRow = <T extends { id: any }>({
                                                      row,
                                                      columns,
                                                      onClick,
                                                      selected,
                                                      sx,
                                                      ...rest
                                                  }: ClickableTableRowProps<T>): JSX.Element => {
    return (
        <TableRow
            selected={selected}
            sx={{
                // 当此 TableRow 是最后一个子元素时，
                // 选中其内部的 TableCell 并移除底部分割线。
                '&:last-child > td': {
                    borderBottom: 'none',
                },
                // 合并外部传入的 sx，以保持可定制性
                ...sx
            }}
            {...rest}
            hover
        >
            {/* 这一行只包含一个单元格，它会跨越所有列 */}
                <TableCell
                    colSpan={columns.length}
                    sx={{
                        padding: 0,
                        // 为每一行添加默认的底部分割线
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
                            // 直接在 ButtonBase 上应用 hover 和 selected 样式
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                            // TableRow 的 selected 状态不会影响到这里的 ButtonBase，所以我们直接检查 prop
                            ...(selected && {
                                backgroundColor: 'action.selected',
                                '&:hover': {
                                    backgroundColor: 'action.selected',
                                }
                            }),
                        }}
                    >
                        {columns.map((col) => (
                            <Box
                                key={col.id}
                                sx={{
                                    // 使用 Flexbox 来模拟列
                                    display: 'flex',
                                    alignItems: 'center',
                                    // 从列配置中获取宽度
                                    width: col.sx?.width,
                                    // 模拟单元格的内边距
                                    padding: '16px',
                                    // 防止列在空间不足时被压缩
                                    flexShrink: 0,
                                    // 关键：让没有指定宽度的列自动填充剩余空间
                                    ...(!col.sx?.width && { flex: '1 1 0' }),
                                    // 确保内容溢出时可以被 TooltipCell 处理
                                    overflow: 'hidden',
                                }}
                            >
                                {/* 渲染单元格内容 */}
                                {col.renderCell(row)}
                            </Box>
                        ))}
                    </ButtonBase>
                </TableCell>
        </TableRow>
    );
};

export default ClickableTableRow;