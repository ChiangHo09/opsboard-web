// src/pages/Dashboard.tsx
import React from 'react'
import SideNav from '../components/SideNav'
import { Box, Typography } from '@mui/material'

const drawerWidth = 82  // 与 SideNav.BASE_WIDTH 保持一致

const Dashboard: React.FC = () => {
    const username = 'chiangho'  // TODO: 登录后改为从 Context / Redux / API 读取

    return (
        <Box sx={{ display: 'flex' }}>
            <SideNav />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#e3f2fd',
                    minHeight: '100vh',
                    p: 3,
                    ml: `${drawerWidth}px`,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    欢迎回来，{username}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="text.secondary">
                    接下来要做什么
                </Typography>
                {/* 下半部分内容后续扩展 */}
            </Box>
        </Box>
    )
}

export default Dashboard
