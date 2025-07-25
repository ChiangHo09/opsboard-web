/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【模板页面】组件（TemplatePage）。它展示了如何以最佳实践的方式集成右侧搜索面板和全局模态框（弹窗），
 * 并遵循了“路由驱动状态”、“按需加载”和“责任单一”的设计模式。此文件可以作为创建新页面的基础模板。
 *
 * 此模板实现了以下核心功能:
 * - 1. **懒加载集成**: `TemplateSearchForm` 和 `TemplateModalContent` 都通过 `React.lazy` 进行动态导入，并使用 `<Suspense>` 进行包裹，只有在需要时才下载其代码，优化初始加载性能。
 * - 2. **右侧搜索面板管理**:
 *      - **按需加载**: 仅在用户首次点击“搜索”按钮时，才加载并渲染搜索表单。
 *      - **生命周期管理**: 此页面完全负责其关联的搜索面板的生命周期。在 `useEffect` 的清理函数中，会彻底清空面板内容，防止状态“泄露”到其他页面。
 * - 3. **全局弹窗集成**:
 *      - **路由驱动**: 完全通过 URL 参数来控制全局弹窗的显示与隐藏，支持深链接和浏览器刷新。
 * - 4. **性能优化**:
 *      - **Context 分离**: 严格使用 `useLayoutDispatch` 和 `useLayoutState` 来分离状态的读写，防止不必要的组件重渲染。
 *      - **回调记忆化**: 使用 `useCallback` 来稳定回调函数的引用，避免子组件的不必要重渲染。
 * - 5. **动画安全**:
 *      - **延迟设置**: 对面板内容的设置操作被包裹在 `setTimeout(..., 0)` 内，确保不会与页面的进入/退出动画产生渲染冲突。
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
// - Stack: 用于一维布局（水平或垂直）的容器。
// - CircularProgress: 一个圆形的加载指示器。
import { Box, Typography, Button, Stack, CircularProgress } from '@mui/material';

// 从 '@mui/icons-material' 库导入图标。
import SearchIcon from '@mui/icons-material/Search';

// 从我们自己定义的全局布局上下文中导入分离后的自定义钩子。
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext.tsx';

// 导入我们创建的、用于统一页面布局的可重用组件。
import PageLayout from '../layouts/PageLayout.tsx';

