/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 * 它还管理着这些布局组件之间的交互逻辑，如面板的开关、动画和响应式行为。
 *
 * 本次修改内容:
 * - 【动画闪烁与同步终极修复】通过统一动画源，彻底解决了侧边面板内容切换时“先闪烁内容再播放动画”的问题。
 * - **问题定位**: 原代码通过`useEffect`和`useState`手动管理面板的动画Key(`panelContentAnimationKey`)，导致内容更新与Key的更新存在一个渲染周期的延迟，引发了竞态和内容闪烁。
 * - **解决方案**:
 *   1.  **废弃手动Key管理**: 完全移除了 `panelContentAnimationKey` 状态、`prevPanelContentRef` 以及用于更新它们的手动 `useEffect`。
 *   2.  **统一动画Key**: `RightSearchPanel` 的 `contentKey` prop 现在直接使用与主内容区 `<MotionBox>` 完全相同的 `basePath` (即 `pathname.split('/').slice(0, 3).join('/')`)。
 * - **最终效果**: 现在，当路由变化时，主内容区和侧边面板的内容及动画Key会在同一次渲染中被同步更新。这确保了`<AnimatePresence>`能够正确地在新旧内容之间执行动画，从根本上消除了闪烁问题，并实现了两个区域内容切换动画的完美同步。
 */
import { useState, useEffect, type JSX } from 'react';
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
    // 为主内容区和侧面板提供一个统一的、基于路由的动画 Key
    const basePath = pathname.split('/').slice(0, 3).join('/');

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        togglePanel, isPanelRelevant, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    // 【核心修复】移除手动管理的动画 key 及其相关的所有逻辑
    // const [panelContentAnimationKey, setPanelContentAnimationKey] = useState<number>(0);
    // const prevPanelContentRef = useRef<React.ReactNode>(null);

    useEffect(() => {
        if (isModalOpen) setIsModalOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // 【核心修复】移除此 useEffect，因为它导致了竞态问题
    // useEffect(() => {
    //     if (isPanelOpen && panelContent && panelContent !== prevPanelContentRef.current) {
    //         setPanelContentAnimationKey(Date.now());
    //     }
    //     prevPanelContentRef.current = panelContent;
    // }, [isPanelOpen, panelContent]);

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
                    <MotionBox
                        key={basePath} // 主内容区动画Key
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <Typography variant="h6" noWrap>
                                        {panelTitle}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={togglePanel}
                                        aria-label="close search panel"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Box
                                    sx={{
                                        mt: 2,
                                        flexGrow: 1,
                                        overflowY: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        {isPanelOpen && !panelContent ? (
                                            <MotionBox
                                                key="loading-mobile-panel-content"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <CircularProgress />
                                            </MotionBox>
                                        ) : isPanelOpen && panelContent ? (
                                            <MotionBox
                                                key={basePath} // 移动端面板内容动画也使用 basePath
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    boxSizing: 'border-box',
                                                    overflowY: 'auto',
                                                    overflowX: 'hidden',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
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
                        contentKey={basePath} // 【核心修复】将动画Key与主内容区同步
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