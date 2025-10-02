/**
 * @file src/pages/Changelog.tsx
 * @description 该文件负责渲染“更新日志”页面，并实现了完整的状态管理和删除功能。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [UI 调整]：调整了桌面端表格的列顺序，将信息密度较低、长度不定的“更新内容”列移动到了表格的最后一列，以优化整体布局和可读性。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, Typography, IconButton, Tooltip, Chip
} from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type ChangelogSearchValues} from '@/components/forms/ChangelogSearchForm.tsx';
import {changelogsApi, type ChangelogRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type ChangelogDetailContentProps} from '@/components/modals/ChangelogDetailContent';
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
import {useNotification} from "@/contexts/NotificationContext.tsx";

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

// [核心修改] 调整列的顺序
const desktopColumns: ColumnConfig<ChangelogRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '150px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'updateType', label: '更新类型', sx: {width: '120px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell> },
    { id: 'status', label: '状态', sx: {width: '90px'}, renderCell: (r: ChangelogRow) => <Chip label={r.status} size="small" color={r.status === '完成' ? 'success' : 'warning'} /> },
    { id: 'updateTime', label: '发布时间', sx: {width: '150px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{new Date(r.updateTime).toLocaleDateString()}</TooltipCell> },
    { id: 'completionTime', label: '完成时间', sx: {width: '150px'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.completionTime?.Valid ? new Date(r.completionTime.Time).toLocaleDateString() : '-'}</TooltipCell> },
    { id: 'updateContent', label: '更新内容', renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateContent}</TooltipCell> },
];

const mobileColumns: ColumnConfig<ChangelogRow>[] = [
    { id: 'customerName', label: '客户名称', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.customerName}</TooltipCell> },
    { id: 'updateType', label: '更新类型', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <TooltipCell>{r.updateType}</TooltipCell> },
    { id: 'status', label: '状态', sx: {width: '33.33%'}, renderCell: (r: ChangelogRow) => <Chip label={r.status} size="small" color={r.status === '完成' ? 'success' : 'warning'} /> },
];

const CHANGELOGS_QUERY_KEY_BASE = ['changelogs'];
const ANIMATION_DELAY = 300;

export default function Changelog(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const {logId} = useParams<{ logId: string }>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const delayedNavigate = useDelayedNavigate();
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);
    const showNotification = useNotification();
    const queryClient = useQueryClient();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ChangelogRow | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsQueryEnabled(true), ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const { rows, totalRows, isLoading, isError, error } = useResponsiveDetailView<ChangelogRow, ChangelogDetailContentProps>({
        paramName: 'logId',
        baseRoute: '/app/changelog',
        queryKey: [CHANGELOGS_QUERY_KEY_BASE],
        queryFn: changelogsApi.fetchAll,
        DetailContentComponent: ChangelogDetailContent,
        enabled: isQueryEnabled,
        page: page,
        rowsPerPage: rowsPerPage,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: '完成' | '挂起' }) => {
            if (status === '完成') {
                return changelogsApi.markAsPending(id);
            }
            return changelogsApi.markAsCompleted(id);
        },
        onSuccess: (_, variables) => {
            const actionText = variables.status === '完成' ? '取消完成' : '标记为完成';
            showNotification(`操作成功: ${actionText}`, 'success');
            queryClient.invalidateQueries({ queryKey: [CHANGELOGS_QUERY_KEY_BASE] });
        },
        onError: (err) => {
            handleAsyncError(err, showNotification);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: changelogsApi.deleteById,
        onSuccess: () => {
            showNotification('更新日志删除成功', 'success');
            queryClient.invalidateQueries({ queryKey: [CHANGELOGS_QUERY_KEY_BASE] });
        },
        onError: (err) => {
            handleAsyncError(err, showNotification);
        }
    });

    const handleDeleteClick = (row: ChangelogRow) => {
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
        if (!logId) {
            setClickedRowId(null);
        }
    }, [logId]);

    const onSearch = useCallback((v: ChangelogSearchValues) => {
        alert(`搜索: ${JSON.stringify({ ...v, startTime: v.startTime?.format('YYYY-MM-DD'), endTime: v.endTime?.format('YYYY-MM-DD'), })}`);
        togglePanel();
    }, [togglePanel]);

    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }
        setPanelContent(
            <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress/></Box>}>
                <ChangelogSearchForm onSearch={onSearch} onReset={onReset}/>
            </Suspense>
        );
        setPanelTitle('日志搜索');
        setPanelWidth(360);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]);

    const handleRowClick = useCallback((id: string) => {
        setClickedRowId(id);
        delayedNavigate(`/app/changelog/${id}`, {replace: true});
    }, [delayedNavigate]);

    const columns = isMobile ? mobileColumns : desktopColumns;

    const tableContent = useMemo(() => (
        <Table stickyHeader aria-label="更新日志表" sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
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
                        selected={r.id === logId || r.id === clickedRowId}
                        onClick={() => handleRowClick(r.id)}
                        actions={
                            <>
                                {r.status === '完成' ? (
                                    <Tooltip title="取消完成">
                                        <IconButton size="small" color="warning" onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: r.id, status: r.status }); }}>
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="完成">
                                        <IconButton size="small" color="success" onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: r.id, status: r.status }); }}>
                                            <CheckCircleIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
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
    ), [rows, columns, logId, clickedRowId, handleRowClick, handleDeleteClick, updateStatusMutation]);

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
            return <NoDataMessage message="暂无更新日志" />;
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
                title="更新日志"
                actions={ <ActionButtons showEditButton={isAdmin} onSearchClick={togglePanel} onEditClick={() => alert('编辑按钮被点击')} onExportClick={() => alert('导出按钮被点击')} /> }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {renderContent()}
            </Box>

            <ConfirmDialog
                open={deleteConfirmOpen}
                title="确认删除"
                content={`您确定要删除这条更新日志吗？此操作不可撤销。`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </PageLayout>
    );
}