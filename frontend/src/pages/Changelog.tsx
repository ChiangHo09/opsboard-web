/**
 * @file src/pages/Changelog.tsx
 * @description 该文件负责渲染“更新日志”页面，并提供搜索功能。
 * @modification
 *   - [最终UX修复]：修复了在所有平台上，点击行导致弹窗打开时，行本身会“闪烁”一下的视觉问题。
 *   - [原因]：行的高亮状态更新与弹窗的出现被捆绑在同一次React渲染周期中，两个视觉事件同时发生，被人眼感知为“闪烁”。
 *   - [解决方案]：
 *     1. 引入了一个新的本地state `clickedRowId`，用于提供即时的视觉反馈。
 *     2. 当行被点击时，**立即**更新`clickedRowId`来高亮该行，让用户瞬间看到操作响应。
 *     3. **然后**再调用`useDelayedNavigate`来启动延迟导航，从而触发弹窗逻辑。
 *     4. 通过在时间和渲染周期上分离“行高亮”和“弹窗出现”这两个视觉事件，彻底消除了“闪烁”感，实现了平滑的交互体验。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
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
import { useDelayedNavigate } from '@/hooks/useDelayedNavigate';

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

const desktopColumns: ColumnConfig<ChangelogRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '180px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'updateTime', label: '更新时间', sx: {width: '180px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateTime.split(' ')[0]}</TooltipCell> },
    { id: 'updateType', label: '更新类型', sx: {width: '150px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell> },
    { id: 'updateContent', label: '更新内容', renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateContent}</TooltipCell> },
];

const mobileColumns: ColumnConfig<ChangelogRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'updateTime', label: '更新时间', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateTime.split(' ')[0]}</TooltipCell> },
    { id: 'updateType', label: '更新类型', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell> },
];

const CHANGELOGS_QUERY_KEY = ['changelogs'];

export default function Changelog(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const {logId} = useParams<{ logId: string }>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const delayedNavigate = useDelayedNavigate();

    // [核心修复] 1. 新增一个 state 用于即时视觉反馈
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);

    const { data: rows = [], isLoading, isError, error } = useResponsiveDetailView<ChangelogRow, ChangelogDetailContentProps>({
        paramName: 'logId',
        baseRoute: '/app/changelog',
        queryKey: CHANGELOGS_QUERY_KEY,
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

    // [核心修复] 4. 添加一个 effect 来清理临时的 clickedRowId
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

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // [核心修复] 2. 修改点击处理函数
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
                {pageRows.map(r => (
                    <ClickableTableRow
                        key={r.id}
                        row={r}
                        columns={columns}
                        // [核心修复] 3. 修改高亮逻辑
                        selected={r.id === logId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
                    />
                ))}
            </TableBody>
        </Table>
    ), [pageRows, columns, logId, clickedRowId, handleRowClick]);

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader
                title="更新日志"
                actions={ <ActionButtons showEditButton={isAdmin} onSearchClick={togglePanel} onEditClick={() => alert('编辑按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}><CircularProgress/></Box>}
                {isError && <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Box>加载失败: {error?.message || '未知错误'}</Box></Box>}
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
                    {tableContent}
                </DataTable>
            </Box>
        </PageLayout>
    );
}