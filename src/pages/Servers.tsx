/**
 * 文件名: src/pages/Servers.tsx
 *
 * 代码功能:
 * 此文件负责定义并渲染应用的“服务器信息”页面。
 *
 * 本次修改内容:
 * - 【性能优化】适配了重构后的 LayoutContext，将 `useLayout` 拆分为 `useLayoutState` 和 `useLayoutDispatch`。
 * - **优化详情**:
 *   1.  现在从 `useLayoutState` 中获取只读的状态值（如 `isMobile`）。
 *   2.  从 `useLayoutDispatch` 中获取所有状态更新函数。这可以防止组件因不相关的状态变化而重新渲染。
 *   3.  在 `useEffect` 中对面板的设置操作使用了 `setTimeout(..., 0)` 进行延迟，以避免与页面过渡动画冲突。
 *   4.  优化了 `onClick` 事件，直接在点击时触发弹窗，提供即时反馈。
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, useTheme, ButtonBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// 【核心修复】导入分离后的新版 Hooks
import { useLayoutState, useLayoutDispatch } from '../contexts/LayoutContext.tsx';
import ServerSearchForm, { type ServerSearchValues } from '../components/forms/ServerSearchForm';
import ServerDetailContent from '../components/modals/ServerDetailContent';
import TooltipCell from '../components/ui/TooltipCell';
import PageLayout from '../layouts/PageLayout';
import DataTable from '../components/ui/DataTable';

interface Row { id: string; customerName: string; serverName: string; ip: string; role: string; note?: string; dep?: string; custNote?: string; }
const create = (id: string, c: string, s: string, ip: string, role: string, note?: string, dep?: string, cn?: string): Row => ({ id, customerName: c, serverName: s, ip, role, note, dep, custNote: cn });
const LONG_NOTE = '这是一段非常非常长的使用备注，用于测试在表格单元格中的文本溢出和 Tooltip 显示效果。我们需要确保这段文本足够长，以便在不同屏幕宽度下都能被截断。';
const rows: Row[] = [ create('srv001', '客户a', 'APP-SERVER-A', '192.168.1.10', '应用', LONG_NOTE), create('srv002', '客户a', 'DB-SERVER-AB', '192.168.1.20', '数据库', LONG_NOTE, '共享', '客户 a/b 共用'), ...Array.from({ length: 100 }).map((_, i) => create(`test${i + 1}`, `测试客户${i + 1}`, `TestServer${i + 1}`, `10.0.0.${i + 1}`, i % 2 === 0 ? '应用' : '数据库', `（第 ${i + 1} 条）${LONG_NOTE}`, i % 3 === 0 ? '测试版' : undefined)), ];

const Servers: React.FC = () => {
    // 【核心修复】分离状态和派发函数的消费
    const { isMobile } = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, setIsModalOpen, setModalConfig } = useLayoutDispatch();

    const theme    = useTheme();
    const navigate = useNavigate();
    const { serverId } = useParams<{ serverId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 处理深链接
    useEffect(() => {
        if (serverId && !isMobile) {
            setIsModalOpen(true);
            setModalConfig({ content: <ServerDetailContent serverId={serverId} />, onClose: () => navigate('/app/servers') });
        } else {
            setIsModalOpen(false);
        }
    }, [serverId, navigate, setIsModalOpen, setModalConfig, isMobile]);

    const onSearch = useCallback((v: ServerSearchValues) => { alert(`搜索: ${JSON.stringify(v)}`); togglePanel(); }, [togglePanel]);
    const onReset  = useCallback(() => { alert('重置搜索表单'); setPage(0); setRowsPerPage(10); }, []);

    // 延迟设置面板内容
    useEffect(() => {
        const timerId = setTimeout(() => {
            setPanelContent(<ServerSearchForm onSearch={onSearch} onReset={onReset} />);
            setPanelTitle('服务器搜索');
            setPanelWidth(360);
            setIsPanelRelevant(true);
        }, 0);

        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
            setIsPanelRelevant(false);
        };
    }, [onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>服务器信息</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={togglePanel} sx={{ height: 42, borderRadius: '50px', textTransform: 'none', px: 3, bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': { bgcolor: 'app.button.hover' } }}>
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>搜索</Typography>
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
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
                                <ButtonBase
                                    key={r.id}
                                    component={TableRow}
                                    onClick={() => {
                                        if (!isMobile) {
                                            setModalConfig({ content: <ServerDetailContent serverId={r.id} />, onClose: () => navigate('/app/servers') });
                                            setIsModalOpen(true);
                                        }
                                        navigate(`/app/servers/${r.id}`);
                                    }}
                                    sx={{
                                        display: 'table-row',
                                        width: '100%',
                                        position: 'relative',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        }
                                    }}
                                >
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