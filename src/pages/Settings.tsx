/**
 * 文件名: src/pages/Settings.tsx
 *
 * 本次修改内容:
 * - 【布局对齐】为了适应 `MainLayout` 最新的“父级控制滚动”模型，彻底简化了此页面的布局。
 * - 移除了所有 `height`, `display: 'flex'`, 和 `flexGrow` 等强制布局属性。
 * - 页面现在回归到简单的、由内容驱动高度的自然文档流，将滚动控制权完全交还给父级布局。
 *
 * 文件功能描述:
 * 此文件定义了应用的“设置”页面。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext.tsx';

const Settings: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => {
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]);

    return (
        <Box sx={{
            width: '100%', // 宽度占满父容器
            // 不再需要 height, display:flex, flexGrow
        }}>
            <Typography
                variant="h5"
                sx={{
                    color: 'primary.main',
                    fontSize: '2rem'
                }}
            >
                设置 (Settings)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
        </Box>
    );
};

export default Settings;