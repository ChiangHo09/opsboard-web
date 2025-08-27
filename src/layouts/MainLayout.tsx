/**
 * @file src/layouts/MainLayout.tsx
 * @description 此文件定义了应用的主UI布局。
 * @modification
 *   - [动画一致性]：移除在 `basePath` 变化时清除 `LayoutContext` 中 `panelContent` 的逻辑。此举是为了让 `RightSearchPanel` 内部的 `AnimatePresence` 能够更直接地处理内容切换，避免额外的加载状态动画，从而与主面板的动画流程保持同步。
 *   - [体验优化]：修复了在桌面端打开详情弹窗时，背景列表页面会不必要地重载（刷新）的问题。
 *   - **问题根源**:
 *     包裹页面组件的 `ErrorBoundary` 使用了 `location.pathname` 作为其 `key`。当路由从
 *     `/app/tickets` 变为 `/app/tickets/tkt001` 时，`key` 发生变化，导致 React 卸载并
 *     重新挂载整个页面组件，丢失了其滚动位置等状态。
 *   - **解决方案**:
 *     将 `ErrorBoundary` 的 `key` 从 `location.pathname` 修改为 `basePath`。
 *     `basePath` 代表了应用的主模块路径（如 `/app/tickets`），在打开详情弹窗这种
 *     子路由导航中，`basePath` 的值保持不变。
 *   - **最终效果**:
 *     现在，当用户打开详情弹窗时，`ErrorBoundary` 的 `key` 不再改变，背景页面组件
 *     的状态（如滚动位置）得以保留，实现了无缝、平滑的弹窗体验。
 */
import {useState, type JSX, Suspense, useEffect} from 'react';
import {useLocation, useOutlet} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {
    Box,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SideNav from '@/components/SideNav';
import {LayoutProvider, useLayout, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import RightSearchPanel from '@/components/RightSearchPanel';
import Modal from '@/components/Modal';
import {pageVariants, pageTransition, mobileOverlayVariants} from '@/utils/animations';
import ErrorBoundary from '@/components/ErrorBoundary';
import LocalErrorFallback from '@/components/LocalErrorFallback';


const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

function MainContentWrapper({onFakeLogout}: { onFakeLogout: () => void }): JSX.Element {
    const location = useLocation();
    const currentOutlet = useOutlet();
    const basePath = location.pathname.split('/').slice(0, 3).join('/');

    const {
        isPanelOpen, panelContent, closePanel,
        togglePanel, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose,
    } = useLayout();

    // 【修改】不再需要从 useLayoutDispatch 中解构 setPanelContent，因为不再在此处调用它
    const {setIsModalOpen, setModalConfig} = useLayoutDispatch();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
        setModalConfig({content: null, onClose: null});
        // 【核心修改】移除 setPanelContent(null); 这一行，让 RightSearchPanel 内部的 AnimatePresence 直接处理内容切换
    }, [basePath, setIsModalOpen, setModalConfig]); // 移除 setPanelContent 依赖

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
                    pt: {xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3},
                    pb: {xs: 0, md: 3},
                    pr: {xs: 0, md: 3},
                    pl: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row'},
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'padding-top 0.2s',
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.paper',
                        borderRadius: {xs: '16px 16px 0 0', md: 2},
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
                                <CircularProgress/>
                            </Box>
                        }
                    >
                        <AnimatePresence mode="wait">
                            {currentOutlet && (
                                // 【核心修复】将 ErrorBoundary 的 key 从 location.pathname 修改为 basePath
                                <ErrorBoundary key={basePath} fallback={<LocalErrorFallback/>}>
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
                                        <CloseIcon/>
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
                                                <CircularProgress/>
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
}

interface MainLayoutProps {
    onFakeLogout: () => void;
}

const MainLayout = ({onFakeLogout}: MainLayoutProps): JSX.Element => {
    return (
        <LayoutProvider>
            <MainContentWrapper onFakeLogout={onFakeLogout}/>
        </LayoutProvider>
    );
};

export default MainLayout;