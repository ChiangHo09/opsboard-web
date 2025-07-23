/**
 * 文件名: src/pages/Settings.tsx
 *
 * 本次修改内容:
 * - 【布局统一】更新了页面根 `Box` 的样式，使其与其他内容页面（如 Servers）的布局完全一致。
 * - 采用了 `width: { xs: '90%', md: '80%' }`, `maxWidth: 1280`, 和 `mx: 'auto'`
 *   来实现响应式的、居中的内容区域。
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
        // 【核心修复】应用统一的居中和宽度限制样式
        <Box sx={{
            width: { xs: '90%', md: '80%' },
            maxWidth: 1280,
            mx: 'auto',
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