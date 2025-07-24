/**
 * 文件名: src/pages/InspectionBackup.tsx
 *
 * 文件功能描述:
 * 此文件是“巡检备份”功能的主页面。
 *
 * 本次修改内容:
 * - 【性能优化】适配了重构后的 LayoutContext。
 * - **优化详情**:
 *   1.  将 `useLayout` 的调用替换为更高效的 `useLayoutDispatch`，因为此组件仅调用更新函数。
 *   2.  在 `useEffect` 中对面板的设置操作使用了 `setTimeout(..., 0)` 进行延迟，以避免与页面过渡动画冲突。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// 【核心修复】导入分离后的新版 Hook
import { useLayoutDispatch } from '../contexts/LayoutContext.tsx';
import InspectionBackupSearchForm, { type InspectionBackupSearchValues } from '../components/forms/InspectionBackupSearchForm.tsx';
import PageLayout from '../layouts/PageLayout';

const InspectionBackup: React.FC = () => {
    // 【核心修复】使用更高效的 Hook
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayoutDispatch();

    const handleSearch = useCallback((values: InspectionBackupSearchValues) => { alert(`搜索条件: ${JSON.stringify(values, null, 2)}`); togglePanel(); }, [togglePanel]);
    const handleReset = useCallback(() => { alert('搜索表单已重置'); }, []);

    // 【核心修复】延迟设置面板状态
    useEffect(() => {
        const timerId = setTimeout(() => {
            setPanelContent(<InspectionBackupSearchForm onSearch={handleSearch} onReset={handleReset} />);
            setPanelTitle('巡检备份搜索');
            setPanelWidth(360);
            setIsPanelRelevant(true);
        }, 0);

        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
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