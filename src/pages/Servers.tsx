/**
 * 文件名: src/pages/Servers.tsx
 *
 * 本次修改内容:
 * - 【交互优化】为表格中可能被截断的单元格添加了 hover 显示完整内容的 Tooltip 功能。
 * - 导入了新的、可重用的 `TooltipCell` 组件。
 * - 在桌面端视图的 `TableBody` 中，将所有用于显示动态数据的 `TableCell` 替换为了 `TooltipCell`。
 * - 移除了之前在组件内部定义的 `noWrapCellSx` 样式对象，因为这个样式现在已经封装在 `TooltipCell` 内部。
 *
 * 文件功能描述:
 * 此文件负责定义并渲染应用的“服务器信息”页面。它包含服务器数据的获取与展示、分页控制、与侧边搜索面板的交互逻辑，以及一个支持行列冻结和内容截断的高级数据表格。
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ServerSearchForm, { type ServerSearchValues } from '../components/forms/ServerSearchForm';
import ServerDetailContent from '../components/modals/ServerDetailContent';
import TooltipCell from '../components/ui/TooltipCell'; // 【新增】导入新组件

// ... (数据模型和模拟数据保持不变)
interface ServerData { id: string; customerName: string; serverName: string; ipAddress: string; roleName: string; usageSpecificNotes?: string; deploymentType?: string; customerNotes?: string; }
const createServerData = (id: string, customerName: string, serverName: string, ipAddress: string, roleName: string, usageSpecificNotes?: string, deploymentType?: string, customerNotes?: string): ServerData => ({ id, customerName, serverName, ipAddress, roleName, usageSpecificNotes, deploymentType, customerNotes });
const mockServerData: ServerData[] = [
    createServerData('srv001', '客户a', 'APP-SERVER-A', '192.168.1.10', '应用'),
    createServerData('srv002', '客户a', 'DB-SERVER-SHARED-AB', '192.168.1.20', '数据库', '客户a和b使用同一台数据库服务器'),
    ...Array.from({ length: 100 }).map((_, i) => createServerData(`test${i + 1}`,`测试客户${i + 1}`, `TestServer${i + 1}`, `10.0.0.${i + 1}`, i % 2 === 0 ? '应用' : '数据库', `这是一条专门用于测试的特别长的使用备注，目的是验证当表格宽度不足时，文本内容是否能够被正确地截断并显示省略号。这是第 ${i + 1} 条记录。`, i % 3 === 0 ? '测试版' : undefined)),
];


const Servers: React.FC = () => {
    const { setIsModalOpen, setModalConfig, isMobile, ...layout } = useLayout();
    const theme = useTheme();
    const navigate = useNavigate();
    const { serverId } = useParams<{ serverId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (serverId) {
            setIsModalOpen(true);
            setModalConfig({ content: <ServerDetailContent serverId={serverId} />, onClose: () => navigate('/app/servers') });
        } else {
            setIsModalOpen(false);
        }
    }, [serverId, setIsModalOpen, setModalConfig, navigate]);

    // ... (其他回调和 useEffect 保持不变)
    const handleChangePage = useCallback((_event: unknown, newPage: number) => { setPage(newPage); }, []);
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }, []);
    const handleSearch = useCallback((values: ServerSearchValues) => { alert(`搜索: ${JSON.stringify(values)}`); layout.togglePanel(); }, [layout]);
    const handleReset = useCallback(() => { alert('重置搜索表单'); setPage(0); setRowsPerPage(10); }, []);
    useEffect(() => {
        layout.setPanelContent(<ServerSearchForm onSearch={handleSearch} onReset={handleReset} />);
        layout.setPanelTitle('服务器搜索'); layout.setPanelWidth(360); layout.setIsPanelRelevant(true);
        return () => { layout.setPanelContent(null); layout.setPanelTitle(''); layout.setPanelWidth(360); layout.setIsPanelRelevant(false); };
    }, [layout, handleSearch, handleReset]);

    const paginatedServerData = mockServerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    // 【修改】移除 noWrapCellSx，逻辑已移入 TooltipCell

    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Box sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', py: 4, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>服务器信息</Typography>
                    <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={layout.togglePanel} sx={{ height: 42, borderRadius: '50px', bgcolor: 'app.button.background', color: 'neutral.main', boxShadow: 'none', textTransform: 'none', fontSize: 15, fontWeight: 500, px: 3, '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' } }}>
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>搜索</Typography>
                    </Button>
                </Box>
            </Box>
            <TableContainer sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', flexGrow: 1, overflow: 'auto', bgcolor: 'background.paper' }}>
                <Table stickyHeader aria-label="服务器信息表" sx={{ borderCollapse: 'separate', tableLayout: isMobile ? 'auto' : 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            {isMobile ? (
                                <><TableCell sx={{ fontWeight: 700 }}>客户名称</TableCell><TableCell sx={{ fontWeight: 700 }}>服务器名称</TableCell><TableCell sx={{ fontWeight: 700 }}>角色</TableCell></>
                            ) : (
                                <>
                                    <TableCell sx={{ width: '15%', position: 'sticky', left: 0, zIndex: 120, bgcolor: 'background.paper', fontWeight: 700 }}>客户名称</TableCell>
                                    {[{ label: '服务器名称', width: '20%' }, { label: 'IP 地址', width: '15%' }, { label: '角色', width: '10%' }, { label: '部署类型 / 客户备注', width: '20%' }, { label: '使用备注', width: '20%' }].map(({ label, width }) => (<TableCell key={label} sx={{ width, position: 'sticky', top: 0, zIndex: 110, bgcolor: 'background.paper', fontWeight: 700 }}>{label}</TableCell>))}
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedServerData.map((row) => (
                            <TableRow key={row.id} onClick={() => navigate(`/app/servers/${row.id}`)} sx={{ cursor: 'pointer', '&:hover > .MuiTableCell-root': { backgroundColor: theme.palette.action.hover } }}>
                                {isMobile ? (
                                    <><TableCell>{row.customerName}</TableCell><TableCell>{row.serverName}</TableCell><TableCell>{row.roleName}</TableCell></>
                                ) : (
                                    <>
                                        {/* 【核心修改】将 TableCell 替换为 TooltipCell */}
                                        <TooltipCell sx={{ position: 'sticky', left: 0, zIndex: 100 }}>{row.customerName}</TooltipCell>
                                        <TooltipCell>{row.serverName}</TooltipCell>
                                        <TooltipCell>{row.ipAddress}</TooltipCell>
                                        <TooltipCell>{row.roleName}</TooltipCell>
                                        <TooltipCell>
                                            {row.deploymentType ? `[${row.deploymentType}]` : ''}{row.customerNotes ? ` ${row.customerNotes}` : ''}{!row.deploymentType && !row.customerNotes ? '-' : ''}
                                        </TooltipCell>
                                        <TooltipCell>{row.usageSpecificNotes || '-'}</TooltipCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', flexShrink: 0, bgcolor: 'background.paper', borderTop: (theme) => `1px solid ${theme.palette.divider}` }} rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={mockServerData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="每页行数:" labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count !== -1 ? count : `超过 ${to}`} 条`} />
        </Box>
    );
};

export default Servers;