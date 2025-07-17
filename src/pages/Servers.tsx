/**
 * 文件名：Servers.tsx
 * 描述：此文件为“服务器信息”页面，负责展示服务器列表数据和提供搜索入口。
 *
 * 本次修改：
 * - 【问题修复】将页面右上角“搜索”按钮的背景色和悬停色指向了新的、语义更清晰的 `app.button.background` 和 `app.button.hover` 主题颜色，解决了按钮颜色对比度不足的问题。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ServerSearchForm, { type ServerSearchValues } from '../components/forms/ServerSearchForm';

const Servers: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    const handleSearch = useCallback((values: ServerSearchValues) => {
        console.log('在 Servers 页面接收到搜索条件:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        alert('重置表单');
    }, []);

    useEffect(() => {
        setPanelContent(
            <ServerSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        setPanelTitle('服务器搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);

        return () => {
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{ color: 'primary.main', fontSize: '2rem' }}
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
                            bgcolor: 'app.button.background', // 使用新的按钮背景色
                            color: 'neutral.main',
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            px: 3,
                            '&:hover': {
                                bgcolor: 'app.button.hover', // 使用新的按钮悬停色
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