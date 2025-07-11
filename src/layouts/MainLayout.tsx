// MainLayout.tsx
/*****************************************************************
 *  MainLayout — FINAL FIX: 只提供最简单的布局骨架，不控制任何间距
 *****************************************************************/
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, useMediaQuery, useTheme } from '@mui/material'; // 引入 useMediaQuery, useTheme
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56; // 与 SideNav 中定义的高度一致

// 内部组件，用于使用 LayoutContext
function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 判断是否为移动设备

    const { isPanelOpen, panelContent, setPanelContent, togglePanel, panelActions, setPanelActions } = useLayout();

    // 当页面路径改变时，重置右侧面板内容和动作
    useEffect(() => {
        setPanelContent(null);
        setPanelActions({}); // 也要清除面板动作
    }, [pathname, setPanelContent, setPanelActions]); // 添加 setPanelActions 到依赖

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f7f9fd' }}>
            {/* SideNav组件会根据isMobile在其内部决定渲染样式 */}
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
                    // 调整主内容区域的顶部内边距，以避开移动端顶部栏
                    pt: isMobile ? `${MOBILE_TOP_BAR_HEIGHT}px` : 3, // 移动端时顶部推开固定高度，桌面端保持 py:3
                    pb: 3, // 底部内边距保持不变
                    pl: isMobile ? 0 : 3, // 移动端时左侧无内边距，桌面端保持 py:3 中的左侧内边距
                    pr: isMobile ? 0 : 3, // 移动端时右侧无内边距，桌面端保持 py:3 中的右侧内边距
                    boxSizing: 'border-box',
                    // 在移动端时，主内容面板和搜索面板垂直堆叠，无间隔
                    // 在桌面端时，主内容面板和搜索面板水平并排，有间隔
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 0 : 3, // 移动端无间隙，桌面端有间隙
                }}
            >
                {/* 静态的白色背景主内容面板 - 这是您所说的“显示区域” */}
                {/* 在这里添加 p:3 作为其内边距，统一控制所有页面的外层边距 */}
                <Box
                    sx={{
                        flexGrow: 1,
                        height: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 3, // 新增：为白色背景面板（显示区域）添加固定内边距
                        boxSizing: 'border-box', // 确保内边距包含在 Box 的总尺寸内
                        display: 'flex', // 让内部的 MotionBox 能够填充
                        flexDirection: 'column', // 如果需要，让内部内容垂直堆叠
                    }}
                >
                    {/* 这个 MotionBox 负责页面的动画效果，同时处理溢出滚动 */}
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
                            overflowY: 'auto', // 允许垂直方向滚动
                            overflowX: 'hidden', // 隐藏水平方向滚动
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Outlet /> {/* 页面内容在这里渲染 */}
                    </MotionBox>
                </Box>

                {/* 右侧搜索面板 - 由 LayoutContext 控制其内容和打开状态 */}
                <RightSearchPanel<Record<string, unknown>>
                    open={isPanelOpen}
                    onClose={togglePanel}
                    onSearch={panelActions.onSearch || (() => console.log('MainLayout: No search handler provided for this page'))}
                    onReset={panelActions.onReset}
                    title={panelActions.title}
                    width={panelActions.width}
                    showActionBar={panelActions.showActionBar}
                >
                    {panelContent}
                </RightSearchPanel>
            </Box>
        </Box>
    );
}

// 导出带有 LayoutProvider 的 MainLayout
export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }) {
    return (
        <LayoutProvider>
            <MainContentWrapper onFakeLogout={onFakeLogout} />
        </LayoutProvider>
    );
}
