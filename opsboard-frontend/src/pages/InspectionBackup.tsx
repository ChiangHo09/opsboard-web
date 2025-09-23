/**
 * @file src/pages/InspectionBackup.tsx
 * @description 此文件是“巡检备份”功能的主页面。
 * @modification
 *   - [TS修复]：修复了多个TypeScript编译错误。
 *     - 移除了未使用的 `Typography` 导入，解决了 `TS6133` 警告。
 *     - 为 `<ClickableTableRow>` 组件明确传递了一个空的 `onClick` 回调函数 (`() => {}`)，以满足其必需的 prop 类型要求，解决了 `TS2741` 错误。
 *   - [UI重构]：(前次提交) 将页面布局重构为与其他数据列表页面一致的风格，引入了数据表格和标准头部。
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
    Chip
} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type InspectionBackupSearchValues} from '@/components/forms/InspectionBackupSearchForm.tsx';
import PageLayout from '@/layouts/PageLayout';
import PageHeader from '@/layouts/PageHeader';
import ActionButtons from '@/components/ui/ActionButtons';
import DataTable from '@/components/ui/DataTable';
import TooltipCell from '@/components/ui/TooltipCell';
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';

const InspectionBackupSearchForm = lazy(() => import('@/components/forms/InspectionBackupSearchForm.tsx'));

// --- 模拟数据和类型定义 ---
interface InspectionBackupRow {
    id: string;
    taskName: string;
    type: '巡检' | '备份';
    status: '成功' | '失败' | '进行中';
    executionTime: string;
    target: string;
}

const mockData: InspectionBackupRow[] = Array.from({ length: 50 }, (_, i) => ({
    id: `task-${i + 1}`,
    taskName: `常规${i % 2 === 0 ? '数据库' : '文件系统'}检查`,
    type: i % 3 === 0 ? '备份' : '巡检',
    status: i % 10 === 0 ? '失败' : (i % 5 === 0 ? '进行中' : '成功'),
    executionTime: new Date(Date.now() - i * 3600000).toLocaleString(),
    target: `服务器-${(i % 5) + 1} (192.168.1.${100 + i})`,
}));

// --- 列配置 ---
const columns: ColumnConfig<InspectionBackupRow>[] = [
    { id: 'taskName', label: '任务名称', sx: { width: '25%' }, renderCell: (r) => <TooltipCell>{r.taskName}</TooltipCell> },
    { id: 'type', label: '类型', sx: { width: '10%' }, renderCell: (r) => <Chip label={r.type} size="small" color={r.type === '备份' ? 'secondary' : 'primary'} /> },
    { id: 'status', label: '状态', sx: { width: '10%' }, renderCell: (r) => <Chip label={r.status} size="small" color={r.status === '成功' ? 'success' : (r.status === '失败' ? 'error' : 'warning')} /> },
    { id: 'executionTime', label: '执行时间', sx: { width: '25%' }, renderCell: (r) => <TooltipCell>{r.executionTime}</TooltipCell> },
    { id: 'target', label: '目标对象', renderCell: (r) => <TooltipCell>{r.target}</TooltipCell> },
];


const InspectionBackup = (): JSX.Element => {
    const {isPanelOpen} = useLayoutState();
    const {togglePanel, setPanelContent, setPanelTitle, setPanelWidth} = useLayoutDispatch();

    // --- State ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAdmin] = useState(true);
    const [rows] = useState<InspectionBackupRow[]>(mockData);

    // --- Callbacks ---
    const handleSearch = useCallback((values: InspectionBackupSearchValues) => {
        alert(`搜索条件: ${JSON.stringify(values, null, 2)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        alert('搜索表单已重置');
    }, []);

    // --- Effects ---
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
        setPanelTitle('巡检备份搜索');
        setPanelWidth(360);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    // --- Render Logic ---
    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const tableContent = useMemo(() => (
        <Table stickyHeader aria-label="巡检备份记录表" sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
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
                        // [核心修复] 明确传递一个空函数以满足 onClick prop 的类型要求
                        onClick={() => {}}
                    />
                ))}
            </TableBody>
        </Table>
    ), [pageRows]);

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader
                title="巡检备份"
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
};

export default InspectionBackup;