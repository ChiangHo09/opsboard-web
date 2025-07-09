/*****************************************************************
 * 修复后的 src/layouts/MainLayout.tsx
 *****************************************************************/
import { Outlet, useLocation } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion' // 导入Variants类型
import Box from '@mui/material/Box'
import SideNav from '../components/SideNav'

interface MainLayoutProps {
    onFakeLogout: () => void
}

// Material Design标准缓动配置（独立声明）
const transitionConfig = {
    duration: 0.28,
    ease: [0.4, 0, 0.2, 1] as const // 使用const断言确保类型安全
}

// 修复：variants只包含状态描述，不包含transition
const variants: Variants = {
    initial: {
        opacity: 0,
        y: 48 // 仅定义状态值
    },
    animate: {
        opacity: 1,
        y: 0
    },
    exit: {
        opacity: 0,
        y: -20
    }
};

const MotionBox = motion(Box)

export default function MainLayout({ onFakeLogout }: MainLayoutProps) {
    const { pathname } = useLocation()

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            overflow: 'hidden'
        }}>
            <SideNav onFakeLogout={onFakeLogout} />

            <Box component="main" sx={{
                flexGrow: 1,
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                bgcolor: 'background.default'
            }}>
                {/* 关键修复：transition作为独立属性传递 */}
                <MotionBox
                    key={pathname}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transitionConfig} // 统一配置过渡参数
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}
                >
                    <Outlet />
                </MotionBox>
            </Box>
        </Box>
    )
}