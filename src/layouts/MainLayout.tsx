/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 *
 * 本次修改内容:
 * - 【懒加载动画修复】解决了懒加载页面在加载完毕后，没有执行进入动画（直接闪现）的问题。
 * - **问题定位**: 原代码中，`<Suspense>` 组件位于 `<AnimatePresence>` 动画组件的内部。这导致 AnimatePresence 将“加载指示器”作为新页面进行了动画，而真正的页面内容加载完毕后只能生硬地替换掉加载器。
 * - **解决方案**:
 *   1.  调整了组件的嵌套结构，将 `<Suspense>` 组件移动到了 `<AnimatePresence>` 的【外层】。
 *   2.  这意味着，React 会首先等待懒加载组件的代码完全下载完毕（在此期间显示 Suspense 的 fallback），然后才允许 AnimatePresence 开始处理新旧页面组件之间的“进入”和“退出”动画。
 * - **最终效果**: 现在，页面切换时，用户会先看到加载指示器。一旦新页面准备就绪，加载器会消失，同时旧页面开始执行退出动画，新页面则平滑地执行我们预设的进入动画，整个过程流畅且符合预期。
 */
import { useState, useEffect, type JSX, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    Box,
    useTheme,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import Modal from '../components/Modal';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

const mobilePanelVariants: Variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit:    { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
};

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    const { pathname } = useLocation();
    const theme = useTheme();
    const basePath = pathname.split('/').slice(0, 3).join('/');

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        togglePanel, isPanelRelevant, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) setIsModalOpen(false);
    }, [basePath]);

    useEffect(() => {
        if (isPanelOpen && !isPanelRelevant) {
            const timerId = setTimeout(() => {
                if (isPanelOpen && !isPanelRelevant) {
                    closePanel();
                    setPanelContent(null);
                    setPanelTitle('');
                }
            }, 50);

            return () => {
                clearTimeout(timerId);
            };
        }
    }, [pathname, isPanelOpen, isPanelRelevant, closePanel, setPanelContent, setPanelTitle]);

    const modalJSX = (
        <AnimatePresence>
            {isModalOpen && onModalClose && (
                <Modal onClose={onModalClose}>
                    {modalContent}
                </Modal>
            )}
        </AnimatePresence>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100dvh',
                overflow: 'hidden',
                bgcolor: 'app.background',
            }}
        >
            <SideNav
                open={sideNavOpen}
                onToggle={() => setSideNavOpen(o => !o)}
                onFakeLogout={onFakeLogout}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    pt: { xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3 },
                    pb: { xs: 0, md: 3 },
                    pr: { xs: 0, md: 3 },
                    pl: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    overflow: 'hidden',
                    position: 'relative',
                    transition: theme.transitions.create('padding-top', {
                        duration: theme.transitions.duration.short,
                    }),
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.paper',
                        borderRadius: { xs: '16px 16px 0 0', md: 2 },
                        p: { xs: 0, md: 3 },
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: theme.transitions.create(['border-radius', 'padding'], {
                            duration: theme.transitions.duration.short,
                        }),
                        minHeight: 0,
                    }}
                >
                    {/* 【核心修复】将 Suspense 移动到 AnimatePresence 的外层 */}
                    <Suspense
                        fallback={
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        }
                    >
                        <AnimatePresence mode="wait">
                            <MotionBox
                                key={basePath}
                                variants={pageVariants}
                                transition={pageTransition}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                sx={{
                                    width: '100%',
                                    flex: '1 1 auto',
                                    minHeight: 0,
                                    boxSizing: 'border-box',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: { xs: 2, md: 0 },
                                    position: 'relative',
                                }}
                            >
                                <Outlet />
                                {isMobile && modalJSX}
                            </MotionBox>
                        </AnimatePresence>
                    </Suspense>
                    <AnimatePresence>
                        {isMobile && isPanelOpen && (
                            <MotionBox
                                variants={mobilePanelVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    bgcolor: 'background.paper',
                                    zIndex: 10,
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0, }}>
                                    <Typography variant="h6" noWrap>{panelTitle}</Typography>
                                    <IconButton size="small" onClick={togglePanel} aria-label="close search panel">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <AnimatePresence mode="wait">
                                        {isPanelOpen && !panelContent ? (
                                            <MotionBox key="loading-mobile-panel-content" variants={pageVariants} transition={pageTransition} initial="initial" animate="animate" exit="exit" sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                                <CircularProgress />
                                            </MotionBox>
                                        ) : isPanelOpen && panelContent ? (
                                            <MotionBox key={basePath} variants={pageVariants} transition={pageTransition} initial="initial" animate="animate" exit="exit" sx={{ width: '100%', height: '100%', boxSizing: 'border-box', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', }}>
                                                {panelContent}
                                            </MotionBox>
                                        ) : null}
                                    </AnimatePresence>
                                </Box>
                            </MotionBox>
                        )}
                    </AnimatePresence>
                </Box>
                {!isMobile && (
                    <RightSearchPanel
                        open={isPanelOpen}
                        onClose={closePanel}
                        title={panelTitle}
                        width={panelWidth}
                        contentKey={basePath}
                    >
                        {panelContent}
                    </RightSearchPanel>
                )}
                {!isMobile && modalJSX}
            </Box>
        </Box>
    );
}

export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    return (
        <LayoutProvider>
            <MainContentWrapper onFakeLogout={onFakeLogout} />
        </LayoutProvider>
    );
}