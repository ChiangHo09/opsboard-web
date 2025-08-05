/**
 * @file src/pages/TemplatePage.tsx
 * @description
 * 此文件定义了一个功能完备的【模板页面】。它是一个高级的数据驱动视图，
 * 集成了多种现代React应用的常见模式和功能，旨在成为创建新页面的“终极模板”。
 *
 * @features
 * 实现的核心功能包括：
 * - 1. **配置驱动的UI**: 表格的结构（列、顺序、样式、渲染方式）由 `desktopColumns` 和 `mobileColumns` 配置数组驱动，彻底消除了重复代码，使维护变得极其简单。
 * - 2. **数据展示**: 使用 Material-UI 的 `<Table>` 组件，在一个可分页的 `DataTable` 容器中展示模拟数据。
 * - 3. **响应式布局**:
 *      - **桌面端**: 包含一个内容丰富的表格，并支持“粘性”固定列。
 *      - **移动端**: 自动切换为列数更少、布局更紧凑的表格视图。
 * - 4. **统一的交互体验**:
 *      - **整行点击**: 通过统一的 `<ClickableTableRow>` 组件，每一行都是一个完整的可点击区域。
 *      - **行高亮**: 支持通过 URL 参数 (`:itemId`) 控制特定行的高亮显示。
 *      - **悬停效果**: 鼠标悬停在行上时，有统一的背景色变化反馈。
 * - 5. **健壮的渲染机制**:
 *      - **加载状态**: 在模拟数据获取时，会显示一个覆盖整个表格的半透明加载指示器。
 *      - **错误状态**: 在数据加载失败时，会显示清晰的错误提示信息。
 * - 6. **懒加载集成**: 右侧的搜索面板 (`TemplateSearchForm`) 和弹窗内容 (`TemplateModalContent`) 都通过 `React.lazy` 和 `Suspense` 实现按需加载，优化了初始加载性能。
 * - 7. **URL驱动状态**: 详情视图的打开状态完全由URL参数驱动，支持通过链接直接分享和访问特定项的详情。
 * - 8. **全局状态集成**: 与 `LayoutContext` 深度集成，用于控制和管理右侧搜索面板和全局模态框。
 * - 9. **统一错误处理**: 为所有可能在用户交互中出错的回调函数添加了 `try...catch` 块，并调用统一的错误处理机制。
 * - 10. **统一操作按钮**: 页面顶部的操作按钮由统一的 `<ActionButtons>` 组件提供，支持权限控制和响应式换行。
 *
 * @modification
 * - 【核心重构】引入了“配置驱动UI”模式，使用 `columns` 数组来动态渲染表格，彻底消除了桌面端和移动端视图的重复渲染逻辑。
 * - 【注释完善】根据要求，为整个文件添加了极其详尽的、教学级别的注释。
 * - 【架构统一】将此模板页面的布局和功能，与应用内其他页面（如 Servers.tsx）的最终最佳实践完全对齐。
 */

// --- 1. IMPORTS ---
// 导入 React 及其核心 Hooks。
import {useEffect, useCallback, useState, lazy, Suspense, type JSX, type ChangeEvent} from 'react';
// 导入 React Router 的 Hooks，用于导航和读取URL参数。
import {useNavigate, useParams} from 'react-router-dom';
// 导入所有需要的 Material-UI 组件。
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
// 导入全局上下文的 Hooks，用于与主布局进行状态交互。
import {useLayoutDispatch, useLayoutState} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
// 导入子组件和工具。
import PageLayout from '@/layouts/PageLayout.tsx';
import DataTable from '@/components/ui/DataTable.tsx';
import TooltipCell from '@/components/ui/TooltipCell.tsx';
import {type TemplateSearchValues} from '@/components/forms/TemplateSearchForm.tsx';
import {handleAsyncError} from '@/utils/errorHandler.ts';
// 导入我们最终的、健壮的可点击行组件和操作按钮组组件。
import ClickableTableRow from '@/components/ui/ClickableTableRow.tsx';
import ActionButtons from '@/components/ui/ActionButtons.tsx';


