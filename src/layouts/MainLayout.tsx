/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 * 它还负责所有页面切换的动画编排。
 *
 * 本次修改内容:
 * - 【代码简化】移除了所有用于处理面板跨页跳转的复杂 `useEffect` 逻辑。
 * - **解决方案**:
 *   面板的打开、关闭和内容管理现在完全由各个页面组件自己负责。`MainLayout` 不再需要猜测子组件的意图。
 * - **最终效果**:
 *   `MainLayout` 的职责更单一，代码更简洁，并且消除了所有因时序问题导致的竞态条件。
 */
import {useState, type JSX, Suspense} from 'react';
import {useLocation, useOutlet} from 'react-router-dom';
import {motion, AnimatePresence, type Variants} from 'framer-motion';
import {
    Box,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SideNav from '../components/SideNav';
import {LayoutProvider, useLayout} from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import Modal from '../components/Modal';
import {pageVariants, pageTransition} from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

const mobilePanelVariants: Variants = {
    initial: {opacity: 0, scale: 0.98},
    animate: {opacity: 1, scale: 1, transition: {duration: 0.2, ease: 'easeOut'}},
    exit: {opacity: 0, scale: 0.98, transition: {duration: 0.2, ease: 'easeIn'}},
};

function MainContentWrapper({onFakeLogout}: { onFakeLogout: () => void }): JSX.Element {
    const location = useLocation();
    const currentOutlet = useOutlet();
    const basePath = location.pathname.split('/').slice(0, 3).join('/');

    const {
        isPanelOpen, panelContent, closePanel,
        togglePanel, panelTitle, panelWidth,
        isMobile, isModalOpen, modalContent, onModalClose,
    } = useLayout();

    const [sideNavOpen, setSideNavOpen] = useState(false);

    // 【核心修复】移除所有用于智能关闭面板的 useEffect 逻辑。
    // 该职责现在完全下放到各个页面组件。

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