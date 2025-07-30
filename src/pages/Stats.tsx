/**
 * 文件名: src/pages/Stats.tsx
 *
 * 文件功能描述:
 * 此文件定义了“统计信息”页面。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {useEffect, type JSX} from 'react';
import {Typography} from '@mui/material';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';

const Stats = (): JSX.Element => {
    const {closePanel} = useLayoutDispatch();

    useEffect(() => {
        closePanel();
    }, [closePanel]);

    return (
        <PageLayout>
            <Typography variant="h4" sx={{color: 'primary.main'}}>
                统计信息 (Stats)
            </Typography>
            <Typography sx={{mt: 2}}>这里实现一些快速统计的内容，比如列表展示服务器磁盘空间、内存、操作系统</Typography>
        </PageLayout>
    );
};

export default Stats;