// 使用 React.lazy 进行代码分割，只有在需要时才加载这些组件。
const TemplateSearchForm = lazy(() => import('@/components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('@/components/modals/TemplateModalContent.tsx'));

// --- 2. TYPE, DATA, AND CONFIG DEFINITIONS ---

/**
 * @interface TemplateRow
 * @description 定义了表格中单行数据的类型结构。
 */
interface TemplateRow {
    id: string;
    name: string;
    category: 'A' | 'B' | 'C';
    description: string;
}

/**
 * @function createData
 * @description 一个创建模拟数据的辅助函数，确保数据结构符合 TemplateRow 接口。
 * @param {string} id - 唯一ID。
 * @param {string} name - 项目名称。
 * @param {TemplateRow['category']} category - 类别。
 * @param {string} description - 描述。
 * @returns {TemplateRow} - 一个符合类型定义的行数据对象。
 */
const createData = (id: string, name: string, category: TemplateRow['category'], description: string): TemplateRow => ({
    id, name, category, description,
});

// 定义一个长文本常量，用于测试表格单元格的文本溢出和 Tooltip 功能。
const LONG_TEXT = '这是一个非常长的描述，用于演示当文本内容超出单元格宽度时，TooltipCell 组件是如何自动截断文本并提供悬停提示的。';

// 创建模拟的表格数据数组。
const templateRows: TemplateRow[] = [
    createData('item-001', '模板项目 Alpha', 'A', '这是 Alpha 项目的简短描述。'),
    createData('item-002', '模板项目 Beta', 'B', LONG_TEXT),
    createData('item-003', '模板项目 Gamma', 'C', '这是 Gamma 项目的简短描述。'),
    ...Array.from({length: 20}).map((_, i) =>
        createData(`item-${i + 4}`, `模板项目 ${i + 4}`, ['A', 'B', 'C'][i % 3] as TemplateRow['category'], `这是第 ${i + 4} 条项目的描述。`)
    ),
];

// 【核心重构】为桌面端定义列配置数组
const desktopColumns = [
    {
        id: 'name', // 列的唯一标识符
        label: '项目名称', // 在表头中显示的文本
        sx: { // 应用于表头 <TableCell> 的样式
            width: '25%',
            position: 'sticky', // 关键属性：使单元格“粘性”定位
            left: 0, // 粘在左侧
            zIndex: 1, // zIndex 确保在滚动时能覆盖其他列
            bgcolor: 'background.paper', // 需要背景色以覆盖下方滚过的内容
            fontWeight: 700
        },
        // 定义如何渲染该列的单元格，接收一整行数据作为参数
        renderCell: (r: TemplateRow, isLoading: boolean) => (
            <TooltipCell key="name" sx={{
                // 单元格也需要保持粘性定位
                position: 'sticky',
                left: 0,
                // 当数据加载时，背景色需要与表头同步，否则会透明
                bgcolor: 'background.paper',
                // 关键修复：加载时 zIndex 降级，以被遮罩层覆盖
                zIndex: isLoading ? 'auto' : 1,
            }}>
                {r.name}
            </TooltipCell>
        )
    },
    {
        id: 'category',
        label: '类别',
        sx: {width: '15%', fontWeight: 700},
        // 对于不需要 Tooltip 的简单文本，直接使用 TableCell
        renderCell: (r: TemplateRow) => <TableCell key="category">{r.category}</TableCell>
    },
    {
        id: 'description',
        label: '描述',
        sx: {width: '60%', fontWeight: 700},
        renderCell: (r: TemplateRow) => <TooltipCell key="desc">{r.description}</TooltipCell>
    },
];

// 【核心重构】为移动端定义列配置数组
const mobileColumns = [
    {
        id: 'name',
        label: '项目名称',
        sx: {width: '40%', fontWeight: 700},
        renderCell: (r: TemplateRow) => <TooltipCell key="name">{r.name}</TooltipCell>
    },
    {
        id: 'category',
        label: '类别',
        sx: {width: '20%', fontWeight: 700},
        renderCell: (r: TemplateRow) => <TableCell key="category">{r.category}</TableCell>
    },
    {
        id: 'description',
        label: '描述',
        sx: {width: '40%', fontWeight: 700},
        renderCell: (r: TemplateRow) => <TooltipCell key="desc">{r.description}</TooltipCell>
    },
];


// --- 3. COMPONENT DEFINITION ---

/**
 * @component TemplatePage
 * @description 一个功能完备的数据展示页面，可作为创建新页面的模板。
 * @returns {JSX.Element} - 渲染出的页面组件。
 */
const TemplatePage = (): JSX.Element => {
    // --- 3.1 Hooks ---
    // 从全局布局上下文中获取状态和 dispatch 函数。
    const {isMobile, isPanelOpen} = useLayoutState(); // 获取响应式状态和面板打开状态。
    const {
        togglePanel, // 函数：切换右侧面板的显示/隐藏。
        setPanelContent, // 函数：设置右侧面板的 React 内容。
        setPanelTitle, // 函数：设置右侧面板的标题。
        setPanelWidth, // 函数：设置右侧面板的宽度。
        setIsModalOpen, // 函数：设置全局模态框（弹窗）的打开/关闭状态。
        setModalConfig, // 函数：配置全局模态框的内容和关闭回调。
    } = useLayoutDispatch();
    const showNotification = useNotification(); // 获取全局通知函数，用于显示 snackbar。
    const navigate = useNavigate(); // 获取用于程序化导航的函数。
    const {itemId} = useParams<{ itemId: string }>(); // 从URL中获取 :itemId 参数，例如 /app/template-page/item-001。

    // --- 3.2 State ---
    // 管理表格分页的状态。
    const [page, setPage] = useState(0); // 当前页码（从0开始）。
    const [rowsPerPage, setRowsPerPage] = useState(10); // 每页显示的行数。
    // 管理搜索面板内容的加载状态，确保面板动画和内容加载的协调。
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);
    // 模拟数据获取的加载和错误状态。
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    // 模拟管理员权限状态。
    const [isAdmin] = useState(true); // 您可以改为 false 来测试编辑按钮的隐藏效果。

    // --- 3.3 Callbacks ---
    // 使用 useCallback 来记忆回调函数，避免在子组件中引起不必要的重渲染。

    /**
     * @callback handleSearch
     * @description 传递给搜索表单的搜索处理器。
     * @param {TemplateSearchValues} values - 从搜索表单接收到的数据。
     */
    const handleSearch = useCallback((values: TemplateSearchValues) => {
        try {
            // 在真实应用中，这里会执行API调用或数据筛选逻辑。
            alert(`搜索: ${JSON.stringify(values)}`);
            togglePanel(); // 搜索后关闭搜索面板。
        } catch (e) {
            // 使用统一的错误处理机制捕获任何意外错误。
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]); // 依赖项：确保函数在依赖变化时才重新创建。

    /**
     * @callback handleReset
     * @description 传递给搜索表单的重置处理器。
     */
    const handleReset = useCallback(() => {
        try {
            alert('表单已重置');
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [showNotification]);

    /**
     * @function handleTogglePanel
     * @description 处理搜索按钮的点击事件，用于打开/关闭右侧面板。
     */
    const handleTogglePanel = (): void => {
        // 首次打开时，设置标志位以触发面板内容的加载。
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel(); // 调用全局函数来切换面板的开关状态。
    };

    // --- 3.4 Effects ---
    // 使用 useEffect 来处理副作用，如响应 props 或 state 的变化。

    // Effect 1: 模拟数据获取过程。
    useEffect(() => {
        setIsLoading(true); // 开始时，设置为加载状态。
        setIsError(false); // 重置错误状态。
        const timer = setTimeout(() => {
            // 模拟成功或失败
            if (Math.random() > 0.1) { // 90% 概率成功
                setIsLoading(false);
            } else { // 10% 概率失败
                setIsLoading(false);
                setIsError(true);
            }
        }, 1500); // 模拟1.5秒的网络延迟。
        return () => clearTimeout(timer); // 组件卸载时清除定时器，防止内存泄漏。
    }, []); // 空依赖数组表示此 effect 只在组件首次挂载时运行一次。

    // Effect 2: 当全局面板状态为打开时，同步本地的面板内容加载状态。
    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]); // 依赖于 isPanelOpen。

    // Effect 3: 核心响应式逻辑 - 处理桌面端弹窗的显示。
    useEffect(() => {
        const itemExists = itemId && templateRows.some(row => row.id === itemId);
        // 仅当 itemId 存在、数据中能找到对应项且当前不是移动端视图时，才打开弹窗。
        if (itemExists && !isMobile) {
            setIsModalOpen(true); // 打开全局弹窗。
            setModalConfig({ // 配置弹窗内容。
                content: (
                    // 使用 Suspense 包裹懒加载的组件，提供加载中的后备 UI。
                    <Suspense fallback={<Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><CircularProgress/></Box>}>
                        <TemplateModalContent itemId={itemId}/>
                    </Suspense>
                ),
                // 定义关闭弹窗时的回调，通常是导航回基础 URL。
                onClose: () => navigate('/app/template-page', {replace: true}),
            });
        } else {
            // 如果条件不满足，确保弹窗是关闭的。
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [itemId, isMobile, navigate, setIsModalOpen, setModalConfig]); // 依赖于这些值的变化。

    // Effect 4: 核心响应式逻辑 - 处理移动端的页面重定向。
    useEffect(() => {
        // 如果 URL 中有 itemId 且当前是移动端视图，则重定向到专门的移动详情页。
        if (itemId && isMobile) {
            navigate(`/app/template-page/mobile/${itemId}`, {replace: true});
        }
    }, [itemId, isMobile, navigate]);

    // Effect 5: 负责在需要时加载搜索面板的内容。
    useEffect(() => {
        if (!isPanelContentSet) return; // 如果不需要设置内容，则提前返回。
        // 使用 setTimeout(..., 0) 将内容设置推迟到下一个事件循环，确保面板动画流畅。
        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <TemplateSearchForm onSearch={handleSearch} onReset={handleReset}/>
                </Suspense>
            );
            setPanelTitle('模板搜索');
            setPanelWidth(360);
        }, 0);
        // 返回一个清理函数，在 effect 重新运行或组件卸载时，清空面板内容。
        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    // --- 3.5 Render Logic ---
    // 根据当前分页状态，从总数据中计算出当前页应显示的数据。
    const pageRows = templateRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    // 根据 isMobile 状态选择要使用的列配置
    const columns = isMobile ? mobileColumns : desktopColumns;

    // --- 3.6 JSX ---
    return (
        <PageLayout>
            {/* 页面顶部区域：标题和操作按钮 */}
            <Box sx={{
                display: 'flex', // 启用 Flexbox 布局
                flexShrink: 0, // 防止此容器在 flex 布局中被压缩
                mb: 2, // margin-bottom，与下方表格的间距
                flexWrap: 'wrap', // 关键：允许内容在空间不足时换行
                justifyContent: 'space-between', // 将子元素沿主轴（水平）分散对齐
                alignItems: 'center', // 将子元素沿交叉轴（垂直）居中对齐
                gap: 2 // 子元素之间的间距
            }}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>模板页面</Typography>

                {/* 使用统一的 ActionButtons 组件 */}
                <ActionButtons
                    showEditButton={isAdmin} // prop: 根据权限显示/隐藏编辑按钮
                    onSearchClick={handleTogglePanel} // prop: 搜索按钮的点击回调
                    onEditClick={() => alert('编辑按钮被点击')} // prop: 编辑按钮的点击回调
                    onExportClick={() => alert('导出按钮被点击')} // prop: 导出按钮的点击回调
                />
            </Box>

            {/* 数据表格区域，flexGrow: 1 使其占据所有剩余垂直空间。 */}
            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {/* 加载状态遮罩层 */}
                {isLoading && (
                    <Box sx={{
                        position: 'absolute', inset: 0, display: 'flex',
                        justifyContent: 'center', alignItems: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 // zIndex 确保在表格内容之上
                    }}>
                        <CircularProgress/>
                    </Box>
                )}
                {/* 错误状态提示 */}
                {isError && (
                    <Box sx={{
                        position: 'absolute', inset: 0, display: 'flex',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Typography color="error">加载失败: 模拟网络错误</Typography>
                    </Box>
                )}
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]} // prop: 可选的每页行数
                    count={templateRows.length} // prop: 总行数，用于计算总页数
                    rowsPerPage={rowsPerPage} // prop: 当前每页行数
                    page={page} // prop: 当前页码
                    onPageChange={(_, newPage: number) => setPage(newPage)} // prop: 页码改变时的回调
                    onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // prop: 每页行数改变时的回调
                        setRowsPerPage(+event.target.value);
                        setPage(0); // 改变每页行数时，重置到第一页
                    }}
                    labelRowsPerPage="每页行数:" // prop: 自定义文本
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`} // prop: 自定义文本
                >
                    <Table
                        stickyHeader // prop: 使表头在垂直滚动时固定
                        aria-label="模板数据表"
                        sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
                        <TableHead>
                            <TableRow>
                                {/* 【核心重构】动态渲染表头 */}
                                {columns.map(col => (
                                    <TableCell key={col.id} sx={col.sx}>{col.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(row => (
                                // 使用 ClickableTableRow 替代旧的实现
                                <ClickableTableRow
                                    key={row.id} // prop: React 列表渲染的必要 key
                                    selected={row.id === itemId} // prop: 将高亮状态传递给组件
                                    onClick={() => navigate(`/app/template-page/${row.id}`, {replace: true})} // prop: 传递点击回调
                                >
                                    {/* 【核心重构】动态渲染单元格 */}
                                    {columns.map(col => col.renderCell(row, isLoading))}
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default TemplatePage;