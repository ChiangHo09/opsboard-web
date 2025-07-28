/**
 * 文件名: src/pages/mobile/ServerDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个专用于【移动端】的服务器详情页面。它现在负责处理从移动端到桌面端的视图切换。
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

const ServerDetailContent = lazy(() => import('../../components/modals/ServerDetailContent.tsx'));

const ServerDetailMobile: React.FC = () => {
    const navigate = useNavigate();
    const { serverId } = useParams<{ serverId: string }>();
    const { isMobile } = useLayoutState();

    useEffect(() => {
        if (serverId && !isMobile) {
            navigate(`/app/servers/${serverId}`, { replace: true });
        }
    }, [isMobile, serverId, navigate]);

    if (!serverId) {
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
                    服务器详情
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Suspense fallback={
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }>
                    <ServerDetailContent serverId={serverId} />
                </Suspense>
            </Box>
        </Box>
    );
};

export default ServerDetailMobile;