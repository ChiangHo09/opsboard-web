/**
 * 文件名：Tickets.tsx
 * 描述：此文件定义了“工单”页面。
 *
 * 本次修改：
 * - 【问题修复】为页面标题的 `Typography` 组件添加了 `sx={{ color: 'primary.main' }}` 属性，使其颜色能正确地跟随全局主题变化。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext.tsx';

const Tickets: React.FC = () => {
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
                    工单 (Tickets)
                </Typography>
                <Typography sx={{ mt: 2 }}>这里实现一些快速制作工单的功能，通过更新记录直接生成工单</Typography>
            </Box>
        </Box>
    );
};

export default Tickets;