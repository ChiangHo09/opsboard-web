/**
 * 文件名: src/pages/Settings.tsx
 *
 * 文件功能描述:
 * 此文件定义了应用的“设置”页面。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {useEffect, type JSX} from 'react';
import {Typography} from '@mui/material';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';

const Settings = (): JSX.Element => {
    const {closePanel} = useLayoutDispatch();

    useEffect(() => {
        closePanel();
    }, [closePanel]);

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