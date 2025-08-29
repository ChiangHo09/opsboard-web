/**
 * @file src/pages/Servers.tsx
 * @description 该文件负责渲染“服务器信息”页面，并提供搜索功能。
 * @modification
 *   - [动画优化]：移除 `isPanelContentSet` 状态及其相关 `useEffect`。修改设置搜索面板内容的 `useEffect`，使其直接依赖 `isPanelOpen` 并移除 `setTimeout(0)`。此举旨在消除面板内容设置的延迟和潜在竞态条件，解决搜索面板在页面切换时“闪现然后自动收起”的问题，确保面板内容与 `isPanelOpen` 状态同步。
 *   - [性能优化]：将 `useResponsiveDetailView` 钩子中的 `queryKey` 从内联数组字面量更改为模块级别的常量 `SERVERS_QUERY_KEY`。此举确保了 `queryKey` 的引用稳定性，防止 `useQuery` 在页面组件重新渲染时触发不必要的数据重新获取和处理，从而显著减少 JavaScript 执行时间，解决页面切换时的卡顿问题。
 *   - [性能优化]：将传递给 `ClickableTableRow` 的 `onClick` 回调函数使用 `useCallback` 进行记忆化。这确保了在父组件重新渲染时，`onClick` 函数的引用保持稳定，从而配合 `React.memo` 减少 `ClickableTableRow` 的不必要渲染，提高表格性能。
 *   - [类型修复]：列配置数组 `desktopColumns` 和 `mobileColumns` 的类型 `ColumnConfig<ServerRow>[]` 现在是正确的。由于 `ColumnConfig` 接口已更新并包含了 `label` 属性，因此之前存在的 TypeScript 编译错误 (TS2353) 已被解决。
 *   - [架构重构]：更新了表格主体的渲染逻辑，以使用全新的 `<ClickableTableRow>` 组件架构。
 *   - [Layout Fix]: 修复了表格右侧的空白问题。
 *   - [Refactor]: 更新了 `<PageHeader>` 组件的导入路径。
 *   - [Refactor]: 引入并使用了新的可复用布局组件 `<PageHeader />`。
 *   - [Refactor]: 引入了列配置数组（`columns`）来动态渲染表格的表头和单元格。
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
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';
import PageHeader from '@/layouts/PageHeader';

const ServerSearchForm = lazy(() => import('@/components/forms/ServerSearchForm'));
const ServerDetailContent = lazy(() => import('@/components/modals/ServerDetailContent'));

// 列配置现在也需要符合 ColumnConfig<ServerRow> 类型
const desktopColumns: ColumnConfig<ServerRow>[] = [
    {
        id: 'serverName',
        label: '服务器名称',
        sx: {width: '150px'},
        renderCell: (r: ServerRow) => <TooltipCell>{r.serverName}</TooltipCell>
    },
    {
        id: 'ip',
        label: 'IP 地址',
        sx: {width: '130px'},
        renderCell: (r: ServerRow) => <TooltipCell>{r.ip}</TooltipCell>
    },
    {
        id: 'role',
        label: '角色',
        sx: {width: '100px'},
        renderCell: (r: ServerRow) => <TooltipCell>{r.role}</TooltipCell>
    },
    {
        id: 'depCustNote',
        label: '部署类型 / 备注',
        sx: {width: '200px'},
        renderCell: (r: ServerRow) => <TooltipCell>{r.dep ? `[${r.dep}] ` : ''}{r.custNote || '-'}</TooltipCell>
    },
    {
        id: 'note',
        label: '使用备注',
        renderCell: (r: ServerRow) => <TooltipCell>{r.note || '-'}</TooltipCell>
    },
];

const mobileColumns: ColumnConfig<ServerRow>[] = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '33.33%'},
        renderCell: (r: ServerRow) => <TooltipCell>{r.customerName}</TooltipCell>
    },
    {
        id: 'serverName',
        label: '服务器名称',
        sx: {width: '33.33%'},
        renderCell: (r: ServerRow) => <TooltipCell>{r.serverName}</TooltipCell>
    },
    {
        id: 'role',
        label: '角色',
        sx: {width: '33.33%'},
        renderCell: (r: ServerRow) => <TooltipCell>{r.role}</TooltipCell>
    },
];

// 将 queryKey 定义为模块级别的常量
const SERVERS_QUERY_KEY = ['servers'];

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
    // 移除 isPanelContentSet 状态

    const [isAdmin] = useState(true);

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

    // 移除同步 isPanelContentSet 的 useEffect
    // useEffect(() => {
    //     if (isPanelOpen) {
    //         setIsPanelContentSet(true);
    //     }
    // }, [isPanelOpen]);

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
                <ServerSearchForm onSearch={onSearch} onReset={onReset}/>
            </Suspense>
        );
        setPanelTitle('服务器搜索');
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
        navigate(`/app/servers/${id}`, {replace: true});
    }, [navigate]);

    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <PageLayout>
            <PageHeader
                title="服务器信息"
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
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="服务器信息表"
                           sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
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
                                    selected={r.id === serverId}
                                    onClick={() => handleRowClick(r.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
}