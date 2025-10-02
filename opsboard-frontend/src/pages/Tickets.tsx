/**
 * @file src/pages/Tickets.tsx
 * @description 此文件负责渲染“工单信息”页面，数据来源于后端聚合视图。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [UI 增强]：更新了表格的列定义，现在会同时显示“发布时间”和“完成时间”，并按发布时间进行倒序排列，提供了更完整和有序的时间线信息。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, Chip, type Theme, IconButton, Tooltip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
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
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';
import PageHeader from '@/layouts/PageHeader';
import { useDelayedNavigate } from '@/hooks/useDelayedNavigate';
import NoDataMessage from "@/components/ui/NoDataMessage";

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));

const statusConfig: Record<string, { label: string; sx: (theme: Theme) => object }> = {
    '完成': { label: '完成', sx: (theme: Theme) => ({ fontWeight: 700, backgroundColor: theme.palette.success.main, color: theme.palette.common.white, '& .MuiChip-label': { transform: 'translateY(1px)' } }) },
    '挂起': { label: '挂起', sx: (theme: Theme) => ({ fontWeight: 700, backgroundColor: theme.palette.warning.main, color: theme.palette.common.white, '& .MuiChip-label': { transform: 'translateY(1px)' } }) },
    'default': { label: '未知', sx: () => ({ fontWeight: 700 }) },
};

// [核心修改] 更新列定义
const desktopColumns: ColumnConfig<TicketRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '120px'}, renderCell: (row: TicketRow) => <TooltipCell>{row.customerName}</TooltipCell> },
    { id: 'status', label: '状态', sx: {width: '90px'}, renderCell: (row: TicketRow) => { const currentStatus = statusConfig[row.status] || statusConfig.default; return <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>; } },
    { id: 'operationType', label: '操作类别', sx: {width: '120px'}, renderCell: (row: TicketRow) => <TooltipCell>{row.operationType}</TooltipCell> },
    { id: 'operationContent', label: '操作内容', renderCell: (row: TicketRow) => <TooltipCell>{row.operationContent}</TooltipCell> },
    { id: 'publicationTime', label: '发布时间', sx: {width: '150px'}, renderCell: (row: TicketRow) => <TooltipCell>{new Date(row.publicationTime).toLocaleDateString()}</TooltipCell> },
    { id: 'completionTime', label: '完成时间', sx: {width: '150px'}, renderCell: (row: TicketRow) => <TooltipCell>{row.completionTime?.Valid ? new Date(row.completionTime.Time).toLocaleDateString() : '-'}</TooltipCell> },
];

const mobileColumns: ColumnConfig<TicketRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '33.33%'}, renderCell: (row: TicketRow) => <TooltipCell>{row.customerName}</TooltipCell> },
    { id: 'status', label: '状态', sx: {width: '33.33%'}, renderCell: (row: TicketRow) => { const currentStatus = statusConfig[row.status] || statusConfig.default; return <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>; } },
    { id: 'operationType', label: '操作类别', sx: {width: '33.33%'}, renderCell: (row: TicketRow) => <TooltipCell>{row.operationType}</TooltipCell> },
];

const TICKETS_QUERY_KEY_BASE = ['tickets'];
const ANIMATION_DELAY = 300;

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
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsQueryEnabled(true), ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const {rows, totalRows, isLoading, isError, error} = useResponsiveDetailView<TicketRow, TicketDetailContentProps>({
        paramName: 'ticketId',
        baseRoute: '/app/tickets',
        queryKey: [TICKETS_QUERY_KEY_BASE],
        queryFn: ticketsApi.fetchAll,
        DetailContentComponent: TicketDetailContent,
        enabled: isQueryEnabled,
        page: page,
        rowsPerPage: rowsPerPage,
    });

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
                {rows.map((r: TicketRow) => (
                    <ClickableTableRow
                        key={r.id}
                        row={r}
                        columns={columns}
                        selected={r.id === ticketId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
                        actions={
                            <Tooltip title="打印工单">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); alert(`打印工单 ${r.id}`); }}>
                                    <PrintIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                ))}
            </TableBody>
        </Table>
    ), [rows, columns, ticketId, clickedRowId, handleRowClick]);

    const renderContent = () => {
        if ((isLoading || !isQueryEnabled) && totalRows === 0) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (isError) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography color="error">加载失败: {error ? error.message : '未知错误'}</Typography>
                </Box>
            );
        }
        if (totalRows === 0) {
            return <NoDataMessage message="暂无工单数据" />;
        }
        return (
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
                title="工单信息"
                actions={ <ActionButtons showEditButton={isAdmin} onSearchClick={togglePanel} onEditClick={() => alert('新建工单按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {renderContent()}
            </Box>
        </PageLayout>
    );
};

export default Tickets;