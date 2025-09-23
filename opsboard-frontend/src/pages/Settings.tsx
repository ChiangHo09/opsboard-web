/**
 * @file src/pages/Settings.tsx
 * @description 此文件定义了应用的“设置”页面。
 * @modification
 *   - [动画优化]：修改 `useEffect` 钩子的依赖数组为 `[]`。此举确保 `closePanel()` 只在组件首次挂载时执行一次，从而解决首次登录或导航到此页面时，搜索面板“弹出一个面板然后自动收起”的用户体验问题。
 *   - [组件写法现代化]：移除了 `React.FC`，采用了现代的函数组件定义方式，并显式注解了 `: JSX.Element` 返回值类型。
 */
import {useEffect, type JSX} from 'react';
import {Typography} from '@mui/material';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';

const Settings = (): JSX.Element => {
    const {closePanel} = useLayoutDispatch();

    // 【核心修改】将 useEffect 的依赖数组更改为 []
    useEffect(() => {
        closePanel();
    }, []); // 仅在组件首次挂载时运行一次

    return (
        <PageLayout>
            <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>
                设置 (Settings)
            </Typography>
            <Typography sx={{mt: 2}}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
        </PageLayout>
    );
};

export default Settings;