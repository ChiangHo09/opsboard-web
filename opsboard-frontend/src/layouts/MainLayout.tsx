/**
 * @file src/layouts/MainLayout.tsx
 * @description 应用的主 UI 布局，包含侧边栏和内容区域。
 * @modification
 *   - [Context Fix]: 移除了组件内部多余的 `<LayoutProvider>` 包裹。
 *   - [Reason]: 全局的 `LayoutProvider` 已经在 `App.tsx` 中提供了。在布局组件内部重复提供会创建一个新的、隔离的上下文，导致子组件（如 `MainContentWrapper`）无法访问由 `App.tsx` 提供的其他全局上下文（如 `AuthProvider`），从而引发 "useAuth must be used within an AuthProvider" 的错误。
 *   - [Refactor]: 将 `MainContentWrapper` 的逻辑合并回 `MainLayout`，简化了组件结构。
 */
import { useState, type JSX, Suspense, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SideNav from '@/components/SideNav';
// [核心修改] 不再需要 LayoutProvider
import { useLayout, useLayoutDispatch } from '@/contexts/LayoutContext.tsx';
import RightSearchPanel from '@/components/RightSearchPanel';
import Modal from '@/components/Modal';
import { pageVariants, pageTransition, mobileOverlayVariants } from '@/utils/animations';
import ErrorBoundary from '@/components/ErrorBoundary';
import LocalErrorFallback from '@/components/LocalErrorFallback';
import { useAuth } from '@/hooks/useAuth';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

// [核心修改] 不再需要 MainContentWrapper，将其逻辑直接合并到 MainLayout 中
const MainLayout = (): JSX.Element => {
    const { logout } = useAuth(); // 现在可以在这里安全地调用 useAuth
    const location = useLocation();
    const currentOutlet = useOutlet();
    const basePath = location.pathname.split('/').slice(0, 3).join('/');

    // useLayout 现在可以正常工作，因为它继承了 App.tsx 中的 LayoutProvider
    const {
        isPanelOpen, panelContent, closePanel,
        togglePanel, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose,
    } = useLayout();

    const { setIsModalOpen, setModalConfig } = useLayoutDispatch();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
        setModalConfig({ content: null, onClose: null });
    }, [basePath, setIsModalOpen, setModalConfig]);

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
        // [核心修改] 移除了外层的 LayoutProvider
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
                onLogout={logout}
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
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <CircularProgress />
                            </Box>
                        }
                    >
                        <AnimatePresence mode="wait">
                            {currentOutlet && (
                                <ErrorBoundary key={basePath} fallback={<LocalErrorFallback />}>
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
                                </ErrorBoundary>
                            )}
                        </AnimatePresence>
                        {isMobile && modalJSX}
                    </Suspense>

                    <AnimatePresence>
                        {isMobile && isPanelOpen && (
                            <MotionBox
                                variants={mobileOverlayVariants}
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
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                    flexShrink: 0,
                                }}>
                                    <Typography variant="h6" noWrap>{panelTitle}</Typography>
                                    <IconButton size="small" onClick={togglePanel} aria-label="close search panel">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{
                                    mt: 2,
                                    flexGrow: 1,
                                    overflowY: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <AnimatePresence mode="wait">
                                        {isPanelOpen && !panelContent ? (
                                            <MotionBox key="loading-mobile-panel-content" variants={pageVariants}
                                                       transition={pageTransition} initial="initial" animate="animate"
                                                       exit="exit" sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <CircularProgress />
                                            </MotionBox>
                                        ) : isPanelOpen && panelContent ? (
                                            <MotionBox key={basePath} variants={pageVariants}
                                                       transition={pageTransition} initial="initial" animate="animate"
                                                       exit="exit" sx={{
                                                width: '100%',
                                                height: '100%',
                                                boxSizing: 'border-box',
                                                overflowY: 'auto',
                                                overflowX: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
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
};

export default MainLayout;