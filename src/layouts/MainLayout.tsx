/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 * 它还负责所有页面切换的动画编排。
 *
 * 本次修改内容:
 * - 【错误边界修复】解决了错误边界状态在页面导航后不会自动重置的问题。
 * - **问题根源**:
 *   当一个页面崩溃后，其局部的错误边界会进入 `hasError: true` 状态。在之前的实现中，即使用户导航到一个正常的页面，
 *   这个错误状态依然存在，导致新页面也被渲染为错误提示。
 * - **解决方案**:
 *   通过为 `ErrorBoundary` 组件添加一个 `key={location.pathname}` 属性，我们利用了React的 `key` 调和机制。
 *   每当路由路径 (`pathname`) 改变时，React会销毁旧的 `ErrorBoundary` 实例并创建一个全新的实例，
 *   新实例的 `hasError` 状态会自然地重置为 `false`。
 * - **最终效果**:
 *   这确保了每个页面导航都会获得一个“干净”的错误边界，从而正确地渲染新页面，解决了跨页面的状态污染问题。
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
import {useLayout, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
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

    const {setIsModalOpen, setModalConfig} = useLayoutDispatch();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
        setModalConfig({content: null, onClose: null});
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
                                // 【核心修复】为 ErrorBoundary 添加随路由变化的 key
                                <ErrorBoundary key={location.pathname} fallback={<LocalErrorFallback/>}>
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

export default function MainLayout({onFakeLogout}: { onFakeLogout: () => void }): JSX.Element {
    return (
        <MainContentWrapper onFakeLogout={onFakeLogout}/>
    );
}