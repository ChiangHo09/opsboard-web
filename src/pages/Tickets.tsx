/**
 * 文件名: src/pages/Tickets.tsx
 *
 * 代码功能:
 * 此文件负责定义并渲染应用的“工单信息”页面。它提供了一个可搜索、可分页、支持详情查看的高级表格来展示工单数据。
 *
 * 本次修改内容:
 * - 【数据获取重构】使用 TanStack Query 替代了本地硬编码的数据。
 * - 1. **移除静态数据**: 删除了组件内部硬编码的 `rows` 数组和相关创建函数。
 * - 2. **引入 API 调用**: 导入了 `fetchTickets` 函数，该函数负责从模拟 API 获取工单数据。
 * - 3. **集成 `useQuery`**: 使用 `@tanstack/react-query` 的 `useQuery` Hook 来声明式地获取数据。
 * - 4. **处理加载与错误状态**: 在数据加载时显示一个全表格范围的 `CircularProgress` 指示器，并在获取失败时显示错误信息。
 * - 5. **更新依赖逻辑**: 将所有依赖 `rows` 数组的逻辑（如弹窗存在性检查、分页）都更新为使用从 `useQuery` 返回的 `data`。
 */
import React, {useEffect, useCallback, useState, lazy, Suspense} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useQuery} from '@tanstack/react-query';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type TicketSearchValues} from '@/components/forms/TicketSearchForm';
import {fetchTickets, type TicketRow} from '@/api';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));

const Tickets: React.FC = () => {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
        setIsModalOpen,
        setModalConfig
    } = useLayoutDispatch();

    const navigate = useNavigate();
    const {ticketId} = useParams<{ ticketId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const {data: rows = [], isLoading, isError, error} = useQuery<TicketRow[], Error>({
        queryKey: ['tickets'],
        queryFn: fetchTickets,
    });

    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    // Effect 1: 负责控制桌面端弹窗的显示与隐藏
    useEffect(() => {
        const ticketExists = ticketId && rows.some(row => row.id === ticketId);
        if (ticketExists && !isMobile) {
            setIsModalOpen(true);
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><CircularProgress/></Box>}>
                        <TicketDetailContent ticketId={ticketId}/>
                    </Suspense>
                ),
                onClose: () => navigate('/app/tickets', {replace: true})
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [ticketId, isMobile, navigate, setIsModalOpen, setModalConfig, rows]);

    // Effect 2: 负责处理从桌面端到移动端的视图重定向
    useEffect(() => {
        if (ticketId && isMobile) {
            navigate(`/app/tickets/mobile/${ticketId}`, {replace: true});
        }
    }, [ticketId, isMobile, navigate]);


    const onSearch = useCallback((v: TicketSearchValues) => {
        alert(`搜索: ${JSON.stringify(v)}`);
        togglePanel();
    }, [togglePanel]);

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
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={e => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
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