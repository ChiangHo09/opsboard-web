/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 代码功能:
 * 此文件定义了应用的“更新日志”页面，提供了一个可搜索、可分页、支持详情查看的高级表格来展示日志数据。
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
import ChangelogSearchForm, { type ChangelogSearchValues } from '../components/forms/ChangelogSearchForm.tsx';
import ChangelogDetailContent from '../components/modals/ChangelogDetailContent.tsx';
import TooltipCell from '../components/ui/TooltipCell';
import PageLayout from '../layouts/PageLayout';
import DataTable from '../components/ui/DataTable';

interface Row { id: string; customerName: string; updateTime: string; updateType: string; updateContent: string; }
const create = (id: string, c: string, t: string, typ: string, ct: string): Row => ({ id, customerName: c, updateTime: t, updateType: typ, updateContent: ct });
const LONG_TEXT = '这是一个用于测试 hover 效果的特别长的文本，需要足够多的内容才能在宽屏的50%列宽中产生溢出效果。我们再加一点，再加一点，现在应该足够长了。';
const rows: Row[] = [ create('log001', '客户a', '2025-07-21 10:30', '功能更新', LONG_TEXT), create('log002', '客户b', '2025-07-20 15:00', '安全修复', LONG_TEXT), ...Array.from({ length: 50 }).map((_, i) => create(`log${i + 4}`, `测试客户${(i % 5) + 1}`, `2025-06-${20 - (i % 20)} 14:00`, i % 2 === 0 ? 'Bug 修复' : '常规维护', `（第 ${i + 4} 条）${LONG_TEXT}`)), ];

const Changelog: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, isMobile, setIsModalOpen, setModalConfig } = useLayout();
    const theme    = useTheme();
    const navigate = useNavigate();
    const { logId } = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (logId) {
            const itemIndex = rows.findIndex(row => row.id === logId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                setPage(targetPage);
            }
        }
    }, [logId, rowsPerPage]);

    useEffect(() => {
        if (logId) { setIsModalOpen(true); setModalConfig({ content: <ChangelogDetailContent logId={logId} />, onClose: () => navigate('/app/changelog') }); }
        else { setIsModalOpen(false); }
    }, [logId, navigate, setIsModalOpen, setModalConfig]);

    const onSearch = useCallback((v: ChangelogSearchValues) => { alert(`搜索: ${JSON.stringify({ ...v, startTime: v.startTime?.format('YYYY-MM-DD'), endTime:   v.endTime?.format('YYYY-MM-DD'), })}`); togglePanel(); }, [togglePanel]);
    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        setPanelContent(<ChangelogSearchForm onSearch={onSearch} onReset={onReset} />);
        setPanelTitle('日志搜索'); setPanelWidth(360); setIsPanelRelevant(true);
        return () => { setPanelContent(null); setPanelTitle(''); setIsPanelRelevant(false); };
    }, [onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>更新日志</Typography>
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
                            {pageRows.map(r => {
                                const isHighlighted = r.id === logId;
                                return (
                                    <ButtonBase
                                        key={r.id}
                                        component={TableRow}
                                        onClick={() => navigate(`/app/changelog/${r.id}`)}
                                        sx={{
                                            display: 'table-row', // 【核心修复】强制 display 样式为 table-row
                                            width: '100%',
                                            position: 'relative',
                                            bgcolor: isHighlighted ? theme.palette.action.selected : 'transparent',
                                            '&:hover': {
                                                backgroundColor: isHighlighted ? theme.palette.action.selected : theme.palette.action.hover,
                                            },
                                        }}
                                    >
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
                                    </ButtonBase>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Changelog;