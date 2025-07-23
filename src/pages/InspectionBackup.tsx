/**
 * 文件名: src/pages/InspectionBackup.tsx
 *
 * 本次修改内容:
 * - 【布局统一】使用 `PageLayout` 组件来包裹页面内容，确保布局与其他页面完全一致。
 *
 * 文件功能描述:
 * 此文件是“巡检备份”功能的主页面。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import InspectionBackupSearchForm, { type InspectionBackupSearchValues } from '../components/forms/InspectionBackupSearchForm.tsx';
import PageLayout from '../layouts/PageLayout';

const InspectionBackup: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    const handleSearch = useCallback((values: InspectionBackupSearchValues) => { alert(`搜索条件: ${JSON.stringify(values, null, 2)}`); togglePanel(); }, [togglePanel]);
    const handleReset = useCallback(() => { alert('搜索表单已重置'); }, []);

    useEffect(() => {
        setPanelContent(<InspectionBackupSearchForm onSearch={handleSearch} onReset={handleReset} />);
        setPanelTitle('巡检备份搜索'); setPanelWidth(360); setIsPanelRelevant(true);
        return () => { setPanelContent(null); setPanelTitle(''); setPanelWidth(360); setIsPanelRelevant(false); };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    return (
        <PageLayout>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                    巡检备份
                </Typography>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={togglePanel} sx={{ height: '42px', borderRadius: '50px', bgcolor: 'app.button.background', color: 'neutral.main', boxShadow: 'none', textTransform: 'none', fontSize: '15px', fontWeight: 500, px: 3, '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' } }}>
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                        搜索
                    </Typography>
                </Button>
            </Box>
            <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', minHeight: '300px' }}>
                <Typography>这里将用于展示巡检任务和备份记录列表。</Typography>
                <Typography sx={{ mt: 1 }}>请使用右侧的搜索面板来筛选数据。</Typography>
            </Box>
        </PageLayout>
    );
};

export default InspectionBackup;