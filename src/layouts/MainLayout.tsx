/**
 * 文件名: src/layouts/MainLayout.tsx
 *
 * 本次修改内容:
 * - 针对 `TS2769: No overload matches this call` 错误进行修复。
 * - 恢复了 `pageVariants` 和 `pageTransition` 从 `../utils/pageAnimations` 文件的导入，
 *   假设该文件存在并正确导出了这些动画变量。
 *   **重要提示：为了彻底解决 `TS2769` 错误，请确保 `../utils/pageAnimations.ts` 文件中
 *   `pageTransition` 变量的 `ease` 属性被定义为 `[0.4, 0, 0.2, 1] as const`。**
 *   （示例：`export const pageTransition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const };`）
 * - `mobilePanelVariants` 内部的 `ease` 属性，也尝试将其字符串值显式标记为 `as const`，以避免潜在的类型推断问题。
 * - 保持了所有之前针对布局问题的修改，包括 `component="main"` Box 上的 `overflowX: 'auto'` 和 `minWidth: 0`，
 *   以解决在屏幕宽度不足时搜索面板被截断的问题。
 *
 * 文件功能描述:
 * 此文件定义了应用的主UI布局，它包含了侧边栏、主内容区和搜索面板。
 * 它还通过 LayoutProvider 为所有子组件提供了控制右侧面板的状态。
 */
import { useState, type JSX, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Box, useMediaQuery, useTheme, IconButton, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';

// 【修复】重新从外部文件导入 pageVariants 和 pageTransition
// 请确保 ../utils/pageAnimations.ts 存在，并正确导出 pageVariants 和 pageTransition
// 尤其要确保 pageTransition.ease 被定义为 [0.4, 0, 0.2, 1] as const;
import { pageVariants, pageTransition } from '../utils/pageAnimations';


const MotionBox = motion(Box);
const MOBILE_TOP_BAR_HEIGHT = 56;

// 【修复】尝试在内部 transition 的 ease 属性也添加 as const
const mobilePanelVariants: Variants = {
    initial: { opacity: 0, scale: 0.98, },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' as const }, },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeOut' as const }, },
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
            overflow: 'hidden', // 依然保留全局溢出隐藏，避免整个页面出现滚动条
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
                    overflowX: 'auto', // 允许这个主内容区域在必要时水平滚动
                    minWidth: 0, // 确保作为 flex item 能够正确计算最小宽度，允许其内容展开
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
                        overflow: 'hidden', // 这依然只隐藏此 Box 内部的溢出
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