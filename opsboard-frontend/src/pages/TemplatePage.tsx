/**
 * @file src/pages/TemplatePage.tsx
 * @description 此文件定义了一个功能完备的【模板页面】，已集成后端分页功能。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：全面重构了数据获取逻辑，以支持后端分页。
 *   - [实现]：
 *     - `useResponsiveDetailView` 现在接收并使用分页状态 (`page`, `rowsPerPage`)。
 *     - `templateApi.fetchAll` 被更新为支持分页的签名。
 *     - `DataTable` 组件现在由 `totalRows` 和本地分页状态驱动。
 *     - 修复了所有相关的 TypeScript 类型错误。
 */
import {
    useEffect,
    useCallback,
    useState,
    lazy,
    Suspense,
    type JSX,
    type ChangeEvent,
    useMemo
} from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';

import { useLayoutDispatch, useLayoutState } from '@/contexts/LayoutContext.tsx';
import { useNotification } from '@/contexts/NotificationContext.tsx';
import PageLayout from '@/layouts/PageLayout.tsx';
import DataTable from '@/components/ui/DataTable.tsx';
import TooltipCell from '@/components/ui/TooltipCell.tsx';
import { type TemplateSearchValues } from '@/components/forms/TemplateSearchForm.tsx';
import { handleAsyncError } from '@/utils/errorHandler.ts';
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow.tsx';
import ActionButtons from '@/components/ui/ActionButtons.tsx';
import PageHeader from '@/layouts/PageHeader.tsx';
import { templateApi, type TemplateRow } from '@/api/templateApi.ts';
import { useResponsiveDetailView } from '@/hooks/useResponsiveDetailView';
import { useDelayedNavigate } from '@/hooks/useDelayedNavigate';
import NoDataMessage from '@/components/ui/NoDataMessage';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const TemplateSearchForm = lazy(() => import('@/components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('@/components/modals/TemplateModalContent.tsx'));

const desktopColumns: ColumnConfig<TemplateRow>[] = [
    { id: 'name', label: '项目名称', sx: { width: '25%' }, renderCell: (r: TemplateRow) => <TooltipCell>{r.name}</TooltipCell> },
    { id: 'category', label: '类别', sx: { width: '15%' }, renderCell: (r: TemplateRow) => <Typography variant="body2">{r.category}</Typography> },
    { id: 'description', label: '描述', renderCell: (r: TemplateRow) => <TooltipCell>{r.description}</TooltipCell> },
];

const mobileColumns: ColumnConfig<TemplateRow>[] = [
    { id: 'name', label: '项目名称', sx: { width: '40%' }, renderCell: (r: TemplateRow) => <TooltipCell>{r.name}</TooltipCell> },
    { id: 'category', label: '类别', sx: { width: '20%' }, renderCell: (r: TemplateRow) => <Typography variant="body2">{r.category}</Typography> },
    { id: 'description', label: '描述', sx: { width: '40%' }, renderCell: (r: TemplateRow) => <TooltipCell>{r.description}</TooltipCell> },
];

const TEMPLATE_QUERY_KEY_BASE = ['templates'];
const ANIMATION_DELAY = 300;

const TemplatePage = (): JSX.Element => {
    const { isMobile, isPanelOpen } = useLayoutState();
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const showNotification = useNotification();
    const { itemId } = useParams<{ itemId: string }>();
    const delayedNavigate = useDelayedNavigate();
    const queryClient = useQueryClient();

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isAdmin] = useState<boolean>(true);
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<TemplateRow | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsQueryEnabled(true), ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const { rows, totalRows, isLoading, isError, error } = useResponsiveDetailView<TemplateRow, { itemId: string }>({
        paramName: 'itemId',
        baseRoute: '/app/template-page',
        queryKey: [TEMPLATE_QUERY_KEY_BASE],
        queryFn: templateApi.fetchAll,
        DetailContentComponent: TemplateModalContent,
        enabled: isQueryEnabled,
        page: page,
        rowsPerPage: rowsPerPage,
    });

    const deleteMutation = useMutation({
        mutationFn: templateApi.deleteById,
        onSuccess: () => {
            showNotification('模板删除成功', 'success');
            queryClient.invalidateQueries({ queryKey: [TEMPLATE_QUERY_KEY_BASE] });
        },
        onError: (err) => {
            handleAsyncError(err, showNotification);
        }
    });

    const handleDeleteClick = useCallback((row: TemplateRow) => {
        setItemToDelete(row);
        setDeleteConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete.id);
        }
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
    }, [itemToDelete, deleteMutation]);

    const handleSearch = useCallback((values: TemplateSearchValues): void => {
        alert(`搜索: ${JSON.stringify(values)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback((): void => {
        alert('表单已重置');
    }, []);

    const handleRowClick = useCallback((id: string): void => {
        setClickedRowId(id);
        delayedNavigate(`/app/template-page/${id}`, { replace: true });
    }, [delayedNavigate]);

    useEffect(() => {
        if (isPanelOpen) {
            setPanelContent(
                <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress/></Box>}>
                    <TemplateSearchForm onSearch={handleSearch} onReset={handleReset}/>
                </Suspense>
            );
            setPanelTitle('模板搜索');
            setPanelWidth(360);
        } else {
            setPanelContent(null);
            setPanelTitle('');
        }
        return () => {
            if (isPanelOpen) {
                setPanelContent(null);
                setPanelTitle('');
            }
        };
    }, [isPanelOpen, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    useEffect(() => {
        if (!itemId) {
            setClickedRowId(null);
        }
    }, [itemId]);

    const columns: ColumnConfig<TemplateRow>[] = isMobile ? mobileColumns : desktopColumns;

    const tableContent = useMemo(() => (
        <Table stickyHeader sx={{ borderCollapse: 'separate', tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
                <TableRow>
                    {columns.map((col) => (
                        <TableCell key={col.id} sx={{ ...col.sx, fontWeight: 700 }}>
                            {col.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row: TemplateRow) => (
                    <ClickableTableRow
                        key={row.id}
                        row={row}
                        columns={columns}
                        selected={row.id === itemId || row.id === clickedRowId}
                        onClick={() => handleRowClick(row.id)}
                        actions={
                            <>
                                <Tooltip title="打印">
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); alert(`打印 ${row.name}`); }}>
                                        <PrintIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="删除">
                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        }
                    />
                ))}
            </TableBody>
        </Table>
    ), [rows, columns, itemId, clickedRowId, handleRowClick, handleDeleteClick]);

    const renderContent = () => {
        if ((isLoading || !isQueryEnabled) && totalRows === 0) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (isError) {
            return (
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography color="error">加载失败: {error ? error.message : '未知错误'}</Typography>
                </Box>
            );
        }
        if (totalRows === 0) {
            return <NoDataMessage message="暂无模板数据" />;
        }
        return (
            <DataTable
                rowsPerPageOptions={[10, 25, 50]}
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage: number) => setPage(newPage)}
                onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setRowsPerPage(+event.target.value);
                    setPage(0);
                }}
                labelRowsPerPage="每页行数:"
                labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
            >
                {tableContent}
            </DataTable>
        );
    };

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader
                title="模板页面"
                actions={
                    <ActionButtons
                        showEditButton={isAdmin}
                        onSearchClick={togglePanel}
                        onEditClick={() => alert('编辑按钮被点击')}
                        onExportClick={() => alert('导出按钮被点击')}
                    />
                }
            />

            <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
                {renderContent()}
            </Box>

            <ConfirmDialog
                open={deleteConfirmOpen}
                title="确认删除"
                content={`您确定要删除模板 "${itemToDelete?.name}" 吗？此操作不可撤销。`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </PageLayout>
    );
};

export default TemplatePage;