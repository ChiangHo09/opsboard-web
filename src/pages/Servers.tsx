/**
 * 文件名: src/pages/Servers.tsx
 *
 * 代码功能:
 * 此文件负责定义并渲染应用的“服务器信息”页面。
 *
 * 本次修改内容:
 * - 【响应式逻辑修复】应用了最终的、双向无缝切换的响应式详情查看逻辑。
 * - **解决方案**:
 *   1.  **添加重定向 Effect**: 增加了一个 `useEffect`，当 URL 中存在 `serverId` 且视图切换到移动端时，自动重定向到移动端专属的详情页。
 *   2.  **简化点击事件**: 表格行的 `onClick` 事件现在只负责导航到桌面端弹窗路由，所有响应式决策都由 `useEffect` 处理。
 *   3.  **分离弹窗控制**: 控制弹窗的 `useEffect` 逻辑保持不变，它只在非移动端视图下工作。
 */
import React, {useEffect, useCallback, useState, lazy, Suspense} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type ServerSearchValues} from '@/components/forms/ServerSearchForm';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';

// 使用 React.lazy 动态导入组件
const ServerSearchForm = lazy(() => import('@/components/forms/ServerSearchForm'));
const ServerDetailContent = lazy(() => import('@/components/modals/ServerDetailContent'));


interface Row {
    id: string;
    customerName: string;
    serverName: string;
    ip: string;
    role: string;
    note?: string;
    dep?: string;
    custNote?: string;
}

const create = (id: string, c: string, s: string, ip: string, role: string, note?: string, dep?: string, cn?: string): Row => ({
    id,
    customerName: c,
    serverName: s,
    ip,
    role,
    note,
    dep,
    custNote: cn
});
const LONG_NOTE = '这是一段非常非常长的使用备注，用于测试在表格单元格中的文本溢出和 Tooltip 显示效果。我们需要确保这段文本足够长，以便在不同屏幕宽度下都能被截断。';
const rows: Row[] = [create('srv001', '客户a', 'APP-SERVER-A', '192.168.1.10', '应用', LONG_NOTE), create('srv002', '客户a', 'DB-SERVER-AB', '192.168.1.20', '数据库', LONG_NOTE, '共享', '客户 a/b 共用'), ...Array.from({length: 100}).map((_, i) => create(`test${i + 1}`, `测试客户${i + 1}`, `TestServer${i + 1}`, `10.0.0.${i + 1}`, i % 2 === 0 ? '应用' : '数据库', `（第 ${i + 1} 条）${LONG_NOTE}`, i % 3 === 0 ? '测试版' : undefined)),];

const Servers: React.FC = () => {
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
    const {serverId} = useParams<{ serverId: string }>();

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
        const serverExists = serverId && rows.some(row => row.id === serverId);
        if (serverExists && !isMobile) {
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
                        <ServerDetailContent serverId={serverId}/>
                    </Suspense>
                ),
                onClose: () => navigate('/app/servers', {replace: true})
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [serverId, isMobile, navigate, setIsModalOpen, setModalConfig]);

    // 【核心修复】Effect 2: 负责处理从桌面端到移动端的视图重定向
    useEffect(() => {
        if (serverId && isMobile) {
            navigate(`/app/servers/mobile/${serverId}`, { replace: true });
        }
    }, [serverId, isMobile, navigate]);

    const onSearch = useCallback((v: ServerSearchValues) => {
        alert(`搜索: ${JSON.stringify(v)}`);
        togglePanel();
    }, [togglePanel]);
    const onReset = useCallback(() => {
        alert('重置搜索表单');
        setPage(0);
        setRowsPerPage(10);
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
                    <ServerSearchForm onSearch={onSearch} onReset={onReset}/>
                </Suspense>
            );
            setPanelTitle('服务器搜索');
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
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>服务器信息</Typography>
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

            <Box sx={{flexGrow: 1, overflow: 'hidden'}}>
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
                    <Table stickyHeader aria-label="服务器信息表"
                           sx={{borderCollapse: 'separate', tableLayout: isMobile ? 'auto' : 'fixed', minWidth: 900}}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <><TableCell sx={{fontWeight: 700}}>客户名称</TableCell><TableCell
                                        sx={{fontWeight: 700}}>服务器名称</TableCell><TableCell
                                        sx={{fontWeight: 700}}>角色</TableCell></>
                                ) : (
                                    <>
                                        <TableCell sx={{
                                            width: '15%',
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 120,
                                            bgcolor: 'background.paper',
                                            fontWeight: 700
                                        }}>客户名称</TableCell>
                                        <TableCell sx={{width: '20%', fontWeight: 700}}>服务器名称</TableCell>
                                        <TableCell sx={{width: '15%', fontWeight: 700}}>IP 地址</TableCell>
                                        <TableCell sx={{width: '10%', fontWeight: 700}}>角色</TableCell>
                                        <TableCell sx={{width: '20%', fontWeight: 700}}>部署类型 / 备注</TableCell>
                                        <TableCell sx={{width: '20%', fontWeight: 700}}>使用备注</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => (
                                <ButtonBase
                                    key={r.id}
                                    component={TableRow}
                                    onClick={() => {
                                        navigate(`/app/servers/${r.id}`, {replace: true});
                                    }}
                                    sx={{
                                        display: 'table-row',
                                        width: '100%',
                                        position: 'relative',
                                    }}
                                >
                                    {isMobile ? (
                                        <>
                                            <TooltipCell>{r.customerName}</TooltipCell><TooltipCell>{r.serverName}</TooltipCell><TooltipCell>{r.role}</TooltipCell></>
                                    ) : (
                                        <>
                                            <TooltipCell sx={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 100,
                                                bgcolor: 'background.paper',
                                                'tr:hover &': {bgcolor: 'action.hover'}
                                            }}>{r.customerName}</TooltipCell>
                                            <TooltipCell
                                                sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>{r.serverName}</TooltipCell>
                                            <TooltipCell
                                                sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>{r.ip}</TooltipCell>
                                            <TooltipCell
                                                sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>{r.role}</TooltipCell>
                                            <TooltipCell
                                                sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>{r.dep ? `[${r.dep}] ` : ''}{r.custNote || '-'}</TooltipCell>
                                            <TooltipCell
                                                sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>{r.note || '-'}</TooltipCell>
                                        </>
                                    )}
                                </ButtonBase>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Servers;