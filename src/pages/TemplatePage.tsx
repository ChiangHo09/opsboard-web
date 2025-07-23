/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 本次修改内容:
 * - 【布局终极统一】采用了最新的全局布局方案，确保视觉和行为的一致性。
 * - **使用 PageLayout**: 将页面的根容器从 `React.Fragment` 和手动的 `Box` 修改为
 *   统一的 `<PageLayout>` 组件。这自动应用了所有标准的宽度、居中和内外边距。
 * - **简化布局**: 移除了所有内部的、用于模拟布局的 `Box` 和 `flex` 属性，
 *   回归到最简单的、由内容驱动高度的自然文档流。
 * - 【代码注释】按照您的要求，为文件中的每一个语句和每一个参数都添加了极其详细的中文注释。
 *
 * 文件功能描述:
 * 此文件定义了一个【模板页面】组件（TemplatePage）。它展示了如何集成右侧搜索面板和全局模态框（弹窗），
 * 可以作为创建新页面的基础模板。
 */

// 从 'react' 库导入核心功能：
// - useEffect: 这是一个 React Hook，用于处理组件生命周期中的“副作用”，例如数据获取、订阅或手动更改 DOM。在这里，我们用它来设置和清理侧边搜索面板的内容。
// - useCallback: 这是一个 React Hook，用于记忆化回调函数。它可以防止在每次父组件重渲染时都创建一个新的函数实例，从而避免不必要的子组件重渲染，优化性能。
// - FC (FunctionComponent): 这是一个 TypeScript 类型，用于为函数式组件提供类型定义，确保组件的 props 和返回值类型正确。
import { useEffect, useCallback, type FC } from 'react';

// 从 '@mui/material' 库导入 UI 组件，用于构建页面布局和元素：
// - Box: 一个通用的容器组件，类似于 HTML 的 `<div>`，但提供了访问主题（theme）和 `sx` 属性的便利，用于快速样式化。
// - Typography: 用于显示所有类型的文本，可以通过 `variant` 属性来应用预设的排版样式（如 h1, body1 等）。
// - Button: 用于创建可交互的、带有 Material Design 样式的按钮。
// - Stack: 一个专门用于处理一维布局（水平或垂直）的容器组件，可以方便地为子元素设置间距。
import { Box, Typography, Button, Stack } from '@mui/material';

// 从 '@mui/icons-material' 库导入图标。
// - SearchIcon: 一个放大镜图标，通常用于表示“搜索”功能。
import SearchIcon from '@mui/icons-material/Search';

// 从我们自己定义的全局布局上下文中导入 `useLayout` 自定义钩子。
// 这个钩子让我们能够访问和控制共享的布局状态，例如侧边面板和全局弹窗。
import { useLayout } from '../contexts/LayoutContext.tsx';

// 导入我们创建的、用于统一页面布局的可重用组件。
import PageLayout from '../layouts/PageLayout.tsx';

