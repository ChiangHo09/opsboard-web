/**
 * @file src/pages/Servers.tsx
 * @description 该文件负责渲染“服务器信息”页面，并实现了删除服务器的功能。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：实现了删除服务器的完整流程，包括API调用、状态更新和用户确认。
 *   - [UI 交互]：为表格的每一行增加了悬浮时出现的操作按钮（打印和删除），并通过 `ClickableTableRow` 的 `actions` prop 进行渲染。
 *   - [状态管理]：使用 `useState` 管理删除确认对话框的开关状态和待删除项的ID。
 *   - [数据流]：使用 `@tanstack/react-query` 的 `useMutation` 和 `queryClient` 来执行删除操作，并在成功后自动刷新服务器列表，确保了UI与后端数据的同步。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query'; // [核心修改]
import PrintIcon from '@mui/icons-material/Print'; // [核心修改]
import DeleteIcon from '@mui/icons-material/Delete'; // [核心修改]
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
import NoDataMessage from '@/components/ui/NoDataMessage';
import ConfirmDialog from '@/components/ui/ConfirmDialog'; // [核心修改]

const ServerSearchForm = lazy(() => import('@/components/forms/ServerSearchForm'));
const ServerDetailContent = lazy(() => import('@/components/modals/ServerDetailContent'));

const desktopColumns: ColumnConfig<ServerRow>[] = [
    { id: 'serverName', label: '服务器名称', sx: {width: '150px'}, renderCell: (r: ServerRow) => <TooltipCell>{r.serverName}</TooltipCell> },
    { id: 'ip', label: 'IP 地址', sx: {width: '130px'}, renderCell: (r: ServerRow) => <TooltipCell>{r.ip}</TooltipCell> },
    { id: 'role', label: '角色', sx: {width: '100px'}, renderCell: (r: ServerRow) => <TooltipCell>{r.role?.Valid ? r.role.String : '-'}</TooltipCell> },
    { id: 'depCustNote', label: '部署类型 / 备注', sx: {width: '200px'}, renderCell: (r: ServerRow) => {
            const depText = r.dep?.Valid ? `[${r.dep.String}] ` : '';
            const custNoteText = r.custNote?.Valid ? r.custNote.String : '-';
            return <TooltipCell>{depText}{custNoteText}</TooltipCell>;
        }},
    { id: 'note', label: '使用备注', renderCell: (r: ServerRow) => <TooltipCell>{r.note?.Valid ? r.note.String : '-'}</TooltipCell> },
];

const mobileColumns: ColumnConfig<ServerRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '33.33%'}, renderCell: (r: ServerRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'serverName', label: '服务器名称', sx: {width: '33.33%'}, renderCell: (r: ServerRow) => <TooltipCell>{r.serverName}</TooltipCell> },
    { id: 'role', label: '角色', sx: {width: '33.33%'}, renderCell: (r: ServerRow) => <TooltipCell>{r.role?.Valid ? r.role.String : '-'}</TooltipCell> },
];

const SERVERS_QUERY_KEY = ['servers'];
const ANIMATION_DELAY = 300;

export default function Servers(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const showNotification = useNotification();
    const {serverId} = useParams<{ serverId: string }>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const delayedNavigate = useDelayedNavigate();
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    // [核心修改] 删除逻辑的状态管理
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ServerRow | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsQueryEnabled(true);
        }, ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<ServerRow, ServerDetailContentProps>({
        paramName: 'serverId',
        baseRoute: '/app/servers',
        queryKey: SERVERS_QUERY_KEY,
        queryFn: serversApi.fetchAll,
        DetailContentComponent: ServerDetailContent,
        enabled: isQueryEnabled,
    });

    // [核心修改] 使用 useMutation 执行删除操作
    const deleteMutation = useMutation({
        mutationFn: serversApi.deleteById,
        onSuccess: () => {
            showNotification('服务器删除成功', 'success');
            // 使服务器列表的缓存失效，触发自动重新获取
            queryClient.invalidateQueries({ queryKey: SERVERS_QUERY_KEY });
        },
        onError: (err) => {
            handleAsyncError(err, showNotification);
        }
    });

    const handleDeleteClick = (row: ServerRow) => {
        setItemToDelete(row);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete.id);
        }
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
    };

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

    const pageRows = useMemo(() => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [rows, page, rowsPerPage]);

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
                        selected={r.id === serverId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
                        // [核心修改] 传递操作按钮
                        actions={
                            <>
                                <Tooltip title="打印">
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); alert(`打印 ${r.serverName}`); }}>
                                        <PrintIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="删除">
                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(r); }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        }
                    />
                ))}
            </TableBody>
        </Table>
    ), [pageRows, columns, serverId, clickedRowId, handleRowClick]);

    const renderContent = () => {
        if (isLoading || !isQueryEnabled) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                    <CircularProgress/>
                </Box>
            );
        }
        if (isError) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography color="error">加载失败: {error instanceof Error ? error.message : '未知错误'}</Typography>
                </Box>
            );
        }
        if (rows.length === 0) {
            return <NoDataMessage message="暂无服务器数据" />;
        }
        return (
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
        );
    };

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader
                title="服务器信息"
                actions={ <ActionButtons showEditButton={isAdmin} onSearchClick={togglePanel} onEditClick={() => alert('编辑按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {renderContent()}
            </Box>

            {/* [核心修改] 渲染确认对话框 */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                title="确认删除"
                content={`您确定要删除服务器 "${itemToDelete?.serverName}" 吗？此操作不可撤销。`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </PageLayout>
    );
}