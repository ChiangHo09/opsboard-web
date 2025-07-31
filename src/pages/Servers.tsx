/**
 * 文件名: src/pages/Servers.tsx
 *
 * 文件职责:
 * 该文件负责渲染“服务器信息”页面。它包含一个用于展示服务器列表的数据表格，
 * 并通过一个可抽出的侧边面板提供搜索功能。此组件处理数据获取、分页、
 * 响应式布局调整（针对移动和桌面视图），以及到服务器详情页的导航。
 *
 * 本次改动内容:
 * - 【布局简化】移除了之前根据浏览器宽度自动收起部分列的响应式特性。
 * - **解决方案**:
 *   1.  删除了用于检测断点的 `useMediaQuery` hooks (`hideUsageNotes`, `hideDeploymentNotes`)。
 *   2.  移除了 `TableHead` 和 `TableBody` 中用于条件渲染表格列的逻辑。
 * - **最终效果**:
 *   现在，所有列（包括“部署类型/备注”和“使用备注”）在桌面视图下将始终保持可见，布局更加稳定，不再根据窗口宽度动态隐藏。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
import {type ServerSearchValues} from '@/components/forms/ServerSearchForm';
import {serversApi, type ServerRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type ServerDetailContentProps} from '@/components/modals/ServerDetailContent';
import {handleAsyncError} from '@/utils/errorHandler';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';

const ServerSearchForm = lazy(() => import('@/components/forms/ServerSearchForm'));
const ServerDetailContent = lazy(() => import('@/components/modals/ServerDetailContent'));

export default function Servers(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
    } = useLayoutDispatch();
    const showNotification = useNotification();
    const navigate = useNavigate();
    const {serverId} = useParams<{ serverId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<ServerRow, ServerDetailContentProps>({
        paramName: 'serverId',
        baseRoute: '/app/servers',
        queryKey: ['servers'],
        queryFn: serversApi.fetchAll,
        DetailContentComponent: ServerDetailContent,
    });

    useEffect(() => {
        if (serverId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === serverId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [serverId, rows, rowsPerPage, page]);

    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    const onSearch = useCallback((v: ServerSearchValues) => {
        try {
            alert(`搜索: ${JSON.stringify(v)}`);
            togglePanel();
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]);

    const onReset = useCallback(() => {
        alert('重置搜索表单');
        setPage(0);
        setRowsPerPage(10);
    }, []);

    useEffect(() => {
        if (!isPanelContentSet) return;

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <ServerSearchForm onSearch={onSearch} onReset={onReset}/>
                </Suspense>
            );
            setPanelTitle('服务器搜索');
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
            backgroundColor: 'action.hover'
        },
        'tr.Mui-selected &': {
            backgroundColor: 'action.selected'
        },
        'tr.Mui-selected:hover &': {
            backgroundColor: 'action.selected'
        }
    };

    const stickyCellSx = {
        ...cellSx,
        position: 'sticky',
        left: 0,
        zIndex: 100,
        bgcolor: 'background.paper',
    };

    return (
        <PageLayout sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0}}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>服务器信息</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon/>} onClick={handleTogglePanel} sx={{
                    height: 42, borderRadius: '50px', textTransform: 'none', px: 3,
                    bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': {bgcolor: 'app.button.hover'}
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
                }}><Typography color="error">加载失败: {error.message}</Typography></Box>}
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
                    <Table stickyHeader aria-label="服务器信息表"
                           sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <>
                                        <TableCell sx={{fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>服务器名称</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>角色</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell sx={{
                                            width: '18%',
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 120,
                                            bgcolor: 'background.paper',
                                            fontWeight: 700,
                                        }}>服务器名称</TableCell>
                                        <TableCell sx={{width: '15%', fontWeight: 700}}>IP 地址</TableCell>
                                        <TableCell sx={{width: '12%', fontWeight: 700}}>角色</TableCell>
                                        <TableCell sx={{width: '24%', fontWeight: 700}}>部署类型 / 备注</TableCell>
                                        <TableCell sx={{width: '31%', fontWeight: 700}}>使用备注</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => {
                                const isHighlighted = r.id === serverId;
                                return (
                                    <ButtonBase
                                        key={r.id}
                                        component={TableRow}
                                        selected={isHighlighted}
                                        onClick={() => navigate(`/app/servers/${r.id}`, {replace: true})}
                                        sx={{display: 'table-row', width: '100%', textAlign: 'left'}}
                                    >
                                        {isMobile ? (
                                            <>
                                                <TooltipCell sx={cellSx}>{r.customerName}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.serverName}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.role}</TooltipCell>
                                            </>
                                        ) : (
                                            <>
                                                <TooltipCell sx={stickyCellSx}>{r.serverName}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.ip}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.role}</TooltipCell>
                                                <TooltipCell
                                                    sx={cellSx}>{r.dep ? `[${r.dep}] ` : ''}{r.custNote || '-'}</TooltipCell>
                                                <TooltipCell sx={cellSx}>{r.note || '-'}</TooltipCell>
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