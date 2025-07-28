/**
 * 文件名: src/components/ui/DataTable.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个 `DataTable` 组件，它为应用中的所有数据表格提供了一个
 * 统一的、带有固定分页器的、可滚动的容器。
 *
 * 本次修改内容:
 * - 【布局闪烁终极修复】确保了 `TableContainer` 能够始终撑满其父容器的宽度。
 * - **问题根源**:
 *   `TableContainer` 默认的宽度是 `auto`，它会收缩以适应其子元素 (`<Table>`) 的宽度。这在 React hydration 过程中，由于样式的延迟应用，会导致一次从“撑满”到“收缩”的布局重排，从而产生闪烁。
 * - **解决方案**:
 *   1.  为 `<TableContainer>` 组件的 `sx` 属性添加了 `width: '100%'`。
 * - **最终效果**:
 *   此修改强制 `TableContainer` 在任何时候都占据其父级 Grid 单元格的全部宽度。这确保了在页面初始加载和 React hydration 完成后，布局始终保持一致，彻底根除了刷新时的闪烁问题。
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

const DataTable: React.FC<DataTableProps> = ({children, ...paginationProps}) => {
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
            {/* 【核心修复】为 TableContainer 添加 width: '100%' */}
            <TableContainer sx={{overflow: 'auto', width: '100%'}}>
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