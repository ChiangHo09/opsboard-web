/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 文件职责:
 * 该文件负责渲染“更新日志”页面。它通过一个数据表格展示日志列表，
 * 并提供搜索功能。此组件实现了响应式布局，能适配桌面和移动设备，
 * 并支持点击日志行进行高亮显示和导航到详情。
 *
 * 本次改动内容:
 * - 【样式统一】将表格行的悬停 (hover) 背景色与应用内其他页面（如 Tickets.tsx）保持一致。
 * - **解决方案**:
 *   在 `cellSx` 样式对象中，将 `'tr:hover &'` 选择器对应的 `backgroundColor` 的值从 `'primary.light'` 修改为 `'action.hover'`。
 * - **最终效果**:
 *   此页面的悬停效果现在使用了标准的 `action.hover` 主题颜色，确保了整个应用中表格交互视觉反馈的一致性。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, ButtonBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type ChangelogSearchValues} from '@/components/forms/ChangelogSearchForm.tsx';
import {changelogsApi, type ChangelogRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type ChangelogDetailContentProps} from '@/components/modals/ChangelogDetailContent';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

export default function Changelog(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
    } = useLayoutDispatch();

    const navigate = useNavigate();
    const {logId} = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const {
        data: rows = [],
        isLoading,
        isError,
        error
    } = useResponsiveDetailView<ChangelogRow, ChangelogDetailContentProps>({
        paramName: 'logId',
        baseRoute: '/app/changelog',
        queryKey: ['changelogs'],
        queryFn: changelogsApi.fetchAll,
        DetailContentComponent: ChangelogDetailContent,
    });

    useEffect(() => {
        if (logId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === logId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [logId, rows, rowsPerPage, page]);


    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

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

    const cellSx = {
        'tr:hover &': {
            // 【核心修改】将悬停颜色修改为与其他页面一致的 action.hover
            backgroundColor: 'action.hover'
        },
        'tr.Mui-selected &': {
            backgroundColor: 'action.selected'
        },
        'tr.Mui-selected:hover &': {
            backgroundColor: 'action.selected'
        }
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

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 10
                }}><CircularProgress/></Box>}
                {isError && <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><Typography color="error">加载失败: {error?.message || '未知错误'}</Typography></Box>}
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p: number) => setPage(p)}
                    onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}: {
                        from: number,
                        to: number,
                        count: number
                    }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="更新日志表"
                           sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <>
                                        <TableCell sx={{fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>更新时间</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>更新类型</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell sx={{width: '18%', fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell sx={{width: '21%', fontWeight: 700}}>更新时间</TableCell>
                                        <TableCell sx={{width: '14%', fontWeight: 700}}>更新类型</TableCell>
                                        <TableCell sx={{width: '47%', fontWeight: 700}}>更新内容</TableCell>
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
                                        selected={isHighlighted}
                                        onClick={() => navigate(`/app/changelog/${r.id}`, {replace: true})}
                                        sx={{display: 'table-row', width: '100%', textAlign: 'left'}}
                                    >
                                        {isMobile ? (
                                            <>
                                                <TooltipCell sx={cellSx}>{r.customerName}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.updateTime.split(' ')[0]}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.updateType}</TooltipCell>
                                            </>
                                        ) : (
                                            <>
                                                <TooltipCell sx={cellSx}>{r.customerName}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.updateTime.split(' ')[0]}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.updateType}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.updateContent}</TooltipCell>
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
}