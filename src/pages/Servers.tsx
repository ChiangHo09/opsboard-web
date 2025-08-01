/**
 * @file src/pages/Servers.tsx
 * @description 该文件负责渲染“服务器信息”页面，并提供搜索功能。
 * @modification
 *   - [UI/UX]：统一了移动端和桌面端的视图，现在移动端也显示完整的三按钮操作组（编辑、导出、搜索），以保持体验一致性。
 *   - [架构重构]：引入了新的、统一的 `<ActionButtons>` 组件来替换原有的独立按钮，实现了分段式按钮组的视觉效果。
 *   - [权限模拟]：通过向 `<ActionButtons>` 传递 `showEditButton` prop，演示了如何根据权限动态显示或隐藏按钮，而布局始终保持正确。
 *   - [代码简化]：页面顶部的操作按钮逻辑被完全封装，使得本文件代码更简洁、更易于维护。
 *   - [UI/UX]：彻底修复了响应式布局问题。现在无论屏幕尺寸或容器宽度如何，当空间不足时，操作按钮都会自动从标题右侧换行到标题下方。
 *   - [核心修复]：引入并使用了新的 `<ClickableTableRow>` 组件来渲染表格的每一行。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
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
import ActionButtons from '@/components/ui/ActionButtons'; // 导入新的按钮组组件

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

    // 模拟管理员权限
    const [isAdmin] = useState(true); // 您可以改为 false 来测试编辑按钮的隐藏效果

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
        <PageLayout sx={{
            p: {xs: 1, md: 3},
        }}>
            {/* 标题及操作按钮区域 */}
            <Box sx={{
                display: 'flex',
                flexShrink: 0,
                mb: 2,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>服务器信息</Typography>

                {/* 使用新的 ActionButtons 组件，它现在对所有视图都可见 */}
                <ActionButtons
                    showEditButton={isAdmin} // 根据权限显示编辑按钮
                    onSearchClick={handleTogglePanel}
                    onEditClick={() => alert('编辑按钮被点击')}
                    onExportClick={() => alert('导出按钮被点击')}
                />
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