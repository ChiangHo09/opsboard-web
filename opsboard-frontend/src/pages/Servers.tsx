/**
 * @file src/pages/Servers.tsx
 * @description 该文件负责渲染“服务器信息”页面，已集成后端分页和删除功能。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [UI更新]：更新对 `ActionButtons` 组件的调用，以反映其从“编辑”到“新增”的功能变更。
 *   - [属性变更]：将 `showEditButton` 属性替换为 `showAddButton`，并将 `onEditClick` 事件处理器替换为 `onAddClick`，以适配组件更新。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
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
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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

const SERVERS_QUERY_KEY_BASE = ['servers'];
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
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ServerRow | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsQueryEnabled(true);
        }, ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const {rows, totalRows, isLoading, isError, error} = useResponsiveDetailView<ServerRow, ServerDetailContentProps>({
        paramName: 'serverId',
        baseRoute: '/app/servers',
        queryKey: [SERVERS_QUERY_KEY_BASE],
        queryFn: serversApi.fetchAll,
        DetailContentComponent: ServerDetailContent,
        enabled: isQueryEnabled,
        page: page,
        rowsPerPage: rowsPerPage,
    });

    const deleteMutation = useMutation({
        mutationFn: serversApi.deleteById,
        onSuccess: () => {
            showNotification('服务器删除成功', 'success');
            queryClient.invalidateQueries({ queryKey: [SERVERS_QUERY_KEY_BASE] });
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
                {rows.map(r => (
                    <ClickableTableRow
                        key={r.id}
                        row={r}
                        columns={columns}
                        selected={r.id === serverId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
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
    ), [rows, columns, serverId, clickedRowId, handleRowClick, handleDeleteClick]);

    const renderContent = () => {
        if ((isLoading || !isQueryEnabled) && totalRows === 0) {
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
        if (totalRows === 0) {
            return <NoDataMessage message="暂无服务器数据" />;
        }
        return (
            <DataTable
                rowsPerPageOptions={[10, 25, 50]}
                count={totalRows}
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
                actions={ <ActionButtons showAddButton={isAdmin} onSearchClick={togglePanel} onAddClick={() => alert('新增按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {renderContent()}
            </Box>

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