/**
 * @file src/pages/TemplatePage.tsx
 * @description
 * 此文件定义了一个功能完备的【模板页面】。它是一个高级的数据驱动视图，
 * 集成了多种现代React应用的常见模式和功能，旨在成为创建新页面的“终极模板”。
 *
 * @features
 * 实现的核心功能包括：
 * - 1. **数据展示**: 使用 Material-UI 的 `<Table>` 组件，在一个可分页的 `DataTable` 容器中展示模拟数据。
 * - 2. **响应式布局**:
 *      - **桌面端**: 包含一个内容丰富的表格，并支持“粘性”固定列。
 *      - **移动端**: 自动切换为列数更少、布局更紧凑的表格视图。
 * - 3. **统一的交互体验**:
 *      - **整行点击**: 通过统一的 `<ClickableTableRow>` 组件，每一行都是一个完整的可点击区域。
 *      - **涟漪效果**: 点击行时，有标准的“水波纹”涟漪效果，且不会导致任何布局问题。
 *      - **行高亮**: 支持通过 URL 参数 (`:itemId`) 控制特定行的高亮显示。
 *      - **悬停效果**: 鼠标悬停在行上时，有统一的背景色变化反馈。
 * - 4. **健壮的渲染机制**:
 *      - **加载状态**: 在模拟数据获取时，会显示一个覆盖整个表格的半透明加载指示器。
 *      - **错误状态**: 在数据加载失败时，会显示清晰的错误提示信息。
 * - 5. **懒加载集成**: 右侧的搜索面板 (`TemplateSearchForm`) 和弹窗内容 (`TemplateModalContent`)
 *      都通过 `React.lazy` 和 `Suspense` 实现按需加载，优化了初始加载性能。
 * - 6. **URL驱动状态**: 详情视图的打开状态完全由URL参数驱动，支持通过链接直接分享和访问特定项的详情。
 * - 7. **全局状态集成**: 与 `LayoutContext` 深度集成，用于控制和管理右侧搜索面板和全局模态框。
 * - 8. **统一错误处理**: 为所有可能在用户交互中出错的回调函数添加了 `try...catch` 块，并调用统一的错误处理机制。
 *
 * @modification
 * - 【架构统一】将此模板页面的布局和功能，与应用内其他页面（如 Servers.tsx）的最终最佳实践完全对齐。
 * - 【注释完善】根据要求，为整个文件添加了极其详尽的、教学级别的注释。
 * - **核心变更**:
 *   1.  **引入操作按钮**: 新增了“编辑”、“导出”和“搜索”三个胶囊按钮，并统一了样式。
 *   2.  **实现响应式标题**: 应用了 `flex-wrap` 策略，使得标题和操作按钮在窄屏下能自动、优雅地换行。
 *   3.  **自定义边距**: 通过覆盖 `PageLayout` 的 `sx` 属性，为移动端视图设置了更紧凑的内边距。
 *   4.  **采用 `ClickableTableRow`**: 替换了旧的 `ButtonBase` 实现，从根本上解决了涟漪效果与 `table-layout: fixed` 的冲突，根除了布局塌陷和闪烁问题。
 *   5.  **模拟加载**: 新增了 `isLoading` 和 `isError` 状态，以完整演示加载和错误状态下的 UI 效果。
 */

