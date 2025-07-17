/**
 * 文件名：Stats.tsx
 * 描述：此文件定义了“统计信息”页面。
 *
 * 本次修改：
 * - 【问题修复】为页面标题的 `Typography` 组件添加了 `sx={{ color: 'primary.main' }}` 属性，使其颜色能正确地跟随全局主题变化。
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
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    统计信息 (Stats)
                </Typography>
                <Typography sx={{ mt: 2 }}>这里实现一些快速统计的内容，比如列表展示服务器磁盘空间、内存、操作系统</Typography>
            </Box>
        </Box>
    );
};

export default Stats;