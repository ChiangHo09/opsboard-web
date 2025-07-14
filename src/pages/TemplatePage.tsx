/**
 * 文件功能：
 * 此文件定义了一个【模板页面】组件（TemplatePage）。
 * 它的核心目的是作为一个高度注释、可复制的起点，用于快速创建项目内所有新的主工作区页面。
 * 它展示了与全局布局（特别是右侧搜索面板）进行交互的最佳实践，包括：
 *   1. 如何使用 `useLayout` Hook 从上下文中获取控制面板的方法。
 *   2. 如何使用 `useEffect` 在页面加载时，将一个独立的、可复用的搜索表单组件“注入”到右侧面板中。
 *   3. 如何定义一个与表单进行通信的回调函数（`handleSearch`）。
 *   4. 【新增】如何设置 `isPanelRelevant` 状态，以控制面板在路由切换时的智能关闭行为。
 *   5. 对每一个功能、Hook 和语句都提供了极其详尽的注释，方便开发者理解和修改。
 *
 * 本次修改：
 * - 将此文件重构为带有极度详细注释的官方页面模板。
 * - 引入了上一任务中创建的 `TemplateSearchForm` 组件，并演示了如何使用它。
 * - 【重要】集成了 `isPanelRelevant` 状态的管理，演示了页面如何声明自己是否“与面板相关”。
 *   - 默认情况下，模板会演示一个“与面板相关”的页面设置。
 *   - 提供了注释掉的代码示例，展示了“与面板不相关”的页面应如何设置。
 */

// 从 'react' 库中导入核心功能。
// - React: 这是使用 JSX 语法所必需的。
// - useEffect: 这是一个 React Hook，允许我们在组件渲染后执行“副作用”操作，比如设置面板内容、获取数据等。
// - useCallback: 这是一个 React Hook，用于缓存函数定义，防止在子组件中引发不必要的重新渲染，是一种性能优化手段。
// - FC (FunctionComponent): 这是一个类型，用于定义一个函数组件的类型。
import { useEffect, useCallback, type FC } from 'react';

// 从 '@mui/material' 库中导入所有需要用到的 UI 组件。
// - Box: 通用的布局容器。
// - Typography: 用于渲染文本。
// - Button: 按钮组件。
// - Stack: 强大的布局组件。
import { Box, Typography, Button, Stack } from '@mui/material';
// 从 '@mui/icons-material' 库中导入图标。
import SearchIcon from '@mui/icons-material/Search';

// 从我们自己的上下文中导入 `useLayout` Hook。
// 这个 Hook 是我们与应用的主布局（包括右侧面板）进行通信的唯一桥梁。
import { useLayout } from '../contexts/LayoutContext.tsx';

