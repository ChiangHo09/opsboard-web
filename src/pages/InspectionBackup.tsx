/**
 * ================================================================================
 * 文件名称: InspectionBackup.tsx
 * 文件说明:
 * - 此文件是“巡检备份”功能的主页面。
 * - 它是基于通用页面模板创建的，旨在提供一个功能齐全的页面起点，包括与右侧搜索面板的交互逻辑。
 * - 该页面通过 `useLayout` Hook 与全局布局（特别是右侧搜索面板）进行通信。
 * - 在组件挂载时，它会将一个独立的搜索表单组件注入到右侧面板中，并处理其提交的搜索数据。
 *
 * 本次修改记录:
 * - 【核心改动】移除了页面内部的简化版 `InspectionSearchForm` 组件定义。
 * - 【集成】引入并使用了新的独立搜索表单组件 `InspectionBackupSearchForm`。
 * - 【搜索逻辑】更新了 `handleSearch` 回调函数，以接收并处理 `InspectionBackupSearchForm` 提交的新搜索项
 *   （地区、起始时间、截止时间、服务器类型、操作类型）。
 * - 【面板配置】在 `useEffect` 中设置右侧面板的内容为 `InspectionBackupSearchForm`，并配置面板标题、宽度及相关性。
 * - 【清理】确保组件卸载时正确清理面板状态并标记为不相关。
 * - 搜索按钮的样式保持与之前一致。
 * - 【修复】解决了 `Stack` 导入但未使用的 `ESLint` 和 `TS6133` 警告，通过从 `@mui/material` 导入中移除 `Stack`。
 * ================================================================================
 */
import React, { useEffect, useCallback } from 'react'; // 导入 React 库，useEffect Hook 用于副作用处理，useCallback Hook 用于函数记忆化
import {
    Box,        // 灵活的布局容器
    Typography, // 文本排版组件
    Button      // 按钮
    // 【修复】移除 Stack，因为它在该组件的 JSX 中未直接使用
    // Stack
} from '@mui/material'; // 从 Material-UI 导入核心 UI 组件
import SearchIcon from '@mui/icons-material/Search'; // 导入搜索图标

import { useLayout } from '../contexts/LayoutContext.tsx'; // 从自定义的 LayoutContext 中导入 useLayout Hook

// 【新增】导入专门为“巡检备份”页面创建的搜索表单组件及其数据结构接口
import InspectionBackupSearchForm, { type InspectionBackupSearchValues } from '../components/forms/InspectionBackupSearchForm.tsx';

