/**
 * @file src/components/ui/DataTable.tsx
 * @description 这是一个通用的数据表格包装组件，提供了统一的纸张样式、滚动容器和分页功能。它通过 `children` prop 接收实际的表格内容（如 `<Table>`），并将其余 props 传递给底层的 MUI `<TablePagination>` 组件。
 * @modification
 *   - [Bug修复]：修复 `TS2322` 错误，将 `MemoizedTableBodyProps` 接口中的 `children` 属性从必选更改为可选 (`children?: ReactNode;`)，使其与 Material-UI `TableBodyProps` 的行为一致，从而解决类型不兼容问题。
 *   - [Bug修复]：修复多处 `TS2686: 'React' refers to a UMD global...` 错误，通过添加 `import React from 'react';` 解决。
 *   - [Bug修复]：修复 `TS2304: Cannot find name 'Table'.` 错误，通过从 `@mui/material` 导入 `Table` 组件解决。
 *   - [类型修复/重构]：修复 `TS2769`, `TS18046`, `TS2322`, `TS2698` 等与 `React.Children.map` 和 `React.cloneElement` 相关的类型错误。
 *   - [类型修复/重构]：修改 `DataTableProps` 接口，明确 `children` prop 期望接收一个 `Table` 组件，简化内部类型推断。
 *   - [类型修复/重构]：重构 `DataTable` 内部的 `TableBody` 替换逻辑，直接对传入的 `Table` 元素进行克隆，并在遍历其子元素时进行类型断言，确保类型安全和代码健壮性。
 *   - [性能优化]：引入 `MemoizedTableBody` 组件并使用 `React.memo` 进行记忆化。此举旨在确保当 `TableBody` 的 `children`（即表格行 `pageRows`）引用不变时，`TableBody` 及其内部的行组件不会进行不必要的重新渲染，从而进一步优化表格渲染性能，缓解页面切换时的卡顿。
 *   - [Bug修复]：修复了当包裹的表格含有固定列（sticky columns）时，点击行（`ButtonBase`）导致闪烁的底层问题。
 *   - [问题根源]：MUI 的 `<TableContainer>` 组件内部实现与 `position: sticky` 的单元格及 `ButtonBase` 的涟漪效果结合时，会引发渲染层冲突，导致闪烁。
 *   - [解决方案]：使用一个普通的 `<Box>` 组件替换 `<TableContainer>`，并为其应用完全相同的滚动和伸缩样式。`<Box>` 是一个纯粹的 `div` 包装器，不包含任何可能导致冲突的额外逻辑，为表格提供了干净、可预测的渲染环境。
 *   - [效果]：此修改根除了由组件交互引发的闪烁问题，确保了在复杂表格（如带固定列和可点击行）中的流畅视觉体验。
 */
import React, {type JSX, type ReactNode, memo} from 'react';
import {
    Paper,
    Box,
    TablePagination,
    type TablePaginationProps,
    Table,
    TableBody,
    type TableBodyProps,
} from '@mui/material';

// 修改 DataTableProps 接口，明确 children 期望接收一个 Table 组件
interface DataTableProps extends Omit<TablePaginationProps, 'component'> {
    children: React.ReactElement<React.ComponentProps<typeof Table>>;
}

// 记忆化 TableBody 组件
interface MemoizedTableBodyProps extends TableBodyProps {
    children?: ReactNode; // 【核心修改】将 children 属性改为可选
}

const MemoizedTableBody = memo(({ children, ...rest }: MemoizedTableBodyProps): JSX.Element => {
    return <TableBody {...rest}>{children}</TableBody>;
});

// 调整组件参数解构，将 children 重命名为 tableElement
const DataTable = ({children: tableElement, ...paginationProps}: DataTableProps): JSX.Element => {
    // 遍历传入的 Table 元素的子元素，找到 TableBody 并替换为 MemoizedTableBody
    const clonedTable = React.cloneElement(tableElement, {
        children: React.Children.map(tableElement.props.children, (tableChild: React.ReactNode) => {
            // 检查子元素是否是有效的 React 元素，并且其类型是 TableBody
            if (React.isValidElement(tableChild) && tableChild.type === TableBody) {
                // 对 tableChild.props 进行类型断言，确保其为 TableBodyProps 类型，以便安全地展开
                const tableBodyProps = tableChild.props as TableBodyProps;
                return <MemoizedTableBody {...tableBodyProps} />;
            }
            return tableChild;
        })
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
            <Box sx={{
                overflow: 'auto',
                flex: '1 1 0',
                minHeight: 0,
            }}>
                {clonedTable} {/* 渲染包含记忆化 TableBody 的克隆表格 */}
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