/**
 * 文件名: src/components/ui/DataTable.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个 `DataTable` 组件，它为应用中的所有数据表格提供了一个
 * 统一的、带有固定分页器的、可滚动的容器。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式。
 * - 【布局终极修复】通过切换到 Flexbox 布局，创建了一个更健壮的容器。
 * - **问题根源**:
 *   Grid 布局在处理高度为 1fr 的可滚动子元素时，有时会产生不一致的行为。
 * - **解决方案**:
 *   1.  将 `Paper` 的布局从 `display: 'grid'` 修改为 `display: 'flex'` 和 `flexDirection: 'column'`。
 *   2.  为 `<TableContainer>` 添加 `flex: '1 1 auto'` 和 `minHeight: 0`，
 *       这是 Flexbox 布局中让一个子元素占据所有剩余空间并启用内部滚动的经典模式。
 * - **最终效果**:
 *   `DataTable` 现在提供了一个极其稳定和可预测的布局容器，确保了内部的表格
 *   无论内容多少，都能正确地撑满可用空间，为解决所有下游布局问题打下了坚实的基础。
 */
import {type JSX, type ReactNode} from 'react';
import {
    Paper,
    TableContainer,
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
                // 【核心修复】使用 Flexbox 布局
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* 【核心修复】让 TableContainer 在 Flexbox 中占据剩余空间 */}
            <TableContainer sx={{
                overflow: 'auto',
                flex: '1 1 auto', // 占据所有可用空间
                minHeight: 0,     // 允许在空间不足时收缩
            }}>
                {children}
            </TableContainer>

            <TablePagination
                component="div"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    flexShrink: 0, // 防止分页器被压缩
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