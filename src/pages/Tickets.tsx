/**
 * 文件名: src/pages/Tickets.tsx
 *
 * 代码功能:
 * 此文件负责定义并渲染应用的“工单信息”页面。它提供了一个可搜索、可分页、支持详情查看的高级表格来展示工单数据。
 *
 * 本次修改内容:
 * - 【响应式逻辑确认】此文件中的逻辑是正确的，它负责处理“桌面端 -> 移动端”的视图切换。
 * - **解决方案**:
 *   1.  **集中决策 (部分)**: 此组件内的 `useEffect` 负责监听 `ticketId` 和 `isMobile` 的变化。
 *   2.  **单向重定向**: 当 `ticketId` 存在且 `isMobile` 变为 `true` 时，它会将用户重定向到移动端专用的详情路由。
 * - **最终效果**:
 *   确保了从桌面详情弹窗视图到移动端全屏页面的平滑过渡。
 */
import React, {useEffect, useCallback, useState, lazy, Suspense} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type TicketSearchValues} from '@/components/forms/TicketSearchForm';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));


interface Row {
    id: string;
    customerName: string;
    status: '挂起' | '就绪';
    operationType: '更新' | '备份' | '巡检';
    operationContent: string;
}

const create = (id: string, customer: string, status: Row['status'], opType: Row['operationType'], content: string): Row => ({
    id,
    customerName: customer,
    status,
    operationType: opType,
    operationContent: content,
});

const LONG_TEXT = '这是一个非常长的操作内容描述，用于测试在表格单元格中的文本溢出和鼠标悬停时的 Tooltip 显示效果。我们需要确保这段文本足够长，以便在不同屏幕宽度下都能被正确地截断，从而验证UI的健壮性。';

const rows: Row[] = [
    create('tkt001', '客户a', '就绪', '更新', '对核心应用服务器 APP-SERVER-A 进行了版本升级，从 v1.2.5 升级到 v1.3.0，并应用了最新的安全补丁。'),
    create('tkt002', '客户b', '挂起', '备份', `执行了对 DB-SERVER-B 数据库的全量备份任务，备份文件已存储至远程存储桶，并验证了备份文件的完整性。${LONG_TEXT}`),
    create('tkt003', '客户c', '就绪', '巡检', '完成了对客户C所有服务器的季度例行巡检，检查了系统日志、磁盘空间和CPU使用率，未发现异常。'),
    ...Array.from({length: 40}).map((_, i) => {
        const status = i % 3 === 0 ? '挂起' : '就绪';
        const opType = ['更新', '备份', '巡检'][i % 3] as Row['operationType'];
        return create(`tkt${i + 4}`, `测试客户${(i % 7) + 1}`, status, opType, `（第 ${i + 4} 条）${LONG_TEXT}`);
    }),
];

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
                    <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress/></Box>}>
                        <TicketDetailContent ticketId={ticketId}/>
                    </Suspense>
                ),
                onClose: () => navigate('/app/tickets', {replace: true})
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [ticketId, isMobile, navigate, setIsModalOpen, setModalConfig]);

    // Effect 2: 负责处理从桌面端到移动端的视图重定向
    useEffect(() => {
        if (ticketId && isMobile) {
            navigate(`/app/tickets/mobile/${ticketId}`, { replace: true });
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
                <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress/></Box>}>
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
                <Button variant="contained" size="large" startIcon={<SearchIcon/>} onClick={handleTogglePanel} sx={{ height: 42, borderRadius: '50px', textTransform: 'none', px: 3, bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': {bgcolor: 'app.button.hover'} }}>
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                </Button>
            </Box>

            <Box sx={{flexGrow: 1, overflow: 'hidden'}}>
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="工单信息表" sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%', minWidth: 700}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '15%', position: 'sticky', left: 0, zIndex: 120, bgcolor: 'background.paper', fontWeight: 700 }}>客户名称</TableCell>
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
                                    sx={{ display: 'table-row', width: '100%', position: 'relative' }}
                                >
                                    <TooltipCell sx={{ position: 'sticky', left: 0, zIndex: 100, bgcolor: 'background.paper', 'tr:hover &': { bgcolor: 'action.hover' } }}>{r.customerName}</TooltipCell>
                                    <TableCell sx={{ 'tr:hover &': { bgcolor: 'action.hover' } }}>
                                        <Chip label={r.status} color={r.status === '就绪' ? 'success' : 'warning'} size="small" sx={{fontWeight: 700}} />
                                    </TableCell>
                                    <TooltipCell sx={{ 'tr:hover &': { bgcolor: 'action.hover' } }}>{r.operationType}</TooltipCell>
                                    <TooltipCell sx={{ 'tr:hover &': { bgcolor: 'action.hover' } }}>{r.operationContent}</TooltipCell>
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