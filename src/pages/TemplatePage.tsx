/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【模板页面】组件（TemplatePage）。它展示了如何以最佳实践的方式集成一个带有【固定列】的高级数据表格、
 * 右侧搜索面板和全局模态框（弹窗）。它遵循了“路由驱动状态”、“按需加载”和“责任单一”的设计模式，
 * 可以作为创建新数据驱动页面的终极基础模板。
 *
 * 本次修改内容:
 * - 【代码清理】移除了未使用的 `useTheme` 钩子和 `theme` 变量，以修复 ESLint 和 TypeScript 报告的 "no-unused-vars" 警告。
 * - **问题根源**:
 *   在之前的开发版本中可能需要 `useTheme` 来访问主题颜色，但在最终版本中，我们利用了 `sx` 属性可以直接解析主题路径（如 'action.hover'）的特性，使得 `theme` 变量变得多余。
 * - **解决方案**:
 *   1.  从 `@mui/material` 的导入语句中移除 `useTheme`。
 *   2.  删除组件内部 `const theme = useTheme();` 这一行代码。
 * - **最终效果**:
 *   代码更加简洁，并完全符合 ESLint 和 TypeScript 的静态检查规则，消除了所有警告。
 */

// 从 'react' 库导入核心功能：
// - React: React 库的主入口，在现代 JSX 转换中是必需的。
// - useEffect: 一个 React Hook，用于处理组件生命周期中的“副作用”，例如数据获取、订阅或手动更改 DOM。
// - useCallback: 一个 React Hook，用于记忆化回调函数，优化性能。
// - useState: 一个 React Hook，用于在函数组件中添加和管理局部状态。
// - lazy: 一个函数，允许你定义一个动态加载的组件。
// - Suspense: 一个组件，让你可以在子组件加载完成前显示一个“后备”UI（如加载指示器）。
import React, { useEffect, useCallback, useState, lazy, Suspense } from 'react';

// 从 'react-router-dom' 库导入用于路由的钩子：
// - useNavigate: 一个钩子，返回一个函数，允许我们以编程方式进行导航。
// - useParams: 一个钩子，返回一个包含 URL 中动态参数的对象。
import { useNavigate, useParams } from 'react-router-dom';

// 从 '@mui/material' 库导入 UI 组件：
// - Box: 一个通用的容器组件，类似于 `<div>`。
// - Typography: 用于显示文本。
// - Button: 可交互的按钮。
// - Table, TableBody, TableCell, TableHead, TableRow: 用于构建数据表格的组件。
// - ButtonBase: 一个基础组件，用于为任何元素添加 Material Design 的涟漪（水波纹）效果。
// - CircularProgress: 一个圆形的加载指示器。
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';

// 从 '@mui/icons-material' 库导入图标。
import SearchIcon from '@mui/icons-material/Search';

// 从我们自己定义的全局布局上下文中导入分离后的自定义钩子。
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext.tsx';

// 导入我们创建的、用于统一页面布局和数据表格容器的可重用组件。
import PageLayout from '../layouts/PageLayout.tsx';
import DataTable from '../components/ui/DataTable.tsx';
import TooltipCell from '../components/ui/TooltipCell.tsx';

