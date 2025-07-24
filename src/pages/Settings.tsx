/**
 * 文件名: src/pages/Settings.tsx
 *
 * 文件功能描述:
 * 此文件定义了应用的“设置”页面。
 *
 * 本次修改内容:
 * - 【性能优化】适配了重构后的 LayoutContext。
 * - **优化详情**:
 *   1.  将 `useLayout` 的调用替换为更高效的 `useLayoutDispatch`。
 *   2.  在 `useEffect` 中对面板的设置操作使用了 `setTimeout(..., 0)` 进行延迟。
 */
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
// 【核心修复】导入分离后的新版 Hook
import { useLayoutDispatch } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const Settings: React.FC = () => {
    // 【核心修复】使用更高效的 Hook
    const { setIsPanelRelevant } = useLayoutDispatch();

    // 【核心修复】延迟设置面板状态
    useEffect(() => {
        const timerId = setTimeout(() => {
            setIsPanelRelevant(false);
        }, 0);
        return () => {
            clearTimeout(timerId);
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]);

    return (
        <PageLayout>
            <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                设置 (Settings)
            </Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
        </PageLayout>
    );
};

export default Settings;