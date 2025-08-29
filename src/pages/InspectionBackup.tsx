/**
 * @file src/pages/InspectionBackup.tsx
 * @description 此文件是“巡检备份”功能的主页面。
 * @modification
 *   - [Bug修复]：修复 `TS6133: 'closePanel' is declared but its value is never read.` 警告。由于 `closePanel` 在组件中不再被使用，将其从 `useLayoutDispatch()` 的解构中移除。
 *   - [Bug修复]：移除在组件首次挂载时无条件调用 `closePanel()` 的 `useEffect` 钩子。此举旨在解决在其他页面之间打开搜索面板切换到“巡检备份”页面时，搜索面板会自动收起的问题。现在，“巡检备份”页面将像其他数据列表页面一样，尊重 `LayoutContext` 中 `isPanelOpen` 的持久化状态。
 *   - [Bug修复]：修复 `TS6133: 'useState' is declared but its value is never read.` 错误。由于 `useState` 钩子不再被使用，从导入列表中移除它。
 *   - [Bug修复]：修复 `TS2304: Cannot find name 'closePanel'.` 错误。从 `useLayoutDispatch()` 钩子中解构出 `closePanel` 函数。
 *   - [动画优化]：移除 `isPanelContentSet` 状态及其相关 `useEffect`。修改设置搜索面板内容的 `useEffect`，使其直接依赖 `isPanelOpen` 并移除 `setTimeout(0)`。此举旨在消除面板内容设置的延迟和潜在竞态条件，解决搜索面板在页面切换时“闪现然后自动收起”的问题，确保面板内容与 `isPanelOpen` 状态同步。
 *   - [组件写法现代化]：移除了 `React.FC`，采用了现代的函数组件定义方式，并显式注解了 `: JSX.Element` 返回值类型。
 */
import {useEffect, useCallback, lazy, Suspense, type JSX} from 'react';
import {Box, Typography, Button, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type InspectionBackupSearchValues} from '@/components/forms/InspectionBackupSearchForm.tsx';
import PageLayout from '@/layouts/PageLayout';

const InspectionBackupSearchForm = lazy(() => import('@/components/forms/InspectionBackupSearchForm.tsx'));

const InspectionBackup = (): JSX.Element => {
    const {isPanelOpen} = useLayoutState();
    // 【核心修改】从 useLayoutDispatch 中移除 closePanel 的解构
    const {togglePanel, setPanelContent, setPanelTitle, setPanelWidth} = useLayoutDispatch();
    // 移除 isPanelContentSet 状态
    // const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    // 移除此 useEffect 钩子，不再强制关闭面板
    // useEffect(() => {
    //     closePanel();
    // }, []);

    const handleSearch = useCallback((values: InspectionBackupSearchValues) => {
        alert(`搜索条件: ${JSON.stringify(values, null, 2)}`);
        togglePanel();
    }, [togglePanel]);
    const handleReset = useCallback(() => {
        alert('搜索表单已重置');
    }, []);

    // 修改设置面板内容的 useEffect
    useEffect(() => {
        // 如果面板未打开，则立即清除内容
        if (!isPanelOpen) {
            setPanelContent(null);
            setPanelTitle('');
            return;
        }

        // 如果面板打开，则设置内容（无需 setTimeout）
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

        // 清理函数：当 isPanelOpen 变为 false 或组件卸载时，清除内容
        return () => {
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelOpen, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]); // 依赖 isPanelOpen

    const handleTogglePanel = () => {
        // 移除 isPanelContentSet 的设置
        // if (!isPanelContentSet) {
        //     setIsPanelContentSet(true);
        // }
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