const InspectionBackup: React.FC = () => {
    // --- 1. 使用 useLayout Hook ---
    // 调用 `useLayout()` Hook，从全局的 LayoutContext 中解构出这个页面需要用到的方法。
    // 这些方法用于控制右侧面板的行为和内容。
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    // --- 2. 定义页面的业务逻辑（事件处理函数） ---

    /**
     * 定义当搜索表单提交时，这个页面（巡检备份）应该执行什么操作。
     * 这个函数将被作为 `onSearch` prop 传递给 `InspectionBackupSearchForm` 组件。
     *
     * 使用 `useCallback` 来包裹此函数，以优化性能。它会返回一个“记忆化”的函数版本，
     * 只有当其依赖项数组（第二个参数 `[togglePanel]`）中的值发生变化时，它才会重新创建。
     * 这可以防止 `InspectionBackupSearchForm` 因 `handleSearch` prop 变化而进行不必要的重新渲染。
     *
     * @param {InspectionBackupSearchValues} values - 这是函数接收的参数，包含了所有表单字段的当前值。
     *                                               其类型安全由 `InspectionBackupSearchValues` 接口保证。
     */
    const handleSearch = useCallback((values: InspectionBackupSearchValues) => {
        // 在控制台打印接收到的搜索条件，方便调试。
        console.log('在巡检备份页面执行搜索:', values);
        // 使用 alert 模拟一个搜索操作。在实际应用中，这里应该是调用 API 发起网络请求，
        // 并根据 `values` 更新页面的巡检备份记录列表。
        alert(`搜索条件: ${JSON.stringify(values, null, 2)}`); // JSON.stringify 格式化输出，便于查看复杂对象
        togglePanel(); // 在执行搜索后自动关闭右侧搜索面板
    }, [togglePanel]); // 依赖项数组中包含 `togglePanel`

    /**
     * 定义当搜索表单点击重置按钮时，此页面可能需要执行的额外操作。
     *
     * 同样使用 `useCallback` 进行性能优化。
     */
    const handleReset = useCallback(() => {
        // 在这里，您可以添加一些仅与“巡检备份”页面相关的重置逻辑，
        // 例如清空页面上已展示的巡检备份列表数据等。
        console.log('巡检备份页面感知到搜索表单已重置');
        alert('搜索表单已重置');
    }, []); // 空依赖数组意味着此函数只会被创建一次

    // --- 3. 使用 useEffect Hook 配置页面与面板的交互 ---
    // `useEffect` 用于处理在组件渲染后执行的“副作用”操作，例如配置右侧面板。
    // 它在组件挂载后运行一次，并在依赖项变化时重新运行，在组件卸载前执行清理函数。
    useEffect(() => {
        // 1. 设置右侧面板的内容为我们的搜索表单组件。
        //    将 `handleSearch` 和 `handleReset` 函数作为 props 传递给 `InspectionBackupSearchForm`。
        setPanelContent(
            <InspectionBackupSearchForm onSearch={handleSearch} onReset={handleReset} />
        );

        // 2. 设置右侧面板的标题。
        setPanelTitle('巡检备份搜索');

        // 3. 设置右侧面板的宽度。
        setPanelWidth(360); // 设置一个适合搜索面板的宽度

        // 4. 声明页面与面板的相关性：
        //    将其设置为 `true`，告诉 `LayoutContext` 当前页面是“与面板相关”的。
        //    这使得在有搜索面板的页面之间跳转时，面板可以保持其打开状态，避免不必要的关闭和重新打开。
        setIsPanelRelevant(true);

        // --- 组件卸载时执行（清理函数）---
        // `useEffect` 返回的函数会在组件卸载时被调用，用于清理资源或重置状态。
        return () => {
            setPanelContent(null);   // 清空面板内容
            setPanelTitle('');       // 清空面板标题
            setPanelWidth(360);      // 恢复面板默认宽度
            setIsPanelRelevant(false); // 在页面卸载时，将页面标记为与面板不相关
        };

        // `useEffect` 的依赖项数组。只有当这些值发生变化时，`useEffect` 内部的代码才会重新执行。
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);


    // --- 4. JSX 渲染逻辑 ---
    // 定义此页面本身的主体内容。
    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
                width: { xs: '90%', md: '80%' }, // 在小屏幕上占90%，中等及以上屏幕占80%
                maxWidth: 1280, // 最大宽度限制
                mx: 'auto',     // 水平居中
                py: 4,          // 垂直内边距
                flexGrow: 1,    // 占据可用垂直空间
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* 页面头部：标题和搜索按钮 */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Typography variant="h4">巡检备份</Typography>
                    <Button
                        variant="contained" // 填充背景的按钮样式
                        startIcon={<SearchIcon />} // 按钮左侧的搜索图标
                        onClick={togglePanel} // 点击按钮时，调用 `togglePanel` 函数来打开/关闭右侧面板
                        sx={{
                            height: '42px',      // 固定按钮高度
                            borderRadius: '50px', // 圆角样式
                            bgcolor: '#F0F4F9',  // 背景颜色
                            color: '#424242',    // 文字颜色
                            boxShadow: 'none',   // 移除阴影
                            textTransform: 'none', // 不进行文本大写转换
                            fontSize: '15px',    // 字体大小
                            fontWeight: 500,     // 字体粗细
                            px: 3,               // 水平内边距
                            '&:hover': {         // 鼠标悬停时的样式
                                bgcolor: '#E1E5E9', // 悬停时背景色变浅
                                boxShadow: 'none',  // 悬停时也无阴影
                            },
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                            搜索
                        </Typography>
                    </Button>
                </Box>
                {/* 页面内容区域：此处为占位符，实际将用于展示巡检备份记录列表 */}
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>这里将用于展示巡检任务和备份记录列表。</Typography>
                    <Typography sx={{ mt: 1 }}>请使用右侧的搜索面板来筛选数据。</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default InspectionBackup; // 导出 InspectionBackup 组件