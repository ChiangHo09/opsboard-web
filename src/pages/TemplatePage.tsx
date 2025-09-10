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
 *      - **保留分页**: 完全保留了 Material-UI 的分页器功能，用户体验与优化前完全一致。
 *      - **无缝虚拟化**: 通过一个智能的 `<DataTable>` 容器，在不改变页面代码结构的前提下，为表格主体（tbody）“注入”了虚拟滚动能力，解决了长列表的性能瓶颈。
 * - 3. **健壮的交互体验**: 采用了 `colSpan` + `Flexbox` 的高级渲染模式，通过 `<ClickableTableRow>` 组件，实现了整行点击、涟漪效果、行高亮和智能悬浮提示，并从根本上解决了布局塌陷问题。
 * - 4. **响应式布局**: 自动在桌面端（多列+弹窗详情）和移动端（少列+页面详情）之间切换，提供最优体验。
 * - 5. **URL驱动状态**: 详情视图（桌面端弹窗或移动端详情页）的打开状态完全由URL参数驱动，支持通过链接直接分享和访问。
 * - 6. **懒加载集成**: 右侧的搜索面板和弹窗内容都通过 `React.lazy` 和 `Suspense` 实现按需加载，优化了初始加载性能。
 * - 7. **全局状态集成**: 与 `LayoutContext` 深度集成，用于控制和管理右侧搜索面板和全局模态框。
 * - 8. **统一错误处理与状态显示**: 为所有异步操作提供了统一的加载（Loading）和错误（Error）状态显示。
 *
 * @modification
 *   - [布局恢复与性能集成]：重构了页面以适配最终版的“注入式”虚拟化 `<DataTable>` 组件。
 *   - [核心改变]：
 *     - **恢复了分页逻辑**: 重新使用 `page` 和 `rowsPerPage` state 来计算 `pageRows`，将分页后的数据传递给表格。
 *     - **恢复了原始DataTable用法**: 现在向 `<DataTable>` 传递分页相关的 props 和一个完整的 `<Table>` 结构作为 `children`，与优化前的用法完全一致。
 *     - **实现了透明的性能优化**: 虚拟化现在由 `<DataTable>` 在内部自动处理，页面本身无需关心其实现细节，做到了UI保真和性能优化的统一。
 *   - [注释完善]：根据要求，为整个文件添加了极其详尽的、教学级别的注释，使其成为一个合格的“终极模板”。
 */

// --- 1. IMPORTS ---
// 导入 React 及其核心 Hooks，用于组件生命周期管理和状态。
import {useEffect, useCallback, useState, lazy, Suspense, type JSX, type ChangeEvent} from 'react';
// 导入 React Router 的 Hooks，用于程序化导航和读取 URL 参数。
import {useNavigate, useParams} from 'react-router-dom';
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
// 导入我们最终的、带分页和注入式虚拟化功能的数据表格容器。
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
import { templateApi, type TemplateRow } from '@/api/templateApi';
// 导入用于处理响应式详情视图的自定义 Hook。
import { useResponsiveDetailView } from '@/hooks/useResponsiveDetailView';


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
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayoutDispatch();
    const showNotification = useNotification();
    const navigate = useNavigate();
    const {itemId} = useParams<{ itemId: string }>();

    // --- 3.2 State ---
    // [恢复] 重新引入分页 state，用于控制客户端分页。
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isAdmin] = useState<boolean>(true);

    // --- 3.3 Data Fetching ---
    // 使用自定义 Hook 获取数据，并处理加载和错误状态。
    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<TemplateRow, { itemId: string }>({
        paramName: 'itemId',
        baseRoute: '/app/template-page',
        queryKey: TEMPLATE_QUERY_KEY,
        queryFn: templateApi.fetchAll,
        DetailContentComponent: TemplateModalContent,
    });

    // --- 3.4 Callbacks ---
    /**
     * @callback handleSearch
     * @description 搜索表单的提交回调。
     * @param {TemplateSearchValues} values - 表单数据。
     */
    const handleSearch = useCallback((values: TemplateSearchValues): void => {
        try {
            alert(`搜索: ${JSON.stringify(values)}`);
            togglePanel();
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]);

    /**
     * @callback handleReset
     * @description 搜索表单的重置回调。
     */
    const handleReset = useCallback((): void => {
        try {
            alert('表单已重置');
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [showNotification]);

    /**
     * @callback handleRowClick
     * @description 表格行的点击回调，用于导航到详情视图。
     * @param {string} id - 被点击行的ID。
     */
    const handleRowClick = useCallback((id: string): void => {
        navigate(`/app/template-page/${id}`, {replace: true});
    }, [navigate]);

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

    // --- 3.6 Render Logic ---
    // [恢复] 根据分页状态，从总数据 `rows` 中计算出当前页应显示的数据 `pageRows`。
    const pageRows: TemplateRow[] = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    // 根据屏幕尺寸动态选择列配置。
    const columns: ColumnConfig<TemplateRow>[] = isMobile ? mobileColumns : desktopColumns;

    // --- 3.7 JSX ---
    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 页面头部，包含标题和操作按钮 */}
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

            {/* 表格容器，占据剩余空间并处理加载/错误状态 */}
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

                {/*
                  [恢复] 使用原始的 DataTable 用法。
                  我们向它传递分页所需的所有 props，以及一个完整的 <Table> 结构作为 children。
                  DataTable 内部会自动对 <TableBody> 进行虚拟化，对我们来说是透明的。
                */}
                <DataTable
                    // --- 分页 Props ---
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage: number) => setPage(newPage)}
                    onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setRowsPerPage(+event.target.value);
                        setPage(0);
                    }}
                    // --- 标签 Props ---
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    {/*
                      这里传入的 children 是一个标准的、完整的 Table 结构。
                      这正是我们想要恢复的、符合直觉的开发模式。
                    */}
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
                            {/*
                              我们在这里遍历的是分页后的 `pageRows`，而不是全部的 `rows`。
                              这确保了 DOM 中只存在当前页的节点，然后 DataTable 的虚拟化
                              会进一步优化这部分节点的渲染。
                            */}
                            {pageRows.map((row) => (
                                <ClickableTableRow
                                    key={row.id}
                                    row={row}
                                    columns={columns}
                                    selected={row.id === itemId}
                                    onClick={() => handleRowClick(row.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default TemplatePage;