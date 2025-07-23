/*
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 *
 * 本次修改内容:
 * - 【核心动画修复】为解决子页面中 framer-motion 的 `layout` 动画失效问题，移除了本组件中的页面级变换动画。
 *   - 将 `MotionBox` 替换为普通的 `Box`，并删除了 `variants`, `transition` 等动画属性。
 *   - 这为子组件（如 Dashboard 中的按钮）的 `layout` 动画提供了一个必需的稳定坐标环境，从而修复了换行过渡效果。
 * - 【代码清理】根据 ESLint 和 TypeScript 的报错，移除了所有未被使用的导入和变量：
 *   - 移除了未使用的 MUI 组件导入 (`IconButton`, `Typography`, `CircularProgress`)。
 *   - 移除了未使用的 Icon 导入 (`CloseIcon`)。
 *   - 移除了未使用的 `mobilePanelVariants` 常量。
 *   - 从 `useLayout` 的解构中移除了未使用的 `togglePanel`。
 */
import { useState, type JSX, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, useTheme } from '@mui/material';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import Modal from '../components/Modal';
// 移除了 pageVariants 和 pageTransition 的导入，因为不再使用
motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;
// 移除了未使用的 mobilePanelVariants

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const theme = useTheme();
    // 移除了未使用的 basePath

    const {
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        isPanelRelevant, isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
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
                    {/* ✅ 将容器改回为单个普通的 Box，仅负责滚动，以确保 layout 动画环境稳定 */}
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