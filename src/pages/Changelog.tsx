/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 代码功能:
 * 此文件定义了应用的“更新日志”页面，提供了一个可搜索、可分页、支持详情查看的高级表格来展示日志数据。
 *
 * 本次修改内容:
 * - 【代码健壮性与可维护性优化】应用了与 Servers.tsx 页面一致的、基于路由驱动的状态管理模式。
 * - **优化详情**:
 *   1.  简化了 `onClick` 事件处理器，使其唯一职责是更新 URL（`navigate`），并使用 `{ replace: true }` 优化浏览器历史记录。
 *   2.  将弹窗管理和分页跳转的逻辑完全整合到 `useEffect` 中，使其成为响应 URL (`logId`) 变化的唯一“事实来源”。
 *   3.  在 `useEffect` 中增加了对 `logId` 是否有效存在的检查，并确保在弹窗关闭时彻底清理其状态（`content` 和 `onClose`），防止状态残留。
 * - **最终效果**: 这种模式消除了命令式代码和声明式代码之间的潜在冲突，使得组件状态完全由路由驱动，逻辑更清晰，可维护性更高。
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, useTheme, ButtonBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayoutState, useLayoutDispatch } from '../contexts/LayoutContext.tsx';
import ChangelogSearchForm, { type ChangelogSearchValues } from '../components/forms/ChangelogSearchForm.tsx';
import ChangelogDetailContent from '../components/modals/ChangelogDetailContent.tsx';
import TooltipCell from '../components/ui/TooltipCell';
import PageLayout from '../layouts/PageLayout';
import DataTable from '../components/ui/DataTable';

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

    // 【核心修复】将所有与 URL 参数相关的逻辑集中在一个 useEffect 中
    useEffect(() => {
        const itemIndex = logId ? rows.findIndex(row => row.id === logId) : -1;
        const logExists = itemIndex !== -1;

        // 1. 处理弹窗逻辑
        if (logExists && !isMobile) {
            setIsModalOpen(true);
            setModalConfig({
                content: <ChangelogDetailContent logId={logId as string} />,
                onClose: () => navigate('/app/changelog', { replace: true })
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({ content: null, onClose: null });
        }

        // 2. 处理分页和高亮逻辑
        if (logExists) {
            const targetPage = Math.floor(itemIndex / rowsPerPage);
            if (page !== targetPage) {
                setPage(targetPage);
            }
        }
    }, [logId, isMobile, rowsPerPage, page, navigate, setIsModalOpen, setModalConfig]);

    const onSearch = useCallback((v: ChangelogSearchValues) => { alert(`搜索: ${JSON.stringify({ ...v, startTime: v.startTime?.format('YYYY-MM-DD'), endTime:   v.endTime?.format('YYYY-MM-DD'), })}`); togglePanel(); }, [togglePanel]);
    const onReset = useCallback(() => alert('重置表单'), []);

    // 处理侧边搜索面板的 useEffect (保持不变)
    useEffect(() => {
        const timerId = setTimeout(() => {
            setPanelContent(<ChangelogSearchForm onSearch={onSearch} onReset={onReset} />);
            setPanelTitle('日志搜索');
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
                                        // 【核心修复】简化 onClick，只负责导航
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