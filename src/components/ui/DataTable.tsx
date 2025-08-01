/**
 * @file src/components/ui/DataTable.tsx
 * @description 这是一个通用的数据表格包装组件，提供了统一的纸张样式、滚动容器和分页功能。它通过 `children` prop 接收实际的表格内容（如 `<Table>`），并将其余 props 传递给底层的 MUI `<TablePagination>` 组件。
 * @modification 修复了当包裹的表格含有固定列（sticky columns）时，点击行（`ButtonBase`）导致闪烁的底层问题。
 *   - [问题根源]：MUI 的 `<TableContainer>` 组件内部实现与 `position: sticky` 的单元格及 `ButtonBase` 的涟漪效果结合时，会引发渲染层冲突，导致闪烁。
 *   - [解决方案]：使用一个普通的 `<Box>` 组件替换 `<TableContainer>`，并为其应用完全相同的滚动和伸缩样式。`<Box>` 是一个纯粹的 `div` 包装器，不包含任何可能导致冲突的额外逻辑，为表格提供了干净、可预测的渲染环境。
 *   - [效果]：此修改根除了由组件交互引发的闪烁问题，确保了在复杂表格（如带固定列和可点击行）中的流畅视觉体验。
 */
import {type JSX, type ReactNode} from 'react';
import {
    Paper,
    Box, // 【核心修改】导入 Box 组件以替换 TableContainer
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
            {/* 使用 Box 替换 TableContainer 来提供一个无额外逻辑的滚动容器，从而修复渲染闪烁问题。 */}
            <Box sx={{
                overflow: 'auto', // 允许内容（表格）在需要时滚动
                flex: '1 1 0',   // 允许容器在 flex 布局中伸缩
                minHeight: 0,      // 防止在 flex 容器中无限增长
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