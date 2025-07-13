/*
 * [文件用途说明]
 * - 此文件为“服务器信息”页面，负责展示服务器列表数据和提供搜索入口。
 *
 * [本次修改记录]
 * - 为了实现完美的垂直居中，将按钮内的文本“搜索”包裹在了一个 `<Typography>` 组件中。
 * - 对该 `<Typography>` 组件应用了 `transform: 'translateY(1px)'` 样式。
 * - 这个微小的向下位移修正了文本与图标之间的视觉基线差异，使其在视觉上完全居中。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ServerSearchForm, { type ServerSearchValues } from '../components/forms/ServerSearchForm';

const Servers: React.FC = () => {
    // 从简化的 LayoutContext 获取所需方法
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayout();

    // 搜索处理函数现在接收一个类型安全的对象
    const handleSearch = useCallback((values: ServerSearchValues) => {
        console.log('在 Servers 页面接收到搜索条件:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        togglePanel(); // 搜索后可选择关闭面板
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        alert('重置表单');
    }, []);

    // 使用 useEffect 将独立的表单组件设置到面板中
    useEffect(() => {
        // 直接将一个完整的、带 props 的组件实例设置到面板内容中
        setPanelContent(
            <ServerSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        // 分别设置面板的元数据
        setPanelTitle('服务器搜索');
        setPanelWidth(360);

        // 组件卸载时，清理面板内容
        return () => {
            setPanelContent(null);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    return (
        // 页面主体布局保持不变
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
                    <Typography variant="h4">服务器信息</Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SearchIcon />}
                        onClick={togglePanel}
                        sx={{
                            height: '42px',
                            borderRadius: '50px',
                            bgcolor: '#F0F4F9',
                            color: '#424242',
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            px: 3,
                            '&:hover': {
                                bgcolor: '#E1E5E9',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {/* --- START OF MODIFICATION --- */}
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                            搜索
                        </Typography>
                        {/* --- END OF MODIFICATION --- */}
                    </Button>
                </Box>
                <Typography sx={{ mt: 2, flexShrink: 0 }}>这里实现服务器信息的展示和修改。</Typography>
                <Box sx={{ height: '120vh', mt: 2, border: '1px dashed grey', p: 1, flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>这是一个很高的占位符，用于测试主内容区的滚动。</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Servers;