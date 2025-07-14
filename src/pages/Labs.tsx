import React, { useEffect } from 'react'; // 导入 useEffect
import { Box, Typography } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext.tsx'; // 导入 useLayout

const Labs: React.FC = () => {
    const { setIsPanelRelevant } = useLayout(); // 获取 setIsPanelRelevant

    useEffect(() => {
        // 组件挂载时：标记当前页面与面板不相关
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
                <Typography variant="h4">实验性功能 (Labs)</Typography>
                <Typography sx={{ mt: 2 }}>这里实现一些不常用的功能，比如自定义内容的工单</Typography>
            </Box>
        </Box>
    );
};

export default Labs;