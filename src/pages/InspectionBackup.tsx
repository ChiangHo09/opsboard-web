/**
 * 文件名: src/pages/InspectionBackup.tsx
 *
 * 文件功能描述:
 * 此文件是“巡检备份”功能的主页面。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {useEffect, useCallback, useState, lazy, Suspense, type JSX} from 'react';
import {Box, Typography, Button, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type InspectionBackupSearchValues} from '@/components/forms/InspectionBackupSearchForm.tsx';
import PageLayout from '@/layouts/PageLayout';

const InspectionBackupSearchForm = lazy(() => import('@/components/forms/InspectionBackupSearchForm.tsx'));

const InspectionBackup = (): JSX.Element => {
    const {isPanelOpen} = useLayoutState();
    const {togglePanel, setPanelContent, setPanelTitle, setPanelWidth} = useLayoutDispatch();
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    useEffect(() => {
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