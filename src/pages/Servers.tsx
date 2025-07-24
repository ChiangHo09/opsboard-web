/**
 * 文件名: src/pages/Servers.tsx
 *
 * 代码功能:
 * 此文件负责定义并渲染应用的“服务器信息”页面。它包含服务器数据的获取与展示、分页控制、与侧边搜索面板的交互逻辑，以及一个支持行列冻结和内容截断的高级数据表格。
 *
 * 本次修改内容:
 * - 【布局终极修复】解决了因引入 `<ButtonBase>` 导致表格布局错乱的问题。
 * - **问题定位**: `<ButtonBase>` 的默认 `display` 样式（`inline-flex`）覆盖了 `<TableRow>` 所需的 `display: 'table-row'`，破坏了表格的列对齐。
 * - **解决方案**:
 *   1.  在使用 `<ButtonBase component={TableRow}>` 时，通过 `sx` 属性，强制将其 `display` 样式覆盖回 `'table-row'`。
 *   2.  这使得组件在获得水波纹动画效果的同时，也保留了其作为表格行 (`<tr>`) 的正确布局行为。
 * - **最终效果**: 表格的列已完全对齐，恢复了正确的视觉布局，并且点击行时的水波纹动画效果也得以保留。
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, useTheme, ButtonBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
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
                                    onClick={() => navigate(`/app/servers/${r.id}`)}
                                    sx={{
                                        display: 'table-row', // 【核心修复】强制 display 样式为 table-row
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