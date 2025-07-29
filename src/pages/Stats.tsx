/**
 * 文件名: src/pages/Stats.tsx
 *
 * 文件功能描述:
 * 此文件定义了“统计信息”页面。
 *
 * 本次修改内容:
 * - 【跳转逻辑终极修复】此页面现在负责在挂载时，主动关闭任何可能处于打开状态的搜索面板。
 * - **解决方案**:
 *   1.  在 `useEffect` 中，会直接调用从 `useLayoutDispatch` 中获取的 `closePanel()` 函数。
 * - **最终效果**:
 *   通过让无面板的页面主动承担关闭职责，我们获得了一个简单、健壮且无竞态条件的解决方案。
 */
import React, {useEffect} from 'react';
import {Typography} from '@mui/material';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';

const Stats: React.FC = () => {
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