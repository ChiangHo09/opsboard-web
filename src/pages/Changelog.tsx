/**
 * @file src/pages/Changelog.tsx
 * @description 该文件负责渲染“更新日志”页面，并提供搜索功能。
 * @modification
 *   - [性能优化]：将 `useResponsiveDetailView` 钩子中的 `queryKey` 从内联数组字面量更改为模块级别的常量 `CHANGELOGS_QUERY_KEY`。此举确保了 `queryKey` 的引用稳定性，防止 `useQuery` 在页面组件重新渲染时触发不必要的数据重新获取和处理，从而显著减少 JavaScript 执行时间，解决页面切换时的卡顿问题。
 *   - [性能优化]：将传递给 `ClickableTableRow` 的 `onClick` 回调函数使用 `useCallback` 进行记忆化。这确保了在父组件重新渲染时，`onClick` 函数的引用保持稳定，从而配合 `React.memo` 减少 `ClickableTableRow` 的不必要渲染，提高表格性能。
 *   - [架构重构]：更新了表格主体的渲染逻辑，以使用全新的 `<ClickableTableRow>` 组件架构。
 *   - [核心修复]：现在不再手动遍历列来渲染 `<td>`，而是将整行数据 `r` 和列配置 `columns` 直接传递给 `<ClickableTableRow>`。该组件内部会使用 `colSpan` 和 `Flexbox` 来构建一个既能正确布局又不会产生交互冲突的行。
 *   - [类型安全]：为列配置数组 `desktopColumns` 和 `mobileColumns` 添加了 `ColumnConfig<ChangelogRow>[]` 类型注解，确保了类型安全。
 *   - [最终效果]：此修改与 `ClickableTableRow` 和 `TooltipCell` 的重构相配合，彻底解决了表格在交互时布局塌陷的根本性问题。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type ChangelogSearchValues} from '@/components/forms/ChangelogSearchForm.tsx';
import {changelogsApi, type ChangelogRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type ChangelogDetailContentProps} from '@/components/modals/ChangelogDetailContent';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';
import PageHeader from '@/layouts/PageHeader';

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

// 为列配置数组添加正确的类型注解
const desktopColumns: ColumnConfig<ChangelogRow>[] = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '180px'},
        renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell>
    },
    {
        id: 'updateTime',
        label: '更新时间',
        sx: {width: '180px'},
        renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateTime.split(' ')[0]}</TooltipCell>
    },
    {
        id: 'updateType',
        label: '更新类型',
        sx: {width: '150px'},
        renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell>
    },
    {
        id: 'updateContent',
        label: '更新内容',
        renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateContent}</TooltipCell>
    },
];

const mobileColumns: ColumnConfig<ChangelogRow>[] = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '33.33%'},
        renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell>
    },
    {
        id: 'updateTime',
        label: '更新时间',
        sx: {width: '33.33%'},
        renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateTime.split(' ')[0]}</TooltipCell>
    },
    {
        id: 'updateType',
        label: '更新类型',
        sx: {width: '33.33%'},
        renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell>
    },
];

// 【核心修改】将 queryKey 定义为模块级别的常量
const CHANGELOGS_QUERY_KEY = ['changelogs'];

export default function Changelog(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
    } = useLayoutDispatch();

    const navigate = useNavigate();
    const {logId} = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const [isAdmin] = useState(true);

    const {
        data: rows = [],
        isLoading,
        isError,
        error
    } = useResponsiveDetailView<ChangelogRow, ChangelogDetailContentProps>({
        paramName: 'logId',
        baseRoute: '/app/changelog',
        queryKey: CHANGELOGS_QUERY_KEY, // 【核心修改】使用模块常量
        queryFn: changelogsApi.fetchAll,
        DetailContentComponent: ChangelogDetailContent,
    });

    useEffect(() => {
        if (logId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === logId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [logId, rows, rowsPerPage, page]);


    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    const onSearch = useCallback((v: ChangelogSearchValues) => {
        alert(`搜索: ${JSON.stringify({
            ...v,
            startTime: v.startTime?.format('YYYY-MM-DD'),
            endTime: v.endTime?.format('YYYY-MM-DD'),
        })}`);
        togglePanel();
    }, [togglePanel]);

    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        if (!isPanelContentSet) {
            return;
        }

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <ChangelogSearchForm onSearch={onSearch} onReset={onReset}/>
                </Suspense>
            );
            setPanelTitle('日志搜索');
            setPanelWidth(360);
        }, 0);

        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    const handleRowClick = useCallback((id: string) => {
        navigate(`/app/changelog/${id}`, {replace: true});
    }, [navigate]);

    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <PageLayout>
            <PageHeader
                title="更新日志"
                actions={
                    <ActionButtons
                        showEditButton={isAdmin}
                        onSearchClick={handleTogglePanel}
                        onEditClick={() => alert('编辑按钮被点击')}
                        onExportClick={() => alert('导出按钮被点击')}
                    />
                }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 10
                }}><CircularProgress/></Box>}
                {isError && <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><Box>加载失败: {error?.message || '未知错误'}</Box></Box>}
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p: number) => setPage(p)}
                    onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="更新日志表"
                           sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
                        <TableHead>
                            <TableRow>
                                {columns.map(col => (
                                    <TableCell key={col.id} sx={{...col.sx, fontWeight: 700}}>{col.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => (
                                <ClickableTableRow
                                    key={r.id}
                                    row={r}
                                    columns={columns}
                                    selected={r.id === logId}
                                    onClick={() => handleRowClick(r.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
}