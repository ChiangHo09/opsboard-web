/**
 * 文件名: src/pages/Labs.tsx
 *
 * 本次修改内容:
 * - 【布局简化】移除了传递给 `PageLayout` 的 `sx` 属性。
 * - 垂直内边距现在由 `PageLayout` 组件内部统一处理。
 *
 * 文件功能描述:
 * 此文件定义了应用的“实验性功能”页面。
 */
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const Labs: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => { setIsPanelRelevant(false); };
    }, [setIsPanelRelevant]);

    return (
        <PageLayout>
            <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                实验性功能 (Labs)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些不常用的功能，比如自定义内容的工单</Typography>
        </PageLayout>
    );
};

export default Labs;