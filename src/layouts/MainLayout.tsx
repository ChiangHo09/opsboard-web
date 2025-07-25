/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 * 它还负责所有页面切换的动画编排。
 *
 * 本次修改内容:
 * - 【结构性重构】彻底修复页面切换时的闪烁问题。
 * - **问题根源**:
 *   之前的结构是动画化一个静态的`<MotionBox>`，而React Router在其内部通过`<Outlet />`替换内容。这导致了动画与内容更新的脱节：对于已加载的页面，其内容会先被渲染出来，然后动画容器的初始状态（如`opacity: 0`）才被应用，从而产生闪烁。
 * - **解决方案**:
 *   1.  引入 `useOutlet` 钩子，直接获取由路由即将渲染的页面元素（例如 `<Dashboard />` 组件本身）。
 *   2.  将 `AnimatePresence` 的直接子元素从一个静态容器改为一个动态的、包裹着 `useOutlet()` 返回元素的 `<MotionBox>`。
 *   3.  `AnimatePresence` 现在直接管理**整个页面组件**的进入和退出，而不是其容器。
 *   4.  将 `Suspense` 组件移到 `AnimatePresence` 的外层，以正确处理懒加载页面的等待状态。
 * - **最终效果**:
 *   动画和页面内容被绑定在一起进行过渡，保证了渲染时序的绝对同步。无论是首次加载还是切换到已加载页面，都能实现完美、平滑的过渡动画，闪烁问题被从根本上解决。
 */
import { useState, useEffect, type JSX, Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom'; // 【核心修复】导入 useOutlet
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    Box,
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
    const location = useLocation();
    // 【核心修复】使用 useOutlet() 获取当前路由要渲染的元素
    const currentOutlet = useOutlet();

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        togglePanel, isPanelRelevant, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) setIsModalOpen(false);
    }, [location.pathname]);

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
    }, [location.pathname, isPanelOpen, isPanelRelevant, closePanel, setPanelContent, setPanelTitle]);


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
                    transition: 'padding-top 0.2s',
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.paper',
                        borderRadius: { xs: '16px 16px 0 0', md: 2 },
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'border-radius 0.2s',
                        minHeight: 0,
                        position: 'relative', // 父容器必须是相对定位
                    }}
                >
                    {/* 【核心修复】将 Suspense 移到 AnimatePresence 外层 */}
                    <Suspense
                        fallback={
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        }
                    >
                        <AnimatePresence mode="wait">
                            {/*
                              【核心修复】
                              - 我们不再动画化一个静态容器。
                              - 我们直接动画化一个包裹着 `currentOutlet` 的 MotionBox。
                              - `key` 必须是 `location.pathname`，这样 AnimatePresence 才能在路由变化时检测到子元素的改变。
                            */}
                            {currentOutlet && (
                                <MotionBox
                                    key={location.pathname}
                                    variants={pageVariants}
                                    transition={pageTransition}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    sx={{
                                        // 这些样式至关重要，它们让动画容器表现得像一个覆盖层，
                                        // 确保进出动画在同一空间发生，不会导致布局跳动。
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                    }}
                                >
                                    {currentOutlet}
                                </MotionBox>
                            )}
                        </AnimatePresence>
                        {isMobile && modalJSX}
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
                                            <MotionBox key={location.pathname} variants={pageVariants} transition={pageTransition} initial="initial" animate="animate" exit="exit" sx={{ width: '100%', height: '100%', boxSizing: 'border-box', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', }}>
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
                        contentKey={location.pathname}
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