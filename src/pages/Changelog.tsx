/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 本次修改内容:
 * - 【视觉对齐】调整了页面布局的垂直间距，使其与 `Settings.tsx` 等其他简单页面保持一致。
 * - 移除了根 `Box` 上的 `gap: 2` 属性。
 * - 将标题区的 `pt: 1` 修改为 `py: 4`，增加了上下内边距。
 * - 为分页区的 `Box` 添加了 `pb: 4`，增加了底部内边距。
 * - 这一修改确保了 Grid 布局的稳定性，同时实现了视觉上的统一。
 *
 * 文件功能描述:
 * 此文件定义了应用的“更新日志”页面，提供了一个可搜索、可分页、支持详情查看的高级表格来展示日志数据。
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ChangelogSearchForm, { type ChangelogSearchValues } from '../components/forms/ChangelogSearchForm.tsx';
import ChangelogDetailContent from '../components/modals/ChangelogDetailContent.tsx';
import TooltipCell from '../components/ui/TooltipCell';

/* 模拟数据 */
interface Row { id: string; customerName: string; updateTime: string; updateType: string; updateContent: string; }
const create = (id: string, c: string, t: string, typ: string, ct: string): Row => ({ id, customerName: c, updateTime: t, updateType: typ, updateContent: ct });
const LONG_TEXT = '这是一个用于测试 hover 效果的特别长的文本：' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' + 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' + 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const rows: Row[] = [ create('log001', '客户a', '2025-07-21 10:30', '功能更新', LONG_TEXT), create('log002', '客户b', '2025-07-20 15:00', '安全修复', LONG_TEXT), ...Array.from({ length: 50 }).map((_, i) => create(`log${i + 4}`, `测试客户${(i % 5) + 1}`, `2025-06-${20 - (i % 20)} 14:00`, i % 2 === 0 ? 'Bug 修复' : '常规维护', `（第 ${i + 4} 条）${LONG_TEXT}`)), ];

/* 组件 */
const Changelog: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, isMobile, setIsModalOpen, setModalConfig } = useLayout();
    const theme    = useTheme();
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
    }, [logId, navigate, setIsModalOpen, setModalConfig]);

    const onSearch = useCallback((v: ChangelogSearchValues) => {
        alert(`搜索: ${JSON.stringify({ ...v, startTime: v.startTime?.format('YYYY-MM-DD'), endTime:   v.endTime?.format('YYYY-MM-DD'), })}`);
        togglePanel();
    }, [togglePanel]);
    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        setPanelContent(<ChangelogSearchForm onSearch={onSearch} onReset={onReset} />);
        setPanelTitle('日志搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);
        return () => { setPanelContent(null); setPanelTitle(''); setIsPanelRelevant(false); };
    }, [onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant]);

    const handleChangePage = (_: unknown, p: number) => setPage(p);
    const handleChangeRows = (e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(+e.target.value); setPage(0); };
    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%', minHeight: 0 }}>
            {/* ① 标题区 */}
            <Box sx={{ width: { xs: '90%', md: '80%' }, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 4 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>更新日志</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={togglePanel} sx={{ height: 42, borderRadius: '50px', textTransform: 'none', px: 3, bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': { bgcolor: 'app.button.hover' }, }}>
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>搜索</Typography>
                </Button>
            </Box>

            {/* ② 表格区 */}
            <TableContainer sx={{ width: { xs: '90%', md: '80%' }, mx: 'auto', overflow: 'auto', minHeight: 0, bgcolor: 'background.paper' }}>
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
                        {pageRows.map(r => (
                            <TableRow key={r.id} onClick={() => navigate(`/app/changelog/${r.id}`)} sx={{ cursor: 'pointer', '&:hover > .MuiTableCell-root': { background: theme.palette.action.hover } }}>
                                {isMobile ? (
                                    <><TooltipCell>{r.customerName}</TooltipCell><TooltipCell>{r.updateTime}</TooltipCell><TooltipCell>{r.updateContent}</TooltipCell></>
                                ) : (
                                    <>
                                        <TooltipCell sx={{ position: 'sticky', left: 0, zIndex: 100 }}>{r.customerName}</TooltipCell>
                                        <TooltipCell>{r.updateTime}</TooltipCell>
                                        <TooltipCell>{r.updateType}</TooltipCell>
                                        <TooltipCell>{r.updateContent}</TooltipCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ③ 分页区 */}
            <Box sx={{ width: { xs: '90%', md: '80%' }, mx: 'auto', pb: 4 }}>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRows}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                />
            </Box>
        </Box>
    );
};

export default Changelog;