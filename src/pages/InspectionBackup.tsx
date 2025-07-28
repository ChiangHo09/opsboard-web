/**
 * 文件名: src/pages/InspectionBackup.tsx
 *
 * 文件功能描述:
 * 此文件是“巡检备份”功能的主页面。
 *
 * 本次修改内容:
 * - 【跨页加载修复】修复了当面板已打开时，跳转到此页面，面板会卡在加载状态的问题。
 * - **问题根源**:
 *   页面的内容加载逻辑依赖于一个本地状态 `isPanelContentSet`，而这个状态无法感知到面板在跳转前就已经打开的全局状态。
 * - **解决方案**:
 *   1.  引入 `useLayoutState` 来获取全局的 `isPanelOpen` 状态。
 *   2.  添加一个新的 `useEffect`，它会在组件挂载时检查 `isPanelOpen`。
 *   3.  如果 `isPanelOpen` 为 `true`，则立即将本地的 `isPanelContentSet` 设置为 `true`，从而触发本页面搜索表单的加载和渲染。
 * - **最终效果**:
 *   现在，当面板打开时，在具备搜索功能的页面之间跳转，面板内容能够正确、无缝地从一个表单过渡到另一个表单，不再卡在加载状态。
 */
import React, {useEffect, useCallback, useState, lazy, Suspense} from 'react';
import {Box, Typography, Button, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '../contexts/LayoutContext.tsx';
import {type InspectionBackupSearchValues} from '../components/forms/InspectionBackupSearchForm.tsx';
import PageLayout from '../layouts/PageLayout';

const InspectionBackupSearchForm = lazy(() => import('../components/forms/InspectionBackupSearchForm.tsx'));

const InspectionBackup: React.FC = () => {
    const {isPanelOpen} = useLayoutState();
    const {togglePanel, setPanelContent, setPanelTitle, setPanelWidth} = useLayoutDispatch();
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    // 【核心修复】添加此 effect 以同步全局面板状态
    useEffect(() => {
        // 如果此页面挂载时，面板已经是打开状态，则立即触发内容加载
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    const handleSearch = useCallback((values: InspectionBackupSearchValues) => {
        alert(`搜索条件: ${JSON.stringify(values, null, 2)}`);
        togglePanel();
    }, [togglePanel]);
    const handleReset = useCallback(() => {
        alert('搜索表单已重置');
    }, []);

    useEffect(() => {
        if (!isPanelContentSet) return;

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <InspectionBackupSearchForm onSearch={handleSearch} onReset={handleReset}/>
                </Suspense>
            );
            setPanelTitle('巡检备份搜索');
            setPanelWidth(360);
        }, 0);

        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    return (
        <PageLayout>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h4" sx={{color: 'primary.main', fontSize: '2rem'}}>
                    巡检备份
                </Typography>
                <Button variant="contained" startIcon={<SearchIcon/>} onClick={handleTogglePanel} sx={{
                    height: '42px',
                    borderRadius: '50px',
                    bgcolor: 'app.button.background',
                    color: 'neutral.main',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 500,
                    px: 3,
                    '&:hover': {bgcolor: 'app.button.hover', boxShadow: 'none'}
                }}>
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>
                        搜索
                    </Typography>
                </Button>
            </Box>
            <Box sx={{mt: 2, p: 2, border: '1px dashed grey', minHeight: '300px'}}>
                <Typography>这里将用于展示巡检任务和备份记录列表。</Typography>
                <Typography sx={{mt: 1}}>请使用右侧的搜索面板来筛选数据。</Typography>
            </Box>
        </PageLayout>
    );
};

export default InspectionBackup;