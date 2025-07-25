/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【模板页面】组件（TemplatePage）。它展示了如何以最佳实践的方式集成右侧搜索面板和全局模态框（弹窗），
 * 并遵循了“路由驱动状态”的设计模式。此文件可以作为创建新页面的基础模板，因为它包含了性能优化、动画同步、
 * 健壮的状态管理逻辑以及详尽的注释。
 *
 * 此模板实现了以下核心功能:
 * - 1. **右侧搜索面板集成**: 展示了如何正确地设置和清理与页面相关的右侧搜索面板内容。
 * - 2. **全局弹窗集成**: 展示了如何通过 URL 参数来控制全局弹窗的显示与隐藏，支持深链接和浏览器刷新。
 * - 3. **性能优化**: 严格使用 `useLayoutDispatch` 和 `useLayoutState` 来分离状态的读写，防止不必要的组件重渲染。
 * - 4. **动画安全**: 所有对全局状态的副作用（如设置面板内容）都通过 `setTimeout` 延迟执行，避免与页面过渡动画冲突。
 * - 5. **路由驱动状态**: 用户的交互（如点击按钮）只负责更新 URL，而页面的所有状态变化（如弹窗显示）都由 `useEffect` 监听 URL 变化来驱动，保证了单一事实来源。
 */

// 从 'react' 库导入核心功能：
// - React: React 库的主入口，在现代 JSX 转换中是必需的。
// - useEffect: 一个 React Hook，用于处理组件生命周期中的“副作用”，例如数据获取、订阅或手动更改 DOM。在这里，我们用它来响应 URL 变化和设置搜索面板。
// - useCallback: 一个 React Hook，用于记忆化回调函数。它可以防止在每次父组件重渲染时都创建一个新的函数实例，从而避免不必要的子组件重渲染，优化性能。
// - useState: 一个 React Hook，用于在函数组件中添加和管理局部状态。
import React, { useEffect, useCallback } from 'react';

// 从 'react-router-dom' 库导入用于路由的钩子：
// - useNavigate: 一个钩子，返回一个函数，允许我们以编程方式进行导航（例如，在点击按钮后跳转到新页面）。
// - useParams: 一个钩子，返回一个包含 URL 中动态参数（例如 /items/:itemId 中的 itemId）的对象。
import { useNavigate, useParams } from 'react-router-dom';

// 从 '@mui/material' 库导入 UI 组件，用于构建页面布局和元素：
// - Box: 一个通用的容器组件，类似于 HTML 的 `<div>`，但提供了访问主题（theme）和 `sx` 属性的便利，用于快速样式化。
// - Typography: 用于显示所有类型的文本，可以通过 `variant` 属性来应用预设的排版样式（如 h1, body1 等）。
// - Button: 用于创建可交互的、带有 Material Design 样式的按钮。
// - Stack: 一个专门用于处理一维布局（水平或垂直）的容器组件，可以方便地为子元素设置间距。
import { Box, Typography, Button, Stack } from '@mui/material';

// 从 '@mui/icons-material' 库导入图标。
// - SearchIcon: 一个放大镜图标，通常用于表示“搜索”功能。
import SearchIcon from '@mui/icons-material/Search';

// 【性能优化】从我们自己定义的全局布局上下文中导入分离后的自定义钩子。
// - useLayoutDispatch: 只提供状态更新函数（dispatchers），消费它的组件不会因为状态值的变化而重渲染。
// - useLayoutState: 只提供状态值（state），消费它的组件会在状态值变化时重渲染。
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext.tsx';

// 导入我们创建的、用于统一页面布局的可重用组件。
import PageLayout from '../layouts/PageLayout.tsx';

