/*
 * [文件用途说明]
 * - 此文件定义了 RightSearchPanel 组件，这是一个可复用的、带动画效果的右侧面板。
 * - 它主要用于承载各种搜索表单，并提供了标题、关闭按钮和统一的“搜索/重置”操作栏。
 *
 * [本次修改记录]
 * - 为根组件 MotionBox 添加了 `ml: open ? 3 : 0` 样式。
 * - 这个改动使面板仅在展开（open=true）时，才为自己添加一个左外边距（marginLeft），
 *   从而动态地创建与主内容区域的间隙。当面板关闭时，此边距为0，完美解决了关闭后面板区域仍有空白间隙的问题。
 */
import React from 'react';
import { Box, Typography, Divider, IconButton, Stack, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, type Variants } from 'framer-motion';

export interface RightSearchPanelProps<T> {
    open: boolean;
    onClose: () => void;
    onSearch: (values: T) => void;
    onReset?: () => void;
    title?: string;
    width?: number;
    showActionBar?: boolean;
    children: React.ReactNode;
}

const MotionBox = motion(Box);

export default function RightSearchPanel<T>({
                                                open,
                                                onClose,
                                                onSearch,
                                                onReset,
                                                title = '搜索',
                                                width = 360,
                                                showActionBar = true,
                                                children,
                                            }: RightSearchPanelProps<T>) {

    const panelVariants: Variants = {
        open: {
            width: width,
            transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
        },
        closed: {
            width: 0,
            transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
        },
    };

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
                ml: open ? 3 : 0, // <- 修改点：只在展开时添加左边距来创建间隙
                transition: 'margin-left 0.28s ease', // 配合动画，使边距变化更平滑
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
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                    <Typography variant="h6" noWrap>{title}</Typography>
                    <IconButton size="small" onClick={onClose} aria-label="close search panel">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mx: -3, flexShrink: 0 }} />
                <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'auto' }}>
                    {children}
                </Box>
                {showActionBar && (
                    <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end', flexShrink: 0 }}>
                        {onReset && <Button variant="outlined" onClick={onReset} size="large">重置</Button>}
                        <Button variant="contained" onClick={() => onSearch({} as T)} size="large">搜索</Button>
                    </Stack>
                )}
            </Box>
        </MotionBox>
    );
}