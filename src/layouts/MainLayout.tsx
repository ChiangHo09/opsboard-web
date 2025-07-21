/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 本次修改内容:
 * - 【问题修复】解决了 `TS2339: Property 'closeModal' does not exist on type 'LayoutContextType'` 的编译错误。
 * - 错误是由于在监听路由变化的 `useEffect` 中调用了已被重构移除的 `closeModal` 方法。
 * - 已将 `useEffect` 中的 `closeModal()` 调用修正为正确的 API，即 `setIsModalOpen(false)`。
 *
 * 文件功能描述:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
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
        isPanelRelevant, isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen, // <-- 获取 setIsModalOpen
        panelTitle, panelWidth,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);
    const [panelContentAnimationKey, setPanelContentAnimationKey] = useState<string | number>(0);
    const prevPanelContentRef = useRef<React.ReactNode | null>(null);

    // 监听路由变化，如果弹窗打开，则关闭它
    useEffect(() => {
        if (isModalOpen) {
            setIsModalOpen(false); // 【核心修复】使用正确的 API 关闭弹窗
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]); // 只在 pathname 变化时触发

    useEffect(() => {
        if (isPanelOpen && panelContent !== null) {
            if (panelContent !== prevPanelContentRef.current) {
                setPanelContentAnimationKey(Date.now());
            }
        }
        prevPanelContentRef.current = panelContent;
    }, [panelContent, isPanelOpen]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        if (isPanelOpen && !isPanelRelevant) {
            timeoutId = setTimeout(() => {
                if (isPanelOpen && !isPanelRelevant) {
                    closePanel(); setPanelContent(null); setPanelTitle('');
                }
            }, 50);
        }
        return () => { if (timeoutId) clearTimeout(timeoutId); };
    }, [pathname, isPanelOpen, isPanelRelevant, closePanel, setPanelContent, setPanelTitle]);

    return (
        <Box sx={{ display: 'flex', height: '100dvh', overflow: 'hidden', bgcolor: 'app.background' }}>
            <SideNav open={sideNavOpen} onToggle={() => setSideNavOpen(o => !o)} onFakeLogout={onFakeLogout} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1, height: '100%', pt: { xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3 }, pb: { xs: 0, md: 3 },
                    pr: { xs: 0, md: 3 }, pl: 0, boxSizing: 'border-box', display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    transition: theme.transitions.create('padding-top', { duration: theme.transitions.duration.short }),
                    overflow: 'hidden', position: 'relative',
                }}
            >
                <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: { xs: '16px 16px 0 0', md: 2 }, p: { xs: 0, md: 3 }, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', transition: theme.transitions.create(['border-radius', 'padding'], { duration: theme.transitions.duration.short }), overflow: 'hidden' }}>
                    <MotionBox key={basePath} variants={pageVariants} transition={pageTransition} initial="initial" animate="animate" exit="exit" sx={{ width: '100%', height: '100%', boxSizing: 'border-box', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', p: { xs: 2, md: 0 } }}>
                        <Outlet />
                    </MotionBox>
                </Box>
                {!isMobile && (
                    <RightSearchPanel open={isPanelOpen} onClose={closePanel} title={panelTitle} width={panelWidth} contentKey={panelContentAnimationKey}>
                        {panelContent}
                    </RightSearchPanel>
                )}
                <AnimatePresence>
                    {isModalOpen && onModalClose && (
                        <Modal onClose={onModalClose}>
                            {modalContent}
                        </Modal>
                    )}
                </AnimatePresence>
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