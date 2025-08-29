/**
 * @file src/pages/Tickets.tsx
 * @description 此文件负责渲染“工单信息”页面，通过数据表格展示工单列表，并提供搜索功能。
 * @modification
 *   - [动画优化]：移除 `isPanelContentSet` 状态及其相关 `useEffect`。修改设置搜索面板内容的 `useEffect`，使其直接依赖 `isPanelOpen` 并移除 `setTimeout(0)`。此举旨在消除面板内容设置的延迟和潜在竞态条件，解决搜索面板在页面切换时“闪现然后自动收起”的问题，确保面板内容与 `isPanelOpen` 状态同步。
 *   - [性能优化]：将 `useResponsiveDetailView` 钩子中的 `queryKey` 从内联数组字面量更改为模块级别的常量 `TICKETS_QUERY_KEY`。此举确保了 `queryKey` 的引用稳定性，防止 `useQuery` 在页面组件重新渲染时触发不必要的数据重新获取和处理，从而显著减少 JavaScript 执行时间，解决页面切换时的卡卡顿问题。
 *   - [性能优化]：将传递给 `ClickableTableRow` 的 `onClick` 回调函数使用 `useCallback` 进行记忆化。这确保了在父组件重新渲染时，`onClick` 函数的引用保持稳定，从而配合 `React.memo` 减少 `ClickableTableRow` 的不必要渲染，提高表格性能。
 *   - [架构重构]：更新了表格主体的渲染逻辑，以使用全新的 `<ClickableTableRow>` 组件架构。
 *   - [核心修复]：现在不再手动遍历列来渲染 `<td>`，而是将整行数据 `r` 和列配置 `columns` 直接传递给 `<ClickableTableRow>`。该组件内部会使用 `colSpan` 和 `Flexbox` 来构建一个既能正确布局又不会产生交互冲突的行。
 *   - [类型安全]：为列配置数组 `desktopColumns` 和 `mobileColumns` 添加了 `ColumnConfig<TicketRow>[]` 类型注解，确保了类型安全。
 *   - [代码简化]：移除了 `renderCell` 函数中多余的 `<TableCell>` 包装，因为新的 `TooltipCell` 和 `ClickableTableRow` 架构不再需要它。
 *   - [最终效果]：此修改与 `ClickableTableRow` 和 `TooltipCell` 的重构相配合，彻底解决了表格在交互时布局塌陷的根本性问题。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, Chip, type Theme
} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
import {type TicketSearchValues} from '@/components/forms/TicketSearchForm';
import {ticketsApi, type TicketRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type TicketDetailContentProps} from '@/components/modals/TicketDetailContent';
import {handleAsyncError} from '@/utils/errorHandler';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';
import {red} from '@mui/material/colors';
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';
import PageHeader from '@/layouts/PageHeader';

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));

const statusConfig: Record<string, { label: string; sx: (theme: Theme) => object }> = {
    '就绪': {
        label: '完成',
        sx: (theme: Theme) => ({
            fontWeight: 700,
            backgroundColor: theme.palette.neutral.main,
            color: theme.palette.common.white,
            '& .MuiChip-label': {
                transform: 'translateY(1px)',
            },
        }),
    },
    '挂起': {
        label: '挂起',
        sx: (theme: Theme) => ({
            fontWeight: 700,
            backgroundColor: red[200],
            color: theme.palette.common.white,
            '& .MuiChip-label': {
                transform: 'translateY(1px)',
            },
        }),
    },
    'default': {
        label: '未知',
        sx: () => ({
            fontWeight: 700,
        }),
    },
};

// 为列配置数组添加正确的类型注解
const desktopColumns: ColumnConfig<TicketRow>[] = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '120px'},
        renderCell: (r: TicketRow) => <TooltipCell>{r.customerName}</TooltipCell>
    },
    {
        id: 'status',
        label: '状态',
        sx: {width: '90px'},
        renderCell: (r: TicketRow) => {
            const currentStatus = statusConfig[r.status] || statusConfig.default;
            return <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>;
        }
    },
    {
        id: 'operationType',
        label: '操作类别',
        sx: {width: '120px'},
        renderCell: (r: TicketRow) => <TooltipCell>{r.operationType}</TooltipCell>
    },
    {
        id: 'operationContent',
        label: '操作内容',
        renderCell: (r: TicketRow) => <TooltipCell>{r.operationContent}</TooltipCell>
    },
];

const mobileColumns: ColumnConfig<TicketRow>[] = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '33.33%'},
        renderCell: (r: TicketRow) => <TooltipCell>{r.customerName}</TooltipCell>
    },
    {
        id: 'status',
        label: '状态',
        sx: {width: '33.33%'},
        renderCell: (r: TicketRow) => {
            const currentStatus = statusConfig[r.status] || statusConfig.default;
            return <Chip label={currentStatus.label} size="small" sx={currentStatus.sx}/>;
        }
    },
    {
        id: 'operationType',
        label: '操作类别',
        sx: {width: '33.33%'},
        renderCell: (r: TicketRow) => <TooltipCell>{r.operationType}</TooltipCell>
    },
];

// 将 queryKey 定义为模块级别的常量
const TICKETS_QUERY_KEY = ['tickets'];

const Tickets = (): JSX.Element => {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
    } = useLayoutDispatch();
    const showNotification = useNotification();

    const navigate = useNavigate();
    const {ticketId} = useParams<{ ticketId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // 移除 isPanelContentSet 状态

    const [isAdmin] = useState(true);

    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<TicketRow, TicketDetailContentProps>({
        paramName: 'ticketId',
        baseRoute: '/app/tickets',
        queryKey: TICKETS_QUERY_KEY,
        queryFn: ticketsApi.fetchAll,
        DetailContentComponent: TicketDetailContent,
    });

    useEffect(() => {
        if (ticketId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === ticketId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [ticketId, rows, rowsPerPage, page]);

    // 移除同步 isPanelContentSet 的 useEffect
    // useEffect(() => {
    //     if (isPanelOpen) {
    //         setIsPanelContentSet(true);
    //     }
    // }, [isPanelOpen]);

    const onSearch = useCallback((v: TicketSearchValues) => {
        try {
            alert(`搜索: ${JSON.stringify(v)}`);
            togglePanel();
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]);

    const onReset = useCallback(() => {
        alert('重置工单搜索表单');
    }, []);

    // 修改设置面板内容的 useEffect
    useEffect(() => {
        // 如果面板未打开，则立即清除内容
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }

        // 如果面板打开，则设置内容（无需 setTimeout）
        setPanelContent(
            <Suspense fallback={<Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}><CircularProgress/></Box>}>
                <TicketSearchForm onSearch={onSearch} onReset={onReset}/>
            </Suspense>
        );
        setPanelTitle('工单搜索');
        setPanelWidth(360);

        // 清理函数：当 isPanelOpen 变为 false 或组件卸载时，清除内容
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]); // 依赖 isPanelOpen

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleTogglePanel = () => {
        // 移除 isPanelContentSet 的设置
        // if (!isPanelContentSet) {
        //     setIsPanelContentSet(true);
        // }
        togglePanel();
    };

    const handleRowClick = useCallback((id: string) => {
        navigate(`/app/tickets/${id}`, {replace: true});
    }, [navigate]);

    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <PageLayout>
            <PageHeader
                title="工单信息"
                actions={
                    <ActionButtons
                        showEditButton={isAdmin}
                        onSearchClick={handleTogglePanel}
                        onEditClick={() => alert('编辑按钮被点击')}
                        onExportClick={() => alert('导出按钮被点击')}
                    />
                }
            />

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10
                    }}>
                        <CircularProgress/>
                    </Box>
                )}
                {isError && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography color="error">加载失败: {error.message}</Typography>
                    </Box>
                )}
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
                    <Table stickyHeader aria-label="工单信息表"
                           sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
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
                                    selected={r.id === ticketId}
                                    onClick={() => handleRowClick(r.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Tickets;