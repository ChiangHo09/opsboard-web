/**
 * 文件名: src/pages/Labs.tsx
 *
 * 文件功能描述:
 * 此文件定义了应用的“实验性功能”页面。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {type JSX, useEffect} from 'react';
import {Typography} from '@mui/material';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';

const Labs = (): JSX.Element => {
    const {closePanel} = useLayoutDispatch();

    useEffect(() => {
        closePanel();
    }, [closePanel]);

    return (
        <PageLayout>
            <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>
                实验性功能 (Labs)
            </Typography>
            <Typography sx={{mt: 2}}>这里实现一些不常用的功能，比如自定义内容的工单</Typography>
        </PageLayout>
    );
};

export default Labs;