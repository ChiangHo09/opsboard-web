/**
 * 文件名: src/components/RightSearchPanel.tsx
 *
 * 文件功能描述:
 * 此文件定义了 RightSearchPanel 组件，一个带动画的右侧容器。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `export default function` 的写法，采用了现代的、
 *   不使用 `React.FC` 的类型定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
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

// 【核心修改】使用现代写法
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
};

export default RightSearchPanel;