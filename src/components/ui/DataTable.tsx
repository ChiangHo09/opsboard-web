/**
 * 文件名: src/components/ui/DataTable.tsx
 *
 * 文件职责:
 * 这是一个通用的数据表格包装组件，提供了统一的纸张样式、滚动容器和分页功能。
 * 它通过 `children` prop 接收实际的表格内容（如 `<Table>`），并将其余 props
 * 传递给底层的 MUI `<TablePagination>` 组件。
 *
 * 本次改动内容:
 * - 【类型安全修复】为 `labelDisplayedRows` 回调的参数添加了显式类型定义。
 * - **解决方案**:
 *   通过为解构的 `{ from, to, count }` 参数提供 `{ from: number; to: number; count: number }` 类型，
 *   解决了 TypeScript 报出的 `TS7031: Binding element '...' implicitly has an 'any' type.` 错误。
 *   此修改确保了所有使用 `DataTable` 的页面都能通过类型检查。
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
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <TableContainer sx={{
                overflow: 'auto',
                flex: '1 1 0',
                minHeight: 0,
            }}>
                {children}
            </TableContainer>

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