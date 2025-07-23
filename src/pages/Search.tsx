/**
 * 文件名: src/pages/Search.tsx
 *
 * 本次修改内容:
 * - 【布局简化】移除了传递给 `PageLayout` 的 `sx` 属性。
 * - 垂直内边距现在由 `PageLayout` 组件内部统一处理。
 *
 * 文件功能描述:
 * 此文件定义了应用的“全局搜索”页面。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const Search: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => { setIsPanelRelevant(false); };
    }, [setIsPanelRelevant]);

    return (
        <PageLayout>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                    全局搜索 (Search)
                </Typography>
            </Box>
            <Typography sx={{ mt: 2 }}>这里实现搜索框与结果…</Typography>
        </PageLayout>
    );
};

export default Search;