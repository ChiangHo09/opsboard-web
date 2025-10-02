/**
 * @file src/pages/Maintenance.tsx
 * @description 此文件是“维护任务”功能的主页面，已集成后端分页功能。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：修正了 `PaginatedResponse` 类型的导入路径，从 `@/api/maintenanceApi` 更改为 `@/api`。
 *   - [原因]：此修改解决了因错误的导入路径而导致的 TypeScript 编译失败问题 (TS2459)。通过从全局 API 入口文件 (`api/index.ts`) 导入通用的 `PaginatedResponse` 类型，我们确保了类型引用的正确性和一致性。
 */
import {useEffect, useCallback, lazy, Suspense, type JSX, useState, useMemo, type ChangeEvent} from 'react';
import {
    Box,
    CircularProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type InspectionBackupSearchValues} from '@/components/forms/InspectionBackupSearchForm.tsx';
import { maintenanceApi, type MaintenanceTaskRow } from '@/api/maintenanceApi';
import { type PaginatedResponse } from '@/api'; // [核心修复] 修正导入路径
import {useNotification} from "@/contexts/NotificationContext.tsx";
import {handleAsyncError} from "@/utils/errorHandler.ts";
import PageLayout from '@/layouts/PageLayout';
import PageHeader from '@/layouts/PageHeader';
import ActionButtons from '@/components/ui/ActionButtons';
import DataTable from '@/components/ui/DataTable';
import TooltipCell from '@/components/ui/TooltipCell';
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import NoDataMessage from '@/components/ui/NoDataMessage';
import ConfirmDialog from "@/components/ui/ConfirmDialog.tsx";

const InspectionBackupSearchForm = lazy(() => import('@/components/forms/InspectionBackupSearchForm.tsx'));

const columns: ColumnConfig<MaintenanceTaskRow>[] = [
    { id: 'target', label: '目标对象', sx: { width: '20%' }, renderCell: (r: MaintenanceTaskRow) => <TooltipCell>{r.target?.Valid ? r.target.String : '无'}</TooltipCell> },
    { id: 'type', label: '类型', sx: { width: '10%' }, renderCell: (r: MaintenanceTaskRow) => <Chip label={r.type} size="small" /> },
    { id: 'status', label: '状态', sx: { width: '10%' }, renderCell: (r: MaintenanceTaskRow) => {
            const colorMap: { [key in MaintenanceTaskRow['status']]: 'success' | 'warning' } = {
                '完成': 'success',
                '挂起': 'warning',
            };
            return <Chip label={r.status} size="small" color={colorMap[r.status]} />;
        }},
    { id: 'publicationTime', label: '发布时间', sx: { width: '15%' }, renderCell: (r: MaintenanceTaskRow) => <TooltipCell>{new Date(r.publicationTime).toLocaleDateString()}</TooltipCell> },
    { id: 'completionTime', label: '完成时间', sx: { width: '15%' }, renderCell: (r: MaintenanceTaskRow) => <TooltipCell>{r.completionTime?.Valid ? new Date(r.completionTime.Time).toLocaleDateString() : '-'}</TooltipCell> },
    { id: 'taskName', label: '详情', renderCell: (r: MaintenanceTaskRow) => <TooltipCell>{r.taskName}</TooltipCell> },
];

const MAINTENANCE_QUERY_KEY_BASE = ['maintenance'];
const ANIMATION_DELAY = 300;

const Maintenance = (): JSX.Element => {
    const {isPanelOpen} = useLayoutState();
    const {togglePanel, setPanelContent, setPanelTitle, setPanelWidth} = useLayoutDispatch();
    const showNotification = useNotification();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<MaintenanceTaskRow | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsQueryEnabled(true), ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const { data, isLoading, isError, error } = useQuery<PaginatedResponse<MaintenanceTaskRow>, Error>({
        queryKey: [MAINTENANCE_QUERY_KEY_BASE, page, rowsPerPage],
        queryFn: () => maintenanceApi.fetchAll(page + 1, rowsPerPage),
        enabled: isQueryEnabled,
    });

    const rows = data?.data || [];
    const totalRows = data?.total || 0;

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: '完成' | '挂起' }) => {
            if (status === '完成') {
                return maintenanceApi.markAsPending(id);
            }
            return maintenanceApi.markAsCompleted(id);
        },
        onSuccess: (_, variables) => {
            const actionText = variables.status === '完成' ? '取消完成' : '标记为完成';
            showNotification(`操作成功: ${actionText}`, 'success');
            queryClient.invalidateQueries({ queryKey: [MAINTENANCE_QUERY_KEY_BASE] });
        },
        onError: (err) => {
            handleAsyncError(err, showNotification);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: maintenanceApi.deleteById,
        onSuccess: () => {
            showNotification('任务删除成功', 'success');
            queryClient.invalidateQueries({ queryKey: [MAINTENANCE_QUERY_KEY_BASE] });
        },
        onError: (err) => {
            handleAsyncError(err, showNotification);
        }
    });

    const handleDeleteClick = (row: MaintenanceTaskRow) => {
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

    const handleSearch = useCallback((values: InspectionBackupSearchValues) => {
        alert(`搜索条件: ${JSON.stringify(values, null, 2)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        alert('搜索表单已重置');
    }, []);

    useEffect(() => {
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }
        setPanelContent(
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress/></Box>}>
                <InspectionBackupSearchForm onSearch={handleSearch} onReset={handleReset}/>
            </Suspense>
        );
        setPanelTitle('维护任务搜索');
        setPanelWidth(360);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    const tableContent = useMemo(() => (
        <Table stickyHeader aria-label="维护任务记录表" sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
            <TableHead>
                <TableRow>
                    {columns.map(col => (
                        <TableCell key={col.id} sx={{...col.sx, fontWeight: 700}}>{col.label}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((r: MaintenanceTaskRow) => (
                    <ClickableTableRow
                        key={r.id}
                        row={r}
                        columns={columns}
                        selected={false}
                        onClick={() => { /* 暂时无点击交互 */ }}
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
    ), [rows, handleDeleteClick, updateStatusMutation]);

    const renderContent = () => {
        if ((isLoading || !isQueryEnabled) && !data) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                    <CircularProgress/>
                </Box>
            );
        }
        if (isError) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography color="error">加载失败: {error.message}</Typography>
                </Box>
            );
        }
        if (totalRows === 0) {
            return <NoDataMessage message="暂无维护任务数据" />;
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
                title="维护任务"
                actions={
                    <ActionButtons
                        showEditButton={isAdmin}
                        onSearchClick={togglePanel}
                        onEditClick={() => alert('新建任务按钮被点击')}
                        onExportClick={() => alert('导出按钮被点击')}
                    />
                }
            />
            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {renderContent()}
            </Box>

            <ConfirmDialog
                open={deleteConfirmOpen}
                title="确认删除"
                content={`您确定要删除任务 "${itemToDelete?.taskName}" 吗？此操作不可撤销。`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </PageLayout>
    );
};

export default Maintenance;