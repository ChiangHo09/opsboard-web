/**
 * 文件名：Search.tsx
 * 描述：此文件定义了应用的“全局搜索”页面。
 *
 * 本次修改：
 * - 更新了页面标题的样式，将硬编码的颜色值（`#1976d2`）修改为引用自全局主题的 `primary.main` 颜色。
 * - 这确保了标题颜色能跟随应用主题的变化，保持视觉统一性。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useLayout } from '../contexts/LayoutContext.tsx';

const Search: React.FC = () => {
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'primary.main', // 使用主题颜色
                            fontSize: '2rem'
                        }}
                    >
                        全局搜索 (Search)
                    </Typography>
                </Box>
                <Typography sx={{ mt: 2 }}>这里实现搜索框与结果…</Typography>
            </Box>
        </Box>
    );
};

export default Search;