/**
 * @file src/pages/Maintenance.tsx
 * @description 此文件是“维护任务”功能的主页面，负责获取并展示任务列表。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码重构]：将文件名和组件名从 `Tasks` 更改为 `Maintenance`，并更新了所有相关的 API 调用和类型引用，以提高命名的业务清晰度。
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
    Typography
} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type InspectionBackupSearchValues} from '@/components/forms/InspectionBackupSearchForm.tsx';
import { maintenanceApi, type MaintenanceTaskRow } from '@/api/maintenanceApi';
import PageLayout from '@/layouts/PageLayout';
import PageHeader from '@/layouts/PageHeader';
import ActionButtons from '@/components/ui/ActionButtons';
import DataTable from '@/components/ui/DataTable';
import TooltipCell from '@/components/ui/TooltipCell';
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import NoDataMessage from '@/components/ui/NoDataMessage';

const InspectionBackupSearchForm = lazy(() => import('@/components/forms/InspectionBackupSearchForm.tsx'));

const columns: ColumnConfig<MaintenanceTaskRow>[] = [
    { id: 'taskName', label: '任务名称', sx: { width: '25%' }, renderCell: (r) => <TooltipCell>{r.taskName}</TooltipCell> },
    { id: 'type', label: '类型', sx: { width: '10%' }, renderCell: (r) => <Chip label={r.type} size="small" /> },
    { id: 'status', label: '状态', sx: { width: '10%' }, renderCell: (r) => {
            const colorMap: { [key in MaintenanceTaskRow['status']]: 'success' | 'warning' | 'error' } = {
                '完成': 'success',
                '挂起': 'warning',
                '未完成': 'error',
            };
            return <Chip label={r.status} size="small" color={colorMap[r.status]} />;
        }},
    { id: 'executionTime', label: '执行时间', sx: { width: '25%' }, renderCell: (r) => <TooltipCell>{r.executionTime?.Valid ? new Date(r.executionTime.Time).toLocaleString() : '-'}</TooltipCell> },
    { id: 'target', label: '目标对象', renderCell: (r) => <TooltipCell>{r.target?.Valid ? r.target.String : '无'}</TooltipCell> },
];

const MAINTENANCE_QUERY_KEY = ['maintenance'];
const ANIMATION_DELAY = 300;

const Maintenance = (): JSX.Element => {
    const {isPanelOpen} = useLayoutState();
    const {togglePanel, setPanelContent, setPanelTitle, setPanelWidth} = useLayoutDispatch();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsQueryEnabled(true), ANIMATION_DELAY);
        return () => clearTimeout(timer);
    }, []);

    const { data: rows = [], isLoading, isError, error } = useQuery<MaintenanceTaskRow[], Error>({
        queryKey: MAINTENANCE_QUERY_KEY,
        queryFn: maintenanceApi.fetchAll,
        enabled: isQueryEnabled,
    });

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

    const pageRows = useMemo(() => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [rows, page, rowsPerPage]);

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
                {pageRows.map(r => (
                    <ClickableTableRow
                        key={r.id}
                        row={r}
                        columns={columns}
                        selected={false}
                        onClick={() => {}}
                    />
                ))}
            </TableBody>
        </Table>
    ), [pageRows]);

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
                    <Typography color="error">加载失败: {error.message}</Typography>
                </Box>
            );
        }
        if (rows.length === 0) {
            return <NoDataMessage message="暂无维护任务数据" />;
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
        </PageLayout>
    );
};

export default Maintenance;