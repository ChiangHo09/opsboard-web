/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 本次修改内容:
 * - 【布局对齐】为了适应 `MainLayout` 最新的“父级控制滚动”模型，彻底简化了此页面的布局。
 * - 移除了所有 `height`, `display: 'flex'`, 和 `flexGrow` 等强制布局属性。
 * - 页面现在回归到简单的、由内容驱动高度的自然文档流，将滚动控制权完全交还给父级布局。
 * - 【代码注释】按照要求，为文件中的每一个语句和每一个参数都添加了极其详细的中文注释。
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
    }, [togglePanel]); // 依赖数组中包含 `togglePanel`，这意味着只有当 `togglePanel` 函数的引用发生变化时，`handleSearch` 才会重新创建。由于 `togglePanel` 在 context 中也被 `useCallback` 包裹，所以它在整个应用生命周期中是稳定的。

    // 使用 useCallback 创建一个记忆化的回调函数 `handleReset`，用于处理表单重置事件。
    const handleReset = useCallback(() => {
        // 在控制台打印信息，用于调试。
        console.log('TemplatePage 感知到表单已重置');
        // 弹出一个警告框通知用户。
        alert('表单已重置');
    }, []); // 空依赖数组 `[]` 表示此函数在组件的整个生命周期内永远不会被重新创建，引用是绝对稳定的。

    // 使用 useCallback 创建一个记忆化的回调函数 `handleOpenModal`，用于处理打开弹窗的事件。
    const handleOpenModal = useCallback(() => {
        // 调用从 context 中获取的 `setIsModalOpen(true)` 函数，将全局弹窗的状态设置为“打开”。
        setIsModalOpen(true);
        // 调用从 context 中获取的 `setModalConfig` 函数，来配置弹窗要显示的内容和关闭时的行为。
        setModalConfig({
            // content: 这个属性的值是一个 React 元素，即我们想要在弹窗中渲染的组件。
            // 这里我们传入了 `<TemplateModalContent />` 组件的一个实例，并给它传递了一个 `id` prop。
            content: <TemplateModalContent id="template-123" />,
            // onClose: 这个属性的值是一个函数。当弹窗关闭时（通过右上角按钮、ESC键或点击背景），这个函数将被调用。
            // 在这里，我们让它调用 `setIsModalOpen(false)` 来更新全局状态。
            onClose: () => setIsModalOpen(false),
        });
    }, [setIsModalOpen, setModalConfig]); // 依赖数组包含这两个从 context 获取的函数，确保使用的是最新的稳定函数引用。


    // 使用 useEffect Hook 来处理与侧边搜索面板相关的副作用。
    // 这个 effect 会在组件首次挂载时，以及依赖数组中的任何值发生变化时运行。
    useEffect(() => {
        // 调用 `setPanelContent`，将 `<TemplateSearchForm />` 组件设置为右侧面板的内容。
        setPanelContent(
            // `onSearch` 和 `onReset` 是我们传递给子组件 `TemplateSearchForm` 的 props，用于事件回调。
            <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        // 设置右侧面板的标题为“模板搜索”。
        setPanelTitle('模板搜索');
        // 设置右侧面板的宽度为 360 像素。
        setPanelWidth(360);
        // 标记此页面与右侧面板是相关的。这会阻止 `MainLayout` 在我们导航到这个页面时自动关闭已经打开的面板。
        setIsPanelRelevant(true);

        // 返回一个清理函数。这个函数会在组件即将卸载（例如，用户导航到其他页面）时运行。
        return () => {
            // 将面板的各种状态重置为默认值，以避免影响下一个页面。
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]); // 依赖数组确保 effect 只在这些函数引用变化时才重新运行。由于它们都被 `useCallback` 包裹，所以这个 effect 只会在组件挂载时运行一次。

    // 返回组件的 JSX 渲染结构。
    return (
        // 使用 `<>` (React Fragment) 作为根元素，因为它不会在最终的 DOM 中创建额外的节点。
        // 这是因为我们采用了“父级控制滚动”模型，页面组件本身不应是布局容器。
        <>
            {/* 页面顶部的标题栏容器。 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                {/* 页面主标题。 */}
                <Typography variant="h4">模板页面 (Template Page)</Typography>
                {/* 打开搜索面板的按钮。 */}
                <Button
                    // variant="contained": 按钮样式为"包含式"（有背景色和阴影）。
                    variant="contained"
                    // startIcon: 在按钮文本前显示一个图标。
                    startIcon={<SearchIcon />}
                    // onClick: 点击事件处理器，调用 `togglePanel` 来打开或关闭侧边搜索面板。
                    onClick={togglePanel}
                    // sx: Material-UI 的样式属性，用于定义 CSS。
                    sx={{
                        height: '42px',                 // 按钮高度
                        borderRadius: '50px',           // 圆角使其成为胶囊形状
                        bgcolor: 'app.button.background',// 从主题中获取背景色
                        color: 'neutral.main',          // 从主题中获取文字颜色
                        boxShadow: 'none',              // 移除默认阴影
                        textTransform: 'none',          // 禁用文本大写转换
                        fontSize: '15px',               // 字体大小
                        fontWeight: 500,                // 字体重量
                        px: 3,                          // 左右内边距
                        // '&:hover': 定义鼠标悬停时的样式
                        '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' },
                    }}
                >
                    {/* 按钮内的文本，用 Typography 包裹并用 component="span" 渲染为 span 标签，以应用特定样式。 */}
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
            <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', minHeight: '300px' /* 添加最小高度以撑开页面 */ }}>
                <Typography>您的实际内容会在这里渲染。</Typography>

                {/* 打开全局弹窗的按钮。 */}
                <Button
                    // variant="outlined": 按钮样式为"轮廓式"（只有边框）。
                    variant="outlined"
                    // sx: 设置上外边距。
                    sx={{ mt: 2 }}
                    // onClick: 点击事件处理器，调用我们上面定义的 `handleOpenModal` 函数来打开弹窗。
                    onClick={handleOpenModal}
                >
                    打开弹窗
                </Button>
            </Box>
        </>
    );
};

// 默认导出该组件，以便在 `App.tsx` 的路由配置中导入和使用。
export default TemplatePage;