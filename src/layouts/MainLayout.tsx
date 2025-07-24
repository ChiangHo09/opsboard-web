/*
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 *
 * 本次修改内容:
 * - 【动画问题修复】解决了页面切换动画期间，右侧出现不必要滚动条的问题。
 * - 解决方案：在主滚动容器和动画容器之间，增加了一个“剪裁层”。
 * - 这个剪裁层是一个设置了 `overflow: 'hidden'` 的 <Box>，它的作用是“吸收”并隐藏掉页面切换动画（transform: translateY）所产生的溢出部分。
 * - 这样，主滚动容器就不会再检测到内容溢出，从而避免了在动画过程中错误地显示滚动条。
 */
import { useState, type JSX, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, useTheme } from '@mui/material';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import Modal from '../components/Modal';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const theme = useTheme();
    const basePath = pathname.split('/').slice(0, 3).join('/');

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        isPanelRelevant, isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
        panelTitle, panelWidth,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);
    const [panelContentAnimationKey, setPanelContentAnimationKey] = useState<string | number>(0);
    const prevPanelContentRef = useRef<React.ReactNode | null>(null);

    useEffect(() => {
        setIsModalOpen(false);
    }, [basePath, setIsModalOpen]);

    useEffect(() => { if (isPanelOpen && panelContent !== null) { if (panelContent !== prevPanelContentRef.current) setPanelContentAnimationKey(Date.now()); } prevPanelContentRef.current = panelContent; }, [panelContent, isPanelOpen]);
    useEffect(() => { let t: NodeJS.Timeout | null = null; if (isPanelOpen && !isPanelRelevant) { t = setTimeout(() => { if (isPanelOpen && !isPanelRelevant) { closePanel(); setPanelContent(null); setPanelTitle(''); } }, 50); } return () => { if (t) clearTimeout(t); }; }, [pathname, isPanelOpen, isPanelRelevant, closePanel, setPanelContent, setPanelTitle]);

    const modalComponent = ( <AnimatePresence>{isModalOpen && onModalClose && ( <Modal onClose={onModalClose}>{modalContent}</Modal> )}</AnimatePresence> );

    return (
        <Box sx={{ display: 'flex', height: '100dvh', overflow: 'hidden', bgcolor: 'app.background' }}>
            <SideNav open={sideNavOpen} onToggle={() => setSideNavOpen(o => !o)} onFakeLogout={onFakeLogout} />
            <Box component="main" sx={{ flexGrow: 1, height: '100%', pt: { xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3 }, pb: { xs: 0, md: 3 }, pr: { xs: 0, md: 3 }, pl: 0, boxSizing: 'border-box', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, transition: theme.transitions.create('padding-top', { duration: theme.transitions.duration.short }), overflow: 'hidden', position: 'relative' }}>
                <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: { xs: '16px 16px 0 0', md: 2 }, p: { xs: 0, md: 3 }, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', transition: theme.transitions.create(['border-radius', 'padding'], { duration: theme.transitions.duration.short }), overflow: 'hidden' }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            position: 'relative',
                        }}
                    >
                        {/* ✅ 新增一个剪裁层，用于隐藏动画溢出 */}
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden', // 关键属性
                            }}
                        >
                            <MotionBox
                                key={basePath}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={pageVariants}
                                transition={pageTransition}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <Outlet />
                                {isMobile && modalComponent}
                            </MotionBox>
                        </Box>
                    </Box>
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