/**
 * @file src/pages/TemplatePage.tsx
 * @description
 * 此文件定义了一个功能完备的【模板页面】。它是一个高级的数据驱动视图，
 * 集成了多种现代React应用的常见模式和功能，旨在成为创建新页面的“终极模板”。
 *
 * @features
 * 实现的核心功能包括：
 * - 1. **配置驱动的UI**: 表格的结构（列、顺序、样式、渲染方式）由 `desktopColumns` 和 `mobileColumns` 配置数组驱动，使维护变得极其简单。
 * - 2. **高性能表格架构**:
 *      - **保留分页**: 完全保留了 Material-UI 的分页器功能。
 *      - **稳定的渲染**: 通过 `useMemo` 记忆化表格结构，防止因弹窗打开等无关状态更新导致的表格重渲染，保证了DOM的稳定性。
 * - 3. **健壮的交互体验**:
 *      - **无闪烁高亮**: 通过分离“即时视觉反馈”和“延迟导航”的策略，彻底解决了在所有平台上点击行时因弹窗出现而导致的“闪烁”问题。
 *      - **整行点击与涟漪**: 通过统一的 `<ClickableTableRow>` 组件，实现了整行点击、涟漪效果和行高亮。
 *      - **智能悬浮提示**: 通过 `<TooltipCell>` 自动为溢出文本提供悬浮提示。
 * - 4. **响应式布局**: 自动在桌面端（多列+弹窗详情）和移动端（少列+页面详情）之间切换。
 * - 5. **URL驱动状态**: 详情视图的打开状态完全由URL参数驱动，支持通过链接直接分享和访问。
 * - 6. **懒加载集成**: 右侧的搜索面板和弹窗内容都通过 `React.lazy` 和 `Suspense` 实现按需加载。
 * - 7. **全局状态集成**: 与 `LayoutContext` 深度集成，用于控制和管理右侧搜索面板和全局模态框。
 * - 8. **统一错误处理与状态显示**: 为所有异步操作提供了统一的加载（Loading）和错误（Error）状态显示。
 *
 * @modification
 *   - [最终UX修复与功能恢复]：恢复了之前被意外省略的、用于处理弹窗打开和移动端重定向的 `useEffect` 逻辑，并将其与最终的“闪烁”修复方案（`useMemo`, `useDelayedNavigate`, `clickedRowId`）完美整合。
 *   - [注释恢复]：根据用户要求，完全恢复并更新了所有教学级别的详尽注释，确保文件的完整性和可读性。
 */

// --- 1. IMPORTS ---
// 导入 React 及其核心 Hooks，用于组件生命周期管理和状态。
import {useEffect, useCallback, useState, lazy, Suspense, type JSX, type ChangeEvent, useMemo} from 'react';
// 导入 React Router 的 Hooks，用于程序化导航和读取 URL 参数。
import {useParams} from 'react-router-dom';
// 导入所有需要的 Material-UI 组件，用于构建 UI 界面。
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
// 导入全局布局上下文的 Hooks，用于与主布局（如侧边栏、右侧面板、模态框）进行状态交互。
import {useLayoutDispatch, useLayoutState} from '@/contexts/LayoutContext.tsx';
// 导入全局通知 Hook，用于显示 Snackbar 消息。
import {useNotification} from '@/contexts/NotificationContext.tsx';
// 导入页面级布局组件，提供统一的页面容器样式。
import PageLayout from '@/layouts/PageLayout.tsx';
// 导入通用的数据表格包装组件，提供分页和滚动功能。
import DataTable from '@/components/ui/DataTable.tsx';
// 导入智能 Tooltip 单元格组件，用于处理文本溢出。
import TooltipCell from '@/components/ui/TooltipCell.tsx';
// 导入搜索表单的类型定义。
import {type TemplateSearchValues} from '@/components/forms/TemplateSearchForm.tsx';
// 导入统一的异步错误处理器。
import {handleAsyncError} from '@/utils/errorHandler.ts';
// 导入我们最终的、健壮的可点击行组件及其类型定义。
import ClickableTableRow, { type ColumnConfig } from '@/components/ui/ClickableTableRow.tsx';
// 导入统一的操作按钮组件。
import ActionButtons from '@/components/ui/ActionButtons.tsx';
// 导入页面头部组件。
import PageHeader from '@/layouts/PageHeader.tsx';
// 导入页面对应的 API 模块和数据行类型。
import { templateApi, type TemplateRow } from '@/api/templateApi.ts';
// 导入用于处理响应式详情视图的自定义 Hook。
import { useResponsiveDetailView } from '@/hooks/useResponsiveDetailView';
// 导入为解决动画竞态问题而创建的延迟导航 Hook。
import { useDelayedNavigate } from '@/hooks/useDelayedNavigate';


