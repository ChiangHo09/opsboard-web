/*
 * [文件用途说明]
 * - 此文件定义了 RightSearchPanel 组件，它是一个纯粹的、带动画的右侧“容器”或“壳”。
 * - 它的职责是管理自身的展开/收起动画、显示标题和关闭按钮，并为子内容提供一个带标准内边距的插槽。
 *
 * [本次修改记录]
 * - 移除了 onSearch, onReset, showActionBar, 和泛型 <T>。
 * - 该组件不再关心其内容的具体行为（如搜索/重置），这些逻辑现在由传入的 children（例如 ServerSearchForm）完全负责。
 * - 这使得 RightSearchPanel 成为一个高度可复用、与业务逻辑完全解耦的纯UI容器。
 */
import React from 'react';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, type Variants } from 'framer-motion';

export interface RightSearchPanelProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: number;
    children: React.ReactNode;
}

const MotionBox = motion(Box);

export default function RightSearchPanel({
                                             open,
                                             onClose,
                                             title = '搜索',
                                             width = 360,
                                             children,
                                         }: RightSearchPanelProps) {

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
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                    <Typography variant="h6" noWrap>{title}</Typography>
                    <IconButton size="small" onClick={onClose} aria-label="close search panel">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mx: -3, flexShrink: 0 }} />
                {/* 子内容（现在是完整的表单组件）被渲染在这里 */}
                <Box sx={{ mt: 2, flexGrow: 1, overflowY: 'hidden', display: 'flex' }}>
                    {children}
                </Box>
            </Box>
        </MotionBox>
    );
}