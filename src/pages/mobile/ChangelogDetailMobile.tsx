/**
 * 文件名: src/pages/mobile/ChangelogDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个专用于【移动端】的更新日志详情页面。它现在负责处理从移动端到桌面端的视图切换。
 *
 * 本次修改内容:
 * - 【响应式逻辑修复】引入了 `useEffect` 来处理视图切换，确保响应式切换的闭环。
 * - **解决方案**:
 *   1.  **引入 `useLayoutState`**: 获取实时的 `isMobile` 状态。
 *   2.  **添加 `useEffect`**: 在此组件内部，监听 `isMobile` 的变化。当 `isMobile` 变为 `false` 时，立即将用户重定向回桌面端的对应 URL。
 */
import React, { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../../layouts/PageLayout';
import { useLayoutState } from '../../contexts/LayoutContext.tsx';

const ChangelogDetailContent = lazy(() => import('../../components/modals/ChangelogDetailContent.tsx'));

const ChangelogDetailMobile: React.FC = () => {
    const navigate = useNavigate();
    const { logId } = useParams<{ logId: string }>();
    const { isMobile } = useLayoutState();

    // 【核心修复】添加此 effect 来处理从移动端到桌面端的视图切换
    useEffect(() => {
        if (logId && !isMobile) {
            navigate(`/app/changelog/${logId}`, { replace: true });
        }
    }, [isMobile, logId, navigate]);

    if (!logId) {
        return null;
    }

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                <IconButton onClick={() => navigate(-1)} aria-label="返回">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1 }}>
                    日志详情
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Suspense fallback={
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }>
                    <ChangelogDetailContent logId={logId} />
                </Suspense>
            </Box>
        </PageLayout>
    );
};

export default ChangelogDetailMobile;