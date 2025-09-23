/**
 * @file src/pages/Servers.tsx
 * @description 该文件负责渲染“服务器信息”页面，并提供搜索功能。
 * @modification
 *   - [最终UX修复]：修复了在所有平台上，点击行导致弹窗打开时，行本身会“闪烁”一下的视觉问题。
 *   - [原因]：行的高亮状态更新与弹窗的出现被捆绑在同一次React渲染周期中，两个视觉事件同时发生，被人眼感知为“闪烁”。
 *   - [解决方案]：
 *     1. 引入了一个新的本地state `clickedRowId`，用于提供即时的视觉反馈。
 *     2. 当行被点击时，**立即**更新`clickedRowId`来高亮该行，让用户瞬间看到操作响应。
 *     3. **然后**再调用`useDelayedNavigate`来启动延迟导航，从而触发弹窗逻辑。
 *     4. 通过在时间和渲染周期上分离“行高亮”和“弹窗出现”这两个视觉事件，彻底消除了“闪烁”感，实现了平滑的交互体验。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
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
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';
import PageHeader from '@/layouts/PageHeader';
import { useDelayedNavigate } from '@/hooks/useDelayedNavigate';

const ServerSearchForm = lazy(() => import('@/components/forms/ServerSearchForm'));
const ServerDetailContent = lazy(() => import('@/components/modals/ServerDetailContent'));

const desktopColumns: ColumnConfig<ServerRow>[] = [
    { id: 'serverName', label: '服务器名称', sx: {width: '150px'}, renderCell: (r: ServerRow) => <TooltipCell>{r.serverName}</TooltipCell> },
    { id: 'ip', label: 'IP 地址', sx: {width: '130px'}, renderCell: (r: ServerRow) => <TooltipCell>{r.ip}</TooltipCell> },
    { id: 'role', label: '角色', sx: {width: '100px'}, renderCell: (r: ServerRow) => <TooltipCell>{r.role}</TooltipCell> },
    { id: 'depCustNote', label: '部署类型 / 备注', sx: {width: '200px'}, renderCell: (r: ServerRow) => <TooltipCell>{r.dep ? `[${r.dep}] ` : ''}{r.custNote || '-'}</TooltipCell> },
    { id: 'note', label: '使用备注', renderCell: (r: ServerRow) => <TooltipCell>{r.note || '-'}</TooltipCell> },
];

const mobileColumns: ColumnConfig<ServerRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '33.33%'}, renderCell: (r: ServerRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'serverName', label: '服务器名称', sx: {width: '33.33%'}, renderCell: (r: ServerRow) => <TooltipCell>{r.serverName}</TooltipCell> },
    { id: 'role', label: '角色', sx: {width: '33.33%'}, renderCell: (r: ServerRow) => <TooltipCell>{r.role}</TooltipCell> },
];

const SERVERS_QUERY_KEY = ['servers'];

export default function Servers(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const showNotification = useNotification();
    const {serverId} = useParams<{ serverId: string }>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const delayedNavigate = useDelayedNavigate();

    // [核心修复] 1. 新增一个 state 用于即时视觉反馈
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);

    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<ServerRow, ServerDetailContentProps>({
        paramName: 'serverId',
        baseRoute: '/app/servers',
        queryKey: SERVERS_QUERY_KEY,
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

    // [核心修复] 4. 添加一个 effect 来清理临时的 clickedRowId
    useEffect(() => {
        if (!serverId) {
            setClickedRowId(null);
        }
    }, [serverId]);

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
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }
        setPanelContent(
            <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress/></Box>}>
                <ServerSearchForm onSearch={onSearch} onReset={onReset}/>
            </Suspense>
        );
        setPanelTitle('服务器搜索');
        setPanelWidth(360);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // [核心修复] 2. 修改点击处理函数
    const handleRowClick = useCallback((id: string) => {
        setClickedRowId(id);
        delayedNavigate(`/app/servers/${id}`, {replace: true});
    }, [delayedNavigate]);

    const columns = isMobile ? mobileColumns : desktopColumns;

    const tableContent = useMemo(() => (
        <Table stickyHeader aria-label="服务器信息表" sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
            <TableHead>
                <TableRow>
                    {columns.map(col => (
                        <TableCell key={col.id} sx={{...col.sx, fontWeight: 700}}>{col.label}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {pageRows.map(r => (
                    <ClickableTableRow
                        key={r.id}
                        row={r}
                        columns={columns}
                        // [核心修复] 3. 修改高亮逻辑
                        selected={r.id === serverId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
                    />
                ))}
            </TableBody>
        </Table>
    ), [pageRows, columns, serverId, clickedRowId, handleRowClick]);

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader
                title="服务器信息"
                actions={ <ActionButtons showEditButton={isAdmin} onSearchClick={togglePanel} onEditClick={() => alert('编辑按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}><CircularProgress/></Box>}
                {isError && <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Typography color="error">加载失败: {error.message}</Typography></Box>}
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
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    {tableContent}
                </DataTable>
            </Box>
        </PageLayout>
    );
}