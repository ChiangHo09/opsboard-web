/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 本次修改内容:
 * - 【功能新增】集成了全局弹窗功能，现在页面上有一个按钮可以打开一个模态框。
 * - 【代码注释】按照要求，为文件中的每一个语句和每一个参数都添加了极其详细的注释。
 * - 导入了新的 `TemplateModalContent` 组件作为弹窗的内容。
 * - 从 `useLayout` 上下文中获取了 `setIsModalOpen` 和 `setModalConfig` 方法来控制弹窗。
 * - 创建了 `handleOpenModal` 回调函数来处理打开弹窗的逻辑。
 * - 在 JSX 中添加了一个新的 "打开弹窗" 按钮，并绑定了点击事件。
 *
 * 文件功能描述:
 * 此文件定义了一个【模板页面】组件（TemplatePage）。它展示了如何集成右侧搜索面板和全局模态框（弹窗），
 * 可以作为创建新页面的基础模板。
 */

// 从 'react' 库导入核心功能：
// - useEffect: 用于处理组件生命周期中的副作用（如此处设置面板内容）。
// - useCallback: 用于记忆化回调函数，避免不必要的重渲染。
// - FC (FunctionComponent): 用于为函数式组件提供类型定义。
import { useEffect, useCallback, type FC } from 'react';

// 从 '@mui/material' 库导入 UI 组件，用于构建页面布局和元素：
// - Box: 一个通用的容器组件，用于布局。
// - Typography: 用于显示文本。
// - Button: 用于创建可交互的按钮。
// - Stack: 用于沿垂直或水平轴以一维方式排列子元素。
import { Box, Typography, Button, Stack } from '@mui/material';

// 从 '@mui/icons-material' 库导入图标。
// - SearchIcon: 一个搜索图标。
import SearchIcon from '@mui/icons-material/Search';

// 从全局布局上下文中导入 useLayout 自定义钩子，以访问和控制共享的布局状态。
import { useLayout } from '../contexts/LayoutContext.tsx';

