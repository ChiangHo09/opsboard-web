/********************************************************************
 *  组件名：RightSearchPanel
 *  FINAL FIX: 纯粹的动画组件，只控制自身宽度
 ********************************************************************/
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
                                                width = 320,
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