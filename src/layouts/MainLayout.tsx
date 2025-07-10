/*****************************************************************
 *  MainLayout — 使用天然 Flex 推挤，避免重叠
 *****************************************************************/

import React, { useRef, useState } from 'react'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import Box from '@mui/material/Box'
import SideNav from '../components/SideNav'

/* --------- 常量 --------- */
// 修复: 移除冗余常量，因为 SideNav 内部已有
const EASE = [0.4, 0, 0.2, 1] as const;
const DUR = 0.28; // 秒

/* 页面淡入动画（原逻辑保持） */
const variants: Variants = {
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};
const MotionBox = motion(Box);

/* --------- context hook --------- */
export type SearchContainerCtx = { searchContainer: React.RefObject<HTMLDivElement> };
export function useSearchContainer() {
    return useOutletContext<SearchContainerCtx>();
}

export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation();
    // 修复: 状态管理。默认收起(false)与 SideNav 保持一致
    const [sideOpen, setSideOpen] = useState(false);
    const toggleSide = () => setSideOpen(o => !o);

    const cardRef = useRef<HTMLDivElement | null>(null);

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* 修复: 传入 open 和 onToggle，移除不再需要的 props */}
            <SideNav
                open={sideOpen}
                onToggle={toggleSide}
                onFakeLogout={onFakeLogout}
            />

            {/* ---------- 工作区容器：纯 flex 推挤，无 translateX ---------- */}
            <Box
                component="main" // 使用 main 标签更符合语义
                sx={{
                    flexGrow: 1,
                    bgcolor: '#f7f9fd',
                    display: 'flex',
                    flexDirection: 'column', // 让内部卡片可以轻松控制
                    alignItems: 'stretch',
                    pt: { xs: 2, md: 3 },
                    pr: { xs: 2, md: 3 },
                    pb: { xs: 2, md: 3 },
                    // 修复: 移除不必要的 transition，让 flex 推挤效果自然发生
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
                        position: 'relative', // 保持，为内部 MotionBox 定位
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
    );
}