/**
 * 文件名: src/pages/mobile/ChangelogDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个专用于【移动端】的更新日志详情页面。它现在负责处理从移动端到桌面端的视图切换。
 *
 * 本次修改内容:
 * - 【布局修复】移除了不必要的 `<PageLayout>` 组件，并使用 `<Box>` 替换，以解决边距过宽的问题。
 * - **解决方案**:
 *   将根组件替换为 `<Box>`，并为其设置 `p: 3`，以精确匹配搜索面板的内边距。
 */
import React, { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLayoutState } from '../../contexts/LayoutContext.tsx';

const ChangelogDetailContent = lazy(() => import('../../components/modals/ChangelogDetailContent.tsx'));

const ChangelogDetailMobile: React.FC = () => {
    const navigate = useNavigate();
    const { logId } = useParams<{ logId: string }>();
    const { isMobile } = useLayoutState();

    useEffect(() => {
        if (logId && !isMobile) {
            navigate(`/app/changelog/${logId}`, { replace: true });
        }
    }, [isMobile, logId, navigate]);

    if (!logId) {
        return null;
    }

    return (
        // 【核心修复】使用 Box 替换 PageLayout，并设置 p: 3
        <Box sx={{ boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                <IconButton onClick={() => navigate(-1)} aria-label="返回" sx={{ ml: -1.5 }}>
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
        </Box>
    );
};

export default ChangelogDetailMobile;