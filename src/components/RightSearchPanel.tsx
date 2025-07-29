/**
 * 文件名: src/components/RightSearchPanel.tsx
 *
 * 代码功能:
 * 此文件定义了 RightSearchPanel 组件，它是一个纯粹的、带动画的右侧“容器”或“壳”。
 * 它的职责是管理自身的展开/收起动画，并为动态的内部内容提供一个动画插槽。
 *
 * 本次修改内容:
 * - 【动画重构】更新了动画配置的导入方式，使其从新的、集中的 `animations.ts` 工具文件中获取。
 * - **解决方案**:
 *   1.  移除了在组件内部本地定义的 `panelContentVariants`。
 *   2.  从 `src/utils/animations.ts` 中导入了共享的 `panelContentVariants` 和 `pageTransition`。
 * - **最终效果**:
 *   此组件的动画逻辑现在是可复用且集中管理的，为在其他组件中应用相同的动画效果铺平了道路。
 */
import React from 'react';
import {Box, Typography, IconButton, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {motion, type Variants, AnimatePresence} from 'framer-motion';
// 【核心修复】从新的动画工具文件中导入配置
import { pageTransition, panelContentVariants } from '../utils/animations';

export interface RightSearchPanelProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: number;
    children: React.ReactNode;
    contentKey?: string | number;
}

const MotionBox = motion(Box);

export default function RightSearchPanel({
                                             open,
                                             onClose,
                                             title = '搜索',
                                             width = 360,
                                             children,
                                             contentKey,
                                         }: RightSearchPanelProps) {

    const panelVariants: Variants = {
        open: {width: width, transition: {duration: 0.28, ease: [0.4, 0, 0.2, 1]}},
        closed: {width: 0, transition: {duration: 0.28, ease: [0.4, 0, 0.2, 1]}},
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
                    sx={{position: 'absolute', top: 24, right: 24, zIndex: 2}}
                >
                    <CloseIcon/>
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
                                variants={panelContentVariants}
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
                                <CircularProgress/>
                            </MotionBox>
                        ) : open && children ? (
                            <MotionBox
                                key={animationKey}
                                variants={panelContentVariants}
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
                                <Typography variant="h6" noWrap sx={{mb: 4, pr: 4, flexShrink: 0}}>
                                    {title}
                                </Typography>
                                <Box sx={{flexGrow: 1, overflowY: 'auto', overflowX: 'hidden'}}>
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