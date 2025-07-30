/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 代码功能:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区、搜索面板以及全局模态框（弹窗）的渲染入口。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `export default function` 的写法，采用了现代的、
 *   不使用 `React.FC` 的类型定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
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

// MainContentWrapper 已经使用了现代写法，无需修改
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

// 【核心修改】为 MainLayout 定义 props 接口并使用现代写法
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