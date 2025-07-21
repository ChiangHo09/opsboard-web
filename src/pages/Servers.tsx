/**
 * 文件名: src/pages/Servers.tsx
 *
 * 本次修改内容:
 * - 【代码简化】由于自动关闭弹窗的逻辑已移至 `MainLayout.tsx` 全局处理，
 *   此处的 `useEffect` 不再需要返回一个清理函数来关闭弹窗。
 * - 这使得 `Servers.tsx` 的职责更单一：只负责在 `serverId` 存在时请求打开弹窗。
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

// --- 数据模型与模拟数据 (保持不变) ---
interface ServerData { id: string; customerName: string; serverName: string; ipAddress: string; roleName: string; usageSpecificNotes?: string; deploymentType?: string; customerNotes?: string; }
const createServerData = (id: string, customerName: string, serverName: string, ipAddress: string, roleName: string, usageSpecificNotes?: string, deploymentType?: string, customerNotes?: string): ServerData => ({ id, customerName, serverName, ipAddress, roleName, usageSpecificNotes, deploymentType, customerNotes });
const mockServerData: ServerData[] = [
    createServerData('srv001', '客户a', 'APP-SERVER-A', '192.168.1.10', '应用'),
    createServerData('srv002', '客户a', 'DB-SERVER-SHARED-AB', '192.168.1.20', '数据库', '客户a和b使用同一台数据库服务器'),
    ...Array.from({ length: 100 }).map((_, i) => createServerData(`test${i + 1}`,`测试客户${i + 1}`, `TestServer${i + 1}`, `10.0.0.${i + 1}`, i % 2 === 0 ? '应用' : '数据库', `这是一条专门用于测试的特别长的使用备注...`, i % 3 === 0 ? '测试版' : undefined)),
];

const Servers: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, isMobile, setIsModalOpen, setModalConfig } = useLayout();
    const theme = useTheme();
    const navigate = useNavigate();
    const { serverId } = useParams<{ serverId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (serverId) {
            setIsModalOpen(true);
            setModalConfig({
                content: <ServerDetailContent serverId={serverId} />,
                onClose: () => navigate('/app/servers'),
            });
        } else {
            // 当 serverId 不存在时（例如，从详情页返回列表页），确保弹窗状态为关闭
            setIsModalOpen(false);
        }
        // 【简化】不再需要返回清理函数，因为 MainLayout 会处理
    }, [serverId, setIsModalOpen, setModalConfig, navigate]);

    // ... (其他回调函数保持不变)
    const handleChangePage = useCallback((_event: unknown, newPage: number) => { setPage(newPage); }, []);
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }, []);
    const handleSearch = useCallback((values: ServerSearchValues) => { console.log('收到搜索条件:', values); alert(`搜索: ${JSON.stringify(values)}`); togglePanel(); }, [togglePanel]);
    const handleReset = useCallback(() => { alert('重置搜索表单'); setPage(0); setRowsPerPage(10); }, []);
    useEffect(() => {
        setPanelContent(<ServerSearchForm onSearch={handleSearch} onReset={handleReset} />);
        setPanelTitle('服务器搜索'); setPanelWidth(360); setIsPanelRelevant(true);
        return () => { setPanelContent(null); setPanelTitle(''); setPanelWidth(360); setIsPanelRelevant(false); };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    const paginatedServerData = mockServerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const noWrapCellSx = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as const;

    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Box sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', py: 4, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>服务器信息</Typography>
                    <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={togglePanel} sx={{ height: 42, borderRadius: '50px', bgcolor: 'app.button.background', color: 'neutral.main', boxShadow: 'none', textTransform: 'none', fontSize: 15, fontWeight: 500, px: 3, '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' } }}>
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
                                    <TableCell sx={{ width: '15%', position: 'sticky', left: 0, top: 0, zIndex: 120, bgcolor: 'background.paper', fontWeight: 700 }}>客户名称</TableCell>
                                    {[{ label: '服务器名称', width: '20%' }, { label: 'IP 地址', width: '15%' }, { label: '角色', width: '10%' }, { label: '部署类型 / 客户备注', width: '20%' }, { label: '使用备注', width: '20%' }].map(({ label, width }) => (<TableCell key={label} sx={{ width, position: 'sticky', top: 0, zIndex: 110, bgcolor: 'background.paper', fontWeight: 700 }}>{label}</TableCell>))}
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedServerData.length === 0 ? (
                            <TableRow><TableCell colSpan={isMobile ? 3 : 6} align="center">暂无服务器数据</TableCell></TableRow>
                        ) : (
                            paginatedServerData.map((row) => (
                                <TableRow key={row.id} onClick={() => navigate(`/app/servers/${row.id}`)} sx={{ cursor: 'pointer', '&:hover > .MuiTableCell-root': { backgroundColor: theme.palette.action.hover, } }}>
                                    {isMobile ? (
                                        <><TableCell sx={noWrapCellSx}>{row.customerName}</TableCell><TableCell sx={noWrapCellSx}>{row.serverName}</TableCell><TableCell sx={noWrapCellSx}>{row.roleName}</TableCell></>
                                    ) : (
                                        <>
                                            <TableCell sx={{ ...noWrapCellSx, position: 'sticky', left: 0, zIndex: 100 }}>{row.customerName}</TableCell>
                                            <TableCell sx={noWrapCellSx}>{row.serverName}</TableCell><TableCell sx={noWrapCellSx}>{row.ipAddress}</TableCell><TableCell sx={noWrapCellSx}>{row.roleName}</TableCell>
                                            <TableCell sx={noWrapCellSx}>{row.deploymentType ? `[${row.deploymentType}]` : ''}{row.customerNotes ? ` ${row.customerNotes}` : ''}{!row.deploymentType && !row.customerNotes ? '-' : ''}</TableCell>
                                            <TableCell sx={noWrapCellSx}>{row.usageSpecificNotes || '-'}</TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', flexShrink: 0, bgcolor: 'background.paper', borderTop: (theme) => `1px solid ${theme.palette.divider}`, }} rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={mockServerData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="每页行数:" labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count !== -1 ? count : `超过 ${to}`} 条`} />
        </Box>
    );
};

export default Servers;