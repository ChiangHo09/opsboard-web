/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 * 它还负责所有页面切换的动画编排。
 *
 * 本次修改内容:
 * - 【弹窗闪现修复】彻底修复了首次点击打开弹窗时，弹窗会闪现一次的问题。
 * - **问题根源**:
 *   组件中存在一个副作用钩子 `useEffect(() => { if (isModalOpen) setIsModalOpen(false); }, [location.pathname]);`。
 *   这个钩子的意图是在页面切换时关闭弹窗，但它错误地在任何路径变化时（包括从列表页导航到详情子路由时）都触发，导致了状态更新的竞态条件：一个effect尝试打开弹窗，而另一个effect立即尝试关闭它。
 * - **解决方案**:
 *   1.  完全移除了这个有问题的 `useEffect`。
 *   2.  弹窗的打开和关闭现在完全由各个页面组件（如 `Servers.tsx`）根据自身的路由参数（如 `serverId`）来控制，这确保了状态管理的唯一事实来源。
 * - **最终效果**: 消除了状态冲突，弹窗在首次点击时也能平滑、正确地打开，不再闪现。
 */
import { useState, useEffect, type JSX, Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
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
    const currentOutlet = useOutlet();
    const basePath = location.pathname.split('/').slice(0, 3).join('/');

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        togglePanel, isPanelRelevant, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    // 【核心修复】移除这个导致竞态条件的 useEffect
    // useEffect(() => {
    //     if (isModalOpen) setIsModalOpen(false);
    // }, [location.pathname]);

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
                        position: 'relative',
                    }}
                >
                    <Suspense
                        fallback={
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        }
                    >
                        <AnimatePresence mode="wait">
                            {currentOutlet && (
                                <MotionBox
                                    key={basePath}
                                    variants={pageVariants}
                                    transition={pageTransition}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    sx={{
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