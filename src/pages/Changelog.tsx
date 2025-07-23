/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 本次修改内容:
 * - 【无限循环修复】解决了可能导致页面白屏和搜索面板内容闪烁的无限重渲染循环问题。
 * - **移除了不稳定的 `...layout` 对象**: 不再使用剩余操作符来收集 context 的属性。
 * - **明确解构依赖**: 从 `useLayout` 中明确地解构出 `useEffect` 所需的每一个函数
 *   （`setPanelContent`, `setPanelTitle`, `setPanelWidth`, `setIsPanelRelevant`）。
 * - **稳定依赖数组**: 将这些从 context 中获取的、被 `useCallback` 包裹的稳定函数
 *   直接放入 `useEffect` 的依赖数组中，从而打破了重渲染的循环。
 *
 * 文件功能描述:
 * 此文件定义了应用的“更新日志”页面，提供了一个可搜索、可分页、支持详情查看的高级表格来展示日志数据。
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ChangelogSearchForm, { type ChangelogSearchValues } from '../components/forms/ChangelogSearchForm.tsx';
import ChangelogDetailContent from '../components/modals/ChangelogDetailContent.tsx';
import TooltipCell from '../components/ui/TooltipCell';

// ... (数据模型和模拟数据保持不变)
interface ChangelogData { id: string; customerName: string; updateTime: string; updateType: string; updateContent: string; }
const createLogData = (id: string, customerName: string, updateTime: string, updateType: string, updateContent: string): ChangelogData => ({ id, customerName, updateTime, updateType, updateContent });
const mockLogData: ChangelogData[] = [ createLogData('log001', '客户a', '2025-07-21 10:30', '功能更新', '新增了用户导出功能...'), createLogData('log002', '客户b', '2025-07-20 15:00', '安全修复', '修复了一个潜在的XSS漏洞。'), ...Array.from({ length: 50 }).map((_, i) => createLogData(`log${i + 4}`, `测试客户${(i % 5) + 1}`, `2025-06-${20 - (i % 20)} 14:00`, i % 2 === 0 ? 'Bug修复' : '常规维护', `这是第 ${i + 4} 条模拟更新日志...`)), ];


const Changelog: React.FC = () => {
    // 【核心修复】明确解构所有需要的函数
    const {
        setIsModalOpen, setModalConfig, isMobile, togglePanel,
        setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant
    } = useLayout();
    const theme = useTheme();
    const navigate = useNavigate();
    const { logId } = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (logId) {
            setIsModalOpen(true);
            setModalConfig({ content: <ChangelogDetailContent logId={logId} />, onClose: () => navigate('/app/changelog') });
        } else {
            setIsModalOpen(false);
        }
    }, [logId, setIsModalOpen, setModalConfig, navigate]);

    const handleSearch = useCallback((values: ChangelogSearchValues) => { const searchInfo = { ...values, startTime: values.startTime?.format('YYYY-MM-DD'), endTime: values.endTime?.format('YYYY-MM-DD') }; alert(`搜索: ${JSON.stringify(searchInfo)}`); togglePanel(); }, [togglePanel]);
    const handleReset = useCallback(() => { alert('重置表单'); }, []);

    // 【核心修复】将稳定的函数直接放入依赖数组
    useEffect(() => {
        setPanelContent(<ChangelogSearchForm onSearch={handleSearch} onReset={handleReset} />);
        setPanelTitle('日志搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    const handleChangePage = useCallback((_event: unknown, newPage: number) => { setPage(newPage); }, []);
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }, []);
    const paginatedLogData = mockLogData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', py: 4, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>更新日志</Typography>
                    <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={togglePanel} sx={{ height: '42px', borderRadius: '50px', bgcolor: 'app.button.background', color: 'neutral.main', boxShadow: 'none', textTransform: 'none', fontSize: '15px', fontWeight: 500, px: 3, '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' } }}>
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>搜索</Typography>
                    </Button>
                </Box>
            </Box>
            <TableContainer sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', flexGrow: 1, overflow: 'auto', bgcolor: 'background.paper' }}>
                <Table stickyHeader aria-label="更新日志表" sx={{ borderCollapse: 'separate', tableLayout: isMobile ? 'auto' : 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            {isMobile ? (
                                <><TableCell sx={{ fontWeight: 700 }}>客户名称</TableCell><TableCell sx={{ fontWeight: 700 }}>更新时间</TableCell><TableCell sx={{ fontWeight: 700 }}>更新内容</TableCell></>
                            ) : (
                                <>
                                    <TableCell sx={{ width: '15%', position: 'sticky', left: 0, zIndex: 120, bgcolor: 'background.paper', fontWeight: 700 }}>客户名称</TableCell>
                                    <TableCell sx={{ width: '20%', fontWeight: 700 }}>更新时间</TableCell>
                                    <TableCell sx={{ width: '15%', fontWeight: 700 }}>更新类型</TableCell>
                                    <TableCell sx={{ width: '50%', fontWeight: 700 }}>更新内容</TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedLogData.map((row) => (
                            <TableRow key={row.id} onClick={() => navigate(`/app/changelog/${row.id}`)} sx={{ cursor: 'pointer', '&:hover > .MuiTableCell-root': { backgroundColor: theme.palette.action.hover } }}>
                                {isMobile ? (
                                    <><TableCell>{row.customerName}</TableCell><TableCell>{row.updateTime}</TableCell><TableCell>{row.updateContent}</TableCell></>
                                ) : (
                                    <>
                                        <TooltipCell sx={{ position: 'sticky', left: 0, zIndex: 100 }}>{row.customerName}</TooltipCell>
                                        <TooltipCell>{row.updateTime}</TooltipCell>
                                        <TooltipCell>{row.updateType}</TooltipCell>
                                        <TooltipCell>{row.updateContent}</TooltipCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', flexShrink: 0, bgcolor: 'background.paper', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={mockLogData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="每页行数:"
                labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
            />
        </Box>
    );
};

export default Changelog;