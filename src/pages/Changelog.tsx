/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 本次修改内容:
 * - 【API 调用更新】更新了数据获取方式，以匹配重构后的模块化 API。
 * - **解决方案**:
 *   1.  将导入从 `fetchChangelogs` 修改为 `changelogsApi`。
 *   2.  在 `useResponsiveDetailView` Hook 的 `queryFn` 选项中，
 *       将调用从 `fetchChangelogs` 修改为 `changelogsApi.fetchAll`。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type ChangelogSearchValues} from '@/components/forms/ChangelogSearchForm.tsx';
// 【核心修改】更新 API 导入
import {changelogsApi, type ChangelogRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type ChangelogDetailContentProps} from '@/components/modals/ChangelogDetailContent';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

const Changelog = (): JSX.Element => {
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
        // 【核心修改】更新 API 调用
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
                {isLoading && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10
                    }}>
                        <CircularProgress/>
                    </Box>
                )}
                {isError && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography color="error">加载失败: {error?.message || '未知错误'}</Typography>
                    </Box>
                )}
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