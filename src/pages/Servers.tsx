/*****************************************************************
 *  src/pages/Servers.tsx
 *  FINAL FIX: 页面自己负责完整的内部布局，包括所有内边距和间距
 *****************************************************************/
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';

type ServerSearchForm = Record<string, unknown>;

const Servers: React.FC = () => {
    // 从 useLayout 解构出需要的状态和方法
    const { togglePanel, setPanelContent, setPanelActions } = useLayout();

    // 定义页面特定的搜索处理函数
    const handleSearch = useCallback((values: ServerSearchForm) => {
        console.log('在 Servers 页面执行搜索:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        // 这里可以执行实际的搜索逻辑
    }, []);

    // 定义页面特定的重置处理函数
    const handleReset = useCallback(() => {
        alert('重置表单');
        // 这里可以执行实际的重置逻辑
    }, []);

    // 使用 useEffect 将 RightSearchPanel 的内容和逻辑设置到 LayoutContext
    useEffect(() => {
        // 构建右侧搜索面板的内容
        const panelInnerContent = (
            <React.Fragment>
                <TextField fullWidth margin="normal" label="IP 地址" variant="outlined" />
                <TextField fullWidth margin="normal" label="服务器名称" variant="outlined" />
                <TextField fullWidth margin="normal" label="状态" variant="outlined" />
            </React.Fragment>
        );

        // 设置面板内容到 Context
        setPanelContent(panelInnerContent);

        // 设置面板动作（onSearch, onReset, title 等）到 Context
        setPanelActions({
            onSearch: handleSearch, // 传递本页的搜索处理函数
            onReset: handleReset,   // 传递本页的重置处理函数
            title: '服务器搜索', // 为面板设置自定义标题
            width: 360, // 为面板设置自定义宽度
            showActionBar: true, // 是否显示动作条
        });

        // 返回一个清理函数，当组件卸载时清除面板内容和动作
        return () => {
            setPanelContent(null); // 清除面板内容
            setPanelActions({});   // 清除面板动作
        };
    }, [setPanelContent, setPanelActions, handleSearch, handleReset]); // 依赖项只包含设置函数和回调

    return (
        // 外层 Box: 不再需要 p:3，因为显示区域的边距现在由 MainLayout 中的白色背景 Box 提供。
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            {/* 内层 Box，用于控制内容的响应式宽度和居中，并添加内部上下边距 */}
            <Box sx={{
                width: { xs: '90%', md: '80%' }, // 小屏幕 90% 宽度 (各留 5% 留白)，中大屏幕 80% 宽度 (各留 10% 留白)
                maxWidth: 1280, // 内容最大宽度限制
                mx: 'auto', // 自动左右外边距，实现居中和两侧留白
                py: 4, // 为内容区域添加上下内边距
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Typography variant="h4">服务器信息</Typography>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={togglePanel} // 调用 LayoutContext 的 togglePanel
                    >
                        搜索
                    </Button>
                </Box>
                <Typography sx={{ mt: 2, flexShrink: 0 }}>这里实现服务器信息的展示和修改。</Typography>
                <Box sx={{ height: '120vh', mt: 2, border: '1px dashed grey', p: 1, flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>这是一个很高的占位符，用于测试主内容区的滚动。</Typography>
                </Box>
            </Box>
            {/* 注意：RightSearchPanel 不再在这里直接渲染 */}
        </Box>
    );
};

export default Servers;
