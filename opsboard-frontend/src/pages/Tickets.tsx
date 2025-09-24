/**
 * @file src/pages/Tickets.tsx
 * @description 此文件负责渲染“工单信息”页面。
 * @modification
 *   - [API导入修复]: 经过 API 目录重构，确认从此文件的角度看，`import { ticketsApi, type TicketRow } from '@/api'` 依然是正确的导入方式。无需修改此文件。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, Chip, type Theme
} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
import {type TicketSearchValues} from '@/components/forms/TicketSearchForm';
import {ticketsApi, type TicketRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type TicketDetailContentProps} from '@/components/modals/TicketDetailContent';
import {handleAsyncError} from '@/utils/errorHandler';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';
import {red} from '@mui/material/colors';
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';
import PageHeader from '@/layouts/PageHeader';
import { useDelayedNavigate } from '@/hooks/useDelayedNavigate';

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));

const statusConfig: Record<string, { label: string; sx: (theme: Theme) => object }> = {
    '就绪': { label: '完成', sx: (theme: Theme) => ({ fontWeight: 700, backgroundColor: theme.palette.neutral.main, color: theme.palette.common.white, '& .MuiChip-label': { transform: 'translateY(1px)' } }) },
    '挂起': { label: '挂起', sx: (theme: Theme) => ({ fontWeight: 700, backgroundColor: red[200], color: theme.palette.common.white, '& .MuiChip-label': { transform: 'translateY(1px)' } }) },
    'default': { label: '未知', sx: () => ({ fontWeight: 700 }) },
};

const desktopColumns: ColumnConfig<TicketRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '120px'}, renderCell: (r: TicketRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'status', label: '状态', sx: {width: '90px'}, renderCell: (r: TicketRow) => { const currentStatus = statusConfig[r.status] || statusConfig.default; return <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>; } },
    { id: 'operationType', label: '操作类别', sx: {width: '120px'}, renderCell: (r: TicketRow) => <TooltipCell>{r.operationType}</TooltipCell> },
    { id: 'operationContent', label: '操作内容', renderCell: (r: TicketRow) => <TooltipCell>{r.operationContent}</TooltipCell> },
];

const mobileColumns: ColumnConfig<TicketRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '33.33%'}, renderCell: (r: TicketRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'status', label: '状态', sx: {width: '33.33%'}, renderCell: (r: TicketRow) => { const currentStatus = statusConfig[r.status] || statusConfig.default; return <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>; } },
    { id: 'operationType', label: '操作类别', sx: {width: '33.33%'}, renderCell: (r: TicketRow) => <TooltipCell>{r.operationType}</TooltipCell> },
];

const TICKETS_QUERY_KEY = ['tickets'];

const Tickets = (): JSX.Element => {
    const {isMobile, isPanelOpen} = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const showNotification = useNotification();
    const {ticketId} = useParams<{ ticketId: string }>();
    const [isAdmin] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const delayedNavigate = useDelayedNavigate();
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);

    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<TicketRow, TicketDetailContentProps>({
        paramName: 'ticketId',
        baseRoute: '/app/tickets',
        queryKey: TICKETS_QUERY_KEY,
        queryFn: ticketsApi.fetchAll,
        DetailContentComponent: TicketDetailContent,
    });

    useEffect(() => {
        if (ticketId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === ticketId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [ticketId, rows, rowsPerPage, page]);

    useEffect(() => {
        if (!ticketId) {
            setClickedRowId(null);
        }
    }, [ticketId]);

    const onSearch = useCallback((v: TicketSearchValues) => {
        try {
            alert(`搜索: ${JSON.stringify(v)}`);
            togglePanel();
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]);

    const onReset = useCallback(() => {
        alert('重置工单搜索表单');
    }, []);

    useEffect(() => {
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }
        setPanelContent(
            <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress/></Box>}>
                <TicketSearchForm onSearch={onSearch} onReset={onReset}/>
            </Suspense>
        );
        setPanelTitle('工单搜索');
        setPanelWidth(360);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleRowClick = useCallback((id: string) => {
        setClickedRowId(id);
        delayedNavigate(`/app/tickets/${id}`, {replace: true});
    }, [delayedNavigate]);

    const columns = isMobile ? mobileColumns : desktopColumns;

    const tableContent = useMemo(() => (
        <Table stickyHeader aria-label="工单信息表" sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
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
                        selected={r.id === ticketId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
                    />
                ))}
            </TableBody>
        </Table>
    ), [pageRows, columns, ticketId, clickedRowId, handleRowClick]);

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader
                title="工单信息"
                actions={ <ActionButtons showEditButton={isAdmin} onSearchClick={togglePanel} onEditClick={() => alert('编辑按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && ( <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}> <CircularProgress/> </Box> )}
                {isError && ( <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <Typography color="error">加载失败: {error.message}</Typography> </Box> )}

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
};

export default Tickets;