// 从我们已经创建好的、独立的表单组件文件中，导入该组件及其提交的数据类型接口。
// 这体现了“关注点分离”的原则：页面本身不关心表单长什么样，只关心如何使用它。
import TemplateSearchForm, { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';


// --- 1. 定义组件本身 ---
// 使用 `React.FC` 来定义一个标准的函数组件。
const TemplatePage: FC = () => {

    // --- 2. 使用 useLayout Hook ---
    // 调用 `useLayout()` Hook，从全局的 LayoutContext 中解构出我们在这个页面需要用到的方法。
    // - `togglePanel`: 一个函数，用于打开或关闭右侧的搜索面板。
    // - `setPanelContent`: 一个函数，用于将任何 React 元素（比如我们的搜索表单）设置为右侧面板的内容。
    // - `setPanelTitle`: 一个函数，用于设置右侧面板的标题。
    // - `setPanelWidth`: 一个函数，用于设置右侧面板的宽度。
    // - `setIsPanelRelevant`: 【新增】一个函数，用于告诉 LayoutContext 当前页面是否“与面板相关”。
    //   - 如果为 `true`，表示此页面会使用右侧面板，当从其他页面跳转回来时，面板可以保持打开状态。
    //   - 如果为 `false`，表示此页面不使用右侧面板，当导航到此页面时，如果面板是打开的，它应该自动关闭。
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    // --- 3. 定义页面的业务逻辑（事件处理函数） ---

    /**
     * 定义当搜索表单提交时，这个页面应该执行什么操作。
     * 这个函数将被作为 prop 传递给 `TemplateSearchForm` 组件。
     *
     * 我们使用 `useCallback` 来包裹这个函数，这是一种性能优化。
     * - `useCallback` 会返回一个“记忆化”的函数版本，只有当它的依赖项数组（第二个参数）中的值发生变化时，它才会重新创建。
     * - 在这里，它的依赖是 `[togglePanel]`。因为 `togglePanel` 函数本身是稳定的（由 context 提供），所以 `handleSearch` 函数在组件的整个生命周期中只会被创建一次。
     * - 这可以防止当 `TemplatePage` 组件因其他原因重渲染时，传递给子组件 `TemplateSearchForm` 的 `onSearch` prop 发生变化，从而避免了子组件不必要的重渲染。
     *
     * @param {TemplateSearchValues} values - 这是函数接收的唯一参数，它是由 `TemplateSearchForm` 组件在点击搜索后回传的、包含了所有表单字段值的对象。其类型安全由我们导入的 `TemplateSearchValues` 接口保证。
     */
    const handleSearch = useCallback((values: TemplateSearchValues) => {
        // 在控制台打印接收到的搜索条件，方便调试。
        console.log('在 TemplatePage 页面接收到搜索条件:', values);
        // 使用 alert 模拟一个搜索操作。在实际应用中，这里应该是调用 API 发起网络请求。
        alert(`搜索: ${JSON.stringify(values)}`);
        // 调用 `togglePanel` 函数，在执行搜索后自动关闭搜索面板。
        togglePanel();
    }, [togglePanel]); // 依赖项数组

    /**
     * 定义当用户点击重置按钮时，此页面可能需要执行的额外操作。
     */
    const handleReset = useCallback(() => {
        // 在这里，你可以执行一些仅与页面相关的重置逻辑，比如清空页面的数据列表等。
        console.log('TemplatePage 感知到表单已重置');
        alert('表单已重置');
    }, []); // 空依赖数组意味着此函数也只会被创建一次。


    // --- 4. 使用 useEffect Hook 配置页面与面板的交互 ---
    // `useEffect` 用于处理“副作用”——那些不直接与渲染输出相关，但又必须在组件渲染后执行的操作。
    // 在这里，我们的副作用就是“配置右侧的搜索面板”以及“声明页面与面板的相关性”。
    useEffect(() => {
        // --- 场景一：页面【有】搜索面板功能（默认示例） ---
        // 如果当前页面需要右侧面板来显示搜索表单或其他内容，则执行以下设置：

        // 1. 设置右侧面板的内容：
        //    调用 `setPanelContent`，将我们的搜索表单组件“注入”到右侧面板中。
        //    我们在这里创建了 `TemplateSearchForm` 的一个实例，并通过 props 将本页面定义的 `handleSearch` 和 `handleReset` 函数传递给它。
        //    这就是父子组件通信的关键：父组件通过 props 将“指令”（回调函数）传递给子组件。
        setPanelContent(
            <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
        );

        // 2. 设置右侧面板的元数据：
        //    调用 `setPanelTitle` 来设置面板的标题。
        setPanelTitle('模板搜索');
        //    调用 `setPanelWidth` 来设置面板的宽度（如果需要自定义的话）。
        setPanelWidth(360); // 这是一个常见的宽度值。

        // 3. 声明页面与面板的相关性：
        //    【重要】将 `isPanelRelevant` 设置为 `true`，告诉 `LayoutContext` 当前页面是“与面板相关”的。
        //    这使得在有搜索面板的页面之间跳转时，面板可以保持其打开状态，避免不必要的关闭和重新打开。
        setIsPanelRelevant(true);

        // --- 场景二：页面【没有】搜索面板功能（请取消注释以下代码块并注释掉“场景一”的代码块来使用） ---
        /*
        // 如果当前页面不需要右侧面板，或者它有自己的搜索区域，则执行以下设置：

        // 1. 确保面板内容为空：
        setPanelContent(null);
        // 2. 确保面板标题为空：
        setPanelTitle('');
        // 3. 确保面板宽度恢复默认：
        setPanelWidth(360); // 恢复默认宽度

        // 4. 声明页面与面板不相关：
        //    【重要】将 `isPanelRelevant` 设置为 `false`，告诉 `LayoutContext` 当前页面是“与面板不相关”的。
        //    这会确保当导航到此页面时，如果右侧面板是打开的，它会自动关闭。
        setIsPanelRelevant(false);
        */


        // --- 组件卸载时执行（清理函数）---
        // `useEffect` 可以返回一个函数，这个函数被称为“清理函数”。
        // 它会在组件即将从屏幕上移除（卸载）时被调用。
        // 在这里，我们的清理工作就是重置面板的状态，防止当我们导航到其他页面时，这个页面的搜索面板还残留在那里。
        return () => {
            // 清理面板内容和元数据：
            setPanelContent(null); // 将面板内容设置为空。
            setPanelTitle('');     // 清空标题。
            setPanelWidth(360);    // 恢复默认宽度。
            // 【重要】将 `isPanelRelevant` 设置为 `false`：
            // 无论页面之前是否与面板相关，在卸载时都应将其标记为不相关。
            // 这确保了当页面离开时，LayoutContext 不会错误地认为某个已卸载的页面仍然需要面板。
            setIsPanelRelevant(false);
        };

        // `useEffect` 的第二个参数是依赖项数组。
        // 这个数组告诉 React：“只有当数组中的这些值发生变化时，才需要重新执行上面定义的副作用函数”。
        // 这是一种重要的性能优化，避免了在每次组件重渲染时都去重复设置面板。
        // 在这里，我们的依赖包括了所有从 `useLayout` 获取的方法和我们自己定义的 `handleSearch` 函数。
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);


    // --- 5. JSX 渲染逻辑 ---
    // `return` 语句定义了此页面本身的主体内容。
    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280,
                mx: 'auto',
                py: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Typography variant="h4">模板页面 (Template Page)</Typography>
                    {/* 只有当页面【有】搜索面板功能时才显示此按钮 */}
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={togglePanel} // 点击这个按钮时，调用从 context 获取的 `togglePanel` 方法来打开/关闭面板。
                    >
                        搜索
                    </Button>
                    {/* 如果页面【没有】搜索面板功能，则移除上面的 Button 组件。
                        或者，如果页面有自己的内置搜索功能，可以在这里放置该功能的UI。
                    */}
                </Box>

                {/* 页面的静态内容或动态渲染的列表等 */}
                <Stack spacing={1} sx={{ mt: 2, flexShrink: 0 }}>
                    <Typography>
                        这是一个根据其他页面样式生成的通用模板。
                    </Typography>
                    <Typography>
                        在这里编写您的页面内容。例如：
                    </Typography>
                </Stack>

                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>您的实际内容会在这里渲染。</Typography>
                </Box>
            </Box>
        </Box>
    );
};

// 使用 `export default` 将这个组件导出，以便在路由配置中使用它。
export default TemplatePage;