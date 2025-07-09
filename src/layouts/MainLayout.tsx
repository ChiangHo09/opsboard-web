/*****************************************************************
 *  src/layouts/MainLayout.tsx
 *  --------------------------------------------------------------
 *  • 仅对新页面执行自下而上淡入（opacity & y）
 *  • 不播放 exit 动画 → 无双重渲染
 *****************************************************************/

import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import SideNav from '../components/SideNav'

interface MainLayoutProps {
    onFakeLogout: () => void
}

/* Material Design standard easing */
const transition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const };

const variants = {
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0, transition },
}

export default function MainLayout({ onFakeLogout }: MainLayoutProps) {
    const { pathname } = useLocation()

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <SideNav onFakeLogout={onFakeLogout} />

            {/* 主内容区 */}
            <Box
                sx={{
                    position: 'relative',
                    flexGrow: 1,
                    overflow: 'hidden',
                    bgcolor: 'background.default',
                }}
            >
                {/* 每次路径变化直接替换 DOM，并让新页播放入场动画 */}
                <motion.div
                    key={pathname}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    style={{ position: 'absolute', inset: 0, overflow: 'auto' }}
                >
                    <Outlet />
                </motion.div>
            </Box>
        </Box>
    )
}

