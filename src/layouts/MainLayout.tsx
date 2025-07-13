/*
 * [文件用途说明]
 * - 此文件定义了应用的主布局（MainLayout），它包含了固定的侧边导航栏（SideNav）、
 *   一个动态的主内容区域（通过 <Outlet> 渲染）以及一个可抽拉的右侧搜索面板（RightSearchPanel）。
 * - 它还通过 LayoutProvider 为子组件提供了控制右侧面板显隐和内容的状态。
 *
 * [本次修改记录]
 * - 响应 `LayoutContext` 的重构，现在从上下文中获取 `panelContent`, `panelTitle`, `panelWidth`。
 * - `RightSearchPanel` 组件现在接收简化的 props (`open`, `onClose`, `title`, `width`, `children`)。
 * - `panelContent`（现在是一个完整的组件实例，如 ServerSearchForm）被直接作为 `children` 传递给 `RightSearchPanel`。
 * - 每次路由切换时，会调用 `closePanel` 和 `setPanelContent(null)` 来清理状态，确保页面间的隔离。
 */
import { useState, useEffect, type JSX } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // 从重构后的 LayoutContext 获取状态
    const {
        isPanelOpen,
        panelContent,
        setPanelContent,
        togglePanel,
        closePanel,
        panelTitle,
        panelWidth,
    } = useLayout();

    // 路由切换时，清理面板状态
    useEffect(() => {
        closePanel();
        setPanelContent(null);
    }, [pathname, setPanelContent, closePanel]);

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#F0F4F9' }}>
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
                    pt: isMobile ? `${MOBILE_TOP_BAR_HEIGHT}px` : 3,
                    pb: 3,
                    pl: 0,
                    pr: 3,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        height: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 3,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
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
                        }}
                    >
                        <Outlet />
                    </MotionBox>
                </Box>

                {/* RightSearchPanel 现在接收简化的 props */}
                <RightSearchPanel
                    open={isPanelOpen}
                    onClose={togglePanel}
                    title={panelTitle}
                    width={panelWidth}
                >
                    {/* panelContent (一个完整的组件) 被作为 children 传递 */}
                    {panelContent}
                </RightSearchPanel>
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