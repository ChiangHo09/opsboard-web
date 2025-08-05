/**
 * @file src/pages/Tickets.tsx
 * @description 此文件负责渲染“工单信息”页面，通过数据表格展示工单列表，并提供搜索功能。
 * @modification
 *   - [Layout Fix]: 修复了表格右侧的空白问题。通过为前几列设置固定的像素宽度，并让最后一列（操作内容）自动填充所有剩余空间，确保表格能够精确地填满其容器的100%宽度。
 *   - [Refactor]: 更新了 `<PageHeader>` 组件的导入路径，以符合 `/src/layouts` 的标准目录结构。
 *   - [Refactor]: 引入并使用了新的可复用布局组件 `<PageHeader />`。
 *   - [Refactor]: 引入了列配置数组（`columns`）来动态渲染表格的表头和单元格。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
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
import ClickableTableRow from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';
import PageHeader from '@/layouts/PageHeader';

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));

const statusConfig: Record<string, { label: string; sx: (theme: Theme) => object }> = {
    '就绪': {
        label: '完成',
        sx: (theme: Theme) => ({
            fontWeight: 700,
            backgroundColor: theme.palette.neutral.main,
            color: theme.palette.common.white,
            '& .MuiChip-label': {
                transform: 'translateY(1px)',
            },
        }),
    },
    '挂起': {
        label: '挂起',
        sx: (theme: Theme) => ({
            fontWeight: 700,
            backgroundColor: red[200],
            color: theme.palette.common.white,
            '& .MuiChip-label': {
                transform: 'translateY(1px)',
            },
        }),
    },
    'default': {
        label: '未知',
        sx: () => ({
            fontWeight: 700,
        }),
    },
};

// 【核心修复】为固定宽度的列设置像素宽度，最后一列不设置宽度以自动填充。
const desktopColumns = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '120px', fontWeight: 700},
        renderCell: (r: TicketRow) => <TooltipCell key="customerName">{r.customerName}</TooltipCell>
    },
    {
        id: 'status',
        label: '状态',
        sx: {width: '90px', fontWeight: 700},
        renderCell: (r: TicketRow) => {
            const currentStatus = statusConfig[r.status] || statusConfig.default;
            return (
                <TableCell key="status">
                    <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>
                </TableCell>
            );
        }
    },
    {
        id: 'operationType',
        label: '操作类别',
        sx: {width: '120px', fontWeight: 700},
        renderCell: (r: TicketRow) => <TooltipCell key="opType">{r.operationType}</TooltipCell>
    },
    {
        id: 'operationContent',
        label: '操作内容',
        sx: {fontWeight: 700}, // 不设置 width，让其自动填充剩余空间
        renderCell: (r: TicketRow) => <TooltipCell key="opContent">{r.operationContent}</TooltipCell>
    },
];

const mobileColumns = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '33.33%', fontWeight: 700},
        renderCell: (r: TicketRow) => <TooltipCell key="customerName">{r.customerName}</TooltipCell>
    },
    {
        id: 'status', label: '状态', sx: {width: '33.33%', fontWeight: 700}, renderCell: (r: TicketRow) => {
            const currentStatus = statusConfig[r.status] || statusConfig.default;
            return (
                <TableCell key="status">
                    <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>
                </TableCell>
            );
        }
    },
    {
        id: 'operationType',
        label: '操作类别',
        sx: {width: '33.33%', fontWeight: 700},
        renderCell: (r: TicketRow) => <TooltipCell key="opType">{r.operationType}</TooltipCell>
    },
];


const Tickets = (): JSX.Element => {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
    } = useLayoutDispatch();
    const showNotification = useNotification();

    const navigate = useNavigate();
    const {ticketId} = useParams<{ ticketId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const [isAdmin] = useState(true);

    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<TicketRow, TicketDetailContentProps>({
        paramName: 'ticketId',
        baseRoute: '/app/tickets',
        queryKey: ['tickets'],
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
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

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
        if (!isPanelContentSet) return;
        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <TicketSearchForm onSearch={onSearch} onReset={onReset}/>
                </Suspense>
            );
            setPanelTitle('工单搜索');
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

    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <PageLayout>
            <PageHeader
                title="工单信息"
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
                {isLoading && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10
                    }}>
                        <CircularProgress/>
                    </Box>
                )}
                {isError && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography color="error">加载失败: {error.message}</Typography>
                    </Box>
                )}
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
                    <Table stickyHeader aria-label="工单信息表"
                           sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
                        <TableHead>
                            <TableRow>
                                {columns.map(col => (
                                    <TableCell key={col.id} sx={col.sx}>{col.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => (
                                <ClickableTableRow
                                    key={r.id}
                                    selected={r.id === ticketId}
                                    onClick={() => {
                                        navigate(`/app/tickets/${r.id}`, {replace: true});
                                    }}
                                >
                                    {columns.map(col => col.renderCell(r))}
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Tickets;