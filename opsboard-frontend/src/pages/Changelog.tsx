/**
 * @file src/pages/Changelog.tsx
 * @description 该文件负责渲染“更新日志”页面，已集成后端分页功能。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [后端分页]：重构了数据获取逻辑，`useResponsiveDetailView` 现在接收并使用分页状态 (`page`, `rowsPerPage`) 来进行 API 调用。
 *   - [状态同步]：`DataTable` 的分页器现在由 `react-query` 返回的总记录数和本地分页状态驱动，实现了前后端分页的完美同步。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, Typography
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
import { useDelayedNavigate } from '@/hooks/useDelayedNavigate';
import NoDataMessage from '@/components/ui/NoDataMessage';

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

const desktopColumns: ColumnConfig<ChangelogRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '180px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'updateTime', label: '更新时间', sx: {width: '180px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateTime.split('T')[0]}</TooltipCell> },
    { id: 'updateType', label: '更新类型', sx: {width: '150px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell> },
    { id: 'updateContent', label: '更新内容', renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateContent}</TooltipCell> },
];

const mobileColumns: ColumnConfig<ChangelogRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'updateTime', label: '更新时间', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateTime.split('T')[0]}</TooltipCell> },
    { id: 'updateType', label: '更新类型', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell> },
];

const CHANGELOGS_QUERY_KEY_BASE = ['changelogs'];
const ANIMATION_DELAY = 300;

export default function Changelog(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const {logId} = useParams<{ logId: string }>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const delayedNavigate = useDelayedNavigate();
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsQueryEnabled(true), ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    // [核心修改] 将分页状态传递给 useResponsiveDetailView
    const { rows, totalRows, isLoading, isError, error } = useResponsiveDetailView<ChangelogRow, ChangelogDetailContentProps>({
        paramName: 'logId',
        baseRoute: '/app/changelog',
        queryKey: [CHANGELOGS_QUERY_KEY_BASE],
        queryFn: changelogsApi.fetchAll,
        DetailContentComponent: ChangelogDetailContent,
        enabled: isQueryEnabled,
        page: page,
        rowsPerPage: rowsPerPage,
    });

    useEffect(() => {
        if (!logId) {
            setClickedRowId(null);
        }
    }, [logId]);

    const onSearch = useCallback((v: ChangelogSearchValues) => {
        alert(`搜索: ${JSON.stringify({ ...v, startTime: v.startTime?.format('YYYY-MM-DD'), endTime: v.endTime?.format('YYYY-MM-DD'), })}`);
        togglePanel();
    }, [togglePanel]);

    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }
        setPanelContent(
            <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress/></Box>}>
                <ChangelogSearchForm onSearch={onSearch} onReset={onReset}/>
            </Suspense>
        );
        setPanelTitle('日志搜索');
        setPanelWidth(360);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]);

    const handleRowClick = useCallback((id: string) => {
        setClickedRowId(id);
        delayedNavigate(`/app/changelog/${id}`, {replace: true});
    }, [delayedNavigate]);

    const columns = isMobile ? mobileColumns : desktopColumns;

    const tableContent = useMemo(() => (
        <Table stickyHeader aria-label="更新日志表" sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
            <TableHead>
                <TableRow>
                    {columns.map(col => (
                        <TableCell key={col.id} sx={{...col.sx, fontWeight: 700}}>{col.label}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(r => ( // [核心修改] 不再需要前端分页，直接使用 rows
                    <ClickableTableRow
                        key={r.id}
                        row={r}
                        columns={columns}
                        selected={r.id === logId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
                    />
                ))}
            </TableBody>
        </Table>
    ), [rows, columns, logId, clickedRowId, handleRowClick]);

    const renderContent = () => {
        if ((isLoading || !isQueryEnabled) && totalRows === 0) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                    <CircularProgress/>
                </Box>
            );
        }
        if (isError) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography color="error">加载失败: {error instanceof Error ? error.message : '未知错误'}</Typography>
                </Box>
            );
        }
        if (totalRows === 0) {
            return <NoDataMessage message="暂无更新日志" />;
        }
        return (
            // [核心修改] DataTable 现在由后端数据驱动
            <DataTable
                rowsPerPageOptions={[10, 25, 50]}
                count={totalRows}
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
                {tableContent}
            </DataTable>
        );
    };

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader
                title="更新日志"
                actions={ <ActionButtons showEditButton={isAdmin} onSearchClick={togglePanel} onEditClick={() => alert('编辑按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {renderContent()}
            </Box>
        </PageLayout>
    );
}