// 导入右侧搜索面板中要显示的表单组件，以及它的 props 类型定义。
import TemplateSearchForm, { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';

// 导入将要在全局弹窗中显示的内容组件。
import TemplateModalContent from '../components/modals/TemplateModalContent.tsx';

// 定义 TemplatePage 组件，它是一个函数式组件（FC），不接收任何 props。
const TemplatePage: FC = () => {
    // 使用 `useLayout` 钩子，从全局上下文中解构出需要用到的状态和方法：
    // - togglePanel: 一个函数，用于切换右侧搜索面板的显示/隐藏状态。
    // - setPanelContent: 一个函数，用于设置右侧面板中要渲染的 React 组件。
    // - setPanelTitle: 一个函数，用于设置右侧面板的标题。
    // - setPanelWidth: 一个函数，用于设置右侧面板的宽度。
    // - setIsPanelRelevant: 一个函数，用于标记当前页面是否与右侧面板相关（防止在切换页面时面板意外关闭）。
    // - setIsModalOpen: 一个函数，用于直接设置全局弹窗的打开/关闭状态 (true/false)。
    // - setModalConfig: 一个函数，用于设置全局弹窗的内容和关闭时的回调函数。
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, setIsModalOpen, setModalConfig } = useLayout();

    // 使用 useCallback 创建一个记忆化的回调函数 `handleSearch`，用于处理搜索事件。
    const handleSearch = useCallback((
        // values: TemplateSearchValues: 这个回调函数接收一个参数 `values`，其类型为 `TemplateSearchValues`，包含了表单的搜索条件。
        values: TemplateSearchValues
    ) => {
        // 在浏览器的开发者工具控制台中打印日志，方便调试。
        console.log('在 TemplatePage 页面接收到搜索条件:', values);
        // 弹出一个浏览器原生的警告框，向用户显示 JSON 格式的搜索条件。
        alert(`搜索: ${JSON.stringify(values)}`);
        // 调用从 context 中获取的 `togglePanel` 方法来关闭/隐藏搜索面板。
        togglePanel();
    }, [togglePanel]); // 依赖数组中包含 `togglePanel`，这意味着只有当 `togglePanel` 函数的引用发生变化时，`handleSearch` 才会重新创建。

    // 使用 useCallback 创建一个记忆化的回调函数 `handleReset`，用于处理表单重置事件。
    const handleReset = useCallback(() => {
        // 在控制台打印信息，用于调试。
        console.log('TemplatePage 感知到表单已重置');
        // 弹出一个警告框通知用户。
        alert('表单已重置');
    }, []); // 空依赖数组 `[]` 表示此函数在组件的整个生命周期内引用是稳定的。

    // 使用 useCallback 创建一个记忆化的回调函数 `handleOpenModal`，用于处理打开弹窗的事件。
    const handleOpenModal = useCallback(() => {
        // 调用从 context 中获取的 `setIsModalOpen(true)` 函数，将全局弹窗的状态设置为“打开”。
        setIsModalOpen(true);
        // 调用从 context 中获取的 `setModalConfig` 函数，来配置弹窗要显示的内容和关闭时的行为。
        setModalConfig({
            // content: 这个属性的值是一个 React 元素，即我们想要在弹窗中渲染的组件。
            content: <TemplateModalContent id="template-123" />,
            // onClose: 这个属性的值是一个函数。当弹窗关闭时，这个函数将被调用。
            onClose: () => setIsModalOpen(false),
        });
    }, [setIsModalOpen, setModalConfig]); // 依赖数组确保使用的是最新的稳定函数引用。


    // 使用 useEffect Hook 来处理与侧边搜索面板相关的副作用。
    useEffect(() => {
        // 调用 `setPanelContent`，将 `<TemplateSearchForm />` 组件设置为右侧面板的内容。
        setPanelContent(
            <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        // 设置右侧面板的标题。
        setPanelTitle('模板搜索');
        // 设置右侧面板的宽度。
        setPanelWidth(360);
        // 标记此页面与右侧面板是相关的。
        setIsPanelRelevant(true);

        // 返回一个清理函数，在组件卸载时运行。
        return () => {
            // 将面板的各种状态重置为默认值。
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]); // 依赖数组确保 effect 只在组件挂载时运行一次。

    // 返回组件的 JSX 渲染结构。
    return (
        // 使用我们创建的 `<PageLayout>` 组件作为页面的根容器。
        // 它会自动处理所有响应式的宽度、居中和内外边距，确保布局统一。
        <PageLayout>
            {/* 页面顶部的标题栏容器。 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                {/* 页面主标题。 */}
                <Typography variant="h4">模板页面 (Template Page)</Typography>
                {/* 打开搜索面板的按钮。 */}
                <Button
                    // variant="contained": 按钮样式为"包含式"。
                    variant="contained"
                    // startIcon: 在按钮文本前显示一个图标。
                    startIcon={<SearchIcon />}
                    // onClick: 点击事件处理器。
                    onClick={togglePanel}
                    // sx: Material-UI 的样式属性。
                    sx={{
                        height: '42px',                 // 按钮高度
                        borderRadius: '50px',           // 圆角
                        bgcolor: 'app.button.background',// 背景色
                        color: 'neutral.main',          // 文字颜色
                        boxShadow: 'none',              // 移除阴影
                        textTransform: 'none',          // 禁用文本大写
                        fontSize: '15px',               // 字体大小
                        fontWeight: 500,                // 字体重量
                        px: 3,                          // 左右内边距
                        // '&:hover': 定义鼠标悬停时的样式
                        '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' },
                    }}
                >
                    {/* 按钮内的文本。 */}
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                        搜索
                    </Typography>
                </Button>
            </Box>

            {/* 页面描述文本区域，使用 Stack 组件来方便地控制子元素间距。 */}
            <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography>这是一个根据其他页面样式生成的通用模板。</Typography>
                <Typography>在这里编写您的页面内容。例如：</Typography>
            </Stack>

            {/* 内容占位符区域。 */}
            <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', minHeight: '300px' }}>
                <Typography>您的实际内容会在这里渲染。</Typography>

                {/* 打开全局弹窗的按钮。 */}
                <Button
                    // variant="outlined": 按钮样式为"轮廓式"。
                    variant="outlined"
                    // sx: 设置上外边距。
                    sx={{ mt: 2 }}
                    // onClick: 点击事件处理器。
                    onClick={handleOpenModal}
                >
                    打开弹窗
                </Button>
            </Box>
        </PageLayout>
    );
};

// 默认导出该组件，以便在 `App.tsx` 的路由配置中导入和使用。
export default TemplatePage;