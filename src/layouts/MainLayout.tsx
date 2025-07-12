/* --- START OF FILE MainLayout.tsx --- */

/*****************************************************************
 *  MainLayout — FINAL FIX: 只提供最简单的布局骨架，不控制任何间距
 *****************************************************************/
import {useState, useEffect, type ReactNode, type JSX} from 'react'; // 添加 ReactNode 类型
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx'; // 确保 LayoutContext 导出正确类型
import RightSearchPanel from '../components/RightSearchPanel';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

// 修复点1: 明确定义 PanelActions 类型
interface PanelActions {
    onSearch?: (query?: string) => void;
    onReset?: () => void;
    title?: string;
    width?: number;
    showActionBar?: boolean;
}

const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

// 修复点2: 为 MainContentWrapper 添加类型定义
function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // 修复点3: 确保 LayoutContext 提供正确的类型
    const {
        isPanelOpen,
        panelContent,
        setPanelContent,
        togglePanel,
        panelActions,
        setPanelActions
    } = useLayout() as {
        isPanelOpen: boolean;
        panelContent: ReactNode;
        setPanelContent: (content: ReactNode) => void;
        togglePanel: () => void;
        panelActions: PanelActions;
        setPanelActions: (actions: PanelActions) => void;
    };

    useEffect(() => {
        setPanelContent(null);
        setPanelActions({});
    }, [pathname, setPanelContent, setPanelActions]);

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
                    pr: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 0 : 3,
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

                {/* 修复点4: 移除泛型参数 */}
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

// 修复点5: 为 MainLayout 添加明确的返回类型
// TODO:它们的作用是让 TypeScript 编译器跳过对紧随其后的下一行代码的类型检查，通常用于临时绕过某些已知但暂时无法修复的类型错误
// MainLayout报错了，因为MainLayout.tsx中的LayoutProvider组件的返回值类型被定义为ReactNode，而不是JSX.Element。
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    return (
        <LayoutProvider>
            <MainContentWrapper onFakeLogout={onFakeLogout} />
        </LayoutProvider>
    );
}