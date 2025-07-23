/**
 * 文件名: src/pages/Stats.tsx
 *
 * 本次修改内容:
 * - 【布局对齐】为了适应 `MainLayout` 最新的“父级控制滚动”模型，彻底简化了此页面的布局。
 * - 移除了所有 `height`, `display: 'flex'`, 和 `flexGrow` 等强制布局属性。
 * - 页面现在回归到简单的、由内容驱动高度的自然文档流，将滚动控制权完全交还给父级布局。
 *
 * 文件功能描述:
 * 此文件定义了“统计信息”页面。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext.tsx';

const Stats: React.FC = () => {
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
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
                统计信息 (Stats)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些快速统计的内容，比如列表展示服务器磁盘空间、内存、操作系统</Typography>
        </Box>
    );
};

export default Stats;