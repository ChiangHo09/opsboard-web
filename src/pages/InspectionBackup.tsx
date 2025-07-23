/**
 * 文件名: src/pages/InspectionBackup.tsx
 *
 * 本次修改内容:
 * - 【布局统一】更新了页面根 `Box` 的样式，使其与其他内容页面（如 Servers）的布局完全一致。
 * - 采用了 `width: { xs: '90%', md: '80%' }`, `maxWidth: 1280`, 和 `mx: 'auto'`
 *   来实现响应式的、居中的内容区域。
 *
 * 文件功能描述:
 * 此文件是“巡检备份”功能的主页面。
 */
import React, { useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useLayout } from '../contexts/LayoutContext.tsx';
import InspectionBackupSearchForm, { type InspectionBackupSearchValues } from '../components/forms/InspectionBackupSearchForm.tsx';

const InspectionBackup: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    const handleSearch = useCallback((values: InspectionBackupSearchValues) => {
        console.log('在巡检备份页面执行搜索:', values);
        alert(`搜索条件: ${JSON.stringify(values, null, 2)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        console.log('巡检备份页面感知到搜索表单已重置');
        alert('搜索表单已重置');
    }, []);

    useEffect(() => {
        setPanelContent(
            <InspectionBackupSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        setPanelTitle('巡检备份搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);

        return () => {
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);


    return (
        // 【核心修复】应用统一的居中和宽度限制样式
        <Box sx={{
            width: { xs: '90%', md: '80%' },
            maxWidth: 1280,
            mx: 'auto',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                    巡检备份
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={togglePanel}
                    sx={{
                        height: '42px',
                        borderRadius: '50px',
                        bgcolor: 'app.button.background',
                        color: 'neutral.main',
                        boxShadow: 'none',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        px: 3,
                        '&:hover': {
                            bgcolor: 'app.button.hover',
                            boxShadow: 'none',
                        },
                    }}
                >
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                        搜索
                    </Typography>
                </Button>
            </Box>
            <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', minHeight: '300px' }}>
                <Typography>这里将用于展示巡检任务和备份记录列表。</Typography>
                <Typography sx={{ mt: 1 }}>请使用右侧的搜索面板来筛选数据。</Typography>
            </Box>
        </Box>
    );
};

export default InspectionBackup;