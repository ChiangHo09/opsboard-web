/**
 * 文件名: src/pages/Tickets.tsx
 *
 * 本次修改内容:
 * - 【布局简化】移除了传递给 `PageLayout` 的 `sx` 属性。
 * - 垂直内边距现在由 `PageLayout` 组件内部统一处理。
 *
 * 文件功能描述:
 * 此文件定义了“工单”页面。
 */
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const Tickets: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => { setIsPanelRelevant(false); };
    }, [setIsPanelRelevant]);

    return (
        <PageLayout>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
                工单 (Tickets)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些快速制作工单的功能，通过更新记录直接生成工单</Typography>
        </PageLayout>
    );
};

export default Tickets;