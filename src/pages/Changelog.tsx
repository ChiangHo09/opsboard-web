/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 代码功能:
 * 此文件定义了应用的“更新日志”页面，提供了一个可搜索、可分页、支持详情查看的高级表格来展示日志数据。
 *
 * 本次修改内容:
 * - 【跳转逻辑修复】配合 MainLayout 的新逻辑，修改了本页面的副作用清理函数。
 * - **解决方案**:
 *   1.  `useEffect` 的清理函数 (return) 现在不再负责清空面板内容（`setPanelContent(null)`）和标题（`setPanelTitle('')`）。
 *   2.  它的唯一职责是在组件卸载时，将 `isPanelRelevant` 标志设置为 `false`。
 * - **最终效果**:
 *   此页面不再“擅自”关闭面板。它只是向布局系统报告自己的状态，而关闭面板的最终决策由 `MainLayout` 根据新页面的特性来智能决定，从而实现了无缝的跨页跳转体验。
 */
import React, { useEffect, useCallback, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, useTheme, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayoutState, useLayoutDispatch } from '../contexts/LayoutContext.tsx';
import { type ChangelogSearchValues } from '../components/forms/ChangelogSearchForm.tsx';
import TooltipCell from '../components/ui/TooltipCell';
import PageLayout from '../layouts/PageLayout';
import DataTable from '../components/ui/DataTable';

const ChangelogSearchForm = lazy(() => import('../components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('../components/modals/ChangelogDetailContent.tsx'));


interface Row { id: string; customerName: string; updateTime: string; updateType: string; updateContent:string; }
const create = (id: string, c: string, t: string, typ: string, ct: string): Row => ({ id, customerName: c, updateTime: t, updateType: typ, updateContent: ct });
const LONG_TEXT = '这是一个用于测试 hover 效果的特别长的文本，需要足够多的内容才能在宽屏的50%列宽中产生溢出效果。我们再加一点，再加一点，现在应该足够长了。';
const rows: Row[] = [ create('log001', '客户a', '2025-07-21 10:30', '功能更新', LONG_TEXT), create('log002', '客户b', '2025-07-20 15:00', '安全修复', LONG_TEXT), ...Array.from({ length: 50 }).map((_, i) => create(`log${i + 4}`, `测试客户${(i % 5) + 1}`, `2025-06-${20 - (i % 20)} 14:00`, i % 2 === 0 ? 'Bug 修复' : '常规维护', `（第 ${i + 4} 条）${LONG_TEXT}`)), ];

const Changelog: React.FC = () => {
    const { isMobile } = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, setIsModalOpen, setModalConfig } = useLayoutDispatch();

    const theme    = useTheme();
    const navigate = useNavigate();
    const { logId } = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    useEffect(() => {
        const itemIndex = logId ? rows.findIndex(row => row.id === logId) : -1;
        const logExists = itemIndex !== -1;

        if (logExists && !isMobile) {
            setIsModalOpen(true);
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}>
                        <ChangelogDetailContent logId={logId as string} />
                    </Suspense>
                ),
                onClose: () => navigate('/app/changelog', { replace: true })
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({ content: null, onClose: null });
        }

        if (logExists) {
            const targetPage = Math.floor(itemIndex / rowsPerPage);
            if (page !== targetPage) {
                setPage(targetPage);
            }
        }
    }, [logId, isMobile, rowsPerPage, page, navigate, setIsModalOpen, setModalConfig]);

    const onSearch = useCallback((v: ChangelogSearchValues) => { alert(`搜索: ${JSON.stringify({ ...v, startTime: v.startTime?.format('YYYY-MM-DD'), endTime:   v.endTime?.format('YYYY-MM-DD'), })}`); togglePanel(); }, [togglePanel]);
    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        if (!isPanelContentSet) {
            return;
        }

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}>
                    <ChangelogSearchForm onSearch={onSearch} onReset={onReset} />
                </Suspense>
            );
            setPanelTitle('日志搜索');
            setPanelWidth(360);
            setIsPanelRelevant(true);
        }, 0);

        // 【核心修复】修改清理函数
        return () => {
            clearTimeout(timerId);
            // 在组件卸载时，不再清空面板内容，只标记为“不相关”
            setIsPanelRelevant(false);
        };
    }, [isPanelContentSet, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>更新日志</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={handleTogglePanel} sx={{ height: 42, borderRadius: '50px', textTransform: 'none', px: 3, bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': { bgcolor: 'app.button.hover' } }}>
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
                                        onClick={() => {
                                            navigate(`/app/changelog/${r.id}`, { replace: true });
                                        }}
                                        sx={{
                                            display: 'table-row',
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