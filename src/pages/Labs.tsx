/**
 * 文件名: src/pages/Labs.tsx
 *
 * 文件功能描述:
 * 此文件定义了应用的“实验性功能”页面。
 *
 * 本次修改内容:
 * - 【跳转逻辑终极修复】此页面现在负责在挂载时，主动关闭任何可能处于打开状态的搜索面板。
 * - **解决方案**:
 *   1.  在 `useEffect` 中，会直接调用从 `useLayoutDispatch` 中获取的 `closePanel()` 函数。
 * - **最终效果**:
 *   通过让无面板的页面主动承担关闭职责，我们获得了一个简单、健壮且无竞态条件的解决方案。
 */
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useLayoutDispatch } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const Labs: React.FC = () => {
    const { closePanel } = useLayoutDispatch();

    useEffect(() => {
        closePanel();
    }, [closePanel]);

    return (
        <PageLayout>
            <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                实验性功能 (Labs)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些不常用的功能，比如自定义内容的工单</Typography>
        </PageLayout>
    );
};

export default Labs;