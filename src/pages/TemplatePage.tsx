/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个功能完备的【模板页面】。它是一个高级的数据驱动视图，
 * 集成了多种现代React应用的常见模式和功能，旨在成为创建新页面的“终极模板”。
 *
 * 实现的核心功能包括：
 * - 1. **数据展示**: 使用 Material-UI 的 `Table` 组件，在一个可分页的 `DataTable` 容器中展示模拟数据。
 * - 2. **固定列**: 实现了表格首列在水平滚动时固定的效果，提升了宽表格的可用性。
 * - 3. **懒加载集成**: 右侧的搜索面板 (`TemplateSearchForm`) 和弹窗内容 (`TemplateModalContent`)
 *      都通过 `React.lazy` 和 `Suspense` 实现按需加载，优化了初始加载性能。
 * - 4. **响应式详情视图**:
 *      - **桌面端**: 点击表格行时，在页面上以模态框（Modal）形式打开详情。
 *      - **移动端**: 点击表格行时，自动重定向到一个专用的移动端详情页。
 * - 5. **URL驱动状态**: 详情视图的打开状态完全由URL参数（`:itemId`）驱动，支持通过链接直接分享和访问特定项的详情。
 * - 6. **全局状态集成**: 与 `LayoutContext` 深度集成，用于控制和管理右侧搜索面板的开关、标题和内容。
 * - 7. **统一错误处理**: 为所有可能在用户交互中出错的回调函数（如 `handleSearch`）添加了 `try...catch` 块，
 *      并调用统一的错误处理机制，提升了应用的健壮性。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 * - 【注释完善】为整个文件添加了极其详尽的、教学级别的注释。
 */

// --- 1. IMPORTS ---
// 导入 React 及其核心 Hooks。
import {useEffect, useCallback, useState, lazy, Suspense, type JSX} from 'react';
// 导入 React Router 的 Hooks，用于导航和读取URL参数。
import {useNavigate, useParams} from 'react-router-dom';
// 导入所有需要的 Material-UI 组件。
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// 导入全局上下文的 Hooks，用于与主布局进行状态交互。
import {useLayoutDispatch, useLayoutState} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
// 导入子组件和工具。
import PageLayout from '@/layouts/PageLayout.tsx';
import DataTable from '@/components/ui/DataTable.tsx';
import TooltipCell from '@/components/ui/TooltipCell.tsx';
import {type TemplateSearchValues} from '@/components/forms/TemplateSearchForm.tsx';
import {handleAsyncError} from '@/utils/errorHandler.ts';

