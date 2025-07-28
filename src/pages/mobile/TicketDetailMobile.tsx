/**
 * 文件名: src/pages/mobile/TicketDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个专用于【移动端】的工单详情页面。它现在负责处理从移动端到桌面端的视图切换。
 *
 * 本次修改内容:
 * - 【布局修复】彻底解决了移动端视图下边距过宽的问题。
 * - **问题根源**:
 *   错误地使用了为桌面端设计的 `<PageLayout>` 组件，该组件自身带有 `width: 80%` 和 `mx: 'auto'` 的样式，导致了不必要的外部边距。
 * - **解决方案**:
 *   1.  将根组件从 `<PageLayout>` 替换为一个标准的 MUI `<Box>` 组件。
 *   2.  将所有必要的布局样式（如 `display: 'flex'`）直接应用到这个 `<Box>` 上。
 *   3.  为 `<Box>` 设置 `p: 3`，使其内边距在所有方向上都与搜索面板完全一致。
 * - **最终效果**:
 *   移动端详情页现在是一个真正的全屏视图，其内容区的内边距与搜索面板精确匹配，视觉效果协调统一。
 */
import React, { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// 【核心修复】不再需要 PageLayout
import { useLayoutState } from '../../contexts/LayoutContext.tsx';

const TicketDetailContent = lazy(() => import('../../components/modals/TicketDetailContent.tsx'));

const TicketDetailMobile: React.FC = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams<{ ticketId: string }>();
    const { isMobile } = useLayoutState();

    useEffect(() => {
        if (ticketId && !isMobile) {
            navigate(`/app/tickets/${ticketId}`, { replace: true });
        }
    }, [isMobile, ticketId, navigate]);

    if (!ticketId) {
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
                    工单详情
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Suspense fallback={
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }>
                    <TicketDetailContent ticketId={ticketId} />
                </Suspense>
            </Box>
        </Box>
    );
};

export default TicketDetailMobile;