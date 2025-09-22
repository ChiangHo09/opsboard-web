/**
 * @file src/components/RightSearchPanel.tsx
 * @description 此文件定义了 RightSearchPanel 组件，一个带动画的右侧容器。
 * @modification
 *   - [Cleanup/BugFix]：移除了之前为演示防抖功能而错误添加的通用搜索输入框及其相关逻辑。
 *   - [原因]：该搜索框被错误地硬编码到了面板容器组件中，导致它出现在所有使用此面板的页面上，这不符合设计。
 *   - [解决方案]：将组件恢复为其原始职责——一个纯粹的、通用的动画容器。它只负责展示通过 `children` prop 传入的具体内容（如 `TicketSearchForm`），而将所有业务逻辑（如搜索、防抖）交还给这些子组件自行处理。
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

    // [Cleanup] 移除了所有与防抖搜索框相关的 state 和 effect 逻辑

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
                willChange: 'width',
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
                        position: 'relative',
                    }}
                >
                    <AnimatePresence mode="wait">
                        {open && (
                            <MotionBox
                                key={animationKey}
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
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    zIndex: 1,
                                }}
                            >
                                {children ? (
                                    <>
                                        <Typography variant="h6" noWrap sx={{mb: 4, pr: 4, flexShrink: 0}}>
                                            {title}
                                        </Typography>
                                        {/* [Cleanup] 移除了硬编码的 TextField 和相关 Box */}
                                        <Box sx={{ flexGrow: 1 }}>
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