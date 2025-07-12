/*
 * [文件用途说明]
 * - 此文件定义了应用的主布局（MainLayout），它包含了固定的侧边导航栏（SideNav）、
 *   一个动态的主内容区域（通过 <Outlet> 渲染）以及一个可抽拉的右侧搜索面板（RightSearchPanel）。
 * - 它还通过 LayoutProvider 为子组件提供了控制右侧面板显隐和内容的状态。
 *
 * [本次修改记录]
 * - 从 useLayout 上下文中解构出新增的 `closePanel` 方法。
 * - 在监听路由 `pathname` 变化的 useEffect 中，增加了 `closePanel()` 的调用。
 * - 这确保了每当用户导航到一个新页面时，右侧的搜索面板（如果之前是打开的）都会自动关闭，提升了用户体验的一致性。
 */
import {useState, useEffect, type ReactNode, type JSX} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

interface PanelActions {
    onSearch?: (query?: string) => void;
    onReset?: () => void;
    title?: string;
    width?: number;
    showActionBar?: boolean;
}

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        isPanelOpen,
        panelContent,
        setPanelContent,
        togglePanel,
        closePanel, // <- 修改点1：获取 closePanel 方法
        panelActions,
        setPanelActions
    } = useLayout() as {
        isPanelOpen: boolean;
        panelContent: ReactNode;
        setPanelContent: (content: ReactNode) => void;
        togglePanel: () => void;
        closePanel: () => void; // <- 类型断言中也加上
        panelActions: PanelActions;
        setPanelActions: (actions: PanelActions) => void;
    };

    useEffect(() => {
        closePanel(); // <- 修改点2：在路由切换时，总是先关闭面板
        setPanelContent(null);
        setPanelActions({});
    }, [pathname, setPanelContent, setPanelActions, closePanel]); // <- 修改点3：添加依赖项

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

                <RightSearchPanel
                    open={isPanelOpen}
                    onClose={togglePanel}
                    onSearch={panelActions.onSearch || (() => console.log('MainLayout: No search handler'))}
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    return (
        <LayoutProvider>
            <MainContentWrapper onFakeLogout={onFakeLogout} />
        </LayoutProvider>
    );
}