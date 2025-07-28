/**
 * 文件名: src/pages/mobile/TicketDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个专用于【移动端】的工单详情页面。它现在负责处理从移动端到桌面端的视图切换。
 *
 * 本次修改内容:
 * - 【响应式逻辑修复】重新引入了 `useEffect` 来处理视图切换，并移除了导致空白页的渲染判断。
 * - **问题根源**:
 *   此组件是唯一能在移动端详情视图下响应 `isMobile` 状态变化的地方。
 * - **解决方案**:
 *   1.  **引入 `useLayoutState`**: 获取实时的 `isMobile` 状态。
 *   2.  **添加 `useEffect`**: 在此组件内部，监听 `isMobile` 的变化。当 `isMobile` 变为 `false` 时，立即将用户重定向回桌面端的对应 URL。
 *   3.  **移除渲染阻断**: 删除了 `if (!isMobile) return null;` 的判断。这允许组件在 `isMobile` 变为 `false` 的瞬间仍然能够完成一次渲染，从而确保 `useEffect` 有机会执行导航操作，避免了空白页问题。
 * - **最终效果**:
 *   实现了从移动端详情页到桌面端弹窗视图的平滑、自动的重定向，完成了响应式切换的闭环。
 */
import React, { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../../layouts/PageLayout';
import { useLayoutState } from '../../contexts/LayoutContext.tsx';

// 懒加载详情内容组件以优化性能
const TicketDetailContent = lazy(() => import('../../components/modals/TicketDetailContent.tsx'));

const TicketDetailMobile: React.FC = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams<{ ticketId: string }>();
    // 【核心修复】获取实时的 isMobile 状态
    const { isMobile } = useLayoutState();

    // 【核心修复】添加此 effect 来处理从移动端到桌面端的视图切换
    useEffect(() => {
        // 如果 ticketId 存在，并且视图已经不再是移动端...
        if (ticketId && !isMobile) {
            // ...则重定向到桌面端的弹窗路由，并替换当前历史记录
            navigate(`/app/tickets/${ticketId}`, { replace: true });
        }
    }, [isMobile, ticketId, navigate]); // 依赖 isMobile 的变化

    if (!ticketId) {
        return null;
    }

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                <IconButton onClick={() => navigate(-1)} aria-label="返回">
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
        </PageLayout>
    );
};

export default TicketDetailMobile;