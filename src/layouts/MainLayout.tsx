/**
 * 文件名：src/layouts/MainLayout.tsx
 * 作用：
 *   · 定义应用主布局：左侧导航、主内容区、右侧搜索面板、全局弹窗。
 *   · ★关键修复★
 *       1) 最外层 <Box> 使用 height:'100dvh' + overflow:'hidden'
 *          —— 与 index.css 配合，彻底锁死 body 滚动条。
 *       2) 业务滚动容器 <MotionBox> 改用 flex: 1 1 auto + minHeight:0
 *          —— 避免因内边距 + sticky 行高抖动导致溢出。
 *
 * 代码注释：
 *   · 每行 / 每个参数右侧均附带中文说明，便于初学者阅读。
 */

import { useState, useEffect, useRef, type JSX } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    Box,             /* MUI 盒模型 */
    useTheme,        /* 读取当前主题（过渡曲线等） */
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import SideNav from '../components/SideNav';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx';
import RightSearchPanel from '../components/RightSearchPanel';
import Modal from '../components/Modal';
import { pageVariants, pageTransition } from '../utils/pageAnimations';

/* ---------- 1. Motion 组件 & 常量 ---------- */
const MotionBox = motion(Box);              /* 把 MUI Box 包装成可动画组件 */
const MOBILE_TOP_BAR_HEIGHT = 56;           /* 移动端顶部条固定高度 */