// 导入右侧搜索面板的表单组件及其类型定义。
import TemplateSearchForm, { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';

// 导入将要在弹窗中显示的内容组件。
import TemplateModalContent from '../components/modals/TemplateModalContent.tsx';

// 定义 TemplatePage 组件，它是一个函数式组件（FC）。
const TemplatePage: FC = () => {
    // 从 useLayout 钩子中解构出需要用到的状态和方法：
    // - togglePanel: 切换右侧搜索面板的显示/隐藏。
    // - setPanelContent: 设置右侧面板中要渲染的内容。
    // - setPanelTitle: 设置右侧面板的标题。
    // - setPanelWidth: 设置右侧面板的宽度。
    // - setIsPanelRelevant: 标记当前页面是否与右侧面板相关。
    // - setIsModalOpen: 直接设置全局弹窗的打开/关闭状态。
    // - setModalConfig: 设置全局弹窗的内容和关闭时的回调函数。
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, setIsModalOpen, setModalConfig } = useLayout();

    // 使用 useCallback 创建一个记忆化的回调函数，用于处理搜索事件。
    // 这可以防止在父组件重渲染时，将新的函数实例传递给子组件（TemplateSearchForm），从而优化性能。
    const handleSearch = useCallback((
        // values: TemplateSearchValues: 接收一个符合 TemplateSearchValues 接口的对象作为参数，包含了表单的搜索条件。
        values: TemplateSearchValues
    ) => {
        // 在控制台打印搜索条件，用于调试。
        console.log('在 TemplatePage 页面接收到搜索条件:', values);
        // 弹出一个警告框，向用户显示搜索条件。
        alert(`搜索: ${JSON.stringify(values)}`);
        // 调用 togglePanel 方法来关闭搜索面板。
        togglePanel();
    }, [togglePanel]); // 依赖数组中包含 togglePanel，确保使用的是最新的函数实例。

    // 使用 useCallback 创建一个记忆化的回调函数，用于处理表单重置事件。
    const handleReset = useCallback(() => {
        // 在控制台打印信息，用于调试。
        console.log('TemplatePage 感知到表单已重置');
        // 弹出一个警告框通知用户。
        alert('表单已重置');
    }, []); // 空依赖数组表示此函数在组件的整个生命周期内保持不变。

    // 【新增】使用 useCallback 创建一个记忆化的回调函数，用于处理打开弹窗的事件。
    const handleOpenModal = useCallback(() => {
        // 调用 setIsModalOpen(true) 来命令全局弹窗显示。
        setIsModalOpen(true);
        // 调用 setModalConfig 来配置弹窗的内容和关闭逻辑。
        setModalConfig({
            // content: 传入要在弹窗中渲染的 React 组件实例。
            content: <TemplateModalContent id="template-123" />,
            // onClose: 传入一个回调函数，当弹窗关闭时（通过按钮、ESC键或点击背景），此函数将被调用。
            onClose: () => setIsModalOpen(false),
        });
    }, [setIsModalOpen, setModalConfig]); // 依赖数组包含这两个从 context 获取的函数。


    // 使用 useEffect Hook 来处理副作用。此 effect 会在组件首次挂载时运行。
    useEffect(() => {
        // 调用 setPanelContent，将 TemplateSearchForm 组件设置为右侧面板的内容。
        setPanelContent(
            // onSearch 和 onReset 是传递给子组件的 props，用于回调。
            <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        // 设置右侧面板的标题。
        setPanelTitle('模板搜索');
        // 设置右侧面板的宽度。
        setPanelWidth(360);
        // 标记此页面与右侧面板相关（防止在切换到此页面时面板自动关闭）。
        setIsPanelRelevant(true);

        // 返回一个清理函数。此函数会在组件卸载时运行。
        return () => {
            // 清理右侧面板的内容、标题等，恢复到默认状态。
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]); // 依赖数组确保 effect 只在这些函数引用变化时重新运行。

    // 返回组件的 JSX 渲染结构。
    return (
        // 使用 Box 组件作为页面的根容器。
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            {/* 页面内容的主要容器，负责居中和内边距。 */}
            <Box sx={{ width: { xs: '90%', md: '80%' }, maxWidth: 1280, mx: 'auto', py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* 页面顶部的标题栏。 */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    {/* 页面主标题。 */}
                    <Typography variant="h4">模板页面 (Template Page)</Typography>
                    {/* 打开搜索面板的按钮。 */}
                    <Button
                        // variant="contained": 按钮样式为"包含式"（有背景色）。
                        variant="contained"
                        // startIcon: 在按钮文本前显示一个图标。
                        startIcon={<SearchIcon />}
                        // onClick: 点击事件处理器，调用 togglePanel 来开关面板。
                        onClick={togglePanel}
                        // sx: 样式属性。
                        sx={{
                            height: '42px', borderRadius: '50px', bgcolor: 'app.button.background',
                            color: 'neutral.main', boxShadow: 'none', textTransform: 'none',
                            fontSize: '15px', fontWeight: 500, px: 3,
                            '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' },
                        }}
                    >
                        {/* 按钮内的文本，用 Typography 包裹以应用特定样式。 */}
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                            搜索
                        </Typography>
                    </Button>
                </Box>

                {/* 页面描述文本区域。 */}
                <Stack spacing={1} sx={{ mt: 2, flexShrink: 0 }}>
                    <Typography>这是一个根据其他页面样式生成的通用模板。</Typography>
                    <Typography>在这里编写您的页面内容。例如：</Typography>
                </Stack>

                {/* 内容占位符区域。 */}
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>您的实际内容会在这里渲染。</Typography>

                    {/* 【新增】打开弹窗的按钮。 */}
                    <Button
                        // variant="outlined": 按钮样式为"轮廓式"（只有边框）。
                        variant="outlined"
                        // sx: 设置上外边距。
                        sx={{ mt: 2 }}
                        // onClick: 点击事件处理器，调用 handleOpenModal 来打开弹窗。
                        onClick={handleOpenModal}
                    >
                        打开弹窗
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

// 默认导出该组件。
export default TemplatePage;