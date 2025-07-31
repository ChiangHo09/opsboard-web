/**
 * 文件名: src/pages/Tickets.tsx
 *
 * 文件职责:
 * 此文件负责渲染“工单信息”页面，通过数据表格展示工单列表，并提供搜索功能。
 *
 * 本次改动内容:
 * - 【布局简化】移除了桌面视图下的固定列（Sticky Column）功能。
 * - **变更原因**:
 *   由于表格现在已实现完美的自适应列宽，不再出现水平滚动条，因此固定首列的功能已不再必要。
 * - **解决方案**:
 *   1.  从表头 (`TableHead`) 的第一个 `TableCell` 的 `sx` 属性中，移除了 `position: 'sticky'`, `left: 0`, 和 `zIndex`。
 *   2.  从表体 (`TableBody`) 的第一个 `TooltipCell` 中，移除了专门为其设计的 `stickyCellSx`，改为使用与其他单元格统一的 `cellSx`。
 * - **最终效果**:
 *   代码得到了简化，并从根源上消除了所有由 `position: sticky` 引发的 `z-index` 渲染冲突问题（如加载状态颜色不一致、点击行闪烁等）。
 *
 * ---
 *
 * ### **【归档】固定列闪烁及加载状态问题的终极解决方案**
 *
 * 以下是为未来需要重新实现固定列功能时，解决相关渲染问题的备忘录：
 *
 * 1.  **行点击闪烁问题**:
 *     - **根源**: 涟漪动画层与固定列的 `position: sticky` 层发生渲染冲突。
 *     - **解决方案 (转移背景色所有权)**:
 *       a. 在作为行的 `<ButtonBase>` 上直接定义 `hover` 和 `selected` 的 `backgroundColor`。
 *       b. 在固定列的 `sx` 中，使其在 `tr:hover` 或 `tr.Mui-selected` 状态下 `backgroundColor` 变为 `transparent`，以“透”出父行的背景。
 *
 * 2.  **加载状态颜色不一致问题**:
 *     - **根源**: 固定列表头的 `z-index` (如 120) 高于加载遮罩层的 `z-index` (如 10)，导致其无法被遮罩。
 *     - **解决方案 (动态 Z-Index)**:
 *       在 `isLoading` 为 `true` 时，将固定列表头的 `z-index` 动态设置为 `auto`，使其渲染层级降至遮罩层之下。
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

    const cellSx = {
        'tr:hover &': {
            backgroundColor: 'action.hover'
        },
        'tr.Mui-selected &': {
            backgroundColor: 'action.selected'
        },
        'tr.Mui-selected:hover &': {
            backgroundColor: 'action.selected'
        }
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
                    onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                           sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>状态</TableCell>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>操作类别</TableCell>
                                    </>
                                ) : (
                                    <>
                                        {/* 【核心修改】移除固定列相关样式 */}
                                        <TableCell sx={{
                                            width: '15%',
                                            fontWeight: 700
                                        }}>客户名称</TableCell>
                                        <TableCell sx={{width: '10%', fontWeight: 700}}>状态</TableCell>
                                        <TableCell sx={{width: '15%', fontWeight: 700}}>操作类别</TableCell>
                                        <TableCell sx={{width: '60%', fontWeight: 700}}>操作内容</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => {
                                const isHighlighted = r.id === ticketId;
                                return (
                                    <ButtonBase
                                        key={r.id}
                                        component={TableRow}
                                        selected={isHighlighted}
                                        onClick={() => {
                                            navigate(`/app/tickets/${r.id}`, {replace: true});
                                        }}
                                        sx={{display: 'table-row', width: '100%', textAlign: 'left'}}
                                    >
                                        {isMobile ? (
                                            <>
                                                <TooltipCell sx={cellSx}>{r.customerName}</TooltipCell>
                                                <TableCell sx={cellSx}>
                                                    <Chip label={r.status}
                                                          color={r.status === '就绪' ? 'success' : 'warning'}
                                                          size="small" sx={{fontWeight: 700}}/>
                                                </TableCell>
                                                <TooltipCell sx={cellSx}>{r.operationType}</TooltipCell>
                                            </>
                                        ) : (
                                            <>
                                                {/* 【核心修改】使用统一的 cellSx */}
                                                <TooltipCell sx={cellSx}>{r.customerName}</TooltipCell>
                                                <TableCell sx={cellSx}>
                                                    <Chip label={r.status}
                                                          color={r.status === '就绪' ? 'success' : 'warning'}
                                                          size="small" sx={{fontWeight: 700}}/>
                                                </TableCell>
                                                <TooltipCell sx={cellSx}>{r.operationType}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.operationContent}</TooltipCell>
                                            </>
                                        )}
                                    </ButtonBase>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Tickets;