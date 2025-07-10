/*****************************************************************
 *  MainLayout — 使用天然 Flex 推挤，避免重叠
 *****************************************************************/

import React, { useRef, useState } from 'react'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import Box from '@mui/material/Box'
import SideNav from '../components/SideNav'

/* --------- 常量 --------- */
const OPEN_WIDTH   = 200   // 侧边栏展开宽度
const CLOSED_WIDTH = 56    // 侧边栏收缩宽度
const EASE         = [0.4, 0, 0.2, 1] as const
const DUR          = 0.28  // 秒

/* 页面淡入动画（原逻辑保持） */
const variants: Variants = {
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -20 },
}
const MotionBox = motion(Box)

/* --------- context hook --------- */
export type SearchContainerCtx = { searchContainer: React.RefObject<HTMLDivElement> }
export function useSearchContainer() {
    return useOutletContext<SearchContainerCtx>()
}

export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation()
    const [sideOpen, setSideOpen] = useState(true)
    const toggleSide = () => setSideOpen(o => !o)

    const cardRef = useRef<HTMLDivElement | null>(null)

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* ---------- 侧边栏（自身带 width 过渡） ---------- */}
            <SideNav
                open={sideOpen}
                onToggle={toggleSide}
                onFakeLogout={onFakeLogout}
                openWidth={OPEN_WIDTH}
                closedWidth={CLOSED_WIDTH}
            />

            {/* ---------- 工作区容器：纯 flex 推挤，无 translateX ---------- */}
            <Box
                sx={{
                    flexGrow: 1,
                    bgcolor: '#f7f9fd',
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'flex-start',
                    pt: { xs: 2, md: 3 },
                    pr: { xs: 2, md: 3 },
                    pb: { xs: 2, md: 3 },
                    /* padding-left 已在 SideNav 占位后由 flex 自然推挤 */
                    transition: `padding ${DUR}s cubic-bezier(${EASE.join(',')})`,
                }}
            >
                {/* ---------- 白色主卡片 ---------- */}
                <Box
                    ref={cardRef}
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        position: 'relative',
                    }}
                >
                    <MotionBox
                        key={pathname}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: DUR, ease: EASE }}
                        sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}
                    >
                        <Outlet context={{ searchContainer: cardRef }} />
                    </MotionBox>
                </Box>
            </Box>
        </Box>
    )
}
