/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 本次修改内容:
 * - 【布局终极统一】为了确保所有子页面的布局一致性，移除了 `MotionBox` (Outlet 容器)
 *   上的所有内边距 (`p`) 属性。
 * - 现在，`MotionBox` 是一个纯粹的、无内边距的滚动容器。
 * - 所有页面的内外边距将完全由其自身的根组件（即 `<PageLayout>`）来统一控制，
 *   从而从根本上解决了因内外边距叠加导致的留白不一致问题。
 *
 * 文件功能描述:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 */
import { useState, type JSX, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Box, useTheme, IconButton, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import Modal from '../components/Modal';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;
const mobilePanelVariants: Variants = { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } }, };

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const theme = useTheme();
    const basePath = pathname.split('/').slice(0, 3).join('/');

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        togglePanel, isPanelRelevant, isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
        panelTitle, panelWidth,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);
    const [panelContentAnimationKey, setPanelContentAnimationKey] = useState<string | number>(0);
    const prevPanelContentRef = useRef<React.ReactNode | null>(null);

    useEffect(() => { if (isModalOpen) setIsModalOpen(false); }, [pathname, isModalOpen, setIsModalOpen]);
    useEffect(() => { if (isPanelOpen && panelContent !== null) { if (panelContent !== prevPanelContentRef.current) setPanelContentAnimationKey(Date.now()); } prevPanelContentRef.current = panelContent; }, [panelContent, isPanelOpen]);
    useEffect(() => { let t: NodeJS.Timeout | null = null; if (isPanelOpen && !isPanelRelevant) { t = setTimeout(() => { if (isPanelOpen && !isPanelRelevant) { closePanel(); setPanelContent(null); setPanelTitle(''); } }, 50); } return () => { if (t) clearTimeout(t); }; }, [pathname, isPanelOpen, isPanelRelevant, closePanel, setPanelContent, setPanelTitle]);

    const modalComponent = ( <AnimatePresence>{isModalOpen && onModalClose && ( <Modal onClose={onModalClose}>{modalContent}</Modal> )}</AnimatePresence> );

    return (
        <Box sx={{ display: 'flex', height: '100dvh', overflow: 'hidden', bgcolor: 'app.background' }}>
            <SideNav open={sideNavOpen} onToggle={() => setSideNavOpen(o => !o)} onFakeLogout={onFakeLogout} />
            <Box component="main" sx={{ flexGrow: 1, height: '100%', pt: { xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3 }, pb: { xs: 0, md: 3 }, pr: { xs: 0, md: 3 }, pl: 0, boxSizing: 'border-box', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, transition: theme.transitions.create('padding-top', { duration: theme.transitions.duration.short }), overflow: 'hidden', position: 'relative' }}>
                <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: { xs: '16px 16px 0 0', md: 2 }, p: { xs: 0, md: 3 }, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', transition: theme.transitions.create(['border-radius', 'padding'], { duration: theme.transitions.duration.short }), overflow: 'hidden' }}>
                    <MotionBox
                        key={basePath}
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
                            position: 'relative',
                            // 【核心修复】移除所有内边距，交由 PageLayout 控制
                        }}
                    >
                        <Outlet />
                        {isMobile && modalComponent}
                    </MotionBox>
                </Box>
                {!isMobile && ( <RightSearchPanel open={isPanelOpen} onClose={closePanel} title={panelTitle} width={panelWidth} contentKey={panelContentAnimationKey}>{panelContent}</RightSearchPanel> )}
                {!isMobile && modalComponent}
            </Box>
        </Box>
    );
}

export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    return ( <LayoutProvider><MainContentWrapper onFakeLogout={onFakeLogout} /></LayoutProvider> );
}