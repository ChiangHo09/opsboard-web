/*
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 *
 * 本次修改内容:
 * - 【核心问题修复】解决了详情弹窗在页面加载时闪烁后消失、点击行不出现的问题。
 * - 问题原因：一个用于在页面切换时关闭弹窗的 `useEffect` 错误地将 `isModalOpen` 作为依赖，导致在弹窗打开时触发了自我关闭的逻辑循环。
 * - 解决方案：将该 `useEffect` 的依赖数组修正为只包含 `basePath` 和 `setIsModalOpen`。
 *   - 这样，该 effect 只会在主页面模块 (`basePath`) 真正改变时运行一次，以关闭可能残留的弹窗，而不会再错误地响应弹窗自身的打开事件。
 */
import { useState, type JSX, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Box, useTheme } from '@mui/material';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import Modal from '../components/Modal';

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

    // ✅ 核心修复：移除 isModalOpen 依赖，避免自我触发的关闭循环
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
                        <Outlet />
                        {isMobile && modalComponent}
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