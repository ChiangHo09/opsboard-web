/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 * 它还管理着这些布局组件之间的交互逻辑，如面板的开关、动画和响应式行为。
 *
 * 本次修改内容:
 * - 【类型修复】以最严格和明确的方式修复了 TypeScript 编译错误 TS2345。
 * - 问题原因: 在自动收起面板的 useEffect 中，其清理函数的类型被推断为可能返回 null，与 EffectCallback 的要求不符。
 * - 最终解决方案: 重构了该 useEffect 的逻辑。现在，仅当需要设置定时器时，才返回一个明确的清理函数 `() => clearTimeout(t)`。该清理函数本身总是返回 `void`。在不需要定时器的情况下，effect 函数隐式返回 `undefined`。这两种情况都完全符合 React 对 EffectCallback 的类型要求，从而彻底解决了类型不匹配的问题。
 */
import { useState, useEffect, useRef, type JSX } from 'react';
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

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        togglePanel, isPanelRelevant, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);
    const [panelContentAnimationKey, setPanelContentAnimationKey] = useState<number>(0);
    const prevPanelContentRef = useRef<React.ReactNode>(null);

    useEffect(() => {
        if (isModalOpen) setIsModalOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        if (isPanelOpen && panelContent && panelContent !== prevPanelContentRef.current) {
            setPanelContentAnimationKey(Date.now());
        }
        prevPanelContentRef.current = panelContent;
    }, [isPanelOpen, panelContent]);

    // 【最终修复】请完整替换此 useEffect 代码块
    useEffect(() => {
        // 仅当面板需要被自动关闭时，才执行内部逻辑
        if (isPanelOpen && !isPanelRelevant) {
            // 设置一个定时器
            const timerId = setTimeout(() => {
                // 在回调触发时，再次检查条件，避免竞态问题
                if (isPanelOpen && !isPanelRelevant) {
                    closePanel();
                    setPanelContent(null);
                    setPanelTitle('');
                }
            }, 50);

            // 返回一个定义明确的清理函数。此函数总是返回 void。
            return () => {
                clearTimeout(timerId);
            };
        }
        // 如果条件不满足，此 effect 不执行任何操作，也不返回任何东西（隐式返回 undefined），
        // 这完全符合 EffectCallback 的类型要求，不会引发错误。
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
                        key={pathname.split('/').slice(0, 3).join('/')}
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
                                                key={panelContentAnimationKey}
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
                        contentKey={panelContentAnimationKey}
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