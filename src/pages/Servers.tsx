/**
 * @file src/pages/Servers.tsx
 * @description 该文件负责渲染“服务器信息”页面，并提供搜索功能。
 * @modification 在保留涟漪效果的前提下，彻底修复了表格行在交互时导致的布局塌陷问题。
 *   - [核心修复]：引入并使用了新的 `<ClickableTableRow>` 组件来渲染表格的每一行。
 *   - [解决方案]：`<ClickableTableRow>` 内部通过“第一单元格锚点”策略，完美地将布局与交互分离，既保证了 HTML 结构的有效性，又使得涟漪效果的 DOM 操作不会干扰 `table-layout: fixed` 的计算。
 *   - [效果]：页面代码简洁，交互效果完整，布局问题被根除。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
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