/**
 * 文件名: src/pages/Tickets.tsx
 *
 * 文件职责:
 * 此文件负责渲染“工单信息”页面，通过数据表格展示工单列表，并提供搜索功能。
 *
 * 本次改动内容:
 * - 【类型安全修复】为 `onRowsPerPageChange` 回调的事件参数添加了显式类型定义。
 * - **解决方案**:
 *   通过将 `e` 参数的类型指定为 `React.ChangeEvent<HTMLInputElement>`，
 *   解决了 TypeScript 报出的 `TS7006: Parameter 'e' implicitly has an 'any' type.` 错误。
 * - 【API 调用更新】(此文件之前的改动) 更新了数据获取方式，以匹配重构后的模块化 API。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));

const Tickets = (): JSX.Element => {
    const {isPanelOpen} = useLayoutState();
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

    return (
        <PageLayout sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0}}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>工单信息</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon/>} onClick={handleTogglePanel} sx={{
                    height: 42,
                    borderRadius: '50px',
                    textTransform: 'none',
                    px: 3,
                    bgcolor: 'app.button.background',
                    color: 'neutral.main',
                    '&:hover': {bgcolor: 'app.button.hover'}
                }}>
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                </Button>
            </Box>

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
                    onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}: {
                        from: number,
                        to: number,
                        count: number
                    }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="工单信息表"
                           sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%', minWidth: 700}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{
                                    width: '15%',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 120,
                                    bgcolor: 'background.paper',
                                    fontWeight: 700
                                }}>客户名称</TableCell>
                                <TableCell sx={{width: '10%', fontWeight: 700}}>状态</TableCell>
                                <TableCell sx={{width: '15%', fontWeight: 700}}>操作类别</TableCell>
                                <TableCell sx={{width: '60%', fontWeight: 700}}>操作内容</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => (
                                <ButtonBase
                                    key={r.id}
                                    component={TableRow}
                                    onClick={() => {
                                        navigate(`/app/tickets/${r.id}`, {replace: true});
                                    }}
                                    sx={{display: 'table-row', width: '100%', position: 'relative'}}
                                >
                                    <TooltipCell sx={{
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 100,
                                        bgcolor: 'background.paper',
                                        'tr:hover &': {bgcolor: 'action.hover'}
                                    }}>{r.customerName}</TooltipCell>
                                    <TableCell sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>
                                        <Chip label={r.status} color={r.status === '就绪' ? 'success' : 'warning'}
                                              size="small" sx={{fontWeight: 700}}/>
                                    </TableCell>
                                    <TooltipCell
                                        sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>{r.operationType}</TooltipCell>
                                    <TooltipCell
                                        sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>{r.operationContent}</TooltipCell>
                                </ButtonBase>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Tickets;