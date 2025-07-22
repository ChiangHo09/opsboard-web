/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 本次修改内容:
 * - 【功能对齐】完全重构了此页面，使其拥有与 `Servers.tsx` 类似的高级表格功能。
 * - **数据表格**: 添加了一个显示更新日志的表格，包含“客户名称”、“更新时间”、“更新类型”、“更新内容”列。
 * - **分页与冻结**: 实现了表格的分页、桌面端行列冻结、内容截断和响应式布局。
 * - **详情弹窗**: 集成了全局弹窗功能，现在点击表格行会通过路由 `/app/changelog/:logId` 打开一个详情弹窗。
 * - **组件复用**: 导入并使用了新的 `ChangelogDetailContent` 作为弹窗的内容。
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

// 1. 数据模型与模拟数据
interface ChangelogData {
    id: string;
    customerName: string;
    updateTime: string;
    updateType: string;
    updateContent: string;
}

const createLogData = (id: string, customerName: string, updateTime: string, updateType: string, updateContent: string): ChangelogData => ({
    id, customerName, updateTime, updateType, updateContent,
});

const mockLogData: ChangelogData[] = [
    createLogData('log001', '客户a', '2025-07-21 10:30', '功能更新', '新增了用户导出功能，允许管理员将用户信息导出为 CSV 文件。'),
    createLogData('log002', '客户b', '2025-07-20 15:00', '安全修复', '修复了一个潜在的跨站脚本（XSS）漏洞。'),
    createLogData('log003', '客户a', '2025-07-19 09:00', '性能优化', '优化了数据查询逻辑，首页加载速度提升 30%。'),
    ...Array.from({ length: 50 }).map((_, i) =>
        createLogData(
            `log${i + 4}`,
            `测试客户${(i % 5) + 1}`,
            `2025-06-${20 - (i % 20)} 14:00`,
            i % 2 === 0 ? 'Bug修复' : '常规维护',
            `这是第 ${i + 4} 条模拟更新日志，用于填充表格并测试分页和滚动功能。这条日志的内容可能会非常长，以验证单元格的文本截断和省略号显示是否正常工作。`
        )
    ),
];

// 2. 组件定义
const Changelog: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, isMobile, setIsModalOpen, setModalConfig } = useLayout();
    const theme = useTheme();
    const navigate = useNavigate();
    const { logId } = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 弹窗状态同步
    useEffect(() => {
        if (logId) {
            setIsModalOpen(true);
            setModalConfig({
                content: <ChangelogDetailContent logId={logId} />,
                onClose: () => navigate('/app/changelog'),
            });
        } else {
            setIsModalOpen(false);
        }
    }, [logId, setIsModalOpen, setModalConfig, navigate]);

    // 搜索面板副作用
    const handleSearch = useCallback((values: ChangelogSearchValues) => {
        const searchInfo = { ...values, startTime: values.startTime?.format('YYYY-MM-DD'), endTime: values.endTime?.format('YYYY-MM-DD') };
        alert(`搜索: ${JSON.stringify(searchInfo)}`);
        togglePanel();
    }, [togglePanel]);
    const handleReset = useCallback(() => { alert('重置表单'); }, []);
    useEffect(() => {
        setPanelContent(<ChangelogSearchForm onSearch={handleSearch} onReset={handleReset} />);
        setPanelTitle('日志搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);
        return () => { setPanelContent(null); setPanelTitle(''); setPanelWidth(360); setIsPanelRelevant(false); };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    // 分页逻辑
    const handleChangePage = useCallback((_event: unknown, newPage: number) => { setPage(newPage); }, []);
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }, []);
    const paginatedLogData = mockLogData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const noWrapCellSx = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as const;

    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            {/* 固定的标题区 */}
            <Box sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', py: 4, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>更新日志</Typography>
                    <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={togglePanel} sx={{ height: '42px', borderRadius: '50px', bgcolor: 'app.button.background', color: 'neutral.main', boxShadow: 'none', textTransform: 'none', fontSize: '15px', fontWeight: 500, px: 3, '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' } }}>
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>搜索</Typography>
                    </Button>
                </Box>
            </Box>

            {/* 表格与分页器 */}
            <TableContainer sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', flexGrow: 1, overflow: 'auto', bgcolor: 'background.paper' }}>
                <Table stickyHeader aria-label="更新日志表" sx={{ borderCollapse: 'separate', tableLayout: isMobile ? 'auto' : 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            {isMobile ? (
                                <>
                                    <TableCell sx={{ fontWeight: 700 }}>客户名称</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>更新时间</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>更新内容</TableCell>
                                </>
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
                                    <>
                                        <TableCell sx={noWrapCellSx}>{row.customerName}</TableCell>
                                        <TableCell sx={noWrapCellSx}>{row.updateTime}</TableCell>
                                        <TableCell sx={noWrapCellSx}>{row.updateContent}</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell sx={{ ...noWrapCellSx, position: 'sticky', left: 0, zIndex: 100 }}>{row.customerName}</TableCell>
                                        <TableCell sx={noWrapCellSx}>{row.updateTime}</TableCell>
                                        <TableCell sx={noWrapCellSx}>{row.updateType}</TableCell>
                                        <TableCell sx={noWrapCellSx}>{row.updateContent}</TableCell>
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