// 导入右侧搜索面板中要显示的表单组件，以及它的 props 类型定义。
import TemplateSearchForm, { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';

// 导入将要在全局弹窗中显示的内容组件。
import TemplateModalContent from '../components/modals/TemplateModalContent.tsx';

// 定义 TemplatePage 组件，它是一个函数式组件（FC），不接收任何 props。
const TemplatePage: React.FC = () => {
    // --- 1. HOOKS INITIALIZATION ---

    // 从全局布局上下文中解构出【状态更新函数】。
    // 因为此组件只负责“触发”状态变更，所以使用 useLayoutDispatch 来避免不必要的重渲染。
    const {
        togglePanel,      // togglePanel: 一个函数，用于切换右侧搜索面板的显示/隐藏状态。
        setPanelContent,  // setPanelContent: 一个函数，用于设置右侧面板中要渲染的 React 组件。
        setPanelTitle,    // setPanelTitle: 一个函数，用于设置右侧面板的标题。
        setPanelWidth,    // setPanelWidth: 一个函数，用于设置右侧面板的宽度。
        setIsPanelRelevant, // setIsPanelRelevant: 一个函数，用于标记当前页面是否与右侧面板相关。
        setIsModalOpen,   // setIsModalOpen: 一个函数，用于直接设置全局弹窗的打开/关闭状态 (true/false)。
        setModalConfig,   // setModalConfig: 一个函数，用于设置全局弹窗的内容和关闭时的回调函数。
    } = useLayoutDispatch();

    // 从全局布局上下文中解构出【状态值】。
    // 此处仅用于演示，如果组件确实需要根据 isMobile 状态来改变渲染逻辑，则使用此钩子。
    // 如果组件不需要读取任何状态，则可以移除此行。
    const { isMobile } = useLayoutState();

    // 初始化路由相关的钩子。
    const navigate = useNavigate(); // 获取导航函数。
    const { itemId } = useParams<{ itemId: string }>(); // 从 URL 中获取动态参数 `itemId`。

    // --- 2. CALLBACKS & EVENT HANDLERS ---

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
    }, [togglePanel]); // 依赖数组中包含 `togglePanel`。由于`togglePanel`来自`useLayoutDispatch`，其引用是永久稳定的，因此`handleSearch`也只会被创建一次。

    // 使用 useCallback 创建一个记忆化的回调函数 `handleReset`，用于处理表单重置事件。
    const handleReset = useCallback(() => {
        // 在控制台打印信息，用于调试。
        console.log('TemplatePage 感知到表单已重置');
        // 弹出一个警告框通知用户。
        alert('表单已重置');
    }, []); // 空依赖数组 `[]` 表示此函数在组件的整个生命周期内引用是稳定的。

    // --- 3. SIDE EFFECTS MANAGEMENT (useEffect) ---

    // 【核心实践】使用 useEffect 来响应 URL 参数的变化，并管理弹窗状态。
    // 这是“路由驱动状态”模式的核心。
    useEffect(() => {
        // 检查 URL 中是否存在有效的 `itemId`。
        const itemExists = !!itemId;

        // 如果 itemId 存在并且不是在移动端视图，则打开弹窗。
        if (itemExists && !isMobile) {
            // 步骤 a: 设置弹窗内容和关闭回调。
            setModalConfig({
                content: <TemplateModalContent id={itemId} />,
                // 当弹窗关闭时，导航回基础路径，并使用 replace: true 来优化浏览器历史。
                onClose: () => navigate('/app/template-page', { replace: true }),
            });
            // 步骤 b: 打开弹窗。
            setIsModalOpen(true);
        } else {
            // 如果 itemId 不存在或在移动端，则确保弹窗是关闭的，并清理其配置。
            setIsModalOpen(false);
            setModalConfig({ content: null, onClose: null });
        }
        // 依赖数组：这个 effect 会在 itemId, isMobile, navigate, setIsModalOpen, 或 setModalConfig 变化时重新运行。
    }, [itemId, isMobile, navigate, setIsModalOpen, setModalConfig]);


    // 【核心实践】使用 useEffect 来管理与此页面相关的侧边面板。
    useEffect(() => {
        // 使用 setTimeout 将状态更新操作推迟到下一个事件循环。
        // 这确保了页面本身的过渡动画能够优先执行，避免了因渲染冲突导致的视觉闪烁。
        const timerId = setTimeout(() => {
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
        }, 0); // 延迟时间为 0 毫秒，足以将其推入下一个宏任务队列。

        // 返回一个清理函数，在组件卸载时运行。
        return () => {
            // 清除可能还未执行的定时器，防止在已卸载的组件上执行状态更新。
            clearTimeout(timerId);
            // 将面板的各种状态重置为默认值，确保切换到其他页面时不会有残留。
            setPanelContent(null);
            setPanelTitle('');
            setIsPanelRelevant(false);
        };
        // 依赖数组：确保 effect 只在这些函数引用变化时重新运行（在此应用中，只运行一次）。
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    // --- 4. JSX RENDER ---

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
                    variant="contained"         // variant="contained": 按钮样式为"包含式"。
                    startIcon={<SearchIcon />}  // startIcon: 在按钮文本前显示一个图标。
                    onClick={togglePanel}       // onClick: 点击事件处理器。
                    sx={{                       // sx: Material-UI 的样式属性。
                        height: '42px',
                        borderRadius: '50px',
                        bgcolor: 'app.button.background',
                        color: 'neutral.main',
                        boxShadow: 'none',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        px: 3,
                        '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' },
                    }}
                >
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
                    variant="outlined" // variant="outlined": 按钮样式为"轮廓式"。
                    sx={{ mt: 2 }}     // sx: 设置上外边距。
                    // 【核心实践】onClick 只负责导航，将状态变更的责任交给 URL 和 useEffect。
                    onClick={() => {
                        // 点击按钮时，导航到带有 itemId 的 URL。
                        // 使用 replace: true 可以防止在浏览器历史中留下多余的记录。
                        navigate('/app/template-page/template-123', { replace: true });
                    }}
                >
                    打开弹窗 (ID: template-123)
                </Button>
            </Box>
        </PageLayout>
    );
};

// 默认导出该组件，以便在 `App.tsx` 的路由配置中导入和使用。
export default TemplatePage;