// --- 1. IMPORTS ---
// 导入 React 及其核心 Hooks。
import {useEffect, useCallback, useState, lazy, Suspense, type JSX, type ChangeEvent} from 'react';
// 导入 React Router 的 Hooks，用于导航和读取URL参数。
import {useNavigate, useParams} from 'react-router-dom';
// 导入所有需要的 Material-UI 组件。
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
// 导入图标
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// 导入全局上下文的 Hooks，用于与主布局进行状态交互。
import {useLayoutDispatch, useLayoutState} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
// 导入子组件和工具。
import PageLayout from '@/layouts/PageLayout.tsx';
import DataTable from '@/components/ui/DataTable.tsx';
import TooltipCell from '@/components/ui/TooltipCell.tsx';
import {type TemplateSearchValues} from '@/components/forms/TemplateSearchForm.tsx';
import {handleAsyncError} from '@/utils/errorHandler.ts';
// 导入我们最终的、健壮的可点击行组件。
import ClickableTableRow from '@/components/ui/ClickableTableRow.tsx';


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

    // 定义胶囊按钮的通用样式
    const capsuleButtonStyle = {
        height: 42,
        borderRadius: '50px',
        textTransform: 'none',
        px: 3,
        bgcolor: 'app.button.background',
        color: 'neutral.main',
        '&:hover': {bgcolor: 'app.button.hover'}
    };

    // --- 3.6 JSX ---
    return (
        <PageLayout sx={{
            // 覆盖 PageLayout 的默认内边距，为移动端提供更紧凑的布局
            p: { xs: 1, md: 3 },
        }}>
            {/* 页面顶部区域：标题和操作按钮 */}
            <Box sx={{
                display: 'flex',
                flexShrink: 0,
                mb: 2,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>模板页面</Typography>

                {/* 操作按钮容器 */}
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button variant="contained" size="large" startIcon={<DriveFileRenameOutlineIcon />} sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>编辑</Typography>
                    </Button>
                    <Button variant="contained" size="large" startIcon={<ShareOutlinedIcon />} sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>导出</Typography>
                    </Button>
                    <Button variant="contained" size="large" startIcon={<SearchRoundedIcon />} onClick={handleTogglePanel} sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                    </Button>
                </Box>
            </Box>

            {/* 数据表格区域，flexGrow: 1 使其占据所有剩余空间。 */}
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
                    rowsPerPageOptions={[10, 25, 50]} // 可选的每页行数。
                    count={templateRows.length} // 总行数，用于计算总页数。
                    rowsPerPage={rowsPerPage} // 当前每页行数。
                    page={page} // 当前页码。
                    onPageChange={(_, newPage: number) => setPage(newPage)} // 页码改变时的回调。
                    onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // 每页行数改变时的回调。
                        setRowsPerPage(+event.target.value);
                        setPage(0); // 改变每页行数时，重置到第一页。
                    }}
                    labelRowsPerPage="每页行数:" // 自定义文本。
                    labelDisplayedRows={({from, to, count}: {
                        from: number,
                        to: number,
                        count: number
                    }) => `显示 ${from}-${to} 条, 共 ${count} 条`} // 自定义文本。
                >
                    <Table
                        stickyHeader // 关键属性：使表头在垂直滚动时固定。
                        aria-label="模板数据表"
                        sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <>
                                        {/* 移动端表头，提供明确的百分比宽度以避免布局问题 */}
                                        <TableCell sx={{width: '40%', fontWeight: 700}}>项目名称</TableCell>
                                        <TableCell sx={{width: '20%', fontWeight: 700}}>类别</TableCell>
                                        <TableCell sx={{width: '40%', fontWeight: 700}}>描述</TableCell>
                                    </>
                                ) : (
                                    <>
                                        {/* 桌面端表头 */}
                                        <TableCell sx={{
                                            width: '25%',
                                            position: 'sticky', // 关键属性：使单元格“粘性”定位。
                                            left: 0, // 粘在左侧。
                                            // 关键修复：加载时 zIndex 降级，以被遮罩层覆盖。
                                            zIndex: isLoading ? 'auto' : 120,
                                            bgcolor: 'background.paper', // 需要背景色以覆盖下方内容。
                                            fontWeight: 700
                                        }}>项目名称</TableCell>
                                        <TableCell sx={{width: '15%', fontWeight: 700}}>类别</TableCell>
                                        <TableCell sx={{width: '60%', fontWeight: 700}}>描述</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(row => (
                                // 使用 ClickableTableRow 替代旧的实现。
                                <ClickableTableRow
                                    key={row.id} // React 列表渲染的必要 key。
                                    selected={row.id === itemId} // 将高亮状态传递给组件。
                                    onClick={() => navigate(`/app/template-page/${row.id}`, {replace: true})} // 传递点击回调。
                                >
                                    {isMobile ? [
                                        // 移动端行内容，作为数组传递给 children。
                                        // 每个子元素都需要一个唯一的 key。
                                        <TooltipCell key="name">{row.name}</TooltipCell>,
                                        <TableCell key="category">{row.category}</TableCell>,
                                        <TooltipCell key="desc">{row.description}</TooltipCell>
                                    ] : [
                                        // 桌面端行内容，作为数组传递给 children。
                                        <TooltipCell key="name" sx={{
                                            // 固定列单元格需要保持粘性定位。
                                            position: 'sticky',
                                            left: 0,
                                            bgcolor: 'background.paper',
                                        }}>
                                            {row.name}
                                        </TooltipCell>,
                                        <TableCell key="category">
                                            {row.category}
                                        </TableCell>,
                                        <TooltipCell key="desc">
                                            {row.description}
                                        </TooltipCell>
                                    ]}
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