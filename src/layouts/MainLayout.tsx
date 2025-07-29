/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 * 它还负责所有页面切换的动画编排。
 *
 * 本次修改内容:
 * - 【弹窗状态修复】解决了在弹窗打开时，通过侧边栏导航到其他页面，弹窗不会自动关闭的问题。
 * - **问题根源**:
 *   弹窗的显示状态（`isModalOpen`）是全局的，它不会在页面组件卸载时自动重置。
 * - **解决方案**:
 *   1.  在 `MainContentWrapper` 组件内部，增加了一个新的 `useEffect` 钩子。
 *   2.  这个 `useEffect` 的依赖数组是 `[basePath]`，`basePath` 代表了应用的主要模块路径（如 `/app/tickets`）。
 *   3.  当 `basePath` 发生变化（即用户导航到了一个全新的模块）时，`useEffect` 会被触发。
 *   4.  在 `useEffect` 内部，我们调用从 `useLayoutDispatch` 获取的 `setIsModalOpen(false)` 和 `setModalConfig` 函数，来强制关闭并清空任何可能处于打开状态的全局弹窗。
 * - **最终效果**:
 *   现在，当用户在弹窗打开的状态下导航到应用的其他主要部分时，弹窗会自动、平滑地关闭，确保了正确的页面状态和用户体验。
 */
import {useState, type JSX, Suspense, useEffect} from 'react'; // 【核心修复】导入 useEffect
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
// 【核心修复】导入 useLayoutDispatch 以获取状态更新函数
import {LayoutProvider, useLayout, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import RightSearchPanel from '@/components/RightSearchPanel';
import Modal from '@/components/Modal';
import {pageVariants, pageTransition, mobileOverlayVariants} from '@/utils/animations';

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

    // 【核心修复】获取 dispatch 函数
    const { setIsModalOpen, setModalConfig } = useLayoutDispatch();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    // 【核心修复】添加此 useEffect 来监听基础路径的变化
    useEffect(() => {
        // 当基础路径改变时（例如从 /app/tickets -> /app/dashboard），
        // 关闭并清空所有全局弹窗。
        setIsModalOpen(false);
        setModalConfig({ content: null, onClose: null });
    }, [basePath, setIsModalOpen, setModalConfig]); // 依赖 basePath 的变化

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
        <LayoutProvider>
            <MainContentWrapper onFakeLogout={onFakeLogout}/>
        </LayoutProvider>
    );
}