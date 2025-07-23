/**
 * 文件名: src/pages/Labs.tsx
 *
 * 本次修改内容:
 * - 【布局对齐】为了适应 `MainLayout` 最新的“父级控制滚动”模型，彻底简化了此页面的布局。
 * - 移除了所有 `height`, `display: 'flex'`, 和 `flexGrow` 等强制布局属性。
 * - 页面现在回归到简单的、由内容驱动高度的自然文档流，将滚动控制权完全交还给父级布局。
 *
 * 文件功能描述:
 * 此文件定义了应用的“实验性功能”页面。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext.tsx';

const Labs: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => {
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]);

    return (
        <Box sx={{
            width: { xs: '90%', md: '80%' },
            maxWidth: 1280,
            mx: 'auto',
            py: 4,
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
    );
};

export default Labs;