// 【类型导入】只导入懒加载组件所需的 TypeScript 类型。
// 这个 `import type` 语句只在编译时对 TypeScript 有效，不会将组件代码本身打包到初始 chunk 中。
import { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';

// 【懒加载】使用 React.lazy 动态导入组件的实现。
// 这会为这些组件创建独立的代码块（chunk），只有在它们首次被渲染时，浏览器才会去下载这些代码。
const TemplateSearchForm = lazy(() => import('../components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('../components/modals/TemplateModalContent.tsx'));

// --- MOCK DATA ---
// 定义表格行的数据结构。
interface TemplateRow {
    id: string;
    name: string;
    category: 'A' | 'B' | 'C';
    description: string;
}

// 创建一个函数来生成单行数据，方便复用。
const createData = (id: string, name: string, category: TemplateRow['category'], description: string): TemplateRow => ({
    id, name, category, description,
});

// 创建一个长文本用于测试 TooltipCell 的溢出效果。
const LONG_TEXT = '这是一个非常长的描述，用于演示当文本内容超出单元格宽度时，TooltipCell 组件是如何自动截断文本并提供悬停提示的。';

// 生成模拟的表格数据。
const templateRows: TemplateRow[] = [
    createData('item-001', '模板项目 Alpha', 'A', '这是 Alpha 项目的简短描述。'),
    createData('item-002', '模板项目 Beta', 'B', LONG_TEXT),
    createData('item-003', '模板项目 Gamma', 'C', '这是 Gamma 项目的简短描述。'),
    ...Array.from({ length: 20 }).map((_, i) =>
        createData(`item-${i + 4}`, `模板项目 ${i + 4}`, ['A', 'B', 'C'][i % 3] as TemplateRow['category'], `这是第 ${i + 4} 条项目的描述。`)
    ),
];


// 定义 TemplatePage 组件，它是一个函数式组件（React.FC），不接收任何 props。
const TemplatePage: React.FC = () => {
    // --- 1. HOOKS INITIALIZATION ---

    // 从全局布局上下文中解构出【状态值】和【状态更新函数】。
    const { isMobile, isPanelOpen } = useLayoutState(); // isMobile: 布尔值，表示当前是否为移动端视图。 isPanelOpen: 布尔值，表示右侧面板当前是否打开。
    const {
        togglePanel,      // togglePanel: 一个函数，用于切换右侧搜索面板的显示/隐藏状态。
        setPanelContent,  // setPanelContent: 一个函数，用于设置右侧面板中要渲染的 React 组件。
        setPanelTitle,    // setPanelTitle: 一个函数，用于设置右侧面板的标题。
        setPanelWidth,    // setPanelWidth: 一个函数，用于设置右侧面板的宽度。
        setIsModalOpen,   // setIsModalOpen: 一个函数，用于直接设置全局弹窗的打开/关闭状态 (true/false)。
        setModalConfig,   // setModalConfig: 一个函数，用于设置全局弹窗的内容和关闭时的回调函数。
    } = useLayoutDispatch();

    // 初始化路由相关的钩子。
    const navigate = useNavigate(); // 获取导航函数。
    const { itemId } = useParams<{ itemId: string }>(); // 从 URL 中获取动态参数 `itemId`。

    // --- 2. LOCAL STATE ---

    // 创建表格分页相关的本地状态。
    const [page, setPage] = useState(0); // page: 当前页码，从 0 开始。
    const [rowsPerPage, setRowsPerPage] = useState(10); // rowsPerPage: 每页显示的行数。

    // 创建一个本地状态，用于跟踪是否应该加载和设置面板内容。
    // 默认为 false，只有在用户首次点击搜索按钮或页面加载时面板已打开，才变为 true。
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    // --- 3. CALLBACKS & EVENT HANDLERS ---

    // 使用 useCallback 创建一个记忆化的回调函数 `handleSearch`，用于处理搜索事件。
    const handleSearch = useCallback((values: TemplateSearchValues) => {
        alert(`搜索: ${JSON.stringify(values)}`);
        togglePanel();
    }, [togglePanel]); // 依赖数组确保 `handleSearch` 只会被创建一次。

    // 使用 useCallback 创建一个记忆化的回调函数 `handleReset`，用于处理表单重置事件。
    const handleReset = useCallback(() => {
        alert('表单已重置');
    }, []); // 空依赖数组 `[]` 表示此函数在组件的整个生命周期内引用是稳定的。

    // 创建一个处理函数，用于切换面板的显示状态并触发内容的懒加载。
    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    // --- 4. SIDE EFFECTS MANAGEMENT (useEffect) ---

    // 此 useEffect 负责在页面加载时，同步全局面板的打开状态。
    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    // 此 useEffect 负责响应 URL 参数的变化，并管理弹窗状态（路由驱动状态）。
    useEffect(() => {
        const itemExists = itemId && templateRows.some(row => row.id === itemId);

        if (itemExists && !isMobile) {
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}>
                        <TemplateModalContent id={itemId} />
                    </Suspense>
                ),
                onClose: () => navigate('/app/template-page', { replace: true }),
            });
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
            setModalConfig({ content: null, onClose: null });
        }
    }, [itemId, isMobile, navigate, setIsModalOpen, setModalConfig]);

    // 此 useEffect 负责管理与此页面相关的侧边面板的生命周期。
    useEffect(() => {
        if (!isPanelContentSet) return;

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}>
                    <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
                </Suspense>
            );
            setPanelTitle('模板搜索');
            setPanelWidth(360);
        }, 0);

        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    // --- 5. DATA COMPUTATION ---

    // 根据当前页码和每页行数，计算出当前页面应该显示的行数据。
    const pageRows = templateRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // --- 6. JSX RENDER ---

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 页面顶部的标题栏容器。 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>模板页面</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={handleTogglePanel} sx={{ height: 42, borderRadius: '50px', textTransform: 'none', px: 3, bgcolor: 'app.button.background', color: 'neutral.main', '&:hover': { bgcolor: 'app.button.hover' } }}>
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>搜索</Typography>
                </Button>
            </Box>

            {/* 表格容器，使用 flexGrow: 1 占据剩余的垂直空间。 */}
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={templateRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={event => {
                        setRowsPerPage(+event.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({ from, to, count }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table
                        stickyHeader // stickyHeader: 使表格头部在垂直滚动时固定在顶部。
                        aria-label="模板数据表"
                        sx={{
                            borderCollapse: 'separate', // borderCollapse: 'separate' 是实现圆角和边框间距的表格样式所需。
                            tableLayout: 'fixed', // 【关键】tableLayout: 'fixed' 是高性能表格和防止布局抖动的关键，它让浏览器基于表头的宽度来渲染列。
                            width: '100%', // width: '100%' 确保表格撑满其容器宽度。
                            minWidth: 650, // minWidth: 确保在窄屏幕下，表格内容不会被过度挤压，而是出现水平滚动条。
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                {/* 【关键】为所有列都提供明确的宽度，这是防止布局坍塌的最终解决方案。 */}
                                <TableCell sx={{ width: '25%', position: 'sticky', left: 0, zIndex: 120, bgcolor: 'background.paper', fontWeight: 700 }}>项目名称</TableCell>
                                <TableCell sx={{ width: '15%', fontWeight: 700 }}>类别</TableCell>
                                <TableCell sx={{ width: '60%', fontWeight: 700 }}>描述</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(row => (
                                // 【关键】使用 ButtonBase 并将其 component 设为 TableRow，以获得水波纹动画效果。
                                <ButtonBase
                                    key={row.id}
                                    component={TableRow}
                                    onClick={() => navigate(`/app/template-page/${row.id}`, { replace: true })}
                                    sx={{ display: 'table-row', width: '100%', position: 'relative' }}
                                >
                                    {/* 【关键】固定的列，必须有自己的背景色以遮挡滚动内容。 */}
                                    <TooltipCell sx={{ position: 'sticky', left: 0, zIndex: 100, bgcolor: 'background.paper', 'tr:hover &': { bgcolor: 'action.hover' } }}>
                                        {row.name}
                                    </TooltipCell>
                                    {/* 【关键】对于所有单元格，使用 'tr:hover &' 选择器来响应父行的悬停事件，并应用统一的背景色。 */}
                                    <TableCell sx={{ 'tr:hover &': { bgcolor: 'action.hover' } }}>
                                        {row.category}
                                    </TableCell>
                                    <TooltipCell sx={{ 'tr:hover &': { bgcolor: 'action.hover' } }}>
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