/* 移动端搜索面板淡入淡出缩放动画 */
const mobilePanelVariants: Variants = {
    initial: { opacity: 0, scale: 0.98 },     /* 初始：稍小 & 透明 */
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit:    { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
};

/* ---------- 2. 主体包装组件（供 Provider 外层调用） ---------- */
function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    /* 2.1 React Router & MUI */
    const { pathname } = useLocation();       /* 当前路由路径 */
    const theme = useTheme();                 /* 当前主题 */

    /* 2.2 全局布局状态（来自 Context） */
    const {
        /* 右侧搜索面板 */
        isPanelOpen, panelContent, closePanel, setPanelContent, setPanelTitle,
        togglePanel, isPanelRelevant, panelTitle, panelWidth,

        /* 移动端标记 & 全局弹窗 */
        isMobile, isModalOpen, modalContent, onModalClose, setIsModalOpen,
    } = useLayout();

    /* 2.3 本组件局部状态 */
    const [sideNavOpen, setSideNavOpen] = useState(false);      /* 侧边栏展开标记 */
    const [panelContentAnimationKey, setPanelContentAnimationKey] = useState<number>(0);
    const prevPanelContentRef = useRef<React.ReactNode>(null);  /* 记录上一次面板内容 */

    /* ---------- 3. 路由变化时自动关闭 Modal ---------- */
    useEffect(() => {
        if (isModalOpen) setIsModalOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    /* ---------- 4. 面板内容变动时触发淡入动画 ---------- */
    useEffect(() => {
        if (isPanelOpen && panelContent && panelContent !== prevPanelContentRef.current) {
            setPanelContentAnimationKey(Date.now());                /* 强制刷新 key */
        }
        prevPanelContentRef.current = panelContent;
    }, [isPanelOpen, panelContent]);

    /* ---------- 5. 面板无关时自动收起 ---------- */
    useEffect(() => {
        let t: NodeJS.Timeout | null = null;
        if (isPanelOpen && !isPanelRelevant) {
            t = setTimeout(() => {
                if (isPanelOpen && !isPanelRelevant) {
                    closePanel();
                    setPanelContent(null);
                    setPanelTitle('');
                }
            }, 50);
        }
        return () => t && clearTimeout(t);
    }, [pathname, isPanelOpen, isPanelRelevant, closePanel, setPanelContent, setPanelTitle]);

    /* ---------- 6. 统一 Modal JSX 块（复用） ---------- */
    const modalJSX = (
        <AnimatePresence>
            {isModalOpen && onModalClose && (
                <Modal onClose={onModalClose /* 关闭回调 */}>
                    {modalContent /* 业务传入的实际内容 */}
                </Modal>
            )}
        </AnimatePresence>
    );

    /* ---------- 7. 组件渲染 ---------- */
    return (
        /* 7.1 外层 Flex：左侧导航 | 中间 main */
        <Box
            sx={{
                display: 'flex',                    /* 横向布局 */
                height: '100dvh',                   /* 100% 视窗高 (支持移动端地址栏收缩) */
                overflow: 'hidden',                 /* ★锁死 body 滚动★ */
                bgcolor: 'app.background',          /* 自定义背景 token */
            }}
        >
            {/* ───────── 左侧：SideNav ───────── */}
            <SideNav
                open={sideNavOpen}
                onToggle={() => setSideNavOpen(o => !o)}
                onFakeLogout={onFakeLogout}
            />

            {/* ───────── 右侧：主内容 + 搜索面板 ───────── */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,                       /* 占据剩余全部宽度 */
                    height: '100%',                    /* 跟随外层 Box */
                    pt: { xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3 }, /* 顶部留空给移动端 AppBar */
                    pb: { xs: 0, md: 3 },              /* 底部留白（桌面） */
                    pr: { xs: 0, md: 3 },              /* 右侧留白（桌面） */
                    pl: 0,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, /* 移动列 / 桌面行 */
                    overflow: 'hidden',                /* 自身裁剪 */
                    position: 'relative',              /* 供绝对定位层（面板 / Modal） */
                    transition: theme.transitions.create('padding-top', {
                        duration: theme.transitions.duration.short,
                    }),
                }}
            >
                {/* 7.2 左半：业务页面容器 */}
                <Box
                    sx={{
                        flexGrow: 1,                     /* 填满可用空间 */
                        bgcolor: 'background.paper',     /* 卡片白底 */
                        borderRadius: { xs: '16px 16px 0 0', md: 2 },
                        p: { xs: 0, md: 3 },
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',              /* 避免内层滚动超出 */
                        transition: theme.transitions.create(['border-radius', 'padding'], {
                            duration: theme.transitions.duration.short,
                        }),
                        minHeight: 0,                    /* ★允许子元素向上压缩★ */
                    }}
                >
                    {/* 7.2.1 真正滚动区：MotionBox */}
                    <MotionBox
                        key={pathname.split('/').slice(0, 3).join('/')} /* 每组一级路由一套动画 */
                        variants={pageVariants}
                        transition={pageTransition}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        sx={{
                            width: '100%',
                            flex: '1 1 auto',              /* ★伸缩占满垂直空间★ */
                            minHeight: 0,                  /* ★关键：可 shrink 0★ */
                            boxSizing: 'border-box',
                            overflowY: 'auto',             /* 纵向滚动交给自身 */
                            overflowX: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            p: { xs: 2, md: 0 },           /* 移动端额外内边距 */
                            position: 'relative',
                        }}
                    >
                        <Outlet />                       {/* 渲染当前业务页面 */}

                        {/* 移动端下把 Modal 放到内容顶部，避免遮住 AppBar */}
                        {isMobile && modalJSX}
                    </MotionBox>

                    {/* 移动端全屏搜索面板 */}
                    <AnimatePresence>
                        {isMobile && isPanelOpen && (
                            <MotionBox
                                variants={mobilePanelVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,                   /* 充满父盒 */
                                    bgcolor: 'background.paper',
                                    zIndex: 10,
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* 标题 + 关闭按钮 */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <Typography variant="h6" noWrap>
                                        {panelTitle}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={togglePanel}
                                        aria-label="close search panel"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                {/* 面板主体：表单 / 加载圈 */}
                                <Box
                                    sx={{
                                        mt: 2,
                                        flexGrow: 1,
                                        overflowY: 'hidden',     /* 内部再做滚动容器 */
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        {isPanelOpen && !panelContent ? (
                                            /* 加载中 */
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
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <CircularProgress />
                                            </MotionBox>
                                        ) : isPanelOpen && panelContent ? (
                                            /* 表单内容 */
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

                {/* 7.3 右半：桌面端搜索面板 */}
                {!isMobile && (
                    <RightSearchPanel
                        open={isPanelOpen}
                        onClose={closePanel}
                        title={panelTitle}
                        width={panelWidth}
                        contentKey={panelContentAnimationKey}
                    >
                        {panelContent}
                    </RightSearchPanel>
                )}

                {/* 桌面端下把 Modal 放在 main 内部兄弟节点，覆盖面板 */}
                {!isMobile && modalJSX}
            </Box>
        </Box>
    );
}

/* ---------- 8. 外层导出：套上 LayoutProvider ---------- */
export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    return (
        <LayoutProvider>
            <MainContentWrapper onFakeLogout={onFakeLogout} />
        </LayoutProvider>
    );
}