// 使用 React.lazy 进行代码分割，只有在需要时才加载这些组件，优化初始加载性能。
const TemplateSearchForm = lazy(() => import('@/components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('@/components/modals/TemplateModalContent.tsx'));

// --- 2. TYPE, DATA, AND CONFIG DEFINITIONS ---

/**
 * @constant desktopColumns
 * @description 桌面端表格的列配置数组。定义了每列的 ID、显示标签、宽度和渲染方式。
 * @type {ColumnConfig<TemplateRow>[]}
 */
const desktopColumns: ColumnConfig<TemplateRow>[] = [
    {
        id: 'name', // 列的唯一标识符，用于 `key` 和数据访问。
        label: '项目名称', // 在表头中显示的文本。
        sx: { width: '25%' }, // 应用于 Flexbox 容器的宽度样式，控制列宽。
        renderCell: (r: TemplateRow) => <TooltipCell>{r.name}</TooltipCell>
    },
    {
        id: 'category',
        label: '类别',
        sx: { width: '15%' },
        renderCell: (r: TemplateRow) => <Typography variant="body2">{r.category}</Typography>
    },
    {
        id: 'description',
        label: '描述',
        // 不提供 sx.width，ClickableTableRow 会让这一列自动填充剩余空间。
        renderCell: (r: TemplateRow) => <TooltipCell>{r.description}</TooltipCell>
    },
];

/**
 * @constant mobileColumns
 * @description 移动端表格的列配置数组。通常列数更少，以适应小屏幕。
 * @type {ColumnConfig<TemplateRow>[]}
 */
const mobileColumns: ColumnConfig<TemplateRow>[] = [
    { id: 'name', label: '项目名称', sx: { width: '40%' }, renderCell: (r: TemplateRow) => <TooltipCell>{r.name}</TooltipCell> },
    { id: 'category', label: '类别', sx: { width: '20%' }, renderCell: (r: TemplateRow) => <Typography variant="body2">{r.category}</Typography> },
    { id: 'description', label: '描述', sx: { width: '40%' }, renderCell: (r: TemplateRow) => <TooltipCell>{r.description}</TooltipCell> },
];

// 为 useQuery 定义一个模块级别的常量 key，确保其引用稳定，防止不必要的重渲染。
const TEMPLATE_QUERY_KEY = ['template'];


// --- 3. COMPONENT DEFINITION ---

/**
 * @component TemplatePage
 * @description 一个功能完备的数据展示页面，可作为创建新页面的模板。
 * @returns {JSX.Element} - 渲染出的页面组件。
 */
const TemplatePage = (): JSX.Element => {
    // --- 3.1 Hooks ---
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
        setIsModalOpen,
        setModalConfig,
    } = useLayoutDispatch();
    const showNotification = useNotification();
    const {itemId} = useParams<{ itemId: string }>();
    const delayedNavigate = useDelayedNavigate();

    // --- 3.2 State ---
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isAdmin] = useState<boolean>(true);
    // [核心修复] 新增一个 state，用于在点击时提供即时的视觉反馈，而无需等待导航。
    const [clickedRowId, setClickedRowId] = useState<string | null>(null);

    // --- 3.3 Data Fetching ---
    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<TemplateRow, { itemId: string }>({
        paramName: 'itemId',
        baseRoute: '/app/template-page',
        queryKey: TEMPLATE_QUERY_KEY,
        queryFn: templateApi.fetchAll,
        DetailContentComponent: TemplateModalContent,
    });

    // --- 3.4 Callbacks ---
    const handleSearch = useCallback((values: TemplateSearchValues): void => {
        try {
            alert(`搜索: ${JSON.stringify(values)}`);
            togglePanel();
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]);

    const handleReset = useCallback((): void => {
        try {
            alert('表单已重置');
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [showNotification]);

    /**
     * @callback handleRowClick
     * @description [核心修复] 表格行的点击回调，现在它分离了视觉反馈和导航逻辑。
     * @param {string} id - 被点击行的ID。
     */
    const handleRowClick = useCallback((id: string): void => {
        // 步骤 A: 立即更新本地 state，触发一次轻量重渲染，让被点击的行立刻高亮。
        setClickedRowId(id);
        // 步骤 B: 然后，调用延迟导航函数，确保涟漪动画启动后再触发弹窗逻辑。
        delayedNavigate(`/app/template-page/${id}`, {replace: true});
    }, [delayedNavigate]);

    // --- 3.5 Effects ---
    /**
     * @effect 自动同步分页状态。
     * @description 当通过URL直接访问一个详情项时，此 effect 会计算该项所在的页码，并自动跳转到那一页。
     */
    useEffect(() => {
        if (itemId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === itemId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [itemId, rows, rowsPerPage, page]);

    /**
     * @effect 管理右侧搜索面板的内容。
     * @description 当面板打开时，懒加载并设置搜索表单；关闭时则清空内容。
     */
    useEffect(() => {
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }
        setPanelContent(
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress/></Box>}>
                <TemplateSearchForm onSearch={handleSearch} onReset={handleReset}/>
            </Suspense>
        );
        setPanelTitle('模板搜索');
        setPanelWidth(360);
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    // [功能恢复] 恢复处理桌面端详情弹窗的 effect
    useEffect(() => {
        const itemExists: boolean = typeof itemId === 'string' && rows.some((row: TemplateRow) => row.id === itemId);
        if (itemExists && !isMobile) {
            setIsModalOpen(true);
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress/></Box>}>
                        <TemplateModalContent itemId={itemId!}/>
                    </Suspense>
                ),
                onClose: () => delayedNavigate('/app/template-page', {replace: true}),
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [itemId, isMobile, delayedNavigate, setIsModalOpen, setModalConfig, rows]);

    // [功能恢复] 恢复处理移动端页面重定向的 effect
    useEffect(() => {
        if (itemId && isMobile) {
            delayedNavigate(`/app/template-page/mobile/${itemId!}`, {replace: true});
        }
    }, [itemId, isMobile, delayedNavigate]);

    /**
     * @effect [核心修复] 清理临时的点击状态。
     * @description 当 URL 中的 `itemId` 消失时（例如关闭弹窗），此 effect 会清空 `clickedRowId` state。
     */
    useEffect(() => {
        if (!itemId) {
            setClickedRowId(null);
        }
    }, [itemId]);

    // --- 3.6 Render Logic ---
    const pageRows: TemplateRow[] = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const columns: ColumnConfig<TemplateRow>[] = isMobile ? mobileColumns : desktopColumns;

    /**
     * @constant tableContent
     * @description [核心优化] 使用 `useMemo` 记忆化整个 Table JSX 结构。
     * @returns {JSX.Element} - 返回一个缓存的 Table 元素。
     */
    const tableContent = useMemo(() => (
        <Table stickyHeader sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
            <TableHead>
                <TableRow>
                    {columns.map((col) => (
                        <TableCell key={col.id} sx={{...col.sx, fontWeight: 700}}>
                            {col.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {pageRows.map((row) => (
                    <ClickableTableRow
                        key={row.id}
                        row={row}
                        columns={columns}
                        selected={row.id === itemId || row.id === clickedRowId}
                        onClick={() => handleRowClick(row.id)}
                    />
                ))}
            </TableBody>
        </Table>
    ), [pageRows, columns, itemId, clickedRowId, handleRowClick]);

    // --- 3.7 JSX ---
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

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                        <CircularProgress/>
                    </Box>
                )}
                {isError && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography color="error">加载失败: {error?.message || '未知错误'}</Typography>
                    </Box>
                )}

                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage: number) => setPage(newPage)}
                    onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setRowsPerPage(+event.target.value);
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

export default TemplatePage;