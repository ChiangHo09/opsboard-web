/**
 * 文件名: src/pages/Servers.tsx
 *
 * 本次修改内容:
 * - 【布局终极统一】废弃了所有复杂的内部布局（Grid, Flex等），回归到最简单的“自然文档流”模型。
 * - 使用了 `<PageLayout>` 组件来包裹整个页面内容，确保其宽度、居中和内外边距与其他所有页面完全一致。
 * - 标题区和 `Paper` (包裹表格和分页器)现在作为 `<PageLayout>` 的直接子元素，从上到下依次排列。
 *
 * 文件功能描述:
 * 此文件负责定义并渲染应用的“服务器信息”页面。它包含服务器数据的获取与展示、分页控制、与侧边搜索面板的交互逻辑，以及一个支持行列冻结和内容截断的高级数据表格。
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, useTheme, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ServerSearchForm, { type ServerSearchValues } from '../components/forms/ServerSearchForm';
import ServerDetailContent from '../components/modals/ServerDetailContent';
import TooltipCell from '../components/ui/TooltipCell';
import PageLayout from '../layouts/PageLayout'; // 导入 PageLayout

interface Row { id: string; customerName: string; serverName: string; ip: string; role: string; note?: string; dep?: string; custNote?: string; }
const create = (id: string, c: string, s: string, ip: string, role: string, note?: string, dep?: string, cn?: string): Row => ({ id, customerName: c, serverName: s, ip, role, note, dep, custNote: cn });
const LONG_NOTE = '这是一段非常非常长的使用备注，用于测试 hover 截断与 tooltip 效果：' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const rows: Row[] = [ create('srv001', '客户a', 'APP-SERVER-A', '192.168.1.10', '应用', LONG_NOTE), create('srv002', '客户a', 'DB-SERVER-AB', '192.168.1.20', '数据库', LONG_NOTE, '共享', '客户 a/b 共用'), ...Array.from({ length: 100 }).map((_, i) => create(`test${i + 1}`, `测试客户${i + 1}`, `TestServer${i + 1}`, `10.0.0.${i + 1}`, i % 2 === 0 ? '应用' : '数据库', `（第 ${i + 1} 条）${LONG_NOTE}`, i % 3 === 0 ? '测试版' : undefined)), ];

const Servers: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, isMobile, setIsModalOpen, setModalConfig } = useLayout();
    const theme    = useTheme();
    const navigate = useNavigate();
    const { serverId } = useParams<{ serverId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (serverId) { setIsModalOpen(true); setModalConfig({ content: <ServerDetailContent serverId={serverId} />, onClose: () => navigate('/app/servers') }); }
        else { setIsModalOpen(false); }
    }, [serverId, navigate, setIsModalOpen, setModalConfig]);

    const onSearch = useCallback((v: ServerSearchValues) => { alert(`搜索: ${JSON.stringify(v)}`); togglePanel(); }, [togglePanel]);
    const onReset  = useCallback(() => { alert('重置搜索表单'); setPage(0); setRowsPerPage(10); }, []);

    useEffect(() => {
        setPanelContent(<ServerSearchForm onSearch={onSearch} onReset={onReset} />);
        setPanelTitle('服务器搜索'); setPanelWidth(360); setIsPanelRelevant(true);
        return () => { setPanelContent(null); setPanelTitle(''); setIsPanelRelevant(false); };
    }, [onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <PageLayout>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>服务器信息</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={togglePanel} sx={{ height: 42, borderRadius: '50px', textTransform: 'none', px: 3, bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': { bgcolor: 'app.button.hover' } }}>
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>搜索</Typography>
                </Button>
            </Box>

            <Paper elevation={0} sx={{ overflow: 'hidden', width: '100%' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="服务器信息表" sx={{ borderCollapse: 'separate', tableLayout: isMobile ? 'auto' : 'fixed' }}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <><TableCell sx={{ fontWeight: 700 }}>客户名称</TableCell><TableCell sx={{ fontWeight: 700 }}>服务器名称</TableCell><TableCell sx={{ fontWeight: 700 }}>角色</TableCell></>
                                ) : (
                                    <>
                                        <TableCell sx={{ width: '15%', position: 'sticky', left: 0, zIndex: 120, bgcolor: 'background.paper', fontWeight: 700 }}>客户名称</TableCell>
                                        <TableCell sx={{ width: '20%', fontWeight: 700 }}>服务器名称</TableCell>
                                        <TableCell sx={{ width: '15%', fontWeight: 700 }}>IP 地址</TableCell>
                                        <TableCell sx={{ width: '10%', fontWeight: 700 }}>角色</TableCell>
                                        <TableCell sx={{ width: '20%', fontWeight: 700 }}>部署类型 / 备注</TableCell>
                                        <TableCell sx={{ width: '20%', fontWeight: 700 }}>使用备注</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => (
                                <TableRow key={r.id} onClick={() => navigate(`/app/servers/${r.id}`)} sx={{ cursor: 'pointer', '&:hover > .MuiTableCell-root': { background: theme.palette.action.hover } }}>
                                    {isMobile ? (
                                        <><TooltipCell>{r.customerName}</TooltipCell><TooltipCell>{r.serverName}</TooltipCell><TooltipCell>{r.role}</TooltipCell></>
                                    ) : (
                                        <>
                                            <TooltipCell sx={{ position: 'sticky', left: 0, zIndex: 100 }}>{r.customerName}</TooltipCell>
                                            <TooltipCell>{r.serverName}</TooltipCell>
                                            <TooltipCell>{r.ip}</TooltipCell>
                                            <TooltipCell>{r.role}</TooltipCell>
                                            <TooltipCell>{r.dep ? `[${r.dep}] ` : ''}{r.custNote || '-'}</TooltipCell>
                                            <TooltipCell>{r.note || '-'}</TooltipCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                    sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
                />
            </Paper>
        </PageLayout>
    );
};

export default Servers;