/**
 * @file src/components/ui/DataTable.tsx
 * @description 一个高性能、带分页功能的数据表格容器。它保留了MUI Table的布局和分页功能，同时在内部对表格主体（tbody）应用了虚拟滚动优化。
 * @modification
 *   - [架构重写]：为解决之前方案破坏UI布局和功能的问题，本组件被彻底重写。
 *   - [核心策略]：
 *     1. **恢复分页API**：组件现在重新接收并管理MUI `TablePagination`的所有props (`count`, `page`, `rowsPerPage`, `onPageChange`等)，完全恢复了分页功能。
 *     2. **“注入式”虚拟化**：组件通过 `React.cloneElement` 查找并替换传入的 `<Table>` 子元素中的 `<TableBody>` 为一个内部的 `VirtualizedTableBody` 组件。
 *     3. **保留父组件结构**：父组件（如 `Tickets.tsx`）可以像之前一样，传递一个完整的 `<Table>` 结构作为 `children`，无需关心虚拟化的内部实现。
 *   - [效果]：此方案实现了性能优化和UI保真度的完美结合，既解决了长列表渲染的性能瓶颈，又100%保留了用户原有的布局、分页和交互体验。
 */
import React, { type JSX, type ReactNode, useRef } from 'react';
import {
    Paper, Box, TablePagination, type TablePaginationProps,
    Table, TableBody, type TableBodyProps
} from '@mui/material';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';

// --- 内部虚拟化 TableBody 组件 ---
interface VirtualizedTableBodyProps extends TableBodyProps {
    rowCount: number;
    rowHeight: number;
    children: React.ReactElement[];
}

const VirtualizedTableBody = ({ rowCount, rowHeight, children, ...rest }: VirtualizedTableBodyProps): JSX.Element => {
    const parentRef = useRef<HTMLTableSectionElement>(null);

    const virtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current?.parentElement?.parentElement || null, // 滚动容器是外层的 Box
        estimateSize: () => rowHeight,
        overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();
    const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
    const paddingBottom = virtualItems.length > 0 ? virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0) : 0;

    return (
        <TableBody ref={parentRef} {...rest}>
            {paddingTop > 0 && (
                <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                </tr>
            )}
            {virtualItems.map((virtualItem: VirtualItem) =>
                // 克隆原始的行元素，并传入key
                React.cloneElement(children[virtualItem.index], { key: virtualItem.key })
            )}
            {paddingBottom > 0 && (
                <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                </tr>
            )}
        </TableBody>
    );
};


// --- 主 DataTable 组件 ---
interface DataTableProps extends Omit<TablePaginationProps, 'component'> {
    children: React.ReactElement<React.ComponentProps<typeof Table>>;
    rowHeight?: number; // 允许外部传入预估行高
}

const DataTable = ({ children: tableElement, rowHeight = 53, ...paginationProps }: DataTableProps): JSX.Element => {
    const clonedTable = React.cloneElement(tableElement, {
        children: React.Children.map(tableElement.props.children, (tableChild: ReactNode) => {
            if (React.isValidElement(tableChild) && tableChild.type === TableBody) {
                const tableBodyProps = tableChild.props as TableBodyProps;
                const rows = React.Children.toArray(tableBodyProps.children).filter(React.isValidElement) as React.ReactElement[];

                return (
                    <VirtualizedTableBody
                        {...tableBodyProps}
                        rowCount={rows.length}
                        rowHeight={rowHeight}
                    >
                        {rows}
                    </VirtualizedTableBody>
                );
            }
            return tableChild;
        }),
    });

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ overflow: 'auto', flex: '1 1 auto' }}>
                {clonedTable}
            </Box>

            <TablePagination
                component="div"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    flexShrink: 0,
                }}
                {...paginationProps}
            />
        </Paper>
    );
};

export default DataTable;