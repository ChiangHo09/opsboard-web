/*
 * [文件用途说明]
 * - 此文件定义了应用的主布局（MainLayout），它包含了固定的侧边导航栏（SideNav）、
 *   一个动态的主内容区域（通过 <Outlet> 渲染）以及一个响应式的搜索面板。
 * - 它还通过 LayoutProvider 为子组件提供了控制右侧面板显隐和内容的状态。
 *
 * [本次修改记录]
 * - 彻底修复了在移动设备上，工作区底部内容被遮挡或无法滚动的问题。
 * - 将最外层容器 `Box` 的高度从 `height: '100vh'` 修改为 `height: '100dvh'` (动态视口高度)。
 *   - `100dvh` 是一个现代 CSS 单位，它会根据移动端浏览器地址栏的显示/隐藏而动态调整，确保布局始终填充可见区域而无内容被遮挡。
 * - 还原了内部白色工作区容器的 `overflow: 'hidden'` 属性，以确保其圆角和内部绝对定位的搜索面板能正确显示。
 */
import { useState, useEffect, type JSX } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Box, useMediaQuery, useTheme, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

const mobilePanelVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.2, ease: 'easeOut' },
    },
};

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        isPanelOpen,
        panelContent,
        setPanelContent,
        togglePanel,
        closePanel,
        panelTitle,
        panelWidth,
    } = useLayout();

    useEffect(() => {
        closePanel();
        setPanelContent(null);
    }, [pathname, setPanelContent, closePanel]);

    return (
        // --- START OF MODIFICATION ---
        // 使用 100dvh 替代 100vh
        <Box sx={{ display: 'flex', height: '100dvh', overflow: 'hidden', bgcolor: '#F0F4F9' }}>
            {/* --- END OF MODIFICATION --- */}
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
                        overflow: 'hidden', // 还原此属性以保证圆角和覆盖式面板的正确显示
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
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                                    <Typography variant="h6" noWrap>{panelTitle}</Typography>
                                    <IconButton size="small" onClick={togglePanel} aria-label="close search panel">
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'hidden', display: 'flex' }}>
                                    {panelContent}
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