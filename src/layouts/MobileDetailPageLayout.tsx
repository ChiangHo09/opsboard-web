/**
 * 文件名: src/layouts/MobileDetailPageLayout.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【可复用的】移动端详情页面布局组件。它封装了所有移动端详情页共享的
 * UI 结构和业务逻辑，包括全屏布局、带关闭按钮的标题栏、以及从移动端到桌面端的自动重定向功能。
 *
 * 本次修改内容:
 * - 【动画终极修复】确保了移动端详情页的进入/退出动画与移动端搜索面板完全一致。
 * - **问题根源**:
 *   之前的实现错误地使用了基于“垂直位移”的 `panelContentVariants` 动画，而不是搜索面板所使用的、基于“缩放”的 `mobileOverlayVariants` 动画，并且可能错误地覆盖了过渡时长，导致动画效果不一致且速度过快。
 * - **解决方案**:
 *   1.  从集中的 `animations.ts` 工具文件中，导入正确的、专用于移动端覆盖层的 `mobileOverlayVariants`。
 *   2.  将此动画变体应用到页面的根 `MotionBox` 组件上。
 *   3.  【关键】移除了所有独立的 `transition` 属性，完全依赖 `mobileOverlayVariants` 内部定义的精确时长和缓动曲线。
 * - **最终效果**:
 *   所有移动端详情页现在都拥有了与搜索面板完全相同的、平滑且节奏正确的缩放动画，
 *   实现了整个应用在移动端覆盖层体验上的视觉和交互的绝对统一。
 */
import { Suspense, useEffect, type LazyExoticComponent, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useLayoutState } from '../contexts/LayoutContext.tsx';
// 【核心修复】导入正确的、用于移动端覆盖层的动画变体
import { mobileOverlayVariants } from '../utils/animations';

const MotionBox = motion(Box);

interface MobileDetailPageLayoutProps<T extends Record<string, unknown>> {
    title: string;
    backPath: string;
    paramName: keyof T & string;
    DetailContentComponent: LazyExoticComponent<FC<T>>;
}

const MobileDetailPageLayout = <T extends Record<string, unknown>>({
                                                                       title,
                                                                       backPath,
                                                                       paramName,
                                                                       DetailContentComponent,
                                                                   }: MobileDetailPageLayoutProps<T>) => {
    const navigate = useNavigate();
    const params = useParams();
    const { isMobile } = useLayoutState();

    const id = params[paramName];

    useEffect(() => {
        if (id && !isMobile) {
            navigate(`${backPath}/${id}`, { replace: true });
        }
    }, [isMobile, id, navigate, backPath]);

    if (!id) {
        return null;
    }

    const contentProps = { [paramName]: id } as T;

    return (
        // 【核心修复】应用正确的 mobileOverlayVariants 动画，并移除独立的 transition 属性
        <MotionBox
            sx={{ boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}
            variants={mobileOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                <Typography variant="h6">{title}</Typography>
                <IconButton
                    onClick={() => navigate(backPath)}
                    aria-label="关闭"
                    sx={{ mr: -1.5 }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Suspense fallback={
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }>
                    <DetailContentComponent {...contentProps} />
                </Suspense>
            </Box>
        </MotionBox>
    );
};

export default MobileDetailPageLayout;