/**
 * 文件名: src/pages/Changelog.tsx
 *
 * 代码功能:
 * 此文件定义了应用的“更新日志”页面，提供了一个可搜索、可分页、支持详情查看的高级表格来展示日志数据。
 *
 * 本次修改内容:
 * - 【数据获取重构】使用 TanStack Query 替代了本地硬编码的数据。
 * - 1. **移除静态数据**: 删除了组件内部硬编码的 `rows` 数组。
 * - 2. **引入 API 调用**: 导入了 `fetchChangelogs` 函数，该函数负责从模拟 API 获取日志数据。
 * - 3. **集成 `useQuery`**: 使用 `@tanstack/react-query` 的 `useQuery` Hook 来声明式地获取数据。
 * - 4. **处理加载与错误状态**: 在数据加载时显示一个全表格范围的 `CircularProgress` 指示器，并在获取失败时显示错误信息。
 * - 5. **更新依赖逻辑**: 将所有依赖 `rows` 数组的逻辑（如弹窗存在性检查、分页）都更新为使用从 `useQuery` 返回的 `data`。
 */
import React, {useEffect, useCallback, useState, lazy, Suspense} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useQuery} from '@tanstack/react-query';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type ChangelogSearchValues} from '@/components/forms/ChangelogSearchForm.tsx';
import {fetchChangelogs, type ChangelogRow} from '@/api';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

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

    const {data: rows = [], isLoading, isError, error} = useQuery<ChangelogRow[], Error>({
        queryKey: ['changelogs'],
        queryFn: fetchChangelogs,
    });

    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    // Effect 1: 负责控制桌面端弹窗的显示与隐藏
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
    }, [logId, isMobile, rowsPerPage, page, navigate, setIsModalOpen, setModalConfig, rows]);

    // Effect 2: 负责处理从桌面端到移动端的视图重定向
    useEffect(() => {
        if (logId && isMobile) {
            navigate(`/app/changelog/mobile/${logId}`, {replace: true});
        }
    }, [logId, isMobile, navigate]);

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
                        <Typography color="error">加载失败: {error.message}</Typography>
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