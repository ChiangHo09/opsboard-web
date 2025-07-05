/*****************************************************************
 * src/layouts/MainLayout.tsx
 * --------------------------------------------------------------
 * 布局：
 *   ├─ 左侧固定侧边栏（<SideNav />）
 *   └─ 右侧页面区域（<Outlet />）
 *       └─ <PageTransition>（Fade-Through）
 *****************************************************************/

import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

import SideNav from '../components/SideNav'
import PageTransition from '../components/PageTransition'

const MainLayout: React.FC = () => (
    <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* 左侧侧栏 */}
        <SideNav />

        {/* 右侧内容区域 */}
        <Box
            sx={{
                flexGrow: 1,             // 占据剩余空间
                overflowY: 'auto',       // 仅允许纵向滚动
                overflowX: 'hidden',     // 禁止横向滚动，去掉灰条
                p: 2,
                backgroundColor: '#fff', // 纯白背景，避免与侧栏混色
            }}
        >
            <PageTransition>
                <Outlet />               {/* 路由页面在这里渲染 */}
            </PageTransition>
        </Box>
    </Box>
)

export default MainLayout
