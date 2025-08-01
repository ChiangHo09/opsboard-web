/**
 * @file src/pages/Servers.tsx
 * @description 该文件负责渲染“服务器信息”页面，并提供搜索功能。
 * @modification
 *   - [UI/UX]：通过精确覆盖 `PageLayout` 的 `px` 属性，将移动设备视图下的左右边距调整为 `theme.spacing(1)`，同时让 `PageLayout` 的其他默认边距（如更大的顶部边距）正确生效。
 *   - [解决方案]：将 `PageLayout` 的 `sx` 属性从通用的 `p` 修改为更具体的 `px`，避免了意外覆盖垂直内边距的问题。
 *   - [UI/UX]：彻底修复了响应式布局问题。现在无论屏幕尺寸或容器宽度如何，当空间不足时，操作按钮都会自动从标题右侧换行到标题下方。
 *   - [UI/UX]：将“编辑”按钮的图标从 `DriveFileRenameOutlineRoundedIcon` 更改为 `DriveFileRenameOutlineIcon`。
 *   - [UI/UX]：在标题栏右侧的操作区中，于“导出”按钮前新增了一个“编辑”按钮。
 *   - [UI/UX]：为“导出”按钮配置了 `ShareOutlinedIcon` 图标。
 *   - [UI/UX]：为“搜索”按钮配置了 `SearchRoundedIcon` 图标。
 *   - [核心修复]：引入并使用了新的 `<ClickableTableRow>` 组件来渲染表格的每一行。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
// 导入指定的图标
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
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
import ClickableTableRow from '@/components/ui/ClickableTableRow';

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

    // 定义胶囊按钮的通用样式
    const capsuleButtonStyle = {
        height: 42,
        borderRadius: '50px',
        textTransform: 'none',
        px: 3,
        bgcolor: 'app.button.background',
        color: 'neutral.main',
        '&:hover': {bgcolor: 'app.button.hover'}
    };

    return (
        <PageLayout sx={{
            // 只覆盖水平内边距，让 PageLayout 的 pt 和 pb 默认值生效
            px: {xs: 1, md: 3},
        }}>
            {/* 标题及操作按钮区域 */}
            <Box sx={{
                display: 'flex',
                flexShrink: 0,
                mb: 2,
                // 采用 flex-wrap 策略，实现真正的响应式布局
                flexWrap: 'wrap', // 允许子元素在空间不足时换行
                justifyContent: 'space-between', // 在空间充足时，将子元素推向两端
                alignItems: 'center', // 垂直居中对齐
                gap: 2 // 定义元素之间的间距
            }}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>服务器信息</Typography>

                {/* 操作按钮容器 */}
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button variant="contained" size="large" startIcon={<DriveFileRenameOutlineIcon/>}
                            sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>编辑</Typography>
                    </Button>
                    <Button variant="contained" size="large" startIcon={<ShareOutlinedIcon/>} sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>导出</Typography>
                    </Button>
                    <Button variant="contained" size="large" startIcon={<SearchRoundedIcon/>}
                            onClick={handleTogglePanel} sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                    </Button>
                </Box>
            </Box>

            {/* 表格区域 */}
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
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>服务器名称</TableCell>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>角色</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell sx={{
                                            width: '12%',
                                            minWidth: '150px',
                                            fontWeight: 700
                                        }}>服务器名称</TableCell>
                                        <TableCell sx={{width: '10%', minWidth: '130px', fontWeight: 700}}>IP
                                            地址</TableCell>
                                        <TableCell
                                            sx={{width: '8%', minWidth: '100px', fontWeight: 700}}>角色</TableCell>
                                        <TableCell sx={{width: '20%', minWidth: '200px', fontWeight: 700}}>部署类型 /
                                            备注</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>使用备注</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => (
                                <ClickableTableRow
                                    key={r.id}
                                    selected={r.id === serverId}
                                    onClick={() => navigate(`/app/servers/${r.id}`, {replace: true})}
                                >
                                    {isMobile ? [
                                        <TooltipCell key="customerName">{r.customerName}</TooltipCell>,
                                        <TooltipCell key="serverName">{r.serverName}</TooltipCell>,
                                        <TooltipCell key="role">{r.role}</TooltipCell>
                                    ] : [
                                        <TooltipCell key="serverName">{r.serverName}</TooltipCell>,
                                        <TooltipCell key="ip">{r.ip}</TooltipCell>,
                                        <TooltipCell key="role">{r.role}</TooltipCell>,
                                        <TooltipCell
                                            key="depCustNote">{r.dep ? `[${r.dep}] ` : ''}{r.custNote || '-'}</TooltipCell>,
                                        <TooltipCell key="note">{r.note || '-'}</TooltipCell>
                                    ]}
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
}