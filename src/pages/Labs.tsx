/**
 * 文件名：Labs.tsx
 * 描述：此文件定义了应用的“实验性功能”页面。
 *
 * 本次修改：
 * - 更新了页面标题的样式，使其与应用内其他页面的标题（如“服务器信息”）保持一致。
 * - 将标题颜色绑定到全局主题的 `primary.main` 颜色，确保其能跟随主题变化。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext.tsx';

const Labs: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        // 组件挂载时：标记当前页面与面板不相关
        setIsPanelRelevant(false);

        // 组件卸载时：确保标记当前页面与面板不相关
        return () => {
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]);

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
                <Typography
                    variant="h5"
                    sx={{
                        color: 'primary.main',
                        fontSize: '2rem'
                    }}
                >
                    实验性功能 (Labs)
                </Typography>
                <Typography sx={{ mt: 2 }}>这里实现一些不常用的功能，比如自定义内容的工单</Typography>
            </Box>
        </Box>
    );
};

export default Labs;