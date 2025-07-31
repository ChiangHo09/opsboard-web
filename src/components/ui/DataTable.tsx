/**
 * 文件名: src/components/ui/DataTable.tsx
 *
 * 文件职责:
 * 这是一个通用的数据表格包装组件，提供了统一的纸张样式、滚动容器和分页功能。
 * 它通过 `children` prop 接收实际的表格内容（如 `<Table>`），并将其余 props
 * 传递给底层的 MUI `<TablePagination>` 组件。
 *
 * 本次改动内容:
 * - 【渲染闪烁终极修复】修复了包裹的表格在拥有固定列时，点击行会产生闪烁的底层问题。
 * - **问题根源**:
 *   MUI 的 `<TableContainer>` 组件内部存在一些特殊的样式或行为，当它与 `position: sticky` 的单元格和 `ButtonBase` 的涟漪效果结合时，会引发不可预知的渲染层冲突，导致闪烁。
 * - **解决方案**:
 *   使用一个普通的 `<Box>` 组件替换 `<TableContainer>`，并为其应用完全相同的滚动和伸缩样式。`<Box>` 是一个纯粹的 `div` 包装器，它不包含任何额外的内部逻辑，从而为表格提供了一个干净、可预测的渲染环境。
 * - **最终效果**:
 *   在干净的渲染环境中，页面级组件（如 Servers.tsx, Tickets.tsx）中已经实现的、正确的闪烁修复逻辑（背景色所有权转移模式）得以正常工作，所有闪烁问题被彻底根除。
 */
import {type JSX, type ReactNode} from 'react';
import {
    Paper,
    Box, // 【核心修改】导入 Box 组件
    TablePagination,
    type TablePaginationProps,
} from '@mui/material';

interface DataTableProps extends Omit<TablePaginationProps, 'component'> {
    children: ReactNode;
}

const DataTable = ({children, ...paginationProps}: DataTableProps): JSX.Element => {
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
            {/* 【核心修改】使用 Box 替换 TableContainer */}
            <Box sx={{
                overflow: 'auto',
                flex: '1 1 0',
                minHeight: 0,
            }}>
                {children}
            </Box>

            <TablePagination
                component="div"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    flexShrink: 0,
                    '& .MuiToolbar-root': {
                        justifyContent: 'flex-end',
                    },
                }}
                {...paginationProps}
            />
        </Paper>
    );
};

export default DataTable;