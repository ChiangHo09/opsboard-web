/**
 * 文件名: src/pages/Servers.tsx
 *
 * 本次修改内容:
 * - 【桌面端响应式终极修复 v3】通过 CSS Grid 的 `minmax()` 函数，实现了真正灵活的、
 *   按比例自适应的列宽布局，解决了主列在某些情况下宽度过大的视觉不平衡问题。
 * - **问题根源**:
 *   之前仅使用 `1fr` 单位让主列填充剩余空间，当其他列被隐藏时，主列会过度扩张。
 * - **解决方案**:
 *   1.  **为所有列定义弹性宽度**: 使用 `minmax(min-width, fr-unit)` 为每一列都指定了
 *       一个最小宽度（保证可读性）和一个弹性系数（`fr` 单位，用于按比例分配空间）。
 *   2.  **动态列定义**: 创建了一个列定义数组，并根据 `hide...` 标志动态过滤，
 *       生成最终的 `grid-template-columns` 字符串。
 *   3.  **简化单元格样式**: 由于 Grid 容器现在完全控制了布局，单元格组件不再需要
 *       单独的 `width` 样式，使 JSX 更简洁。
 * - **最终效果**:
 *   无论窗口尺寸如何变化、无论哪些列被隐藏，所有可见列都会始终保持和谐的视觉比例，
 *   同时严丝合缝地铺满整个表格容器。这提供了在所有分辨率下都最佳的视觉体验。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress, useTheme, useMediaQuery
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

const Servers = (): JSX.Element => {
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

    const theme = useTheme();
    const hideUsageNotes = useMediaQuery(theme.breakpoints.down(1400));
    const hideDeploymentNotes = useMediaQuery(theme.breakpoints.down(1200));


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
                <Suspense fallback={<Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><CircularProgress/></Box>}>
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

    // 【核心修改】定义所有列的弹性宽度
    const gridTemplateColumns = [
        'minmax(200px, 2.5fr)', // 服务器名称
        'minmax(150px, 1.5fr)', // IP 地址
        'minmax(100px, 1fr)',   // 角色
        !hideDeploymentNotes && 'minmax(200px, 2fr)', // 部署类型
        !hideUsageNotes && 'minmax(250px, 3fr)',   // 使用备注
    ].filter(Boolean).join(' ');


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
                {isLoading && <Box sx={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10}}><CircularProgress/></Box>}
                {isError && <Box sx={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Typography color="error">加载失败: {error.message}</Typography></Box>}
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
                    <Table stickyHeader aria-label="服务器信息表" sx={{borderCollapse: 'separate', minWidth: isMobile ? 0 : 800}}>
                        <TableHead>
                            <TableRow sx={{display: isMobile ? 'table-row' : 'grid', gridTemplateColumns}}>
                                {isMobile ? (
                                    <>
                                        <TableCell sx={{fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>服务器名称</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>角色</TableCell>
                                    </>
                                ) : (
                                    <>
                                        {/* 【核心修改】移除单元格的 width 样式，由 Grid 容器控制 */}
                                        <TableCell sx={{position: 'sticky', left: 0, zIndex: 120, bgcolor: 'background.paper', fontWeight: 700, display: 'flex', alignItems: 'center'}}>服务器名称</TableCell>
                                        <TableCell sx={{fontWeight: 700, display: 'flex', alignItems: 'center'}}>IP 地址</TableCell>
                                        <TableCell sx={{fontWeight: 700, display: 'flex', alignItems: 'center'}}>角色</TableCell>
                                        {!hideDeploymentNotes && <TableCell sx={{fontWeight: 700, display: 'flex', alignItems: 'center'}}>部署类型 / 备注</TableCell>}
                                        {!hideUsageNotes && <TableCell sx={{fontWeight: 700, display: 'flex', alignItems: 'center'}}>使用备注</TableCell>}
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{display: isMobile ? 'table-row-group' : 'contents'}}>
                            {pageRows.map(r => (
                                <ButtonBase
                                    key={r.id}
                                    component="div"
                                    onClick={() => navigate(`/app/servers/${r.id}`, {replace: true})}
                                    sx={{
                                        display: isMobile ? 'table-row' : 'grid',
                                        gridTemplateColumns,
                                        width: '100%',
                                        position: 'relative',
                                        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                                        textAlign: 'left',
                                        '&:hover': {
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    {isMobile ? (
                                        <>
                                            <TooltipCell>{r.customerName}</TooltipCell>
                                            <TooltipCell>{r.serverName}</TooltipCell>
                                            <TooltipCell>{r.role}</TooltipCell>
                                        </>
                                    ) : (
                                        <>
                                            <TooltipCell sx={{position: 'sticky', left: 0, zIndex: 100, bgcolor: 'background.paper', 'div:hover &': {bgcolor: 'action.hover'}, display: 'flex', alignItems: 'center'}}>{r.serverName}</TooltipCell>
                                            <TooltipCell sx={{display: 'flex', alignItems: 'center'}}>{r.ip}</TooltipCell>
                                            <TooltipCell sx={{display: 'flex', alignItems: 'center'}}>{r.role}</TooltipCell>
                                            {!hideDeploymentNotes && <TooltipCell sx={{display: 'flex', alignItems: 'center'}}>{r.dep ? `[${r.dep}] ` : ''}{r.custNote || '-'}</TooltipCell>}
                                            {!hideUsageNotes && <TooltipCell sx={{display: 'flex', alignItems: 'center'}}>{r.note || '-'}</TooltipCell>}
                                        </>
                                    )}
                                </ButtonBase>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Servers;