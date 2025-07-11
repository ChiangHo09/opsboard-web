// MainLayout.tsx
/*****************************************************************
 *  MainLayout — FINAL FIX: 只提供最简单的布局骨架，不控制任何间距
 *****************************************************************/
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

const MotionBox = motion(Box);

// 内部组件，用于使用 LayoutContext
function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);
    // 从 LayoutContext 解构出 panelActions 和 setPanelActions
    const { isPanelOpen, panelContent, setPanelContent, togglePanel, panelActions, setPanelActions } = useLayout();

    // 当页面路径改变时，重置右侧面板内容和动作
    useEffect(() => {
        setPanelContent(null);
        setPanelActions({}); // 也要清除面板动作
    }, [pathname, setPanelContent, setPanelActions]); // 添加 setPanelActions 到依赖

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f7f9fd' }}>
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
                    py: 3, // 只保留上下内边距，移除左右内边距
                    boxSizing: 'border-box',
                    display: 'flex', // 使主内容面板和右侧面板可以并排
                    gap: 3, // 主内容面板和右侧面板之间的间距
                }}
            >
                {/* 静态的白色背景主内容面板 */}
                <Box
                    sx={{
                        flexGrow: 1,
                        height: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        // 移除这里的 p:3，由内部的 MotionBox 或更内部的页面内容来提供
                        // overflow: 'hidden', // 移除这里的 overflow，动画 MotionBox 会处理
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
                            // 移除这里的 p:3，确保它不产生额外的绿色区域
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
                    // 从 panelActions 中获取页面特定的搜索和重置函数
                    onSearch={panelActions.onSearch || (() => console.log('MainLayout: No search handler provided for this page'))}
                    onReset={panelActions.onReset} // 仅在定义时传递
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
