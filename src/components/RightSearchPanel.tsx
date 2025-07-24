/**
 * 文件名: src/components/RightSearchPanel.tsx
 *
 * 代码功能:
 * 此文件定义了 RightSearchPanel 组件，它是一个纯粹的、带动画的右侧“容器”或“壳”。
 * 它的职责是管理自身的展开/收起动画，并为动态的内部内容提供一个动画插槽。
 *
 * 本次修改内容:
 * - 【动画效果优化】解决了侧边面板内容动画的“幅度”和“时长”在视觉上比主工作区更大的问题。
 * - **问题定位**: 此问题由动画的视觉感知差异引起。共享的 `pageVariants` 使用固定的20px位移，这个位移在狭窄的侧边面板中显得过于夸张。
 * - **解决方案**:
 *   1.  在 `RightSearchPanel.tsx` 内部，定义了一套专属的、位移幅度更小的动画变体 `panelContentVariants`。
 *   2.  将动画的垂直位移 `y` 从 `20` / `-20` 减半为 `10` / `-10`，使其动画效果在视觉上更加微妙和收敛。
 *   3.  将这个新的 `panelContentVariants` 应用到面板内部所有内容的动画上，同时保持 `transition` 配置与全局 `pageTransition` 一致，以确保动画的节奏和缓动曲线是统一的。
 * - **最终效果**: 侧边面板的内容切换动画现在看起来更加平缓，其视觉“幅度”与主工作区的动画体验保持了一致。
 */
import React from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
// 仍然导入 pageTransition 以保持动画节奏统一
import { pageTransition } from '../utils/pageAnimations';

export interface RightSearchPanelProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: number;
    children: React.ReactNode;
    contentKey?: string | number;
}

const MotionBox = motion(Box);

// 【核心修复】为面板内容定义一套专属的、更微妙的动画
const panelContentVariants: Variants = {
    initial: {
        opacity: 0,
        y: 10, // 幅度减半，视觉效果更平缓
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -10, // 幅度减半，视觉效果更平缓
    },
};


export default function RightSearchPanel({
                                             open,
                                             onClose,
                                             title = '搜索',
                                             width = 360,
                                             children,
                                             contentKey,
                                         }: RightSearchPanelProps) {

    const panelVariants: Variants = {
        open: { width: width, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
        closed: { width: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
    };

    const animationKey = contentKey || title || 'default-panel-content';

    return (
        <MotionBox
            variants={panelVariants}
            initial="closed"
            animate={open ? "open" : "closed"}
            sx={{
                flexShrink: 0,
                overflow: 'hidden',
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxSizing: 'border-box',
                ml: open ? 3 : 0,
                transition: 'margin-left 0.28s ease',
            }}
        >
            <Box
                sx={{
                    width: width,
                    height: '100%',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    position: 'relative',
                }}
            >
                <IconButton
                    size="small"
                    onClick={onClose}
                    aria-label="close search panel"
                    sx={{ position: 'absolute', top: 24, right: 24, zIndex: 2 }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <AnimatePresence mode="wait">
                        {open && !children ? (
                            <MotionBox
                                key="loading-panel-content"
                                variants={panelContentVariants} // 应用专属动画
                                transition={pageTransition}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <CircularProgress />
                            </MotionBox>
                        ) : open && children ? (
                            <MotionBox
                                key={animationKey}
                                variants={panelContentVariants} // 应用专属动画
                                transition={pageTransition}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography variant="h6" noWrap sx={{ mb: 4, pr: 4, flexShrink: 0 }}>
                                    {title}
                                </Typography>
                                <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                                    {children}
                                </Box>
                            </MotionBox>
                        ) : null}
                    </AnimatePresence>
                </Box>
            </Box>
        </MotionBox>
    );
}