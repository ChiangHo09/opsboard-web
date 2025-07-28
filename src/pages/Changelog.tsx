/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 代码功能:
 * 此文件定义了应用的“更新日志”页面，提供了一个可搜索、可分页、支持详情查看的高级表格来展示日志数据。
 *
 * 本次修改内容:
 * - 【表格交互终极修复】应用了与模板页面相同的终极修复方案，以同时实现布局稳定、水波纹动画和一致的悬停/高亮效果。
 * - **问题根源**:
 *   旧的实现方式直接在 `<ButtonBase>` 上使用 `:hover` 和 `bgcolor`，这与 `position: sticky` 列存在渲染冲突，会导致布局坍塌和颜色不一致。
 * - **解决方案**:
 *   1.  **移除 `useTheme`**: 清理了不再需要的 `useTheme` 钩子及其导入。
 *   2.  **分离交互与样式**: `<ButtonBase>` 不再负责任何背景色样式，只用于提供水波纹动画。
 *   3.  **在子级统一样式**: 在每个 `TableCell` 和 `TooltipCell` 的 `sx` 属性中，通过逻辑判断和 `'tr:hover &'` 选择器来统一处理“高亮”和“悬停”两种状态的背景色。
 *   4.  **确保固定列背景**: 固定的“客户名称”列的背景色现在也由统一的逻辑控制，确保了在所有状态下（默认、高亮、悬停）的视觉效果都完全一致。
 * - **最终效果**:
 *   更新日志页面的表格现在拥有了与工单页面和模板页面完全相同的、健壮可靠的交互体验，并能正确显示高亮行。
 */
import React, {useEffect, useCallback, useState, lazy, Suspense} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '../contexts/LayoutContext.tsx';
import {type ChangelogSearchValues} from '../components/forms/ChangelogSearchForm.tsx';
import TooltipCell from '../components/ui/TooltipCell';
import PageLayout from '../layouts/PageLayout';
import DataTable from '../components/ui/DataTable';

const ChangelogSearchForm = lazy(() => import('../components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('../components/modals/ChangelogDetailContent.tsx'));


interface Row {
    id: string;
    customerName: string;
    updateTime: string;
    updateType: string;
    updateContent: string;
}

const create = (id: string, c: string, t: string, typ: string, ct: string): Row => ({
    id,
    customerName: c,
    updateTime: t,
    updateType: typ,
    updateContent: ct
});
const LONG_TEXT = '这是一个用于测试 hover 效果的特别长的文本，需要足够多的内容才能在宽屏的50%列宽中产生溢出效果。我们再加一点，再加一点，现在应该足够长了。';
const rows: Row[] = [create('log001', '客户a', '2025-07-21 10:30', '功能更新', LONG_TEXT), create('log002', '客户b', '2025-07-20 15:00', '安全修复', LONG_TEXT), ...Array.from({length: 50}).map((_, i) => create(`log${i + 4}`, `测试客户${(i % 5) + 1}`, `2025-06-${20 - (i % 20)} 14:00`, i % 2 === 0 ? 'Bug 修复' : '常规维护', `（第 ${i + 4} 条）${LONG_TEXT}`)),];

const Changelog: React.FC = () => {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
        setIsModalOpen,
        setModalConfig
    } = useLayoutDispatch();

    const navigate = useNavigate();
    const {logId} = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    useEffect(() => {
        const itemIndex = logId ? rows.findIndex(row => row.id === logId) : -1;
        const logExists = itemIndex !== -1;

        if (logExists && !isMobile) {
            setIsModalOpen(true);
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><CircularProgress/></Box>}>
                        <ChangelogDetailContent logId={logId as string}/>
                    </Suspense>
                ),
                onClose: () => navigate('/app/changelog', {replace: true})
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }

        if (logExists) {
            const targetPage = Math.floor(itemIndex / rowsPerPage);
            if (page !== targetPage) {
                setPage(targetPage);
            }
        }
    }, [logId, isMobile, rowsPerPage, page, navigate, setIsModalOpen, setModalConfig]);

    const onSearch = useCallback((v: ChangelogSearchValues) => {
        alert(`搜索: ${JSON.stringify({
            ...v,
            startTime: v.startTime?.format('YYYY-MM-DD'),
            endTime: v.endTime?.format('YYYY-MM-DD'),
        })}`);
        togglePanel();
    }, [togglePanel]);
    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        if (!isPanelContentSet) {
            return;
        }

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <ChangelogSearchForm onSearch={onSearch} onReset={onReset}/>
                </Suspense>
            );
            setPanelTitle('日志搜索');
            setPanelWidth(360);
        }, 0);

        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    return (
        <PageLayout sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0}}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>更新日志</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon/>} onClick={handleTogglePanel} sx={{
                    height: 42,
                    borderRadius: '50px',
                    textTransform: 'none',
                    px: 3,
                    bgcolor: 'app.button.background',
                    color: 'neutral.main',
                    '&:hover': {bgcolor: 'app.button.hover'}
                }}>
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                </Button>
            </Box>

            <Box sx={{flexGrow: 1, overflow: 'hidden'}}>
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={e => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="更新日志表"
                           sx={{borderCollapse: 'separate', tableLayout: isMobile ? 'auto' : 'fixed', minWidth: 800}}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <><TableCell sx={{fontWeight: 700}}>客户名称</TableCell><TableCell
                                        sx={{fontWeight: 700}}>更新时间</TableCell><TableCell
                                        sx={{fontWeight: 700}}>更新内容</TableCell></>
                                ) : (
                                    <>
                                        <TableCell sx={{
                                            width: '15%',
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 120,
                                            bgcolor: 'background.paper',
                                            fontWeight: 700
                                        }}>客户名称</TableCell>
                                        <TableCell sx={{width: '20%', fontWeight: 700}}>更新时间</TableCell>
                                        <TableCell sx={{width: '15%', fontWeight: 700}}>更新类型</TableCell>
                                        <TableCell sx={{width: '50%', fontWeight: 700}}>更新内容</TableCell>
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
                                            navigate(`/app/changelog/${r.id}`, {replace: true});
                                        }}
                                        sx={{
                                            display: 'table-row',
                                            width: '100%',
                                            position: 'relative',
                                        }}
                                    >
                                        {isMobile ? (
                                            <>
                                                <TooltipCell>{r.customerName}</TooltipCell><TooltipCell>{r.updateTime}</TooltipCell><TooltipCell>{r.updateContent}</TooltipCell></>
                                        ) : (
                                            <>
                                                <TooltipCell sx={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                    bgcolor: isHighlighted ? 'action.selected' : 'background.paper',
                                                    'tr:hover &': {bgcolor: isHighlighted ? 'action.selected' : 'action.hover'}
                                                }}>{r.customerName}</TooltipCell>
                                                <TooltipCell sx={{
                                                    bgcolor: isHighlighted ? 'action.selected' : 'transparent',
                                                    'tr:hover &': {bgcolor: isHighlighted ? 'action.selected' : 'action.hover'}
                                                }}>{r.updateTime}</TooltipCell>
                                                <TooltipCell sx={{
                                                    bgcolor: isHighlighted ? 'action.selected' : 'transparent',
                                                    'tr:hover &': {bgcolor: isHighlighted ? 'action.selected' : 'action.hover'}
                                                }}>{r.updateType}</TooltipCell>
                                                <TooltipCell sx={{
                                                    bgcolor: isHighlighted ? 'action.selected' : 'transparent',
                                                    'tr:hover &': {bgcolor: isHighlighted ? 'action.selected' : 'action.hover'}
                                                }}>{r.updateContent}</TooltipCell>
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