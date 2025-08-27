/**
 * @file src/components/RightSearchPanel.tsx
 * @description 此文件定义了 RightSearchPanel 组件，一个带动画的右侧容器。
 * @modification
 *   - [动画一致性]：简化 `AnimatePresence` 内部结构，使其只包含一个 `MotionBox`，并始终使用 `animationKey` 作为其 `key`。在该 `MotionBox` 内部根据 `children` 是否存在来条件渲染内容或加载指示器。这消除了 `AnimatePresence` 内部 `key` 切换导致的双重动画，确保与主面板动画同步。
 *   - [样式调整]：将 `overflowY: 'auto'` 和 `overflowX: 'hidden'` 样式直接应用到动画 `MotionBox` 本身，以确保内容可滚动且动画裁剪正确。
 *   - [组件写法现代化]：移除了 `export default function` 的写法，采用了现代的、不使用 `React.FC` 的类型定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {type JSX, type ReactNode } from 'react';
import {Box, Typography, IconButton, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {motion, type Variants, AnimatePresence} from 'framer-motion';
import { pageTransition, panelContentVariants } from '@/utils/animations';

export interface RightSearchPanelProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: number;
    children: ReactNode;
    contentKey?: string | number;
}

const MotionBox = motion(Box);

const RightSearchPanel = ({
                              open,
                              onClose,
                              title = '搜索',
                              width = 360,
                              children,
                              contentKey,
                          }: RightSearchPanelProps): JSX.Element => {

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
                    position: 'relative', // 确保此Box是定位上下文，以便内部的绝对定位元素正确参照
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
                        overflow: 'hidden', // 确保此父级 Box 裁剪内容
                        position: 'relative', // 确保内部绝对定位的MotionBox正确参照此Box
                    }}
                >
                    <AnimatePresence mode="wait">
                        {open && ( // 仅当面板打开时渲染内部 MotionBox
                            <MotionBox
                                key={animationKey} // 【核心修改】始终使用 animationKey 作为 key
                                variants={panelContentVariants}
                                transition={pageTransition}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflowY: 'auto', // 【核心修改】将 overflow 移到 MotionBox 本身
                                    overflowX: 'hidden', // 【核心修改】将 overflow 移到 MotionBox 本身
                                    zIndex: 1,
                                }}
                            >
                                {children ? (
                                    <>
                                        <Typography variant="h6" noWrap sx={{mb: 4, pr: 4, flexShrink: 0}}>
                                            {title}
                                        </Typography>
                                        <Box sx={{
                                            flexGrow: 1,
                                            // 【移除】此处的 overflowY/X 样式，因为已移到父级 MotionBox
                                        }}>
                                            {children}
                                        </Box>
                                    </>
                                ) : (
                                    <Box sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <CircularProgress/>
                                    </Box>
                                )}
                            </MotionBox>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>
        </MotionBox>
    );
};

export default RightSearchPanel;