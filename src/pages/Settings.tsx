/**
 * 文件名: src/pages/Settings.tsx
 *
 * 本次修改内容:
 * - 【布局简化】移除了传递给 `PageLayout` 的 `sx` 属性。
 * - 垂直内边距现在由 `PageLayout` 组件内部统一处理。
 *
 * 文件功能描述:
 * 此文件定义了应用的“设置”页面。
 */
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const Settings: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => { setIsPanelRelevant(false); };
    }, [setIsPanelRelevant]);

    return (
        <PageLayout>
            <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                设置 (Settings)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
        </PageLayout>
    );
};

export default Settings;