// 使用 React.lazy 进行代码分割，只有在需要时才加载这些组件。
const TemplateSearchForm = lazy(() => import('@/components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('@/components/modals/TemplateModalContent.tsx'));

// --- 2. TYPE & DATA DEFINITIONS ---

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

// --- 3. COMPONENT DEFINITION ---

/**
 * @component TemplatePage
 * @description 一个功能完备的数据展示页面，可作为创建新页面的模板。
 * @returns {JSX.Element} - 渲染出的页面组件。
 */
const TemplatePage = (): JSX.Element => {
    // --- 3.1 Hooks ---
    // 从全局布局上下文中获取状态和 dispatch 函数。
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel, setPanelContent, setPanelTitle, setPanelWidth,
        setIsModalOpen, setModalConfig,
    } = useLayoutDispatch();
    const showNotification = useNotification(); // 获取全局通知函数。
    const navigate = useNavigate(); // 获取用于程序化导航的函数。
    const {itemId} = useParams<{ itemId: string }>(); // 从URL中获取 :itemId 参数。

    // --- 3.2 State ---
    // 管理表格分页的状态。
    const [page, setPage] = useState(0); // 当前页码（从0开始）。
    const [rowsPerPage, setRowsPerPage] = useState(10); // 每页显示的行数。
    // 管理搜索面板内容的加载状态，确保面板动画和内容加载的协调。
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

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
            togglePanel(); // 关闭搜索面板。
        } catch (e) {
            // 使用统一的错误处理机制捕获任何意外错误。
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]); // 依赖项

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

    // Effect 1: 当全局面板状态为打开时，同步本地的面板内容加载状态。
    // 这解决了从其他页面跳转而来时，面板已打开但内容不加载的问题。
    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]); // 依赖于全局 isPanelOpen 状态。

    // Effect 2: 核心响应式逻辑 - 处理桌面端弹窗的显示。
    useEffect(() => {
        // 检查URL中是否存在 itemId，并且该ID对应的数据确实存在。
        const itemExists = itemId && templateRows.some(row => row.id === itemId);

        // 如果数据存在且当前是桌面视图...
        if (itemExists && !isMobile) {
            // ...则打开全局模态框。
            setIsModalOpen(true);
            // ...并配置模态框的内容和关闭行为。
            setModalConfig({
                content: (
                    // 使用 Suspense 包裹懒加载的组件，提供加载中的后备UI。
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
                // 当用户关闭模态框时，导航回不带参数的基础路径。
                onClose: () => navigate('/app/template-page', {replace: true}),
            });
        } else {
            // 否则（如切换到移动端或itemId无效），确保模态框是关闭的。
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [itemId, isMobile, navigate, setIsModalOpen, setModalConfig]); // 依赖项

    // Effect 3: 核心响应式逻辑 - 处理移动端的页面重定向。
    useEffect(() => {
        // 如果URL中有 itemId 且当前是移动端视图...
        if (itemId && isMobile) {
            // ...则重定向到专用的移动端详情页。
            navigate(`/app/template-page/mobile/${itemId}`, {replace: true});
        }
    }, [itemId, isMobile, navigate]);

    // Effect 4: 负责在需要时加载搜索面板的内容。
    useEffect(() => {
        // 如果不需要设置面板内容，则直接返回。
        if (!isPanelContentSet) return;
        // 使用 setTimeout 0 毫秒将状态更新推迟到下一个事件循环，
        // 确保面板的展开动画能够平滑地进行，然后再加载内容。
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
        // 返回一个清理函数，当组件卸载或依赖项变化时，清理副作用。
        return () => {
            clearTimeout(timerId);
            // 在组件卸载时清空面板内容，避免在其他页面上残留。
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    // --- 3.5 Render Logic ---
    // 根据当前分页状态，从总数据中计算出当前页应显示的数据。
    const pageRows = templateRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // --- 3.6 JSX ---
    return (
        <PageLayout sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            {/* 页面顶部区域：标题和搜索按钮 */}
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0}}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>模板页面</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon/>} onClick={handleTogglePanel} sx={{
                    height: 42, borderRadius: '50px', textTransform: 'none', px: 3,
                    bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': {bgcolor: 'app.button.hover'}
                }}>
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                </Button>
            </Box>

            {/* 数据表格区域，flexGrow: 1 使其占据所有剩余空间。 */}
            <Box sx={{flexGrow: 1, overflow: 'hidden'}}>
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]} // 可选的每页行数。
                    count={templateRows.length} // 总行数，用于计算总页数。
                    rowsPerPage={rowsPerPage} // 当前每页行数。
                    page={page} // 当前页码。
                    onPageChange={(_, newPage) => setPage(newPage)} // 页码改变时的回调。
                    onRowsPerPageChange={event => { // 每页行数改变时的回调。
                        setRowsPerPage(+event.target.value);
                        setPage(0); // 改变每页行数时，重置到第一页。
                    }}
                    labelRowsPerPage="每页行数:" // 自定义文本。
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`} // 自定义文本。
                >
                    <Table stickyHeader aria-label="模板数据表"
                           sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%', minWidth: 650}}>
                        <TableHead>
                            <TableRow>
                                {/* 表格头：固定列 */}
                                <TableCell sx={{
                                    width: '25%',
                                    position: 'sticky', // 关键属性：使单元格“粘性”定位。
                                    left: 0, // 粘在左侧。
                                    zIndex: 120, // 确保在其他滚动的单元格之上。
                                    bgcolor: 'background.paper', // 需要设置背景色以覆盖下方内容。
                                    fontWeight: 700
                                }}>项目名称</TableCell>
                                <TableCell sx={{width: '15%', fontWeight: 700}}>类别</TableCell>
                                <TableCell sx={{width: '60%', fontWeight: 700}}>描述</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(row => (
                                // 使用 ButtonBase 将整行变为可点击区域。
                                <ButtonBase
                                    key={row.id}
                                    component={TableRow} // 渲染为一个 TableRow。
                                    onClick={() => navigate(`/app/template-page/${row.id}`, {replace: true})}
                                    sx={{display: 'table-row', width: '100%', position: 'relative'}}
                                >
                                    {/* 表格行：固定列 */}
                                    <TooltipCell sx={{
                                        position: 'sticky', left: 0, zIndex: 100,
                                        bgcolor: 'background.paper',
                                        'tr:hover &': {bgcolor: 'action.hover'} // 处理悬停效果。
                                    }}>
                                        {row.name}
                                    </TooltipCell>
                                    <TableCell sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>
                                        {row.category}
                                    </TableCell>
                                    <TooltipCell sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>
                                        {row.description}
                                    </TooltipCell>
                                </ButtonBase>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default TemplatePage;