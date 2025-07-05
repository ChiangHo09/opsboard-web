// src/layouts/MainLayout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import SideNav from '../components/SideNav'

/** 左侧固定侧栏 + 右侧路由占位 */
const MainLayout: React.FC = () => (
    <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideNav />
        {/* 右侧页面，占满剩余空间 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            <Outlet />      {/* 子路由会渲染到这里 */}
        </Box>
    </Box>
)

export default MainLayout
