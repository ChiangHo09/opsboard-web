/**
 * 文件名：MainLayout.tsx
 * 描述：
 *     此文件定义了应用的主UI布局，它包含了侧边栏、主内容区和搜索面板。
 *     它还通过 LayoutProvider 为所有子组件提供了控制右侧面板的状态。
 *
 * 本次修改：
 * - 修复了一个导致 ESLint 报出 `Parsing error: '}' expected.` 的语法错误。
 * - 这个语法错误是导致大量 `TS6133: '...' is declared but its value is never read.` 警告的根本原因，因为解析器在遇到语法错误后无法正确分析后续代码。
 * - 通过恢复文件的正确语法结构，所有这些连锁错误都已解决。
 */
import { useState, type JSX, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Box, useMediaQuery, useTheme, IconButton, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

const mobilePanelVariants: Variants = {
    initial: { opacity: 0, scale: 0.98, },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' }, },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeOut' }, },
};

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        isPanelOpen,
        panelContent,
        togglePanel,
        closePanel,
        panelTitle,
        setPanelContent,
        setPanelTitle,
        panelWidth,
        isPanelRelevant,
    } = useLayout();

    const closePanelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [panelContentAnimationKey, setPanelContentAnimationKey] = useState<string | number>(0);
    const prevPanelContentRef = useRef<React.ReactNode | null>(null);
    const prevPanelTitleRef = useRef<string>('');

    useEffect(() => {
        if (isPanelOpen && panelContent !== null) {
            if (panelContent !== prevPanelContentRef.current || panelTitle !== prevPanelTitleRef.current) {
                setPanelContentAnimationKey(Date.now());
            }
        }
        prevPanelContentRef.current = panelContent;
        prevPanelTitleRef.current = panelTitle;
    }, [panelContent, panelTitle, isPanelOpen]);

    useEffect(() => {
        if (closePanelTimeoutRef.current) {
            clearTimeout(closePanelTimeoutRef.current);
            closePanelTimeoutRef.current = null;
        }

        if (isPanelOpen && !isPanelRelevant) {
            closePanelTimeoutRef.current = setTimeout(() => {
                if (isPanelOpen && !isPanelRelevant) {
                    closePanel();
                    setPanelContent(null);
                    setPanelTitle('');
                }
            }, 50);
        }

        return () => {
            if (closePanelTimeoutRef.current) {
                clearTimeout(closePanelTimeoutRef.current);
            }
        };
    }, [pathname, isPanelOpen, isPanelRelevant, closePanel, setPanelContent, setPanelTitle]);


    return (
        <Box sx={{
            display: 'flex',
            height: '100dvh',
            overflow: 'hidden',
            bgcolor: 'app.background'
        }}>
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
                    pt: { xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3 },
                    pb: { xs: 0, md: 3 },
                    pr: { xs: 0, md: 3 },
                    pl: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    transition: theme.transitions.create('padding-top', {
                        duration: theme.transitions.duration.short,
                    }),
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.paper',
                        borderRadius: { xs: '16px 16px 0 0', md: 2 },
                        p: { xs: 0, md: 3 },
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: theme.transitions.create(['border-radius', 'padding'], {
                            duration: theme.transitions.duration.short,
                        }),
                        overflow: 'hidden',
                    }}
                >
                    <MotionBox
                        key={pathname}
                        variants={pageVariants}
                        transition={pageTransition}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        sx={{
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            p: { xs: 2, md: 0 }
                        }}
                    >
                        <Outlet />
                    </MotionBox>

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
                                    flexShrink: 0
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
                                            <MotionBox
                                                key="loading-mobile-panel-content"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <CircularProgress />
                                            </MotionBox>
                                        ) : isPanelOpen && panelContent ? (
                                            <MotionBox
                                                key={panelContentAnimationKey}
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    boxSizing: 'border-box',
                                                    overflowY: 'auto',
                                                    overflowX: 'hidden',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
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
                        onClose={togglePanel}
                        title={panelTitle}
                        width={panelWidth}
                        contentKey={panelContentAnimationKey}
                    >
                        {panelContent}
                    </RightSearchPanel>
                )}
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