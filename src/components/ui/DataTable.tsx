/**
 * 文件名: src/components/ui/DataTable.tsx
 *
 * 本次修改内容:
 * - 这是一个全新的、高度可重用的组件，用于封装所有数据表格的通用布局和行为。
 * - **固定分页器**: 使用 CSS Grid 布局 (`gridTemplateRows: '1fr auto'`)，
 *   将组件垂直划分为一个弹性的内容区和一个高度固定的页脚区。
 *   - `TableContainer` 位于弹性区，负责内容的内部滚动。
 *   - `TablePagination` 位于页脚区，始终固定在底部，不会随内容滚动。
 * - **分页器右对齐**: `TablePagination` 的 `sx` 属性被设置为靠右显示。
 * - **统一接口**: 组件通过 props 接收表格内容 (`children`) 和所有分页器所需的属性，
 *   提供了一个简洁、统一的接口。
 *
 * 文件功能描述:
 * 此文件定义了一个 `DataTable` 组件，它为应用中的所有数据表格提供了一个
 * 统一的、带有固定分页器的、可滚动的容器。
 */
import React from 'react';
import {
    Paper,
    TableContainer,
    TablePagination,
    type TablePaginationProps,
} from '@mui/material';

// 定义 DataTable 组件的 props 接口
// 它继承了 TablePagination 的所有 props，除了 'component'，并添加了一个 children prop
interface DataTableProps extends Omit<TablePaginationProps, 'component'> {
    children: React.ReactNode; // 用于接收 <Table> 组件
}

const DataTable: React.FC<DataTableProps> = ({ children, ...paginationProps }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateRows: '1fr auto', // 内容区占满剩余空间，分页器高度自适应
                overflow: 'hidden', // 确保 Paper 自身不滚动
            }}
        >
            <TableContainer sx={{ overflow: 'auto' }}>
                {children}
            </TableContainer>

            <TablePagination
                component="div" // 确保它是一个 div
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    // 使分页控件靠右
                    '& .MuiToolbar-root': {
                        justifyContent: 'flex-end',
                    },
                }}
                // 将所有分页相关的 props 传递给 TablePagination
                {...paginationProps}
            />
        </Paper>
    );
};

export default DataTable;