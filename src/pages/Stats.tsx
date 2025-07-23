/**
 * 文件名: src/pages/Stats.tsx
 *
 * 本次修改内容:
 * - 【布局简化】移除了传递给 `PageLayout` 的 `sx` 属性。
 * - 垂直内边距现在由 `PageLayout` 组件内部统一处理。
 *
 * 文件功能描述:
 * 此文件定义了“统计信息”页面。
 */
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const Stats: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => { setIsPanelRelevant(false); };
    }, [setIsPanelRelevant]);

    return (
        <PageLayout>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
                统计信息 (Stats)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些快速统计的内容，比如列表展示服务器磁盘空间、内存、操作系统</Typography>
        </PageLayout>
    );
};

export default Stats;