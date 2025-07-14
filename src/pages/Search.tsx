import React, { useEffect } from 'react'; // 仅保留 useEffect，因为所有页面都需要设置 isPanelRelevant
import { Box, Typography } from '@mui/material'; // 移除 Button, TextField, Stack
// 移除 SearchIcon
import { useLayout } from '../contexts/LayoutContext.tsx'; // 导入 useLayout

// 移除 GlobalSearchForm 组件，因为它不再需要

const Search: React.FC = () => {
    // 仅获取 setIsPanelRelevant，因为不再需要设置面板内容、标题和宽度
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        // 组件挂载时：标记当前页面与面板不相关
        // 全局搜索页面本身就是搜索功能，不需要额外的右侧面板
        setIsPanelRelevant(false);

        // 组件卸载时：确保标记当前页面与面板不相关
        return () => {
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]); // 依赖项

    return (
        // 外层 Box: 不再需要 p:3，因为显示区域的边距现在由 MainLayout 中的白色背景 Box 提供。
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            {/* 内层 Box，用于控制内容的响应式宽度和居中，并添加内部上下边距 */}
            <Box sx={{
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280,
                mx: 'auto',
                py: 4, // 为内容区域添加上下内边距
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{ color: '#1976d2', fontSize: '2rem' }}
                    >
                        全局搜索 (Search)
                    </Typography>
                    {/* 移除搜索按钮，因为不再需要打开右侧面板 */}
                </Box>
                <Typography sx={{ mt: 2 }}>这里实现搜索框与结果…</Typography>
                {/* 在这里放置您的搜索框和搜索结果列表等内容 */}
            </Box>
        </Box>
    );
};

export default Search;