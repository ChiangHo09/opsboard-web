/**
 * @file src/pages/Search.tsx
 * @description 此文件定义了应用的“全局搜索”页面。
 * @modification
 *   - [动画优化]：修改 `useEffect` 钩子的依赖数组为 `[]`。此举确保 `closePanel()` 只在组件首次挂载时执行一次，从而解决首次登录或导航到此页面时，搜索面板“弹出一个面板然后自动收起”的用户体验问题。
 *   - [组件写法现代化]：移除了 `React.FC`，采用了现代的函数组件定义方式，并显式注解了 `: JSX.Element` 返回值类型。
 */
import {type JSX, useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';

const Search = (): JSX.Element => {
    const {closePanel} = useLayoutDispatch();

    // 【核心修改】将 useEffect 的依赖数组更改为 []
    useEffect(() => {
        closePanel();
    }, []); // 仅在组件首次挂载时运行一次

    return (
        <PageLayout>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4}}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>
                    全局搜索 (Search)
                </Typography>
            </Box>
            <Typography sx={{mt: 2}}>这里实现搜索框与结果…</Typography>
        </PageLayout>
    );
};

export default Search;