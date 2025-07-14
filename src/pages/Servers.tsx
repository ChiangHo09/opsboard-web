/**
 * 文件功能：
 * 此文件为“服务器信息”页面，负责展示服务器列表数据和提供搜索入口。
 *
 * 本次修改：
 * - 将右侧搜索面板的标题从“高级搜索”修改为“服务器搜索”。
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
        setPanelTitle('服务器搜索'); // 修复点：修改标题
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{ color: '#1976d2', fontSize: '2rem' }}
                    >
                        服务器信息
                    </Typography>
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
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                            搜索
                        </Typography>
                    </Button>
                </Box>
                <Box sx={{ height: '120vh', border: '1px dashed grey', p: 1, flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>这是一个很高的占位符，用于测试主内容区的滚动。</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Servers;