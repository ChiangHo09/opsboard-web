/********************************************************************
 *  组件名：RightSearchPanel（纯平面化版本）
 *  功 能：在“白色主卡片”内部从右侧推挤滑入搜索栏。
 ********************************************************************/

import React from 'react'
import {
    Drawer,
    Box,
    Typography,
    Divider,
    IconButton,
    Stack,
    Button
} from '@mui/material'
import CloseIcon  from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

/* ---------- Props ---------- */
export interface RightSearchPanelProps<T> {
    open: boolean                 // 是否展开
    onClose: () => void           // 关闭回调
    onSearch: (values: T) => void // “搜索”按钮
    onReset?: () => void          // “重置”按钮
    title?: string                // 标题
    width?: number                // 面板宽度
    gap?: number                  // 与主内容区的间隙
    showActionBar?: boolean
    children: React.ReactNode
    /** 放置 Drawer 的容器，传入 MainLayout 的 cardRef.current */
    containerEl?: HTMLElement | null
}

/* ---------- 组件实现 ---------- */
export default function RightSearchPanel<T>({
                                                open,
                                                onClose,
                                                onSearch,
                                                onReset,
                                                title = '搜索',
                                                width = 320,
                                                gap = 24,
                                                showActionBar = true,
                                                children,
                                                containerEl
                                            }: RightSearchPanelProps<T>) {
    return (
        <>
            {/* 主体 Drawer：persistent + 无阴影 + 限定容器 */}
            <Drawer
                anchor="right"
                variant="persistent"
                open={open}
                /* 把 Drawer 挂到主卡片内，禁止 Portal */
                ModalProps={{
                    container: containerEl ?? undefined,
                    disablePortal: Boolean(containerEl)
                }}
                /* 让入场动画在容器内完成，无需 appear */
                SlideProps={{ appear: false }}
                PaperProps={{
                    elevation: 0,                    // 无阴影
                    sx: {
                        /* 右侧距离容器右边 0，左侧留 gap 形成缝隙 */
                        width,
                        ml: gap,
                        boxShadow: 'none',            // 纯平面化
                        boxSizing: 'border-box',
                        p: 3,                         // 内边距 24
                        borderLeft: (theme) => `1px solid ${theme.palette.divider}` // 细分割线
                    }
                }}
            >
                {/* ===== 标题行 ===== */}
                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:2 }}>
                    <Typography variant="h6">{title}</Typography>
                    <IconButton size="small" onClick={onClose} aria-label="close search panel">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                {/* ===== 表单内容 ===== */}
                <Box sx={{ mt:2, flexGrow:1, overflowY:'auto' }}>
                    {children}
                </Box>

                {/* ===== 底部按钮区 ===== */}
                {showActionBar && (
                    <Stack direction="row" spacing={2} sx={{ mt:3, justifyContent:'flex-end' }}>
                        {onReset && (
                            <Button variant="outlined" onClick={onReset} size="large">
                                重置
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={() => onSearch(undefined as unknown as T)}
                            size="large"
                        >
                            搜索
                        </Button>
                    </Stack>
                )}
            </Drawer>

            {/* 折叠状态下的“展开”按钮：同样无阴影 */}
            {!open && (
                <IconButton
                    onClick={() => onClose?.()}
                    sx={{
                        position:'fixed',
                        right:8,
                        top:'50%',
                        transform:'translateY(-50%)',
                        zIndex:(t)=>t.zIndex.drawer + 1,
                        bgcolor:'background.paper',
                        borderRadius:1,
                        boxShadow:'none'            // 去掉阴影
                    }}
                    aria-label="open search panel"
                >
                    <SearchIcon />
                </IconButton>
            )}
        </>
    )
}