// 【类型导入】只导入懒加载组件所需的 TypeScript 类型。
// 这个 `import type` 语句只在编译时对 TypeScript 有效，不会将组件代码本身打包到初始 chunk 中。
import { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';

// 【懒加载】使用 React.lazy 动态导入组件的实现。
// 这会为这些组件创建独立的代码块（chunk），只有在它们首次被渲染时，浏览器才会去下载这些代码。
const TemplateSearchForm = lazy(() => import('../components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('../components/modals/TemplateModalContent.tsx'));


// 定义 TemplatePage 组件，它是一个函数式组件（React.FC），不接收任何 props。
const TemplatePage: React.FC = () => {
    // --- 1. HOOKS INITIALIZATION ---

    // 从全局布局上下文中解构出【状态更新函数】。
    // 使用 useLayoutDispatch 可以确保此组件只在需要“派发”一个动作时才与 context 交互，从而避免了不必要的重渲染。
    const {
        togglePanel,      // togglePanel: 一个函数，用于切换右侧搜索面板的显示/隐藏状态。
        setPanelContent,  // setPanelContent: 一个函数，用于设置右侧面板中要渲染的 React 组件。
        setPanelTitle,    // setPanelTitle: 一个函数，用于设置右侧面板的标题。
        setPanelWidth,    // setPanelWidth: 一个函数，用于设置右侧面板的宽度。
        setIsModalOpen,   // setIsModalOpen: 一个函数，用于直接设置全局弹窗的打开/关闭状态 (true/false)。
        setModalConfig,   // setModalConfig: 一个函数，用于设置全局弹窗的内容和关闭时的回调函数。
    } = useLayoutDispatch();

    // 从全局布局上下文中解构出【状态值】。
    // 此处仅用于演示，如果组件确实需要根据 isMobile 状态来改变渲染逻辑，则使用此钩子。
    const { isMobile } = useLayoutState();

    // 初始化路由相关的钩子。
    const navigate = useNavigate(); // 获取导航函数。
    const { itemId } = useParams<{ itemId: string }>(); // 从 URL 中获取动态参数 `itemId`。

    // 创建一个本地状态，用于跟踪是否应该加载和设置面板内容。
    // 默认为 false，只有在用户首次点击搜索按钮时才变为 true。
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    // --- 2. CALLBACKS & EVENT HANDLERS ---

    // 使用 useCallback 创建一个记忆化的回调函数 `handleSearch`，用于处理搜索事件。
    const handleSearch = useCallback((
        // values: TemplateSearchValues: 这个回调函数接收一个参数 `values`，其类型为 `TemplateSearchValues`。
        values: TemplateSearchValues
    ) => {
        // 打印并弹窗显示搜索条件。
        console.log('在 TemplatePage 页面接收到搜索条件:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        // 关闭搜索面板。
        togglePanel();
    }, [togglePanel]); // 依赖数组确保 `handleSearch` 只会被创建一次。

    // 使用 useCallback 创建一个记忆化的回调函数 `handleReset`，用于处理表单重置事件。
    const handleReset = useCallback(() => {
        console.log('TemplatePage 感知到表单已重置');
        alert('表单已重置');
    }, []); // 空依赖数组 `[]` 表示此函数在组件的整个生命周期内引用是稳定的。

    // 创建一个处理函数，用于切换面板的显示状态并触发内容的懒加载。
    const handleTogglePanel = () => {
        // 如果面板内容从未被设置过...
        if (!isPanelContentSet) {
            // ...则将状态设置为 true，这将触发下面的 useEffect 来加载和设置面板内容。
            setIsPanelContentSet(true);
        }
        // 无论如何，都切换面板的打开/关闭状态。
        togglePanel();
    };

    // --- 3. SIDE EFFECTS MANAGEMENT (useEffect) ---

    // 此 useEffect 负责响应 URL 参数的变化，并管理弹窗状态（路由驱动状态）。
    useEffect(() => {
        // 检查 URL 中是否存在有效的 `itemId`。
        const itemExists = !!itemId;

        // 如果 itemId 存在并且不是在移动端视图，则打开弹窗。
        if (itemExists && !isMobile) {
            // 设置弹窗的配置。
            setModalConfig({
                // content: 弹窗中要渲染的内容。
                content: (
                    // 使用 <Suspense> 包裹懒加载的组件。
                    <Suspense fallback={
                        // fallback: 在组件代码下载完成前，显示一个居中的加载指示器。
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>
                    }>
                        <TemplateModalContent id={itemId} />
                    </Suspense>
                ),
                // onClose: 当弹窗关闭时（例如点击遮罩层或关闭按钮），导航回基础路径。
                onClose: () => navigate('/app/template-page', { replace: true }),
            });
            // 打开弹窗。
            setIsModalOpen(true);
        } else {
            // 如果 itemId 不存在或在移动端，则确保弹窗是关闭的，并清理其配置。
            setIsModalOpen(false);
            setModalConfig({ content: null, onClose: null });
        }
    }, [itemId, isMobile, navigate, setIsModalOpen, setModalConfig]); // 依赖数组。

    // 此 useEffect 负责管理与此页面相关的侧边面板的生命周期。
    useEffect(() => {
        // 如果 `isPanelContentSet` 为 false（即用户还未点击过搜索按钮），则不执行任何操作。
        if (!isPanelContentSet) return;

        // 使用 setTimeout 将状态更新操作推迟到下一个事件循环，以避免与页面过渡动画冲突。
        const timerId = setTimeout(() => {
            // 设置面板内容。
            setPanelContent(
                // 使用 <Suspense> 包裹懒加载的搜索表单。
                <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}>
                    <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
                </Suspense>
            );
            // 设置面板标题。
            setPanelTitle('模板搜索');
            // 设置面板宽度。
            setPanelWidth(360);
        }, 0);

        // 返回一个清理函数，此函数会在组件卸载（unmount）时运行。
        return () => {
            // 清除可能还未执行的定时器。
            clearTimeout(timerId);
            // 【核心修复】页面自己负责清理自己设置的面板内容，防止状态泄露。
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]); // 依赖数组。

    // --- 4. JSX RENDER ---

    return (
        // 使用 `<PageLayout>` 组件作为页面的根容器，统一布局样式。
        <PageLayout>
            {/* 页面顶部的标题栏容器。 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                {/* 页面主标题。 */}
                <Typography variant="h4">模板页面 (Template Page)</Typography>
                {/* 打开搜索面板的按钮。 */}
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleTogglePanel}
                    sx={{
                        height: '42px', borderRadius: '50px', bgcolor: 'app.button.background',
                        color: 'neutral.main', boxShadow: 'none', textTransform: 'none',
                        fontSize: '15px', fontWeight: 500, px: 3,
                        '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' },
                    }}
                >
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                        搜索
                    </Typography>
                </Button>
            </Box>

            {/* 页面描述文本区域。 */}
            <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography>这是一个根据其他页面样式生成的通用模板。</Typography>
                <Typography>在这里编写您的页面内容。例如：</Typography>
            </Stack>

            {/* 内容占位符区域。 */}
            <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', minHeight: '300px' }}>
                <Typography>您的实际内容会在这里渲染。</Typography>

                {/* 打开全局弹窗的按钮。 */}
                <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    // onClick 只负责导航，将状态变更的责任交给 URL 和 useEffect。
                    onClick={() => {
                        // 点击按钮时，导航到带有 itemId 的 URL。
                        navigate('/app/template-page/template-123', { replace: true });
                    }}
                >
                    打开弹窗 (ID: template-123)
                </Button>
            </Box>
        </PageLayout>
    );
};

// 默认导出该组件，以便在路由配置中导入和使用。
export default TemplatePage;